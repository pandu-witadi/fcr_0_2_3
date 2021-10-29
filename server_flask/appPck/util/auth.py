#
#
#
from functools import wraps
from flask import request
import jwt
import time

from appPck.util.io_format import fret
from config import Config as CF


def create_payload(email, userId):
    return {
        'email': email,
        'userId': userId,
        'iat': int(time.time()),
        'exp': int(time.time()) + CF.token_exp
    }



def authRequired(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return fret({}, 0, 'auth', 'token missing', {})

        try:
            decoded = jwt.decode(token, CF.SECRET_KEY, algorithms=["HS256"])
            request.userEmail = decoded['email']
            request.userId = decoded['userId']

            # decoded['rem'] = decoded['exp'] - int(time.time())

        except jwt.ExpiredSignatureError:
            return fret({}, 0, 'auth', 'token is expired', {})
        except jwt.DecodeError:
            return fret({}, 0, 'auth', 'token decode error', {})

        return func(*args, **kwargs)
    return decorated
