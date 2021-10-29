#
#
#
from flask import render_template
from appPck.router import bp


@bp.route('/', methods=['GET'])
def index():
    # return render_template('index-test.html')
    return render_template('index.html')
