#
#
#

def dev_scan_v30(dev_start_line, dev_x_col, dev_y_col, dev_z_col, dev_z_mul, filename):
    """ scan deviation file"""
    dev_list = []
    # read dev file
    with open(filename, 'r') as fp:
        i = 0
        for line in fp:
            if i >= dev_start_line:
                cols = line.split()
                dev_data = [float(cols[dev_x_col]),
                            float(cols[dev_y_col]),
                            float(cols[dev_z_col]) * dev_z_mul]
                dev_list.append(dev_data)
            i += 1
    return dev_list
