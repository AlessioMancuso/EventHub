import requests
from jose import jwt
from jose.exceptions import JWTError
import time
from flask import current_app

_JWKS_CACHE = {}

def fetch_jwks(jwks_uri):
    # Simple caching with TTL
    now = time.time()
    cached = _JWKS_CACHE.get(jwks_uri)
    if cached and cached.get('expires', 0) > now:
        return cached['jwks']
    r = requests.get(jwks_uri, timeout=5)
    r.raise_for_status()
    jwks = r.json()
    _JWKS_CACHE[jwks_uri] = {'jwks': jwks, 'expires': now + 3600}
    return jwks


def verify_keycloak_token(token: str, audience: str = None):
    """Verify Keycloak/OIDC token using JWKS. Returns claims if valid, raises on error."""
    issuer = current_app.config.get('KEYCLOAK_ISSUER')
    jwks_uri = current_app.config.get('KEYCLOAK_JWKS_URI')
    if not issuer or not jwks_uri:
        raise RuntimeError('Keycloak not configured')
    jwks = fetch_jwks(jwks_uri)
    try:
        options = {"verify_aud": bool(audience)}
        claims = jwt.decode(token, jwks, audience=audience, issuer=issuer, options=options)
        return claims
    except JWTError as e:
        raise
