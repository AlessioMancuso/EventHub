from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import abort


def role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get('role')
            if user_role not in roles:
                abort(403, description='Insufficient role')
            return fn(*args, **kwargs)

        return decorator

    return wrapper
