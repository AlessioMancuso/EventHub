from flask import Flask
from .config import config_by_name
from .extensions import init_extensions, api
from .api import register_api


def create_app(config_name='dev'):
    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name['dev']))

    init_extensions(app)
    register_api(app)

    # ensure upload folder exists
    import os
    upload_folder = app.config.get('UPLOAD_FOLDER')
    if upload_folder:
        os.makedirs(upload_folder, exist_ok=True)

    @app.route('/')
    def index():
        return {'service': 'EventHub backend', 'status': 'ok'}

    return app
