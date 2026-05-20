from flask_restx import Namespace, Resource, fields
from flask import request, current_app, send_from_directory, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..models import Event, Registration, Review, User
from ..extensions import db
from ..utils.decorators import role_required
import os
import io
import csv
from datetime import datetime
from sqlalchemy import func

ns = Namespace('organizer', description='Organizer operations')

event_model = ns.model('EventCreate', {
    'title': fields.String(required=True),
    'description': fields.String,
    'category': fields.String,
    'city': fields.String,
    'venue': fields.String,
    'start_datetime': fields.DateTime,
    'end_datetime': fields.DateTime,
    'capacity': fields.Integer,
    'price_cents': fields.Integer,
})

ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT


def parse_datetime(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except Exception:
        return None


@ns.route('/events')
class OrganizerEvents(Resource):
    @jwt_required()
    @role_required('organizer', 'admin')
    def get(self):
        user_id = get_jwt_identity()
        events = Event.query.filter_by(organizer_id=user_id).all()
        return [{'id': e.id, 'title': e.title, 'start_datetime': e.start_datetime} for e in events]

    @jwt_required()
    @role_required('organizer', 'admin')
    @ns.expect(event_model, validate=False)
    def post(self):
        user_id = get_jwt_identity()
        data = request.form.to_dict()
        file = request.files.get('cover_image')
        filename = None
        if file and allowed_file(file.filename):
            fname = secure_filename(file.filename)
            filename = f"{user_id}_{fname}"
            dest = os.path.join(current_app.config.get('UPLOAD_FOLDER'), filename)
            file.save(dest)
        ev = Event(
            title=data.get('title'),
            description=data.get('description'),
            category=data.get('category'),
            city=data.get('city'),
            venue=data.get('venue'),
            start_datetime=parse_datetime(data.get('start_datetime')),
            end_datetime=parse_datetime(data.get('end_datetime')),
            capacity=int(data.get('capacity') or 0),
            price_cents=int(data.get('price_cents') or 0),
            cover_image=filename,
            organizer_id=user_id
        )
        db.session.add(ev)
        db.session.commit()
        return {'id': ev.id}, 201


@ns.route('/events/<int:event_id>')
class OrganizerEvent(Resource):
    @jwt_required()
    @role_required('organizer', 'admin')
    def get(self, event_id):
        user_id = get_jwt_identity()
        ev = Event.query.get(event_id)
        if not ev or ev.organizer_id != user_id:
            return {'message': 'Not found or forbidden'}, 404
        return {'id': ev.id, 'title': ev.title, 'description': ev.description}

    @jwt_required()
    @role_required('organizer', 'admin')
    def delete(self, event_id):
        user_id = get_jwt_identity()
        ev = Event.query.get(event_id)
        if not ev or ev.organizer_id != user_id:
            return {'message': 'Not found or forbidden'}, 404
        # remove cover image
        if ev.cover_image:
            try:
                os.remove(os.path.join(current_app.config.get('UPLOAD_FOLDER'), ev.cover_image))
            except Exception:
                pass
        db.session.delete(ev)
        db.session.commit()
        return {'message': 'deleted'}

    @jwt_required()
    @role_required('organizer', 'admin')
    def put(self, event_id):
        user_id = get_jwt_identity()
        ev = Event.query.get(event_id)
        if not ev or ev.organizer_id != user_id:
            return {'message': 'Not found or forbidden'}, 404
        data = request.form.to_dict()
        for k, v in data.items():
            if hasattr(ev, k) and v is not None:
                if k in ('start_datetime', 'end_datetime'):
                    parsed = parse_datetime(v)
                    setattr(ev, k, parsed)
                elif k in ('capacity', 'price_cents'):
                    setattr(ev, k, int(v or 0))
                else:
                    setattr(ev, k, v)
        file = request.files.get('cover_image')
        if file and allowed_file(file.filename):
            fname = secure_filename(file.filename)
            filename = f"{user_id}_{fname}"
            dest = os.path.join(current_app.config.get('UPLOAD_FOLDER'), filename)
            file.save(dest)
            ev.cover_image = filename
        db.session.commit()
        return {'message': 'updated'}


@ns.route('/events/<int:event_id>/export')
class ExportRegistrants(Resource):
    @jwt_required()
    @role_required('organizer', 'admin')
    def get(self, event_id):
        user_id = get_jwt_identity()
        ev = Event.query.get(event_id)
        if not ev or ev.organizer_id != user_id:
            return {'message': 'Not found or forbidden'}, 404
        regs = Registration.query.filter_by(event_id=event_id).join(User, Registration.user_id == User.id).add_columns(User.email, User.name, Registration.created_at).all()
        si = io.StringIO()
        cw = csv.writer(si)
        cw.writerow(['email', 'name', 'registered_at'])
        for r in regs:
            cw.writerow([r.email, r.name, r.created_at])
        output = si.getvalue()
        return Response(output, mimetype='text/csv', headers={"Content-Disposition": f"attachment;filename=registrants_event_{event_id}.csv"})


@ns.route('/dashboard')
class OrganizerDashboard(Resource):
    @jwt_required()
    @role_required('organizer', 'admin')
    def get(self):
        user_id = get_jwt_identity()
        # events with counts
        events = Event.query.filter_by(organizer_id=user_id).all()
        data = []
        for e in events:
            count = Registration.query.filter_by(event_id=e.id).count()
            avg_rating = db.session.query(func.avg(Review.rating)).filter(Review.event_id == e.id).scalar() or 0
            est_income = (e.price_cents or 0) * count / 100.0
            data.append({'event_id': e.id, 'title': e.title, 'attendees': count, 'estimated_income': est_income, 'avg_rating': float(avg_rating)})
        return data
