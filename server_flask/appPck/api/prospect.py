#
# api: prospect
#
import os
import numpy as np
import pandas as pd
import segyio

import json
from flask import request
from flask_cors import cross_origin

from appPck.api import bp
from appPck.util.io_format import fret
from appPck.util.segy import open_segy, find_z_idx
from config import Config as CF

from appPck.model.Prospect import Prospect
from appPck.model.Area import Area
from appPck.model.ProbModelFile import ProbModelFile

from appPck.util.prospect import create_filename, select_df_il_xl, create_list_prob, create_list_sum_max, create_list_far_vfar, template_analysis


@bp.route('/prospect/list', methods=['GET'])
@cross_origin()
def list_prospect():
    """ list prospect """
    # get query set, result list QuerySet
    # rq = request.get_json()
    # q_set = Prospect.objects(id_area=rq['data']['id_area'])
    q_set = Prospect.objects.order_by('+ctime')
    if len(q_set) <= 0:
        return fret(rq, 0, '/prospect/list', "prospect not found", [])

    dmp = []
    for obj in q_set:
        tmp = obj.to_mongo().to_dict()
        tmp['id'] = str(tmp['_id'])
        del tmp['_id']
        tmp['ctime'] = tmp['ctime'].isoformat()
        # tmp['dmp']['polygon']
        dmp.append(tmp)

    return fret({}, 1, '/prospect/list', "success", dmp)



@bp.route('/prospect/analysis', methods=['POST'])
@cross_origin()
def analysis_prospect():
    """ analysis  prospect """
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        tmp['dmp']['ctime'] = tmp['ctime'].isoformat()
        del tmp['ctime']

        return fret(rq, 1, '/prospect/analysis', "success", tmp)

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/prospect/analysis', "prospect not register", [])

# @bp.route('/prospect/data', methods=['POST'])
# @cross_origin()
# def data_prospect():
#     """ get data prospect """
#     # get query set, result list QuerySet
#     rq = request.get_json()
#     dt = rq['data']
#
#     try:
#         obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
#         tmp = obj.to_mongo().to_dict()
#         del tmp['_id']
#         tmp['dmp']['ctime'] = tmp['ctime'].isoformat()
#
#         area = Area.objects.get(id_area=dt['id_area'])
#         subs = area['dmp']['substack']
#
#         df = pd.read_csv(os.path.join(CF.data_folder, subs['far']['loc'], subs['far']['headerfile']), sep=',')
#         fp_far, interval, ns = open_segy(os.path.join(CF.data_folder, subs['far']['loc'], subs['far']['filename']))
#
#         # df_vfar = pd.read_csv(os.path.join(CF.data_folder, subs['vfar']['loc'], subs['vfar']['headerfile']), sep=',')
#         fp_vfar, interval, ns = open_segy(os.path.join(CF.data_folder, subs['vfar']['loc'], subs['vfar']['filename']))
#
#         df_t = df.loc[  (df['iline'] >= int(tmp['dmp']['exca']['iline']['min'])) &
#                         (df['iline'] <= int(tmp['dmp']['exca']['iline']['max'])) &
#                         (df['xline'] >= int(tmp['dmp']['exca']['xline']['min'])) &
#                         (df['xline'] <= int(tmp['dmp']['exca']['xline']['max'])) ]
#         df_s = df_t.sort_values(['iline','xline'],ascending=[True, True])
#         len_sec = len(df_s)
#
#         l_min, iz_min = find_z_idx(interval, float(tmp['dmp']['exca']['z']['min']), interval)
#         l_max, iz_max = find_z_idx(interval, float(tmp['dmp']['exca']['z']['max']), interval)
#
#         tt = []
#         val_list = []
#
#         v_min = 0
#         v_max = 0
#
#         iz = iz_min
#         while iz <= iz_max:
#             t_val_far  = []
#             t_val_vfar = []
#
#             j = 0
#             while j < len_sec:
#
#                 t_val_far.append(  -fp_far.trace[ int(df_s.iloc[j]['tracenum']) ][iz])
#                 t_val_vfar.append(-fp_vfar.trace[ int(df_s.iloc[j]['tracenum']) ][iz])
#                 j += 1
#
#             tt.append(str(iz*interval) + ' - far')
#             df_s['prob'] = t_val_far
#             el = df_s[['y','x','prob']].values.tolist()
#             val_list.append(el)
#
#             tt.append(str(iz*interval) + ' - vfar')
#             df_s['prob'] = t_val_vfar
#             el = df_s[['y','x','prob']].values.tolist()
#             val_list.append(el)
#
#             v_min = min( v_min, min(t_val_far), min(t_val_vfar))
#             v_max = max( v_max, max(t_val_far), max(t_val_vfar))
#
#             print(iz, iz*interval, iz_max, v_min, v_max)
#
#             iz += 1
#
#         dt['polygon'] = tmp['dmp']['geojson']['geometry']['coordinates'][0]
#         dt['label_z'] = tt
#         dt['v_min_max'] = {
#             "min": float(v_min),
#             "max": float(v_max)
#         }
#         dt['val_list'] = val_list
#
#         return fret(rq, 1, '/prospect/data', "success", dt)
#
#     except Prospect.DoesNotExist:
#         return fret(rq, 0, '/prospect/data', "prospect not register", [])



@bp.route('/prospect/data', methods=['POST'])
@cross_origin()
def data_prospect():
    """ get data prospect """
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        tmp['dmp']['ctime'] = tmp['ctime'].isoformat()

        tt = []
        val_list = []
        area = Area.objects.get(id_area=dt['id_area'])


        # --- open probability file
        obj = ProbModelFile.objects.get( id_area=dt['id_area'], layer=tmp['dmp']['layer'] )

        df_prob = pd.read_csv(os.path.join(CF.data_folder, obj['loc'], obj['headerfile']), sep=',')
        fp_prob, interval_prob, ns_prob = open_segy(os.path.join(CF.data_folder, obj['loc'], obj['filename']))

        df_s_prob = select_df_il_xl(df_prob, tmp['dmp']['exca'])
        len_sec_prob = len(df_s_prob)

        l_min, iz_min_prob = find_z_idx(interval_prob, float(tmp['dmp']['exca']['z']['min']), interval_prob)
        l_max, iz_max_prob = find_z_idx(interval_prob, float(tmp['dmp']['exca']['z']['max']), interval_prob)

        # --- insert probability
        tt_1, val_list_1 = create_list_prob(1.0, iz_min_prob, iz_max_prob, len_sec_prob, df_s_prob, ' - PROB', fp_prob, interval_prob)
        prob_val_sum, prob_val_max = create_list_sum_max(len_sec_prob, df_s_prob, fp_prob, iz_min_prob, iz_max_prob)

        tt_1.insert(0, 'prob scaled sum')
        df_s_prob['prob'] = prob_val_sum/max(prob_val_sum)
        el = df_s_prob[['y','x','prob']].values.tolist()
        val_list_1.insert(0, el)

        tt_1.insert(0, 'prob_max')
        df_s_prob['prob'] = prob_val_max
        el = df_s_prob[['y','x','prob']].values.tolist()
        val_list_1.insert(0, el)

        tt.append(tt_1)
        val_list.append(val_list_1)



        #--- open stack far and vfar  file
        subs = area['dmp']['substack']

        df_stk = pd.read_csv(os.path.join(CF.data_folder, subs['far']['loc'], subs['far']['headerfile']), sep=',')
        fp_far, interval_far, ns_sfar = open_segy(os.path.join(CF.data_folder, subs['far']['loc'], subs['far']['filename']))

        # df_vfar = pd.read_csv(os.path.join(CF.data_folder, subs['vfar']['loc'], subs['vfar']['headerfile']), sep=',')
        fp_vfar, interval_vfar, ns_vfar = open_segy(os.path.join(CF.data_folder, subs['vfar']['loc'], subs['vfar']['filename']))

        df_s_stk = select_df_il_xl(df_stk, tmp['dmp']['exca'])
        len_sec_stk = len(df_s_stk)

        l_min, iz_min_stk = find_z_idx(interval_far, float(tmp['dmp']['exca']['z']['min']), interval_far)
        l_max, iz_max_stk = find_z_idx(interval_far, float(tmp['dmp']['exca']['z']['max']), interval_far)

        # --- insert substack far and vfar
        tt_2, val_list_2, v_min_stk, v_max_stk = create_list_far_vfar(-1.0, iz_min_stk, iz_max_stk, len_sec_stk, df_s_stk, ' - STK FAR', ' - STK VFAR',  fp_far, fp_vfar, interval_far)
        print(v_min_stk, v_max_stk)
        tt.append(tt_2)
        val_list.append(val_list_2)


        # # --- open sweetness far and vfar file
        subs = area['dmp']['sweetness']

        df_swt = pd.read_csv(os.path.join(CF.data_folder, subs['far']['loc'], subs['far']['headerfile']), sep=',')
        fp_sfar, interval_sfar, ns_sfar = open_segy(os.path.join(CF.data_folder, subs['far']['loc'], subs['far']['filename']))
        #
        # df_vfar = pd.read_csv(os.path.join(CF.data_folder, subs['vfar']['loc'], subs['vfar']['headerfile']), sep=',')
        fp_svfar, interval_svfar, ns_svfar = open_segy(os.path.join(CF.data_folder, subs['vfar']['loc'], subs['vfar']['filename']))

        df_s_swt = select_df_il_xl(df_swt, tmp['dmp']['exca'])
        len_sec_swt = len(df_s_swt)

        l_min, iz_min_swt = find_z_idx(interval_sfar, float(tmp['dmp']['exca']['z']['min']), interval_sfar)
        l_max, iz_max_swt = find_z_idx(interval_sfar, float(tmp['dmp']['exca']['z']['max']), interval_sfar)

        # --- insert substack far and vfar
        tt_3, val_list_3, v_min_swt, v_max_swt = create_list_far_vfar(1.0, iz_min_swt, iz_max_swt, len_sec_swt, df_s_swt, ' - SWT FAR', ' - SWT VFAR',  fp_sfar, fp_svfar, interval_sfar)
        print(v_min_swt, v_max_swt)
        tt.append(tt_3)
        val_list.append(val_list_3)



        dt['polygon'] = tmp['dmp']['geojson']['geometry']['coordinates'][0]
        dt['label_z'] = tt
        dt['v_min_max'] = [
            {
                "min": 0,
                "max": 1
            },
            {
                "min": float(v_min_stk),
                "max": float(v_max_stk)
            },
            {
                "min": float(v_min_swt),
                "max": float(v_max_swt)
            }
        ]
        dt['val_list'] = val_list


        fp_prob.close()
        fp_far.close()
        fp_vfar.close()
        fp_sfar.close()
        fp_svfar.close()

        return fret(rq, 1, '/prospect/data', "success", dt)

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/prospect/data', "prospect not register", [])



@bp.route('/prospect/save', methods=['POST'])
@cross_origin()
def save_prospect():
    """ save prospect """
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    area = Area.objects.get(id_area=dt['id_area'])
    dt['filename'] = create_filename(
            area['name'], dt['layer'],
            dt['exca']['iline']['min'], dt['exca']['iline']['max'],
            dt['exca']['xline']['min'], dt['exca']['xline']['max'],
            dt['exca']['z']['min'], dt['exca']['z']['max'] )

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        return fret(rq, 0, '/prospect/save', "filename il-xl-z already registered", dt)

    except Prospect.DoesNotExist:

        dt['user'] = rq['user']
        dt['score'] = rq['score']
        dt['score']['star'] = 0
        dt['score']['note'] = ""
        dt['marker'] = rq['marker']
        dt['analysis'] = template_analysis()

        obj = Prospect(
            id_area=dt['id_area'],
            userId=dt['user']['username'],
            layer=dt['layer'],
            name=rq['name'],
            group=rq['group'],
            filename=dt['filename'],
            score=dt['score']['score'],
            np=dt['score']['np'],
            area=dt['score']['area'],
            dmp=dt
        )
        obj.save()

        return fret(rq, 1, '/prospect/save', "success", dt)



@bp.route('/prospect/update', methods=['POST'])
@cross_origin()
def update_prospect():
    """ update prospect """
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        obj['dmp']['score'] = dt['score']
        obj['star'] = dt['score']['star']
        obj['note'] = dt['score']['note']

        obj.save()

        tmp = obj.to_mongo().to_dict()
        tmp['id'] = str(tmp['_id'])
        del tmp['_id']
        tmp['ctime'] = tmp['ctime'].isoformat()

        return fret(rq, 0, '/prospect/update', "success", tmp)

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/prospect/update', "prospect not register", [])



@bp.route('/prospect/create-group', methods=['POST'])
@cross_origin()
def create_group_prospect():
    """ create  grpup prospect """
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    if len(dt['list']) <= 0:
        return fret(rq, 0, '/prospect/create-group', "list is empty", [])

    i = 0
    while i < len(dt['list']):
        try:
            obj = Prospect.objects.get( id_area=dt['list'][i]['id_area'], filename=dt['list'][i]['filename'] )
            obj['group'] = dt['group']
            obj.save()
        except Prospect.DoesNotExist:
            pass
        i += 1

    return fret(rq, 1, '/prospect/create-group', "group updated", [])



@bp.route('/prospect/update-star', methods=['POST'])
@cross_origin()
def update_star_group():
    """ update star prospect """
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        obj['dmp']['analysis'] = dt['analysis']
        obj.save()

        tmp = obj.to_mongo().to_dict()
        tmp['id'] = str(tmp['_id'])
        del tmp['_id']
        tmp['ctime'] = tmp['ctime'].isoformat()

        return fret(rq, 0, '/prospect/update-star', "success", tmp)

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/prospect/update-star', "prospect not register", [])



@bp.route('/prospect/wa-data', methods=['POST'])
@cross_origin()
def wa_data():
    """ get well_analogy data"""
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )

        if "well_analogy" not in obj['dmp']:
            obj['dmp']['well_analogy'] = []
            obj.save()

        tmp = obj.to_mongo().to_dict()
        tmp['id'] = str(tmp['_id'])
        del tmp['_id']
        tmp['ctime'] = tmp['ctime'].isoformat()

        return fret(rq, 0, '/prospect/wa-data', "success", tmp['dmp']['well_analogy'])

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/prospect/wa-data`', "prospect not register", [])



@bp.route('/prospect/wa-delete', methods=['POST'])
@cross_origin()
def wa_delete():
    """ delete well_analogy """
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        obj['dmp']['well_analogy'] = []
        obj.save()

        tmp = obj.to_mongo().to_dict()
        tmp['id'] = str(tmp['_id'])
        del tmp['_id']
        tmp['ctime'] = tmp['ctime'].isoformat()

        return fret(rq, 0, '/prospect/wa-delete', "success", tmp)

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/prospect/wa-delete', "prospect not register", [])



@bp.route('/prospect/wa-add-el', methods=['POST'])
@cross_origin()
def wa_add_el():
    """ add element in well_analogy """
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )

        if "well_analogy" not in obj['dmp']:
            obj['dmp']['well_analogy'] = []

        obj['dmp']['well_analogy'].append(dt['wa_el'])
        obj.save()

        tmp = obj.to_mongo().to_dict()
        tmp['id'] = str(tmp['_id'])
        del tmp['_id']
        tmp['ctime'] = tmp['ctime'].isoformat()

        return fret(rq, 0, '/prospect/wa-add-el', "success", tmp)


    except Prospect.DoesNotExist:
        return fret(rq, 0, '/prospect/wa-add-el', "prospect not register", [])
