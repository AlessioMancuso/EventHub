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
        # Keycloak access tokens sometimes set aud to the account service and
        # client ID in azp for public clients. Also allow local host issuer
        # and internal docker issuer variants during development.
        options = {"verify_aud": False, "verify_iss": False}
        claims = jwt.decode(token, jwks, options=options)

        token_issuer = claims.get('iss')
        allowed_issuers = {issuer}
        if issuer:
            if issuer.startswith('http://keycloak:'):
                allowed_issuers.add(issuer.replace('http://keycloak:', 'http://localhost:'))
            elif issuer.startswith('http://localhost:'):
                allowed_issuers.add(issuer.replace('http://localhost:', 'http://keycloak:'))

        if issuer and token_issuer not in allowed_issuers:
            raise JWTError('Invalid issuer')

        if audience:
            aud_claim = claims.get('aud')
            azp = claims.get('azp')
            aud_values = []
            if isinstance(aud_claim, str):
                aud_values = [aud_claim]
            elif isinstance(aud_claim, list):
                aud_values = aud_claim
            if audience not in aud_values and azp != audience:
                raise JWTError('Invalid audience')
        return claims
    except JWTError as e:
        raise
