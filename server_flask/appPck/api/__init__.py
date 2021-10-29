#
# init package : api
#
from flask import Blueprint

bp = Blueprint('api', __name__, template_folder='templates')

from . import test, area, probmap, model, well, potprosp, prospect, user, segy
