#
#
#
from mongoengine import DynamicDocument
from mongoengine import StringField, DictField, IntField, FloatField


class Area(DynamicDocument):
    """ Area """
    id_area = IntField(min_value=0, unique=True)
    name = StringField()
    bin_area = FloatField()
    dmp = DictField()
    meta = {
        'collection': 'area',
        'indexes': ['id_area', 'name']
    }
