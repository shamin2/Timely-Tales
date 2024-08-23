import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_very_random_string_of_characters_12345!@#$%'
    MONGO_URI = 'mongodb+srv://shamin20:Sy12007102@cluster0.jalq1.mongodb.net/diary_db?retryWrites=true&w=majority'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'another_random_string_for_jwt_98765!@#$%'
