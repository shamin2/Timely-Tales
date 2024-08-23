from flask import Flask, render_template
from config import Config
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from routes import create_routes

app = Flask(__name__)
app.config.from_object(Config)

mongo = PyMongo(app)
jwt = JWTManager(app)

# Pass mongo to routes
api_bp = create_routes(mongo)
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
