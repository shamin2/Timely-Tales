from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# User Model
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


# Diary Entry Model
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


# Task Model
class Task:
    def __init__(self, user_id, title, description, due_date, is_completed=False):
        self.user_id = user_id
        self.title = title
        self.description = description
        self.due_date = due_date
        self.is_completed = is_completed
        self.created_at = datetime.utcnow()

    def save(self, mongo):
        return mongo.db.tasks.insert_one(self.__dict__)

    @staticmethod
    def find_by_user(mongo, user_id):
        return mongo.db.tasks.find({"user_id": user_id})

    @staticmethod
    def find_by_id(mongo, task_id):
        return mongo.db.tasks.find_one({"_id": ObjectId(task_id)})

    @staticmethod
    def delete_by_id(mongo, task_id):
        return mongo.db.tasks.delete_one({"_id": ObjectId(task_id)})


# Goal Model with Milestones
class Goal:
    def __init__(self, user_id, title, description, milestones=[], due_date=None, is_completed=False):
        self.user_id = user_id
        self.title = title
        self.description = description
        self.milestones = milestones
        self.due_date = due_date
        self.is_completed = is_completed
        self.created_at = datetime.utcnow()

    def save(self, mongo):
        return mongo.db.goals.insert_one(self.__dict__)

    @staticmethod
    def find_by_user(mongo, user_id):
        return mongo.db.goals.find({"user_id": user_id})

    @staticmethod
    def find_by_id(mongo, goal_id):
        return mongo.db.goals.find_one({"_id": ObjectId(goal_id)})

    @staticmethod
    def delete_by_id(mongo, goal_id):
        return mongo.db.goals.delete_one({"_id": ObjectId(goal_id)})


# Habit Model
class Habit:
    def __init__(self, user_id, title, frequency='daily', progress=0, goal=0):
        self.user_id = user_id
        self.title = title
        self.frequency = frequency
        self.progress = progress
        self.goal = goal
        self.created_at = datetime.utcnow()

    def save(self, mongo):
        return mongo.db.habits.insert_one(self.__dict__)

    @staticmethod
    def find_by_user(mongo, user_id):
        return mongo.db.habits.find({"user_id": user_id})

    @staticmethod
    def find_by_id(mongo, habit_id):
        return mongo.db.habits.find_one({"_id": ObjectId(habit_id)})

    @staticmethod
    def delete_by_id(mongo, habit_id):
        return mongo.db.habits.delete_one({"_id": ObjectId(habit_id)})


# Mood Tracking Model
class Mood:
    def __init__(self, user_id, mood, note='', rating=0):
        self.user_id = user_id
        self.mood = mood
        self.note = note
        self.rating = rating
        self.date = datetime.utcnow()

    def save(self, mongo):
        return mongo.db.moods.insert_one(self.__dict__)

    @staticmethod
    def find_by_user(mongo, user_id):
        return mongo.db.moods.find({"user_id": user_id})

    @staticmethod
    def find_by_id(mongo, mood_id):
        return mongo.db.moods.find_one({"_id": ObjectId(mood_id)})

    @staticmethod
    def delete_by_id(mongo, mood_id):
        return mongo.db.moods.delete_one({"_id": ObjectId(mood_id)})


# Class Schedule Model
class ClassSchedule:
    def __init__(self, user_id, course_name, start_time, end_time, location='', days_of_week=[]):
        self.user_id = user_id
        self.course_name = course_name
        self.start_time = start_time
        self.end_time = end_time
        self.location = location
        self.days_of_week = days_of_week

    def save(self, mongo):
        return mongo.db.class_schedules.insert_one(self.__dict__)

    @staticmethod
    def find_by_user(mongo, user_id):
        return mongo.db.class_schedules.find({"user_id": user_id})

    @staticmethod
    def find_by_id(mongo, schedule_id):
        return mongo.db.class_schedules.find_one({"_id": ObjectId(schedule_id)})

    @staticmethod
    def delete_by_id(mongo, schedule_id):
        return mongo.db.class_schedules.delete_one({"_id": ObjectId(schedule_id)})


# Gratitude Model
class Gratitude:
    def __init__(self, user_id, content, tags=[]):
        self.user_id = user_id
        self.content = content
        self.tags = tags
        self.timestamp = datetime.utcnow()

    def save(self, mongo):
        return mongo.db.gratitude.insert_one(self.__dict__)

    @staticmethod
    def find_by_user(mongo, user_id):
        return mongo.db.gratitude.find({"user_id": user_id})

    @staticmethod
    def find_by_id(mongo, gratitude_id):
        return mongo.db.gratitude.find_one({"_id": ObjectId(gratitude_id)})

    @staticmethod
    def delete_by_id(mongo, gratitude_id):
        return mongo.db.gratitude.delete_one({"_id": ObjectId(gratitude_id)})


# Time Capsule Model
class TimeCapsule:
    def __init__(self, user_id, content, open_date):
        self.user_id = user_id
        self.content = content
        self.open_date = open_date
        self.timestamp = datetime.utcnow()

    def save(self, mongo):
        return mongo.db.timecapsule.insert_one(self.__dict__)

    @staticmethod
    def find_by_user_and_date(mongo, user_id, current_date):
        return mongo.db.timecapsule.find({"user_id": user_id, "open_date": {"$lte": current_date}})

    @staticmethod
    def find_by_id(mongo, capsule_id):
        return mongo.db.timecapsule.find_one({"_id": ObjectId(capsule_id)})

    @staticmethod
    def delete_by_id(mongo, capsule_id):
        return mongo.db.timecapsule.delete_one({"_id": ObjectId(capsule_id)})
