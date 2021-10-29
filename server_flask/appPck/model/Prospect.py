#
# model/PotProsp.py
# Potential prospect
#
import datetime
from mongoengine import DynamicDocument
from mongoengine import StringField, IntField, DictField, DateTimeField, FloatField


class Prospect(DynamicDocument):
    """ Prospect """
    id_area = IntField()
    userId = StringField(default="")
    layer = IntField(min_value=1)
    name = StringField(default="")
    group = StringField(default="")
    filename = StringField()
    loc = StringField()
    score = FloatField()
    np = IntField()
    area = FloatField()
    star = IntField()
    note = StringField(default="")
    ctime = DateTimeField(default=datetime.datetime.now)
    dmp = DictField()
    meta = {
        'collection': 'prospect'
    }
