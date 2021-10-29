#
#
#
import datetime
import time
import random

from flask import request
from flask_cors import cross_origin

from appPck.api import bp
from config import Config as CF
from appPck.util.io_format import fret
from appPck.util.auth import authRequired


@bp.route('/test', methods=['GET'])
@cross_origin()
def test():
    return fret({}, 1, "/api/test", "success", {
        "app": CF.APP_NAME,
        "version": CF.APP_VERSION,
        "owner": CF.APP_OWNER,
        "random-test": random.randint(0, 1000),
        "time": datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
    })



@bp.route('/test/post', methods=['POST'])
@cross_origin()
def test_post():
    rq = request.get_json()
    return fret({}, 1, "/api/test/post", "success", rq)



@bp.route('/test/auth', methods=['GET'])
@cross_origin()
@authRequired
def check_user():
    return fret({}, 1, '/api/test/auth', 'success', {
        'email': request.userEmail,
        'userId': request.userId
    })
