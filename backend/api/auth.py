from flask_restx import Namespace, Resource, fields
from flask import request, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, Role
from ..schemas import UserSchema

ns = Namespace('auth', description='Authentication')

register_model = ns.model('Register', {
    'email': fields.String(required=True),
    'password': fields.String(required=True),
    'name': fields.String
})

login_model = ns.model('Login', {
    'email': fields.String(required=True),
    'password': fields.String(required=True)
})


@ns.route('/register')
class Register(Resource):
    @ns.expect(register_model)
    def post(self):
        data = request.get_json() or {}
        schema = UserSchema(only=('email', 'name'))
        try:
            validated = schema.load(data)
        except Exception as err:
            return {'message': 'Invalid input', 'errors': err.messages if hasattr(err, 'messages') else str(err)}, 400
        email = validated.get('email')
        password = data.get('password')
        name = validated.get('name')
        if not email or not password:
            return {'message': 'Email and password required'}, 400
        if User.query.filter_by(email=email).first():
            return {'message': 'Email already exists'}, 400
        user = User(email=email, password_hash=generate_password_hash(password), name=name)
        db.session.add(user)
        db.session.commit()
        access = create_access_token(identity=user.id, additional_claims={'role': user.role})
        refresh = create_refresh_token(identity=user.id)
        return {'access_token': access, 'refresh_token': refresh}, 201


@ns.route('/login')
class Login(Resource):
    @ns.expect(login_model)
    def post(self):
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash or '', password):
            return {'message': 'Invalid credentials'}, 401
        if user.banned:
            return {'message': 'User is banned'}, 403
        access = create_access_token(identity=user.id, additional_claims={'role': user.role})
        refresh = create_refresh_token(identity=user.id)
        return {'access_token': access, 'refresh_token': refresh}


@ns.route('/refresh')
class Refresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        identity = get_jwt_identity()
        user = User.query.get(identity)
        access = create_access_token(identity=user.id, additional_claims={'role': user.role})
        return {'access_token': access}


@ns.route('/me')
class Me(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        user = User.query.get(identity)
        if not user:
            return {'message': 'Not found'}, 404
        return {'id': user.id, 'email': user.email, 'name': user.name, 'role': user.role}

    @jwt_required()
    def put(self):
        data = request.get_json() or {}
        user = User.query.get(get_jwt_identity())
        if not user:
            return {'message': 'Not found'}, 404
        email = data.get('email')
        name = data.get('name')
        if email and email != user.email and User.query.filter_by(email=email).first():
            return {'message': 'Email already exists'}, 400
        if email:
            user.email = email
        if name is not None:
            user.name = name
        db.session.commit()
        return {'id': user.id, 'email': user.email, 'name': user.name, 'role': user.role}


@ns.route('/me/password')
class ChangePassword(Resource):
    @jwt_required()
    def put(self):
        data = request.get_json() or {}
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        if not old_password or not new_password:
            return {'message': 'Old and new password required'}, 400
        user = User.query.get(get_jwt_identity())
        if not user or not check_password_hash(user.password_hash or '', old_password):
            return {'message': 'Invalid current password'}, 403
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        return {'message': 'Password updated'}


@ns.route('/keycloak')
class KeycloakExchange(Resource):
    def post(self):
        """Exchange a Keycloak access token for a local JWT (federation)."""
        data = request.get_json() or {}
        token = data.get('token') or request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return {'message': 'Token required'}, 400
        try:
            from ..utils.keycloak import verify_keycloak_token
            aud = current_app.config.get('KEYCLOAK_CLIENT_ID') or current_app.config.get('KEYCLOAK_AUDIENCE')
            claims = verify_keycloak_token(token, audience=aud)
        except Exception as e:
            return {'message': 'Invalid Keycloak token', 'detail': str(e)}, 401

        email = claims.get('email') or claims.get('preferred_username')
        if not email:
            return {'message': 'Email claim missing in token'}, 400
        user = User.query.filter_by(email=email).first()
        if not user:
            # create local user
            user = User(email=email, name=claims.get('name'), role=Role.user.value)
            # promote if roles include organizer/admin
            rc = claims.get('realm_access', {}).get('roles', [])
            if 'admin' in rc:
                user.role = Role.admin.value
            if 'organizer' in rc:
                user.role = Role.organizer.value
            db.session.add(user)
            db.session.commit()

        access = create_access_token(identity=user.id, additional_claims={'role': user.role})
        refresh = create_refresh_token(identity=user.id)
        return {'access_token': access, 'refresh_token': refresh}
