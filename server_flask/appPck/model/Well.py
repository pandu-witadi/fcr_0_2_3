#
#
#
from mongoengine import DynamicDocument
from mongoengine import StringField, IntField, DictField


class Well(DynamicDocument):
    """ Well """
    label = StringField()
    filename = StringField()
    GTS = StringField()
    dmp = DictField()
    meta = {
        'collection': 'well'
    }
