#
# model/ProbMapLayerFile.py
# probability map layer file info
#
from mongoengine import DynamicDocument
from mongoengine import StringField, BooleanField, IntField, ListField


class ProbMapLayerFile(DynamicDocument):
    """ Probability Layer Map 2D """
    id_area = IntField()
    filename = StringField()
    label = StringField()
    loc = StringField()
    layer = IntField(min_value=1)
    isDefault = BooleanField(default=False)
    column = ListField()
    meta = {
        'collection': 'probmaplayerfile'
    }
