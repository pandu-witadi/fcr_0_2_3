#
# store all configuration needed
#
import os


class Config:
    # basic info
    APP_NAME = 'flask-machine-learning'
    APP_VERSION = '0_2_3'
    APP_OWNER = 'Pertamina Hulu Mahakam'

    # for authentication
    SECRET_KEY = 'this-auth-token'
    token_exp = 1 * 24 * 60 * 60      # seconds

     # refers to application_top
    APP_ROOT = os.path.dirname(os.path.abspath(__file__))
    APP_STATIC = os.path.join(APP_ROOT, 'static')

    # mongodb parameter
    MONGODB_HOST = "mongodb://localhost/phm_ml_0_2_2"
    MONGODB_PORT = 27017


    # path and url
    static_folder   = "../../client_vue/dist/static"
    template_folder = "../../client_vue/dist"
    data_folder     = "/home/pandu/dataori/phm"
    well_folder     = "/home/pandu/dataori/phm/well_las_dev"

    path_front_end = "/"
    path_api = "/api"


    p_neigh = 15.0  # meter, half minimum layer
    offset_byte = 37
    cal_prob_threshold = 0.5


    admin_name = "admin"
    admin_password = "admin"
