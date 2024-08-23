from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Entry
from utils import encrypt_content, decrypt_content, generate_key

def create_routes(mongo):
    api_bp = Blueprint('api', __name__)

    @api_bp.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        role = data.get('role', 'user')

        if User.find_by_username(mongo, username):
            return jsonify({'message': 'User already exists'}), 400

        user = User(username, password, role)
        user.save(mongo)
        return jsonify({'message': 'User registered successfully'}), 201

    @api_bp.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user_data = User.find_by_username(mongo, username)
        if not user_data or not User(user_data['username'], user_data['password']).check_password(password):
            return jsonify({'message': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=str(user_data['_id']))
        return jsonify({'access_token': access_token}), 200

    @api_bp.route('/entries', methods=['POST'])
    @jwt_required()
    def create_entry():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        tags = data.get('tags', [])

        key = generate_key()
        encrypted_content = encrypt_content(content, key)

        entry = Entry(current_user_id, title, encrypted_content, tags)
        entry.save(mongo)
        return jsonify({'message': 'Entry created successfully'}), 201

    @api_bp.route('/entries', methods=['GET'])
    @jwt_required()
    def get_entries():
        current_user_id = get_jwt_identity()
        entries = Entry.find_by_user(mongo, current_user_id)
        output = []
        for entry in entries:
            entry_data = {
                'id': str(entry['_id']),
                'title': entry['title'],
                'content': decrypt_content(entry['content'], entry['key']),
                'tags': entry['tags'],
                'timestamp': entry['timestamp']
            }
            output.append(entry_data)
        return jsonify(output), 200

    @api_bp.route('/entries/<entry_id>', methods=['PUT'])
    @jwt_required()
    def update_entry(entry_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        entry = Entry.find_by_id(mongo, entry_id)

        if not entry or entry['user_id'] != current_user_id:
            return jsonify({'message': 'Entry not found'}), 404

        entry['title'] = data.get('title', entry['title'])
        entry['content'] = encrypt_content(data.get('content', decrypt_content(entry['content'], entry['key'])), entry['key'])
        entry['tags'] = data.get('tags', entry['tags'])
        mongo.db.entries.save(entry)

        return jsonify({'message': 'Entry updated successfully'}), 200

    @api_bp.route('/entries/<entry_id>', methods=['DELETE'])
    @jwt_required()
    def delete_entry(entry_id):
        current_user_id = get_jwt_identity()
        entry = Entry.find_by_id(mongo, entry_id)

        if not entry or entry['user_id'] != current_user_id:
            return jsonify({'message': 'Entry not found'}), 404

        Entry.delete_by_id(mongo, entry_id)
        return jsonify({'message': 'Entry deleted successfully'}), 200

    return api_bp
