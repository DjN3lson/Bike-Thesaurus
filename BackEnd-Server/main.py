from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

users=[]

@app.route("/api/bicycles", methods=['GET'])
def bicycles():
    return jsonify(
        {
            "bicycles": [
                'Trek',
                'Giant',
                'Specialized',
                'Cannondale'
            ]
        }
    )


@app.route("/api/users/signup", methods=['POST'])
def signup():
    user_data = request.json

    # Validate required fields
    if not all(key in user_data for key in ("firstName", "lastName", "email", "password", "isAdmin")):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if email already exists
    if any(user["email"] == user_data["email"] for user in users):
        return jsonify({"error": "Email already registered"}), 400
    
    # Store user data
    users.append(user_data)
    return jsonify({
        "message": "User created successfully",
        "user": {
            "firstName": user_data["firstName"],
            "lastName": user_data["lastName"],
            "email": user_data["email"],
            "isAdmin": user_data["isAdmin"]
        }
    }), 201

@app.route("/api/users/signin", methods=['POST'])
def signin():
    user_data = request.json
    if not all(key in user_data for key in ("email", "password")):
        return jsonify({"error": "Missing email or password"}), 400
    
    user = next((user for user in users if 
                 user["email"] == user_data["email"] and 
                 user["password"] == user_data["password"]), None)
    
    if user:
        return jsonify({
            "message": "Sign in successfull",
            "user":{
                "firstName": user["firstName"],
                "lastName": user["lastName"],
                "email": user["email"],
                "isAdmin": user["isAdmin"]
            }
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route("/api/users", methods=['GET'])
def get_users():
    safe_users = [{
        "firstName": user["firstName"],
        "lastName": user["lastName"],
        "email": user["email"],
        "isAdmin": user["isAdmin"]
    } for user in users]
    return jsonify(safe_users), 200
    


if __name__ == "__main__":
    app.run(debug=True, port=8080)