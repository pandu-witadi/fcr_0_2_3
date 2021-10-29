#
# init package : router
#
from flask import Blueprint

bp = Blueprint('router', __name__, template_folder='templates')

from . import vue
