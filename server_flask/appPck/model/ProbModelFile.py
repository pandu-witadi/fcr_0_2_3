#
# model/ProbModelFile.py
# Probability Model FIle info
#
from mongoengine import DynamicDocument
from mongoengine import StringField, BooleanField, IntField, ListField


class ProbModelFile(DynamicDocument):
    """ Probability Model """
    id_area = IntField()
    filename = StringField()
    headerfile = StringField()
    headercolumn = ListField() 
    label = StringField()
    loc = StringField()
    layer = IntField(min_value=1)
    isDefault = BooleanField(default=False)
    note = StringField()
    meta = {
        'collection': 'probmodelfile'
    }
