from flask import request, session, jsonify
from flask_bcrypt import Bcrypt
from app.models import mongo

bcrypt = Bcrypt()

def create_admin_user():
    admin_username = "admin"
    admin_password = "12345" #change password
    hashed_password = bcrypt.generate_password_hash(admin_password).decode('utf-8')
    mongo.db.admins.insert_one({"username": admin_username, "password": hashed_password})

def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    admin = mongo.db.admins.find_one({"username": username})
    if admin and bcrypt.check_password_hash(admin['password'], password):
        session['admin'] = username
        return jsonify({"message": "Login successful!"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

def logout():
    session.pop('admin', None)
    return jsonify({"message": "Logout sucessfull!"}), 200