from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Event, Registration, Ticket, User
from ..extensions import db
from ..utils.qr import generate_qr_base64
import json

ns = Namespace('registrations', description='Event registrations')

reg_model = ns.model('Registration', {
    'id': fields.Integer(readonly=True),
    'event_id': fields.Integer,
    'user_id': fields.Integer,
})


@ns.route('/events/<int:event_id>/register')
class EventRegister(Resource):
    @jwt_required()
    def post(self, event_id):
        user_id = get_jwt_identity()
        event = Event.query.get(event_id)
        if not event:
            return {'message': 'Event not found'}, 404
        # check already registered
        if Registration.query.filter_by(user_id=user_id, event_id=event_id).first():
            return {'message': 'Already registered'}, 400
        # check capacity
        count = Registration.query.filter_by(event_id=event_id).count()
        if event.capacity and count >= event.capacity:
            return {'message': 'Event full'}, 400
        reg = Registration(user_id=user_id, event_id=event_id)
        db.session.add(reg)
        db.session.commit()

        # create ticket with QR
        payload = json.dumps({'ticket_id': reg.id, 'event_id': event_id, 'user_id': user_id})
        qr_b64 = generate_qr_base64(payload)
        ticket = Ticket(registration_id=reg.id, qr_code_data=qr_b64)
        db.session.add(ticket)
        db.session.commit()
        return {'registration_id': reg.id, 'ticket_id': ticket.id, 'qr_base64': qr_b64}, 201

    @jwt_required()
    def delete(self, event_id):
        user_id = get_jwt_identity()
        reg = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
        if not reg:
            return {'message': 'Not registered'}, 404
        # delete ticket
        Ticket.query.filter_by(registration_id=reg.id).delete()
        db.session.delete(reg)
        db.session.commit()
        return {'message': 'Unregistered'}, 200


@ns.route('/users/me/registrations')
class MyRegs(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        regs = Registration.query.filter_by(user_id=user_id).all()
        result = []
        for r in regs:
            ticket = Ticket.query.filter_by(registration_id=r.id).first()
            event = Event.query.get(r.event_id)
            result.append({'registration_id': r.id, 'event': {'id': event.id, 'title': event.title}, 'ticket': {'id': ticket.id if ticket else None}})
        return result
