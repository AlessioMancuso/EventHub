from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Event, Review, Registration
from ..extensions import db
from datetime import datetime

ns = Namespace('reviews', description='Event reviews')

review_model = ns.model('Review', {
    'rating': fields.Integer(required=True, min=1, max=5),
    'comment': fields.String
})


@ns.route('/events/<int:event_id>')
class EventReview(Resource):
    @jwt_required()
    def get(self, event_id):
        reviews = Review.query.filter_by(event_id=event_id, moderated=False).all()
        return [{'id': r.id, 'rating': r.rating, 'comment': r.comment, 'user_id': r.user_id} for r in reviews]

    @ns.expect(review_model)
    @jwt_required()
    def post(self, event_id):
        user_id = get_jwt_identity()
        event = Event.query.get(event_id)
        if not event:
            return {'message': 'Event not found'}, 404
        # allow review only after event end
        if not event.end_datetime or event.end_datetime > datetime.utcnow():
            return {'message': 'Event has not finished yet'}, 400
        # check user attended
        if not Registration.query.filter_by(user_id=user_id, event_id=event_id).first():
            return {'message': 'Only attendees can review'}, 403
        data = request.get_json() or {}
        rating = data.get('rating')
        comment = data.get('comment')
        if not rating or not (1 <= int(rating) <= 5):
            return {'message': 'Invalid rating'}, 400
        rev = Review(user_id=user_id, event_id=event_id, rating=int(rating), comment=comment)
        db.session.add(rev)
        db.session.commit()
        return {'id': rev.id, 'rating': rev.rating, 'comment': rev.comment}, 201
