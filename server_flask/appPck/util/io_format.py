#
#
#
import json

def fret(rq, state, type, mesg, data):

    tmp = {
        "state": state,
        "type": type,
        "mesg": mesg,
        "data": data
    }

    if "workspace" in rq:
        tmp['workspace'] = rq['workspace']

    if "user" in rq:
        tmp['user'] = rq['user']

    return json.dumps(tmp)
