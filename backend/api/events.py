from flask_restx import Namespace, Resource, fields, reqparse
from flask import request
from ..models import Event
from ..extensions import db
from datetime import datetime

ns = Namespace('events', description='Event operations')

event_model = ns.model('Event', {
    'id': fields.Integer(readonly=True),
    'title': fields.String(required=True),
    'description': fields.String,
    'category': fields.String,
    'city': fields.String,
    'start_datetime': fields.DateTime,
    'price_cents': fields.Integer,
})

parser = reqparse.RequestParser()
parser.add_argument('category', type=str, location='args')
parser.add_argument('city', type=str, location='args')
parser.add_argument('date_from', type=str, location='args')
parser.add_argument('date_to', type=str, location='args')
parser.add_argument('min_price', type=int, location='args')
parser.add_argument('max_price', type=int, location='args')
parser.add_argument('q', type=str, location='args')


@ns.route('/')
class EventList(Resource):
    @ns.expect(parser)
    @ns.marshal_list_with(event_model)
    def get(self):
        args = parser.parse_args()
        query = Event.query
        if args.get('category'):
            query = query.filter(Event.category == args['category'])
        if args.get('city'):
            query = query.filter(Event.city.ilike(f"%{args['city']}%"))
        if args.get('date_from'):
            try:
                dfrom = datetime.fromisoformat(args['date_from'])
                query = query.filter(Event.start_datetime >= dfrom)
            except Exception:
                pass
        if args.get('date_to'):
            try:
                dto = datetime.fromisoformat(args['date_to'])
                query = query.filter(Event.start_datetime <= dto)
            except Exception:
                pass
        if args.get('min_price') is not None:
            query = query.filter(Event.price_cents >= args['min_price'])
        if args.get('max_price') is not None:
            query = query.filter(Event.price_cents <= args['max_price'])
        if args.get('q'):
            q = f"%{args['q']}%"
            query = query.filter((Event.title.ilike(q)) | (Event.description.ilike(q)))

        events = query.order_by(Event.start_datetime).limit(100).all()
        return events
