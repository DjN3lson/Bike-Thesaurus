from flask import Flask, jsonify, request, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS

from config import ApplicationConfig
from models import db, User, Bicycle

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
bcrypt = Bcrypt(app)

app.config.from_object(ApplicationConfig)
db.init_app(app)
with app.app_context():
    db.create_all

server_session = Session(app)

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


@app.route("/api/register", methods=['POST'])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    firstName = request.json["firstName"]
    lastname = request.json["lastName"]
    isAdmin = request.json["isAdmin"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, firstName=firstName, lastname=lastname, isAdmin=isAdmin)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id
    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

@app.route("/api/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return  jsonify({"error": "Email is not found"}), 401
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Wrong Password, Try again"}), 401
    
    session["user_id"] = user.id
    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/api/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

@app.route("/api/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "User not found"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    })

if __name__ == "__main__":
    app.run(debug=True, port=8080)
    #app.run(host='0.0.0.0', port=5000, debug=True)


# activation of flask through terminal:
# 1. \venv\Scripts\activate
# 2. python main.py
