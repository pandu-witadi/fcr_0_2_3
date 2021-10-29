#
# api: probmap
#
import os
import pandas as pd
from scipy import spatial

from flask import request
from flask_cors import cross_origin
from appPck.api import bp

from config import Config as CF

from appPck.util.io_format import fret
from appPck.util.segy import open_segy, get_section

from appPck.model.ProbMapLayerFile import ProbMapLayerFile
from appPck.model.ProbModelFile import ProbModelFile



@bp.route('/probmap/list-all', methods=['GET'])
@cross_origin()
def list_all_probmap():
    """ list all probability map """
    # get query set, result list QuerySet
    q_set = ProbMapLayerFile.objects().all()
    dmp = []
    for obj in q_set:
        tmp = obj.to_mongo().to_dict()
        tmp['_id'] = str(tmp['_id'])
        dmp.append(tmp)

    return fret({}, 1, '/probmap/list-all', "success", dmp)



@bp.route('/probmap/get-list/<id_area>', methods=['GET'])
@cross_origin()
def get_list_probmap(id_area):
    """ get list probability map """
    # get query set, result list QuerySet
    q_set = ProbMapLayerFile.objects(id_area=id_area)
    if len(q_set) <= 0:
        return fret({}, 0, '/probmap/get-list', "probmap not found", [])

    dmp = []
    for obj in q_set:
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        dmp.append(tmp)

    return fret({}, 1, '/probmap/get-list', "success", dmp)



@bp.route('/probmap/list', methods=['POST'])
@cross_origin()
def list_probmap():
    """ list probability map """
    # get query set, result list QuerySet
    rq = request.get_json()
    q_set = ProbMapLayerFile.objects(
        id_area=rq['data']['id_area'],
        layer=rq['data']['layer']
    )
    if len(q_set) <= 0:
        return fret(rq, 0, '/probmap/list', "probmap not found", [])

    dmp = []
    for obj in q_set:
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        dmp.append(tmp)

    return fret(rq, 1, '/probmap/list', "success", dmp)



@bp.route('/probmap/register', methods=['POST'])
@cross_origin()
def register_probmap():
    """ register probability map """
    rq = request.get_json()
    try:
        probmap = ProbMapLayerFile.objects.get(
            id_area=rq['data']['id_area'],
            filename=rq['data']['filename'],
            layer=rq['data']['layer']
        )
        return fret(rq, 0, '/probmap/register', "probmap already register", [])

    except ProbMapLayerFile.DoesNotExist:
        pmlf = ProbMapLayerFile(
            id_area=rq['data']['id_area'],
            filename=rq['data']['filename'],
            label=rq['data']['label'],
            loc=rq['data']['loc'],
            layer=rq['data']['layer'],
            isDefault=rq['data']['isDefault']
        )
        pmlf.save()
        tmp = pmlf.to_mongo().to_dict()
        tmp['_id'] = str(tmp['_id'])

        return fret(rq, 1, '/probmap/register', "success", tmp)



@bp.route('/probmap/delete', methods=['POST'])
@cross_origin()
def delete_probmap():
    """ delete probability map """
    rq = request.get_json()
    dt = rq['data']

    try:
        probmap = ProbMapLayerFile.objects.get(
            id_area=dt['id_area'],
            filename=dt['filename'],
            layer=dt['layer']
        )
        probmap.delete()

        tmp = probmap.to_mongo().to_dict()
        tmp['_id'] = str(tmp['_id'])

        return fret(rq, 1, '/probmap/delete', "success", tmp)

    except ProbMapLayerFile.DoesNotExist:
        return fret(rq, 0, '/probmap/delete', "file not register", tmp)



@bp.route('/probmap/multi', methods=['POST'])
@cross_origin()
def multi_probmap():
    """ get multi probability map """
    rq = request.get_json()
    dt = rq['data']

    if len(dt) <= 0:
        return fret(rq, 0, '/probmap/multi', "list empty", [])

    dmp = []
    i = 0
    while i < len(dt):
        try:
            # print(dt[i]['id_area'], dt[i]['layer'], dt[i]['filename'])
            obj = ProbMapLayerFile.objects.get( id_area=dt[i]['id_area'], layer=dt[i]['layer'], filename=dt[i]['filename'] )
            tmp = obj.to_mongo().to_dict()
            probmap_file = os.path.join(CF.data_folder, tmp['loc'], tmp['filename'])
            try:
                df_probmap = pd.read_csv(probmap_file, sep=',')
                check = len(df_probmap) > 0
            except FileNotFoundError:
                check = False

            if check:
                df_probmap['sum'] = df_probmap['mean'] * df_probmap['ns']
                val_max = max(df_probmap['sum'])
                val_min = min(df_probmap['sum'])
                ee = {
                    "label": obj['label'],
                    "layer": obj['layer'],
                    "feature": "sum",
                    "sum": {
                        "min": val_min,
                        "max": val_max
                    },
                    "probmap": df_probmap[['y','x','sum']].values.tolist()
                }
                dmp.append(ee)

        except ProbMapLayerFile.DoesNotExist:
            pass

        i = i + 1

    return fret(rq, 1, '/probmap/multi', "success", dmp)




@bp.route('/probmap/find-sandbox', methods=['POST'])
@cross_origin()
def probmap_find_sandbox():
    rq = request.get_json()
    q_set = model = ProbModelFile.objects(id_area=rq['data']['id_area'])
    if len(q_set) <= 0:
        return fret(rq, 0,  '/probmap/find-sandbox', "model not register", [])

    dmp = []
    for obj in q_set:
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        if tmp['layer'] == int(rq['data']['layer']):
            break

    header_file = os.path.join(CF.data_folder, tmp['loc'], tmp['headerfile'])
    prob_file   = os.path.join(CF.data_folder, tmp['loc'], tmp['filename'])
    try:
        df = pd.read_csv(header_file, sep=',')
        # print(df.columns)
    except FileNotFoundError:
        return fret(rq, 0, '/probmap/find-sandbox', "file empty/not found", [])

    pt = [ float(rq['data']['x']), float(rq['data']['y'])  ]

    A =  df[['x', 'y']].to_numpy()
    dist, index = spatial.KDTree(A).query(pt)
    # print(index, df.loc[index])

    fp, interval, ns = open_segy(prob_file)

    ret_list = []

    # --- set iline
    df_iline = df.loc[df['iline'] == df.iloc[index]['iline']]
    iline_data = get_section(fp, df_iline['tracenum'].tolist())

    # create object json output
    ret = {
        "ntrace": len(df_iline),
        "ns": ns,
        'y': {
            'label': 'm',
            'sampling': interval,
            'start': 0
        },
        'x': {
            'label': 'xl',
            'sampling': 1,
            'start': 0
        },
        'idx_st': df_iline.iloc[0]['xline'],
        'idx_en': df_iline.iloc[len(df_iline)-1]['xline'],
        'file_name': tmp['filename'],
        'title': 'IL :',
        'interval': interval,
        'cdp_no': str(df.iloc[index]['iline'])[:-2],
        'cdp_header': df_iline['xline'].tolist(),
        'cdp_data': [[float(v) for v in row] for row in iline_data]
    }
    ret_list.append(ret)

    # --- set xline
    df_xline = df.loc[df['xline'] == df.iloc[index]['xline']]
    xline_data = get_section(fp, df_xline['tracenum'].tolist())
    # create object json output
    ret = {
        "ntrace": len(df_xline),
        "ns": ns,
        'y': {
            'label': 'm',
            'sampling': interval,
            'start': 0
        },
        'x': {
            'label': 'il',
            'sampling': 1,
            'start': 0
        },
        'idx_st': df_xline.iloc[0]['iline'],
        'idx_en': df_xline.iloc[len(df_xline)-1]['iline'],
        'file_name': tmp['filename'],
        'title': 'XL :',
        'interval': interval,
        'cdp_no': str(df.iloc[index]['xline'])[:-2],
        'cdp_header': df_xline['iline'].tolist(),
        'cdp_data': [[float(v) for v in row] for row in xline_data]
    }
    ret_list.append(ret)
    fp.close()
    return fret(rq, 1, '/probmap/find-sandbox', "success",  ret_list)
