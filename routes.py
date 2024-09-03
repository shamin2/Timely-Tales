from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Entry, Task, Goal, Habit, Mood, ClassSchedule, Gratitude, TimeCapsule
from utils import encrypt_content, decrypt_content, generate_key

def create_routes(mongo):
    api_bp = Blueprint('api', __name__)

    # User Registration
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

    # User Login
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

    # Diary Entries
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

    # Tasks
    @api_bp.route('/tasks', methods=['POST'])
    @jwt_required()
    def create_task():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        task = Task(current_user_id, data.get('title'), data.get('description'), data.get('due_date'))
        task.save(mongo)
        return jsonify({'message': 'Task created successfully'}), 201

    @api_bp.route('/tasks', methods=['GET'])
    @jwt_required()
    def get_tasks():
        current_user_id = get_jwt_identity()
        tasks = Task.find_by_user(mongo, current_user_id)
        return jsonify(list(tasks)), 200

    @api_bp.route('/tasks/<task_id>', methods=['PUT'])
    @jwt_required()
    def update_task(task_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        task = Task.find_by_id(mongo, task_id)

        if not task or task['user_id'] != current_user_id:
            return jsonify({'message': 'Task not found'}), 404

        task['title'] = data.get('title', task['title'])
        task['description'] = data.get('description', task['description'])
        task['due_date'] = data.get('due_date', task['due_date'])
        task['is_completed'] = data.get('is_completed', task['is_completed'])
        mongo.db.tasks.save(task)

        return jsonify({'message': 'Task updated successfully'}), 200

    @api_bp.route('/tasks/<task_id>', methods=['DELETE'])
    @jwt_required()
    def delete_task(task_id):
        current_user_id = get_jwt_identity()
        task = Task.find_by_id(mongo, task_id)

        if not task or task['user_id'] != current_user_id:
            return jsonify({'message': 'Task not found'}), 404

        Task.delete_by_id(mongo, task_id)
        return jsonify({'message': 'Task deleted successfully'}), 200

    # Goals
    @api_bp.route('/goals', methods=['POST'])
    @jwt_required()
    def create_goal():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        goal = Goal(current_user_id, data.get('title'), data.get('description'), data.get('milestones', []), data.get('due_date'))
        goal.save(mongo)
        return jsonify({'message': 'Goal created successfully'}), 201

    @api_bp.route('/goals', methods=['GET'])
    @jwt_required()
    def get_goals():
        current_user_id = get_jwt_identity()
        goals = Goal.find_by_user(mongo, current_user_id)
        return jsonify(list(goals)), 200

    @api_bp.route('/goals/<goal_id>', methods=['PUT'])
    @jwt_required()
    def update_goal(goal_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        goal = Goal.find_by_id(mongo, goal_id)

        if not goal or goal['user_id'] != current_user_id:
            return jsonify({'message': 'Goal not found'}), 404

        goal['title'] = data.get('title', goal['title'])
        goal['description'] = data.get('description', goal['description'])
        goal['milestones'] = data.get('milestones', goal['milestones'])
        goal['due_date'] = data.get('due_date', goal['due_date'])
        goal['is_completed'] = data.get('is_completed', goal['is_completed'])
        mongo.db.goals.save(goal)

        return jsonify({'message': 'Goal updated successfully'}), 200

    @api_bp.route('/goals/<goal_id>', methods=['DELETE'])
    @jwt_required()
    def delete_goal(goal_id):
        current_user_id = get_jwt_identity()
        goal = Goal.find_by_id(mongo, goal_id)

        if not goal or goal['user_id'] != current_user_id:
            return jsonify({'message': 'Goal not found'}), 404

        Goal.delete_by_id(mongo, goal_id)
        return jsonify({'message': 'Goal deleted successfully'}), 200

    # Habits
    @api_bp.route('/habits', methods=['POST'])
    @jwt_required()
    def create_habit():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        habit = Habit(current_user_id, data.get('title'), data.get('frequency', 'daily'), data.get('progress', 0), data.get('goal', 0))
        habit.save(mongo)
        return jsonify({'message': 'Habit created successfully'}), 201

    @api_bp.route('/habits', methods=['GET'])
    @jwt_required()
    def get_habits():
        current_user_id = get_jwt_identity()
        habits = Habit.find_by_user(mongo, current_user_id)
        return jsonify(list(habits)), 200

    @api_bp.route('/habits/<habit_id>', methods=['PUT'])
    @jwt_required()
    def update_habit(habit_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        habit = Habit.find_by_id(mongo, habit_id)

        if not habit or habit['user_id'] != current_user_id:
            return jsonify({'message': 'Habit not found'}), 404

        habit['title'] = data.get('title', habit['title'])
        habit['frequency'] = data.get('frequency', habit['frequency'])
        habit['progress'] = data.get('progress', habit['progress'])
        habit['goal'] = data.get('goal', habit['goal'])
        mongo.db.habits.save(habit)

        return jsonify({'message': 'Habit updated successfully'}), 200

    @api_bp.route('/habits/<habit_id>', methods=['DELETE'])
    @jwt_required()
    def delete_habit(habit_id):
        current_user_id = get_jwt_identity()
        habit = Habit.find_by_id(mongo, habit_id)

        if not habit or habit['user_id'] != current_user_id:
            return jsonify({'message': 'Habit not found'}), 404

        Habit.delete_by_id(mongo, habit_id)
        return jsonify({'message': 'Habit deleted successfully'}), 200

    # Mood Tracking
    @api_bp.route('/moods', methods=['POST'])
    @jwt_required()
    def create_mood():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        mood = Mood(current_user_id, data.get('mood'), data.get('note', ''), data.get('rating', 0))
        mood.save(mongo)
        return jsonify({'message': 'Mood logged successfully'}), 201
    @api_bp.route('/moods', methods=['GET'])
    @jwt_required()
    def get_moods():
        current_user_id = get_jwt_identity()
        moods = Mood.find_by_user(mongo, current_user_id)
        return jsonify(list(moods)), 200

    @api_bp.route('/moods/<mood_id>', methods=['PUT'])
    @jwt_required()
    def update_mood(mood_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        mood = Mood.find_by_id(mongo, mood_id)

        if not mood or mood['user_id'] != current_user_id:
            return jsonify({'message': 'Mood entry not found'}), 404

        mood['mood'] = data.get('mood', mood['mood'])
        mood['note'] = data.get('note', mood['note'])
        mood['rating'] = data.get('rating', mood['rating'])
        mongo.db.moods.save(mood)

        return jsonify({'message': 'Mood entry updated successfully'}), 200

    @api_bp.route('/moods/<mood_id>', methods=['DELETE'])
    @jwt_required()
    def delete_mood(mood_id):
        current_user_id = get_jwt_identity()
        mood = Mood.find_by_id(mongo, mood_id)

        if not mood or mood['user_id'] != current_user_id:
            return jsonify({'message': 'Mood entry not found'}), 404

        Mood.delete_by_id(mongo, mood_id)
        return jsonify({'message': 'Mood entry deleted successfully'}), 200

    # Class Schedules
    @api_bp.route('/classes', methods=['POST'])
    @jwt_required()
    def create_class_schedule():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        class_schedule = ClassSchedule(
            current_user_id,
            data.get('course_name'),
            data.get('start_time'),
            data.get('end_time'),
            data.get('location', ''),
            data.get('days_of_week', [])
        )
        class_schedule.save(mongo)
        return jsonify({'message': 'Class schedule created successfully'}), 201

    @api_bp.route('/classes', methods=['GET'])
    @jwt_required()
    def get_class_schedules():
        current_user_id = get_jwt_identity()
        class_schedules = ClassSchedule.find_by_user(mongo, current_user_id)
        return jsonify(list(class_schedules)), 200

    @api_bp.route('/classes/<schedule_id>', methods=['PUT'])
    @jwt_required()
    def update_class_schedule(schedule_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        class_schedule = ClassSchedule.find_by_id(mongo, schedule_id)

        if not class_schedule or class_schedule['user_id'] != current_user_id:
            return jsonify({'message': 'Class schedule not found'}), 404

        class_schedule['course_name'] = data.get('course_name', class_schedule['course_name'])
        class_schedule['start_time'] = data.get('start_time', class_schedule['start_time'])
        class_schedule['end_time'] = data.get('end_time', class_schedule['end_time'])
        class_schedule['location'] = data.get('location', class_schedule['location'])
        class_schedule['days_of_week'] = data.get('days_of_week', class_schedule['days_of_week'])
        mongo.db.class_schedules.save(class_schedule)

        return jsonify({'message': 'Class schedule updated successfully'}), 200

    @api_bp.route('/classes/<schedule_id>', methods=['DELETE'])
    @jwt_required()
    def delete_class_schedule(schedule_id):
        current_user_id = get_jwt_identity()
        class_schedule = ClassSchedule.find_by_id(mongo, schedule_id)

        if not class_schedule or class_schedule['user_id'] != current_user_id:
            return jsonify({'message': 'Class schedule not found'}), 404

        ClassSchedule.delete_by_id(mongo, schedule_id)
        return jsonify({'message': 'Class schedule deleted successfully'}), 200

    # Gratitude Entries
    @api_bp.route('/gratitude', methods=['POST'])
    @jwt_required()
    def create_gratitude_entry():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        gratitude_entry = Gratitude(current_user_id, data.get('content'), data.get('tags', []))
        gratitude_entry.save(mongo)
        return jsonify({'message': 'Gratitude entry created successfully'}), 201

    @api_bp.route('/gratitude', methods=['GET'])
    @jwt_required()
    def get_gratitude_entries():
        current_user_id = get_jwt_identity()
        entries = Gratitude.find_by_user(mongo, current_user_id)
        return jsonify(list(entries)), 200

    @api_bp.route('/gratitude/<entry_id>', methods=['PUT'])
    @jwt_required()
    def update_gratitude_entry(entry_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        entry = Gratitude.find_by_id(mongo, entry_id)

        if not entry or entry['user_id'] != current_user_id:
            return jsonify({'message': 'Gratitude entry not found'}), 404

        entry['content'] = data.get('content', entry['content'])
        entry['tags'] = data.get('tags', entry['tags'])
        mongo.db.gratitude.save(entry)

        return jsonify({'message': 'Gratitude entry updated successfully'}), 200

    @api_bp.route('/gratitude/<entry_id>', methods=['DELETE'])
    @jwt_required()
    def delete_gratitude_entry(entry_id):
        current_user_id = get_jwt_identity()
        entry = Gratitude.find_by_id(mongo, entry_id)

        if not entry or entry['user_id'] != current_user_id:
            return jsonify({'message': 'Gratitude entry not found'}), 404

        Gratitude.delete_by_id(mongo, entry_id)
        return jsonify({'message': 'Gratitude entry deleted successfully'}), 200

    # Time Capsule Entries
    @api_bp.route('/timecapsule', methods=['POST'])
    @jwt_required()
    def create_time_capsule():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        time_capsule_entry = TimeCapsule(current_user_id, data.get('content'), data.get('open_date'))
        time_capsule_entry.save(mongo)
        return jsonify({'message': 'Time capsule created successfully'}), 201

    @api_bp.route('/timecapsule', methods=['GET'])
    @jwt_required()
    def get_time_capsules():
        current_user_id = get_jwt_identity()
        time_capsules = TimeCapsule.find_by_user_and_date(mongo, current_user_id, datetime.utcnow())
        return jsonify(list(time_capsules)), 200

    @api_bp.route('/timecapsule/<entry_id>', methods=['PUT'])
    @jwt_required()
    def update_time_capsule(entry_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        entry = TimeCapsule.find_by_id(mongo, entry_id)

        if not entry or entry['user_id'] != current_user_id:
            return jsonify({'message': 'Time capsule not found'}), 404

        entry['content'] = data.get('content', entry['content'])
        entry['open_date'] = data.get('open_date', entry['open_date'])
        mongo.db.timecapsule.save(entry)

        return jsonify({'message': 'Time capsule updated successfully'}), 200

    @api_bp.route('/timecapsule/<entry_id>', methods=['DELETE'])
    @jwt_required()
    def delete_time_capsule(entry_id):
        current_user_id = get_jwt_identity()
        entry = TimeCapsule.find_by_id(mongo, entry_id)

        if not entry or entry['user_id'] != current_user_id:
            return jsonify({'message': 'Time capsule not found'}), 404

        TimeCapsule.delete_by_id(mongo, entry_id)
        return jsonify({'message': 'Time capsule deleted successfully'}), 200

    return api_bp