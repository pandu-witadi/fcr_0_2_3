#
# api: segy
#
import os
import numpy as np
import pandas as pd
from scipy import spatial
import segyio

from flask import request
from flask_cors import cross_origin
from appPck.api import bp

from config import Config as CF
from appPck.util.io_format import fret
from appPck.util.segy import open_segy, find_z_idx, find_AVA_raw_segy, find_AVA_section_segy, extract_AVA_from_segy_v20

from appPck.model.Segy import Segy
from appPck.model.Prospect import Prospect
from appPck.model.Area import Area

from scipy import spatial




@bp.route('/segy/view-gather', methods=['POST'])
@cross_origin()
def view_gather():
    """ get data gather """
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        tmp['dmp']['ctime'] = tmp['ctime'].isoformat()

        area = Area.objects.get(id_area=dt['id_area'])
        gtfl = area['dmp']['gather_AVA']

        df = pd.read_csv(os.path.join(CF.data_folder, gtfl['loc'], gtfl['headerfile']), sep=',')
        fp, interval, ns = open_segy(os.path.join(CF.data_folder, gtfl['loc'], gtfl['filename']))

        (il_c, t) = divmod( tmp['dmp']['exca']['iline']['min'] + tmp['dmp']['exca']['iline']['max'], 2)
        (xl_c, t) = divmod( tmp['dmp']['exca']['xline']['min'] + tmp['dmp']['exca']['xline']['max'], 2)

        at = df[['iline']].to_numpy()
        dist, index = spatial.KDTree(at).query([il_c])
        il_h = int(df.loc[index]['iline'])

        at = df[['xline']].to_numpy()
        dist, index = spatial.KDTree(at).query([xl_c])
        xl_h = int(df.loc[index]['xline'])

        df_tr = df[(df['iline'] == il_h) & (df['xline'] == xl_h)]

        idx_st = int(min(df_tr['tracenum']))
        idx_en = int(max(df_tr['tracenum']))
        print(idx_st, idx_en)
        trace_header, trace_data = find_AVA_raw_segy(fp, idx_st, idx_en)

        ret_list = []

        iz =  int(tmp['dmp']['exca']['z']['min'])

        while iz <=  int(tmp['dmp']['exca']['z']['max']):
            len_z, id_z = find_z_idx(interval, iz, interval)
            print(iz, id_z)
            header, idx_z_arr, data = extract_AVA_from_segy_v20(trace_header, trace_data, interval, ns, 37, 15, id_z)

            idx_data_ori = idx_z_arr.index(0)
            idx_data_min = idx_z_arr.index(1)
            idx_data_opt = idx_z_arr.index(2)
            idx_data_avr = idx_z_arr.index(3)
            data_ori = []
            data_min = []
            data_opt = []
            data_avr = []
            len_header = len(header)
            ia = 0
            while ia < len_header:
                data_ori.append(data[ia][idx_data_ori])
                data_min.append(data[ia][idx_data_min])
                data_opt.append(data[ia][idx_data_opt])
                data_avr.append(data[ia][idx_data_avr])
                ia += 1

            # print(header, data)
            ret = {
                'iline': il_h,
                'xline': xl_h,
                'z': iz,
                'header': header,
                'ava': [float(v) for v in data_min]
            }

            ret_list.append(ret)

            iz = iz + interval

        fp.close()
        return fret(rq, 1, '/segy/default-ava', "success", ret_list)

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/segy/default-ava', "prospect not register", [])




@bp.route('/segy/view-gather-section', methods=['POST'])
@cross_origin()
def view_gather_section():
    """ get data gather """
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        tmp['dmp']['ctime'] = tmp['ctime'].isoformat()

        area = Area.objects.get(id_area=dt['id_area'])
        gtfl = area['dmp']['gather_AVA']

        df = pd.read_csv(os.path.join(CF.data_folder, gtfl['loc'], gtfl['headerfile']), sep=',')
        fp, interval, ns = open_segy(os.path.join(CF.data_folder, gtfl['loc'], gtfl['filename']))

        (il_c, t) = divmod( tmp['dmp']['exca']['iline']['min'] + tmp['dmp']['exca']['iline']['max'], 2)
        (xl_c, t) = divmod( tmp['dmp']['exca']['xline']['min'] + tmp['dmp']['exca']['xline']['max'], 2)

        (z_tt, t) = divmod( tmp['dmp']['exca']['z']['min'] + tmp['dmp']['exca']['z']['max'], 2)
        (z_idx, t) = divmod(z_tt, interval)
        z_c = int(z_idx * interval)

        len_z, id_z  = find_z_idx(interval, z_c, interval)
        len_z, iz_st = find_z_idx(interval, tmp['dmp']['exca']['z']['min'], interval)
        len_z, iz_en = find_z_idx(interval, tmp['dmp']['exca']['z']['max'], interval)


        at = df[['iline']].to_numpy()
        dist, index = spatial.KDTree(at).query([il_c])
        il_h = int(df.loc[index]['iline'])

        at = df[['xline']].to_numpy()
        dist, index = spatial.KDTree(at).query([xl_c])
        xl_h = int(df.loc[index]['xline'])

        df_tr = df[(df['iline'] == il_h) & (df['xline'] == xl_h)]

        idx_st = int(min(df_tr['tracenum']))
        idx_en = int(max(df_tr['tracenum']))
        print(idx_st, idx_en)
        header, trace_data = find_AVA_section_segy(37, fp, idx_st, idx_en, iz_st, iz_en+1)
        # header, idx_z_arr, data = extract_AVA_from_segy_v20(trace_header, trace_data, interval, ns, 37, 15, id_z)

        ret = {
            'iline': il_h,
            'xline': xl_h,
            'interval': interval,
            'z_c': z_c,
            'z_st': tmp['dmp']['exca']['z']['min'],
            'z_en': tmp['dmp']['exca']['z']['max'],
            'header': header,
            'ava':  [[float(v) for v in row] for row in trace_data]
        }

        fp.close()
        return fret(rq, 1, '/segy/view-gather-section', "success", [ret])

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/segy/view-gather-section', "prospect not register", [])



@bp.route('/segy/find-gather', methods=['POST'])
@cross_origin()
def find_gather():
    """ find gather location in segy data"""
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        tmp['dmp']['ctime'] = tmp['ctime'].isoformat()

        area = Area.objects.get(id_area=dt['id_area'])
        gtfl = area['dmp']['gather_AVA']

        df = pd.read_csv(os.path.join(CF.data_folder, gtfl['loc'], gtfl['headerfile']), sep=',')
        fp, interval, ns = open_segy(os.path.join(CF.data_folder, gtfl['loc'], gtfl['filename']))

        pt = [ float(dt['x']), float(dt['y'])  ]
        # print(len(df), fp.tracecount, pt)

        A =  df[['x', 'y']].to_numpy()
        dist, index = spatial.KDTree(A).query(pt)
        # print(dist, index, df.iloc[index]['iline'], df.iloc[index]['xline'], obj['dmp']['exca']['z'])

        ret = {
            'iline': int(df.iloc[index]['iline']),
            'xline': int(df.iloc[index]['xline']),
            'z': tmp['dmp']['exca']['z']
        }

        fp.close()
        return fret(rq, 1, '/segy/find-gather', "success", ret)

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/segy/find-gather', "prospect not register", [])



@bp.route('/segy/get-gather-section', methods=['POST'])
@cross_origin()
def get_gather_section():
    """ get data gather """
    # get query set, result list QuerySet
    rq = request.get_json()
    dt = rq['data']

    try:
        obj = Prospect.objects.get( id_area=dt['id_area'], filename=dt['filename'] )
        tmp = obj.to_mongo().to_dict()
        del tmp['_id']
        tmp['dmp']['ctime'] = tmp['ctime'].isoformat()

        area = Area.objects.get(id_area=dt['id_area'])
        gtfl = area['dmp']['gather_AVA']

        df = pd.read_csv(os.path.join(CF.data_folder, gtfl['loc'], gtfl['headerfile']), sep=',')
        fp, interval, ns = open_segy(os.path.join(CF.data_folder, gtfl['loc'], gtfl['filename']))

        (z_tt, t) = divmod( dt['z']['min'] + dt['z']['max'], 2)
        (z_idx, t) = divmod(z_tt, interval)
        z_c = int(z_idx * interval)

        len_z, id_z  = find_z_idx(interval, z_c, interval)
        len_z, iz_st = find_z_idx(interval, dt['z']['min'], interval)
        len_z, iz_en = find_z_idx(interval, dt['z']['max'], interval)

        df_tr = df[(df['iline'] == dt['iline']) & (df['xline'] == dt['xline'])]

        idx_st = int(min(df_tr['tracenum']))
        idx_en = int(max(df_tr['tracenum']))
        print(idx_st, idx_en)
        header, trace_data = find_AVA_section_segy(37, fp, idx_st, idx_en, iz_st, iz_en+1)
        # header, idx_z_arr, data = extract_AVA_from_segy_v20(trace_header, trace_data, interval, ns, 37, 15, id_z)

        label = ''
        if "label" in dt:
            label = dt['label']

        ret = {
            'iline': int(dt['iline']),
            'xline': int(dt['xline']),
            'interval': interval,
            'z_c': z_c,
            'z_st': dt['z']['min'],
            'z_en': dt['z']['max'],
            'header': header,
            'label': label,
            'ava':  [[float(v) for v in row] for row in trace_data]
        }

        fp.close()
        return fret(rq, 1, '/segy/get-gather-section', "success", [ret])

    except Prospect.DoesNotExist:
        return fret(rq, 0, '/segy/get-gather-section', "prospect not register", [])
