#
# api/well
#
import os
import json
import pandas as pd
from flask import request
from flask_cors import cross_origin

from appPck.api import bp
from appPck.util.io_format import fret
from config import Config as CF

from appPck.model.WellListFile import WellListFile
from appPck.model.Well import Well
from appPck.util.well import dev_scan_v30


@bp.route('/well/list-info/<id_area>', methods=['GET'])
@cross_origin()
def list_well_info(id_area):
    """ list well """
    # get query set, result list QuerySet
    rq = request.get_json()
    try:
        wlf = WellListFile.objects.get(id_area=id_area)
        tmp = wlf.to_mongo().to_dict()
        del tmp['_id']

        try:
            df = pd.read_csv(os.path.join(CF.data_folder, tmp['loc'], tmp['filename']), sep=',')
            return fret({}, 0, '/well/list-info', "success", df.to_dict('records'))
        except FileNotFoundError:
            return fret({}, 0, '/well/list-info', "file csv not found", [])

    except WellListFile.DoesNotExist:
        return fret({}, 0, '/well/list-info', "list well not found", [])



@bp.route('/well/list-register', methods=['POST'])
@cross_origin()
def register_well_list():
    """ register well list """
    rq = request.get_json()
    try:
        model = WellListFile.objects.get(
            id_area=rq['data']['id_area'],
            filename=rq['data']['filename']
        )
        return fret(rq, 0, '/well/list-register', "well list already register", [])

    except WellListFile.DoesNotExist:
        wlf = WellListFile(
            id_area=rq['data']['id_area'],
            filename=rq['data']['filename'],
            label=rq['data']['label'],
            loc=rq['data']['loc'],
            column=rq['data']['column']
        )
        wlf.save()
        tmp = wlf.to_mongo().to_dict()
        del tmp['_id']

        return fret(rq, 1, '/well/list-register', "success", tmp)



@bp.route('/well/register', methods=['POST'])
@cross_origin()
def register_well():
    """ register well """
    rq = request.get_json()
    dt = rq['data']
    try:
        well = Well.objects.get(filename=dt['filename'])
        return fret(rq, 0, '/well/register', "well already register", [])

    except Well.DoesNotExist:
        dmp = {}
        polyline = dev_scan_v30(17, 1, 2, 3, -1.0, os.path.join(CF.well_folder, dt['filename']))
        dmp['polyline'] = polyline


        if "marker" in dt:
            dmp['marker'] = dt['marker']
        else:
            dmp['marker'] = []

        well = Well(filename=dt['filename'],
            label=dt['label'],
            GTS=dt['GTS'],
            dmp=dmp
        )
        well.save()
        tmp = well.to_mongo().to_dict()
        tmp['_id'] = str(tmp['_id'])

        return fret(rq, 1, '/well/register', "success", tmp)



@bp.route('/well/delete', methods=['POST'])
@cross_origin()
def delete_well():
    """ delete well """
    rq = request.get_json()
    dt = rq['data']
    try:
        well = Well.objects.get(filename=dt['filename'])
        tmp = well.to_mongo().to_dict()
        tmp['_id'] = str(tmp['_id'])
        well.delete()
        return fret(rq, 1, '/well/delete', "success", tmp)

    except Well.DoesNotExist:
        return fret(rq, 0, '/well/delete', "well not register", tmp)



@bp.route('/well/list', methods=['GET'])
@cross_origin()
def list_well():
    """ list well """
    # get query set, result list QuerySet
    list_obj = Well.objects.all()
    dmp = []
    for obj in list_obj:
        tmp = obj.to_mongo().to_dict()
        tmp['_id'] = str(tmp['_id'])
        dmp.append(tmp)

    return fret({}, 1, '/well/list', "success", dmp)




@bp.route('/well/list-lite', methods=['GET'])
@cross_origin()
def lite_list_well():
    """ list well """
    # get query set, result list QuerySet
    list_obj = Well.objects.all()
    dmp = []
    for obj in list_obj:
        tmp = obj.to_mongo().to_dict()
        del tmp['dmp']
        tmp['_id'] = str(tmp['_id'])
        dmp.append(tmp)

    return fret({}, 1, '/well/list', "success", dmp)




@bp.route('/well/dev-list', methods=['GET'])
@cross_origin()
def list_dev():
    """ list dev """
    tt = []

    wp = False
    try:
        df = pd.read_csv(os.path.join(CF.data_folder, 'well_postmortem_HAL.csv'), sep=',')
        df_g = df.groupby(['Well']).size().reset_index(name='freq')
        wp = True

    except FileNotFoundError:
        wp = False


    with open(os.path.join(CF.data_folder, 'dev_list')) as f:
        lines = f.readlines()

        for line in lines:
            tt.append(line[0:-1])
            dmp = {}
            polyline = dev_scan_v30(17, 1, 2, 3, -1.0, os.path.join(CF.well_folder, line[0:-1]))
            dmp['polyline'] = polyline
            dmp['marker'] = []

            GTS = ''
            if wp and df_g['Well'].str.contains(str(line[0:-5])).sum() > 0:
                print(line[0:-1], 'e')
                df_t = df[df['Well'] == str(line[0:-5])]
                GTS = df_t.iloc[0]['GTS']

                i = 0
                while i < len(df_t):
                    el = {
                        'x': float(df_t.iloc[i]['X']),
                        'y': float(df_t.iloc[i]['Y']),
                        'z': float(df_t.iloc[i]['Depth']) * -1.0,
                        'PD_Reservoir': str(df_t.iloc[i]['PD_Reservoir'])
                    }
                    dmp['marker'].append(el)
                    i += 1

            well = Well(filename=line[0:-1],
                label=line[0:-5],
                GTS=GTS,
                dmp=dmp
            )
            well.save()
            tmp = well.to_mongo().to_dict()
            tmp['_id'] = str(tmp['_id'])

        return fret({}, 0, '/well/dev-list', "success", tt)


    return fret({}, 1, '/well/dev-list', "success", dmp)
