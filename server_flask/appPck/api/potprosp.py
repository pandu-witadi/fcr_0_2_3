#
# api: potprosp
#
import os
import numpy as np
import pandas as pd
import segyio

from flask import request
from flask_cors import cross_origin
from appPck.api import bp

from config import Config as CF

from appPck.util.io_format import fret
from appPck.util.segy import open_segy, get_section, find_z_idx
from appPck.util.potprosp import closest_il_xl, create_box_area, create_exact_area
from appPck.util.prospect import select_df_il_xl, create_list_prob, create_list_sum_max

from appPck.model.Area import Area
from appPck.model.Prospect import Prospect
from appPck.model.ProbModelFile import ProbModelFile

from random import randint
import matplotlib.path as mlPath


@bp.route('/potprosp/propose', methods=['POST'])
@cross_origin()
def propose_potprosp():
    """ propose potential propspect """
    rq = request.get_json()
    dt = rq['data']

    # open header segy file
    model = ProbModelFile.objects.get( id_area=dt['id_area'], layer=dt['layer'] )
    try:
        df = pd.read_csv(os.path.join(CF.data_folder, model['loc'], model['headerfile']), sep=',')
    except FileNotFoundError:
        return fret(rq, 0, '/potprosp/propose', "file empty/not found", [])

    # open segy file
    fp, interval, ns = open_segy(os.path.join(CF.data_folder, model['loc'], model['filename']))

    l_min, iz_min = find_z_idx(interval, float(dt['z']['min']), interval)
    l_max, iz_max = find_z_idx(interval, float(dt['z']['max']), interval)

    il_min, il_max, xl_min, xl_max = closest_il_xl(dt, df)
    dmp = {
        "id_area": dt['id_area'],
        "layer": int(dt['layer']),
        "exca": create_exact_area(il_min, il_max, xl_min, xl_max, l_min, l_max),
        "boxa" : create_box_area(df, il_min, il_max, xl_min, xl_max)
    }

    fp.close()
    return fret(rq, 1, '/potprosp/propose', "success", dmp)



@bp.route('/potprosp/data', methods=['POST'])
@cross_origin()
def data_potprosp():
    """ propose potential propspect """
    rq = request.get_json()
    dt = rq['data']

    try:
        model = ProbModelFile.objects.get( id_area=dt['id_area'], layer=dt['layer'] )
        df = pd.read_csv(os.path.join(CF.data_folder, model['loc'], model['headerfile']), sep=',')
    except FileNotFoundError:
        return fret(rq, 0, '/potprosp/data', "file empty/not found", [])

    df_s = select_df_il_xl(df, dt['exca'])
    len_sec = len(df_s)

    # open segy file
    fp, interval, ns = open_segy(os.path.join(CF.data_folder, model['loc'], model['filename']))

    l_min, iz_min = find_z_idx(interval, float(dt['exca']['z']['min']), interval)
    l_max, iz_max = find_z_idx(interval, float(dt['exca']['z']['max']), interval)

    tt, prob_list = create_list_prob(1.0, iz_min, iz_max, len_sec, df_s, ' - PROB', fp, interval)
    # calculate max and scaled_sum from all z layer
    prob_val_sum, prob_val_max = create_list_sum_max(len_sec, df_s, fp, iz_min, iz_max)

    tt.insert(0, 'scaled sum')
    df_s['prob'] = prob_val_sum/max(prob_val_sum)
    el = df_s[['y','x','prob']].values.tolist()
    prob_list.insert(0, el)

    tt.insert(0, 'max')
    df_s['prob'] = prob_val_max
    el = df_s[['y','x','prob']].values.tolist()
    prob_list.insert(0, el)

    dt['label_z'] = tt
    dt['prob_list'] = prob_list

    fp.close()
    return fret(rq, 1, '/potprosp/data', "success", dt)



@bp.route('/potprosp/calc-score', methods=['POST'])
@cross_origin()
def calc_score_potprosp():
    """ propose potential propspect """
    rq = request.get_json()
    dt = rq['data']

    try:
        area = Area.objects.get(id_area=dt['id_area'])
    except Area.DoesNotExist:
        return fret(rq, 0, '/potprosp/calc-score', "area not register", [])

    # find model
    model = ProbModelFile.objects.get( id_area=dt['id_area'], layer=dt['layer'] )
    try:
        df = pd.read_csv(os.path.join(CF.data_folder, model['loc'], model['headerfile']), sep=',')
    except FileNotFoundError:
        return fret(rq, 0, '/potprosp/calc-score', "file empty/not found", [])

    # open segy file
    fp, interval, ns = open_segy(os.path.join(CF.data_folder, model['loc'], model['filename']))

    # create polygon
    p = mlPath.Path(dt['geojson']['geometry']['coordinates'][0][:-1])
    df_s = select_df_il_xl(df, dt['exca'])
    len_sec = len(df_s)

    l_min, iz_min = find_z_idx(interval, float(dt['exca']['z']['min']), interval)
    l_max, iz_max = find_z_idx(interval, float(dt['exca']['z']['max']), interval)

    nt = 0
    nts = 0.0
    j = 0
    while j < len_sec:
        cp = df_s.iloc[j]
        ck = cp[['x', 'y']].values.tolist()
        cr = p.contains_points([ck])
        if cr[0]:
            nt += 1
            nts += fp.trace[ int(df_s.iloc[j]['tracenum']) ][iz_min:iz_max+1].sum()
        j += 1

    dt['score'] = {
        "np" : nt,
        "score": nts,
        "area": nt * area['dmp']['bin_area']
    }

    fp.close()
    return fret(rq, 1, '/potprosp/calc-rating', "success", dt)
