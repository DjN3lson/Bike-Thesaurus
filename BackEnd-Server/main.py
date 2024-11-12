from flask import Flask, jsonify, request, session, Response
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS

from config import ApplicationConfig
from models import db, User, Bicycle

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config.from_object(ApplicationConfig)
db.init_app(app)

def add_demo_user():
    # Check if the demo user already exists
    demo_user = User.query.filter_by(email='demo@gmail.com').first()
    if demo_user is None:
        # Create a new demo user
        hashed_password = bcrypt.generate_password_hash('1234').decode('utf-8')  # Hash the password
        new_user = User(email='demo@gmail.com', password=hashed_password, firstName='Demo', lastname='User', isAdmin=False)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            print("Demo user created successfully.")
        except Exception as e:
            print(f"Error creating demo user: {str(e)}")
    else:
        print("Demo user already exists.")

with app.app_context():
    db.create_all()

server_session = Session(app)

@app.before_request
def handle_preflight():
    if request.method == 'POST':
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res

@app.route("/api/bicycles", methods=['GET'])
def bicycles():
    bicycles_data = [
        "Trek Domane",
        "Trek Madone",
        "Trek Emonda",
        "Trek Fuel EX",
        "Giant Defy",
        "Giant TCR",
        "Giant Reign",
        "Giant Trance",
        "Specialized Roubaix",
        "Specialized Venge",
        "Specialized Stumpjumper",
        "Specialized Enduro",
        "Cannondale Synapse",
        "Cannondale SuperSix",
        "Cannondale Jekyll",
        "Cannondale Trail",
        "Bianchi Oltre",
        "Bianchi Infinito",
        "Bianchi Specialissima",
        "Bianchi Methanol"
    ]
    return jsonify({
        "bicycles": bicycles_data
    })


@app.route("/register", methods=['POST'])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    firstName = request.json["firstName"]
    lastname = request.json["lastName"]
    isAdmin = request.json["isAdmin"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, hashed_password=hashed_password, firstName=firstName, lastname=lastname, isAdmin=isAdmin)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    session["user_id"] = new_user.id
    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "password": new_user.hashed_password,
        "firstName": new_user.firstName,
        "lastName": new_user.lastName,
        "isAdmin": new_user.isAdmin
    })

@app.route("/signin", methods=["POST"])
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
        "email": user.email,
        "firstName": user.firstName
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return jsonify({"message": "Logged out successfully"}), 200

@app.route("/@me")
def get_current_user():
    user_email = session.get("user_email")

    if not user_email:
        return jsonify({"error": "User not found"}), 401
    
    user = User.query.filter_by(email=user.email).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000)
    #app.run(host='0.0.0.0', port=8000, debug=True)


# activation of flask through terminal:
# 1. .\venv\Scripts\activate
# 2. python main.py
