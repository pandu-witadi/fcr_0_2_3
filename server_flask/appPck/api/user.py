
# api: user
#
import json
import bcrypt
import jwt
from flask import request
from flask_cors import cross_origin

from appPck.api import bp
from appPck.util.io_format import fret
from appPck.util.auth import create_payload
from config import Config as CF

from appPck.model.User import User



@bp.route('/user/list', methods=['GET'])
@cross_origin()
def list_user():
    """ list user """
    # get query set, result list QuerySet
    list_obj = User.objects.all()
    dmp = []
    for obj in list_obj:
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        dmp.append(tmp)

    return fret({}, 1, '/user/list', "success", dmp)



@bp.route('/user/register', methods=['POST'])
@cross_origin()
def register_user():
    """ register user """
    rq = request.get_json()
    dt = rq['data']
    try:
        user = User.objects.get(email=dt['email'])
        return fret(rq, 0, '/user/register', "user already register", [])

    except User.DoesNotExist:
        hashed = bcrypt.hashpw(dt['password'].encode('utf-8'), bcrypt.gensalt())
        user = User(
            email=dt['email'],
            username=dt['username'],
            password=hashed,
            level=dt['level'],
            label=dt['label'],
            isLogin=False
        )
        user.save()
        tmp = user.to_mongo().to_dict()
        del tmp['_id']

        rq['user'] = tmp
        return fret(rq, 1, '/user/register', "success", {})



@bp.route('/user/delete', methods=['POST'])
@cross_origin()
def delete_user():
    """ register user """
    rq = request.get_json()
    dt = rq['data']
    try:
        user = User.objects.get(email=dt['email'])
        user.delete()

        tmp = user.to_mongo().to_dict()
        tmp['_id'] = str(tmp['_id'])
        return fret(rq, 1, '/user/delete', "success", tmp)

    except User.DoesNotExist:
        return fret(rq, 0, '/user/delete', "user not register", [])



@bp.route('/user/login', methods=['POST'])
@cross_origin()
def login_user():
    """ login user """
    rq = request.get_json()
    dt = rq['data']

    if not ("email" in dt and "password" in dt):
         return fret(rq, 0, 'user/login', "parameters incomplete", {})

    try:
        user = User.objects.get(email=dt['email'])
        if not bcrypt.checkpw(dt['password'].encode('utf-8'), user['password'].encode('utf-8')):
            return fret(rq, 0, '/user/login', "password fail", {})

        # if dt['password'] != user['password']:
            # return fret(rq, 0, '/user/login', "password fail", {})

        user.isLogin = True
        user.save()

        tmp = user.to_mongo().to_dict()
        tmp['_id'] = str(tmp['_id'])

        payload = create_payload(user['email'], tmp['_id'])
        token = jwt.encode(payload, CF.SECRET_KEY, algorithm="HS256")
        tmp['token'] = token
        rq['user'] = tmp
        return fret(rq, 1, '/user/login', "success", {})

    except User.DoesNotExist:
        return fret(rq, 0, '/user/login', "user not register", {})



@bp.route('/user/logout', methods=['POST'])
@cross_origin()
def logout_user():
    """ logout user """
    rq = request.get_json()
    dt = rq['data']
    try:
        user = User.objects.get(email=dt['email'])
        user.save()
        user.isLogin = False

        tmp = user.to_mongo().to_dict()
        del tmp['_id']

        rq['user'] = tmp
        return fret(rq, 1, '/user/logout', "success", {})

    except User.DoesNotExist:
        return fret(rq, 0, '/user/logout', "user not register", {})
