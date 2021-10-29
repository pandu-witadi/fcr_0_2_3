#
# api: probmap
#
import os
import pandas as pd
import segyio

from flask import request
from flask_cors import cross_origin
from appPck.api import bp

from config import Config as CF

from appPck.util.io_format import fret
from appPck.model.ProbModelFile import ProbModelFile



@bp.route('/model/list', methods=['POST'])
@cross_origin()
def list_model():
    """ list model """
    # get query set, result list QuerySet
    rq = request.get_json()
    q_set = ProbModelFile.objects(id_area=rq['data']['id_area'])
    if len(q_set) <= 0:
        return fret(rq, 0, '/model/list', "model not found", [])

    dmp = []
    for obj in q_set:
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        dmp.append(tmp)

    return fret(rq, 1, '/model/list', "success", dmp)



@bp.route('/model/register', methods=['POST'])
@cross_origin()
def register_model():
    """ register probability map """
    rq = request.get_json()
    try:
        model = ProbModelFile.objects.get(
            id_area=rq['data']['id_area'],
            filename=rq['data']['filename'],
            layer=rq['data']['layer']
        )
        return fret(rq, 0, '/model/register', "model already register", [])

    except ProbModelFile.DoesNotExist:
        pmf = ProbModelFile(
            id_area=rq['data']['id_area'],
            filename=rq['data']['filename'],
            headerfile=rq['data']['headerfile'],
            headercolumn=rq['data']['headercolumn'],
            label=rq['data']['label'],
            loc=rq['data']['loc'],
            layer=rq['data']['layer'],
            isDefault=rq['data']['isDefault'],
            note=rq['data']['note']
        )
        pmf.save()
        tmp = pmf.to_mongo().to_dict()
        del tmp['_id']

        return fret(rq, 1, '/model/register', "success", tmp)



@bp.route('/model/info', methods=['POST'])
@cross_origin()
def info_model():
    """ info model """
    rq = request.get_json()
    try:
        model = ProbModelFile.objects.get(
            id_area=rq['data']['id_area'],
            layer=rq['data']['layer'],
        )
    except ProbModelFile.DoesNotExist:
        return fret(rq, 0, '/model/info', "model not register", [])

    tmp = model.to_mongo().to_dict()
    del tmp['_id']
    return fret(rq, 1, '/model/info', "success",  tmp)
