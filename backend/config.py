import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///eventhub.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")
    RESTX_MASK_SWAGGER = False
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB

    # Keycloak / OIDC configuration
    KEYCLOAK_ISSUER = os.getenv("KEYCLOAK_ISSUER")
    KEYCLOAK_JWKS_URI = os.getenv("KEYCLOAK_JWKS_URI")
    KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID")
    KEYCLOAK_AUDIENCE = os.getenv("KEYCLOAK_AUDIENCE")

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config_by_name = dict(dev=DevelopmentConfig, prod=ProductionConfig)