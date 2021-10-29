#
#
#
from scipy import spatial



def closest_il_xl(dt, df):
    # find iline
    at = df[['iline']].to_numpy()
    dist, index = spatial.KDTree(at).query([int(dt['iline']['min'])])
    iline_min = int(df.loc[index]['iline'])

    dist, index = spatial.KDTree(at).query([int(dt['iline']['max'])])
    iline_max = int(df.loc[index]['iline'])

    # find xline
    at = df[['xline']].to_numpy()
    dist, index = spatial.KDTree(at).query([int(dt['xline']['min'])])
    xline_min = int(df.loc[index]['xline'])

    dist, index = spatial.KDTree(at).query([int(dt['xline']['max'])])
    xline_max = int(df.loc[index]['xline'])

    return iline_min, iline_max, xline_min, xline_max



def create_exact_area(il_min, il_max, xl_min, xl_max, z_min, z_max):
    return {
        "iline": { "min": il_min, "max": il_max },
        "xline": { "min": xl_min, "max": xl_max },
        "z"    : { "min": z_min,  "max": z_max }
    }



def create_box_area(df, il_min, il_max, xl_min, xl_max):
    dfp1 = df[(df['iline'] == il_min) & (df['xline'] == xl_min)]
    dfp2 = df[(df['iline'] == il_min) & (df['xline'] == xl_max)]
    dfp3 = df[(df['iline'] == il_max) & (df['xline'] == xl_min)]
    dfp4 = df[(df['iline'] == il_max) & (df['xline'] == xl_max)]

    return {
         "p1" : {
             "iline": int(dfp1.iloc[0]['iline']),
             "xline": int(dfp1.iloc[0]['xline']),
             "x"    : float(dfp1.iloc[0]['x']),
             "y"    : float(dfp1.iloc[0]['y'])
         },
         "p2" : {
             "iline": int(dfp2.iloc[0]['iline']),
             "xline": int(dfp2.iloc[0]['xline']),
             "x"    : float(dfp2.iloc[0]['x']),
             "y"    : float(dfp2.iloc[0]['y'])
         },
         "p3" : {
             "iline": int(dfp3.iloc[0]['iline']),
             "xline": int(dfp3.iloc[0]['xline']),
             "x"    : float(dfp3.iloc[0]['x']),
             "y"    : float(dfp3.iloc[0]['y'])
         },
         "p4" : {
             "iline": int(dfp4.iloc[0]['iline']),
             "xline": int(dfp4.iloc[0]['xline']),
             "x"    : float(dfp4.iloc[0]['x']),
             "y"    : float(dfp4.iloc[0]['y'])
         }
    }
