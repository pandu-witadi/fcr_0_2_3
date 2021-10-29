#
#
#
from mongoengine import DynamicDocument
from mongoengine import StringField, IntField, ListField


class WellListFile(DynamicDocument):
    """ Well List """
    id_area = IntField(min_value=0, unique=True)
    filename = StringField()
    label = StringField()
    loc = StringField()
    column = ListField()
    meta = {
        'collection': 'welllist'
    }
