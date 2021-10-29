#
# api: area
#
import json
from flask import request
from flask_cors import cross_origin

from appPck.api import bp
from appPck.util.io_format import fret
from config import Config as CF

from appPck.model.Area import Area



@bp.route('/area/list', methods=['GET'])
@cross_origin()
def list_area():
    """ list area """
    # get query set, result list QuerySet
    list_obj = Area.objects.all()
    dmp = []
    for obj in list_obj:
        dmp.append(obj['dmp'])

    return fret({}, 1, '/area/list', "success", dmp)



@bp.route('/area/register', methods=['POST'])
@cross_origin()
def register_area():
    """ register area """
    rq = request.get_json()
    dt = rq['data']

    q_set = Area.objects(id_area=dt['id_area'])
    dicts = json.loads(q_set.to_json())
    if len(dicts) > 0 :
        return fret(rq, 0, '/area/register', "area already register", [])

    obj = Area(
        id_area=dt['id_area'],
        name=dt['name'],
        dmp=dt
    )
    obj.save()
    return fret(rq, 1, '/area/register', "success", obj.dmp)



@bp.route('/area/delete', methods=['POST'])
@cross_origin()
def delete_area():
    """ delete area """
    rq = request.get_json()
    dt = rq['data']
    try:
        area = Area.objects.get(id_area=dt['id_area'])
        area.delete()

        tmp = area.to_mongo().to_dict()
        return fret(rq, 1, '/area/delete', "success",  tmp['dmp'])

    except Area.DoesNotExist:
        return fret(rq, 0, '/area/delete', "area not register", [])



@bp.route('/area/info', methods=['POST'])
@cross_origin()
def info_area():
    """ info area """
    rq = request.get_json()
    dt = rq['data']

    try:
        area = Area.objects.get(id_area=dt['id_area'])
    except Area.DoesNotExist:
        return fret(rq, 0, '/area/info', "area not register", [])

    return fret(rq, 1, '/area/info', "success",  area['dmp'])
