from flask import Flask
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from config import Config
from routes import create_routes

app = Flask(__name__)
app.config.from_object(Config)

# Initialize MongoDB connection
mongo = PyMongo(app)

# Initialize JWT
jwt = JWTManager(app)

# Register API routes
app.register_blueprint(create_routes(mongo))

if __name__ == '__main__':
    app.run(debug=True)
