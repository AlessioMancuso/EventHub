from datetime import datetime
from enum import Enum
from .extensions import db

class Role(Enum):
    user = "user"
    organizer = "organizer"
    admin = "admin"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    name = db.Column(db.String(120))
    role = db.Column(db.String(32), default=Role.user.value)
    banned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(64))
    city = db.Column(db.String(120))
    venue = db.Column(db.String(255))
    start_datetime = db.Column(db.DateTime)
    end_datetime = db.Column(db.DateTime)
    capacity = db.Column(db.Integer, default=0)
    price_cents = db.Column(db.Integer, default=0)
    cover_image = db.Column(db.String(255))
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registration_id = db.Column(db.Integer, db.ForeignKey('registration.id'), nullable=False)
    qr_code_data = db.Column(db.Text)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    moderated = db.Column(db.Boolean, default=False)
    flagged = db.Column(db.Boolean, default=False)
