from .extensions import ma
from .models import User, Event, Review


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True


class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        load_instance = True


class ReviewSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Review
        load_instance = True
