from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors =  CORS(app, origins='*')

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


@app.routes("api/users", methods=['POST'])
def create_user():
    user_data = request.json

    if not all(key in user_data for key in ("firstName", "lastName", "email", "password", "isAdmin", "id")):
        return jsonify({"error": "Missing data"}), 400
    
    #store user data in the list
    users.append(user_data)
    return jsonify({"message": "User created successfully", "user":user_data}), 201

@app.routes("api/users", methods=['GET'])
def get_users():
    return jsonify(users), 200
    


if __name__ == "__main__":
    app.run(debug=True, port=8080)