from flask import Blueprint
from flask_restx import Namespace

from ..extensions import api

bp = Blueprint('api', __name__, url_prefix='/api')

def register_api(app):
    from .auth import ns as auth_ns
    from .events import ns as events_ns

    api.init_app(app)
    api.add_namespace(auth_ns)
    api.add_namespace(events_ns)
