#
#
#
import segyio



def open_segy(filename):
    """ open segyio """
    fp = segyio.open(filename, ignore_geometry=True)
    interval = float(fp.bin[segyio.BinField.Interval] / 1000)
    ns = fp.bin[segyio.BinField.Samples]
    return fp, interval, ns



def get_section(f, list_idx):
    """ get_section trace data"""
    data = []
    i = 0
    en = len(list_idx)
    while i < en:
        data.append(f.trace[ list_idx[i] ])
        i += 1

    return data



# find closest z index from len1
def find_z_idx(d1, len1, d2):
    i2 = int(len1/d2)
    len2 = i2 * d2
    if len1 <= len2:
        if abs(len2 - d2 - len1) < abs(len2 - len1):
            i2 = i2 - 1
            len2 =  i2 * d2

    if len1 > len2:
        if abs(len2 + d2 - len1) < abs(len2 - len1):
            i2 = i2 + 1
            len2 = i2 * d2

    return len2, i2



def find_AVA_raw_segy(f, idx_st, idx_en):
    """ find correct depth AVA"""
    trace_header = []
    trace_data = []
    i = idx_st
    while i <= idx_en:
        trace_header.append(f.header[i])
        trace_data.append(f.trace[i])
        i += 1
    return trace_header, trace_data


def find_AVA_section_segy(offset_byte, f, idx_st, idx_en, iz_st, iz_en):
    """ find correct depth AVA"""
    trace_header = []
    trace_data = []
    i = idx_st
    while i <= idx_en:
        trace_header.append(int.from_bytes(f.header[i].buf[offset_byte:offset_byte + 3], "big"))
        trace_data.append(f.trace[i][iz_st:iz_en])
        i += 1
    return trace_header, trace_data



def f_mean(l):
    if len(l) > 0:
        return sum(l) / len(l)
    else:
        return 0


def min_opt_mean(arr):
    v_min = min(arr)
    v_mean = f_mean(arr)
    len_arr = len(arr)
    i = 0
    v_opt = arr[0]
    while i < len_arr:
        if abs(v_opt) < abs(arr[i]):
            v_opt = arr[i]
        i += 1
    return v_min, v_opt, v_mean



def extract_AVA_from_segy_v20(trace_header, trace_data, interval, trace_samples, offset_byte, p_neigh, idx_z):
    """ get AVA from segy"""
    data = []
    idx_z_val = []
    header = []
    i_neigh = int(p_neigh / interval)
    j_min = max(0, idx_z - i_neigh)
    j_max = min(idx_z + i_neigh, trace_samples - 1)
    j = j_min
    while j <= j_max:
        idx_z_val.append(j * interval)
        j += 1
    idx_z_val.append(0)
    idx_z_val.append(1)
    idx_z_val.append(2)
    idx_z_val.append(3)

    i = 0
    len_data = len(trace_data)
    while i < len_data:
        header.append(int.from_bytes(trace_header[i].buf[offset_byte:offset_byte + 3], "big"))
        ava = []
        j = j_min
        while j <= j_max:
            ava.append(trace_data[i][j])
            j += 1

        v_min, v_opt, v_mean = min_opt_mean(ava)
        ava.append(trace_data[i][idx_z])
        ava.append(v_min)
        ava.append(v_opt)
        ava.append(v_mean)
        data.append(ava)
        i += 1
    return header, idx_z_val, data
