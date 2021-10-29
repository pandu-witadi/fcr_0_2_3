#
# model/Segy.py
# Segy file desxription
#
import datetime
from mongoengine import DynamicDocument
from mongoengine import StringField, IntField, DictField, DateTimeField, FloatField


class Segy(DynamicDocument):
    """ Segy """
    id_area = IntField()
    label = StringField(default="")
    filename = StringField()
    ctime = DateTimeField(default=datetime.datetime.now)
    dmp = DictField()
    meta = {
        'collection': 'segy'
    }
