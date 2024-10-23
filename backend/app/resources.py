from flask import jsonify, request, session
from app.models import mongo

def get_bicycles():
    bicycles = mongo.db.bicycles.find()
    return jsonify([bicycle for bicycle in bicycles])

def add_bicycle():
    if 'admin' not in session:  # Check if admin is logged in
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    if 'model' not in data or 'brand' not in data:
        return jsonify({"error": "Model and brand are required"}), 400

    mongo.db.bicycles.insert_one(data)
    return jsonify(data), 201

def get_bicycle_manual(brand):
    bicycle = mongo.db.bicycles.find_one({"brand": brand})
    if bicycle:
        return jsonify(bicycle), 200
    return jsonify({"error": "Bicycle not found"}), 404