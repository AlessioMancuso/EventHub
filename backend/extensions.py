from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_restx import Api

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
ma = Marshmallow()
api = Api(version="1.0", title="EventHub API", description="API for EventHub platform", prefix='/api', doc='/swagger/')

def init_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    api.init_app(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        from .models import User
        identity = jwt_payload.get('sub')
        if not identity:
            return True
        user = User.query.get(identity)
        return user is None or user.banned