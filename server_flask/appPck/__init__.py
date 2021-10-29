#
# create instance app
#
from flask import Flask
from flask_cors import CORS

from config import Config as CF



def create_app(config_class=CF):
    """
    create app and load all config
    """
    app = Flask( __name__, static_folder=CF.static_folder, template_folder=CF.template_folder )
    app.config.from_object(config_class)

    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    from appPck.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix=CF.path_api)

    from appPck.router import bp as router_bp
    app.register_blueprint(router_bp, url_prefix=CF.path_front_end)



    return app
