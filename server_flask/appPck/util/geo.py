# lat  Sets the latitude coordinates (in degrees North)
# lon Sets the longitude coordinates (in degrees East)

# EPSG:4326 WGS 84
# Long 117  Indonesia
# Lat 0

# EPSG:32750 WGS 84 / UTM zone 50S

# <pos Sync="TRUE">484415.302975 9871181.190673</pos>
# </cornerPts>
# <cornerPts>
# <pos Sync="TRUE">484415.302975 9989282.565536</pos>
# </cornerPts>
# <cornerPts>
# <pos Sync="TRUE">597887.999778 9989282.565536</pos>
# </cornerPts>
# <cornerPts>
# <pos Sync="TRUE">597887.999778 9871181.190673</pos>
# </cornerPts>


# <centerPt>
# <pos Sync="TRUE">541151.651377 9930231.878105</pos>

import pyproj
from typing import Tuple

# utm15_wgs84 = pyproj.Proj(init='epsg:32615')
utm50s_wgs84 = pyproj.Proj(projparams="epsg:32750")

lon, lat = utm50s_wgs84(434898, 58000, inverse=True)


def convert_utm_latlon(
        utm_x: float,
        utm_y: float,
        pyproj_obj: pyproj.proj.Proj
) -> Tuple[float, float]:
    return pyproj_obj(utm_x, utm_y, inverse=True)


def compute_mid_point(
        ll_x_min: float,
        ll_x_max: float,
        ll_y_min: float,
        ll_y_max: float
) -> Tuple[float, float]:
    return (ll_x_min + ll_x_max) / 2, (ll_y_min + ll_y_max) / 2


def df_utm_latlon(df, func):
    ax_min = df["x_min"].values
    ax_max = df["x_max"].values
    ay_min = df["y_min"].values
    ay_max = df["y_max"].values


print(convert_utm_latlon(484415.302975, 9871181.190673, utm50s_wgs84))
