#
#
#
import numpy as np


def create_filename(id_area, layer, il_min, il_max, xl_min, xl_max, z_min, z_max):
    return  str(id_area) + '-' + str(layer) + '-' + str(il_min) + '-' + str(il_max) + '-' + str(xl_min) + '-' + str(xl_max) + '-' + str(z_min) + '-' + str(z_max)



def select_df_il_xl(df, exca):
    df_t = df.loc[  (df['iline'] >= int(exca['iline']['min'])) &
                    (df['iline'] <= int(exca['iline']['max'])) &
                    (df['xline'] >= int(exca['xline']['min'])) &
                    (df['xline'] <= int(exca['xline']['max'])) ]
    return df_t.sort_values(['iline','xline'],ascending=[True, True])



def create_list_prob(scl, iz_min, iz_max, len_sec, df_s, pofix, fp, interval):

    tt = []
    val_list = []

    iz = iz_min
    while iz <= iz_max:
        t_val = []
        j = 0
        while j < len_sec:
            t_val.append( scl * fp.trace[ int(df_s.iloc[j]['tracenum']) ][iz] )
            j += 1

        tt.append(str(iz*interval) + pofix)
        df_s['prob'] = t_val
        el = df_s[['y','x','prob']].values.tolist()
        val_list.append(el)

        iz += 1

    return tt, val_list



def create_list_sum_max(len_sec, df_s, fp, iz_min, iz_max):
    prob_val_sum = []
    prob_val_max = []
    j = 0
    while j < len_sec:
        vv = fp.trace[ int(df_s.iloc[j]['tracenum']) ][iz_min:iz_max]
        prob_val_sum.append( np.sum(vv) )
        prob_val_max.append( np.amax(vv) )
        j += 1

    return prob_val_sum, prob_val_max



def create_list_far_vfar(scl, iz_min, iz_max, len_sec, df_s, pofix1, pofix2,  fp1, fp2, interval):
    tt = []
    val_list = []

    v_min = 0
    v_max = 0

    iz = iz_min
    while iz <= iz_max:
        t_val_1 = []
        t_val_2 = []

        j = 0
        while j < len_sec:
            t_val_1.append( scl * fp1.trace[ int(df_s.iloc[j]['tracenum']) ][iz])
            t_val_2.append( scl * fp2.trace[ int(df_s.iloc[j]['tracenum']) ][iz])
            j += 1


        tt.append(str(iz*interval) + pofix1)
        df_s['prob'] = t_val_1
        el = df_s[['y','x','prob']].values.tolist()
        val_list.append(el)

        tt.append(str(iz*interval) + pofix2)
        df_s['prob'] = t_val_2
        el = df_s[['y','x','prob']].values.tolist()
        val_list.append(el)

        v_min = min( v_min, min(t_val_1), min(t_val_2) )
        v_max = max( v_max, max(t_val_1), max(t_val_2) )

        # print(iz, iz*interval, iz_max, v_min, v_max)
        iz += 1

    return tt, val_list, v_min, v_max



def template_analysis():
    return {
        "probability": {
            "star": 0,
            "weight": 0,
            "note": "",
            "score": 0
        },
        "substack": {
            "star": 0,
            "weight": 0,
            "note": "",
            "score": 0
        },
        "AVA": {
            "star": 0,
            "weight": 0,
            "note": "",
            "score": 0
        },
        "sweetness": {
            "star": 0,
            "weight": 0,
            "note": "",
            "score": 0
        },
        "well_analogy": {
            "star": 0,
            "weight": 0,
            "note": "",
            "score": 0
        },
        "total": {
            "star": 0,
            "weight": 0,
            "note": "",
            "score": 0
        }
    }
