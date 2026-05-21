from flask import Blueprint
from flask_restx import Namespace

from ..extensions import api

bp = Blueprint('api', __name__, url_prefix='/api')

def register_api(app):
    from .auth import ns as auth_ns
    from .events import ns as events_ns
    from .registrations import ns as regs_ns
    from .reviews import ns as reviews_ns
    from .organizer import ns as organizer_ns
    from .admin import ns as admin_ns

    api.add_namespace(auth_ns)
    api.add_namespace(events_ns)
    api.add_namespace(regs_ns)
    api.add_namespace(reviews_ns)
    api.add_namespace(organizer_ns)
    api.add_namespace(admin_ns)
