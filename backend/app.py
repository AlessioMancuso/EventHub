from flask import Flask, send_from_directory, url_for
from flask_cors import CORS
from .config import config_by_name
from .extensions import init_extensions, api
from .api import register_api


def create_app(config_name='dev'):
    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name['dev']))

    init_extensions(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    register_api(app)

    # ensure upload folder exists
    import os
    upload_folder = app.config.get('UPLOAD_FOLDER')
    if upload_folder:
        os.makedirs(upload_folder, exist_ok=True)

    # create database tables automatically in development
    if app.config.get('DEBUG'):
        from .extensions import db
        with app.app_context():
            db.create_all()

    @app.route('/')
    def index():
        return {'service': 'EventHub backend', 'status': 'ok'}

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config.get('UPLOAD_FOLDER'), filename)

    return app
