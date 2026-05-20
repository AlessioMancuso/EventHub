from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models import User, Review
from ..utils.decorators import role_required

ns = Namespace('admin', description='Administration')

user_model = ns.model('User', {
    'id': fields.Integer,
    'email': fields.String,
    'name': fields.String,
    'role': fields.String,
    'banned': fields.Boolean
})


@ns.route('/users')
class UsersList(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        users = User.query.all()
        return [{'id': u.id, 'email': u.email, 'name': u.name, 'role': u.role, 'banned': u.banned} for u in users]


@ns.route('/users/<int:user_id>/ban')
class BanUser(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        user.banned = True
        db.session.commit()
        return {'message': 'banned'}


@ns.route('/users/<int:user_id>/unban')
class UnbanUser(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        user.banned = False
        db.session.commit()
        return {'message': 'unbanned'}


@ns.route('/users/<int:user_id>/promote')
class PromoteUser(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        user.role = 'organizer'
        db.session.commit()
        return {'message': 'promoted'}


@ns.route('/reviews/flagged')
class FlaggedReviews(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        reviews = Review.query.filter_by(flagged=True).all()
        return [{'id': r.id, 'user_id': r.user_id, 'event_id': r.event_id, 'rating': r.rating, 'comment': r.comment} for r in reviews]


@ns.route('/reviews/<int:review_id>/approve')
class ApproveReview(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self, review_id):
        r = Review.query.get(review_id)
        if not r:
            return {'message': 'Not found'}, 404
        r.flagged = False
        r.moderated = True
        db.session.commit()
        return {'message': 'approved'}


@ns.route('/reviews/<int:review_id>')
class RemoveReview(Resource):
    @jwt_required()
    @role_required('admin')
    def delete(self, review_id):
        r = Review.query.get(review_id)
        if not r:
            return {'message': 'Not found'}, 404
        db.session.delete(r)
        db.session.commit()
        return {'message': 'deleted'}
