from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User:
    def __init__(self, username, password, role='user'):
        self.username = username
        self.password = generate_password_hash(password)
        self.role = role

    def save(self, mongo):
        return mongo.db.users.insert_one(self.__dict__)

    @staticmethod
    def find_by_username(mongo, username):
        return mongo.db.users.find_one({"username": username})

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Entry:
    def __init__(self, user_id, title, content, tags=[]):
        self.user_id = user_id
        self.title = title
        self.content = content
        self.tags = tags
        self.timestamp = datetime.utcnow()

    def save(self, mongo):
        return mongo.db.entries.insert_one(self.__dict__)

    @staticmethod
    def find_by_user(mongo, user_id):
        return mongo.db.entries.find({"user_id": user_id})

    @staticmethod
    def find_by_id(mongo, entry_id):
        return mongo.db.entries.find_one({"_id": ObjectId(entry_id)})

    @staticmethod
    def delete_by_id(mongo, entry_id):
        return mongo.db.entries.delete_one({"_id": ObjectId(entry_id)})
