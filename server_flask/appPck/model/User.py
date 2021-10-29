#
#
#
from mongoengine import DynamicDocument
from mongoengine import StringField, DictField, IntField, EmailField, BooleanField


class User(DynamicDocument):
    """ User """
    email = EmailField()
    username = StringField()
    password = StringField()
    level = IntField()
    label = StringField()
    isLogin = BooleanField(default=False)
    meta = {
        'collection': 'user'
    }
