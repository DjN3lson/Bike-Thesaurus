from flask import Flask, jsonify, request, session, Response, make_response
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename 

from config import ApplicationConfig
from models import db, User, Bicycle

app = Flask(__name__)
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

app.config.from_object(ApplicationConfig)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIOS'] = {'pdf', 'png', 'doc', 'jpg', 'docx', 'txt'}
db.init_app(app)

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
            {"id": 1, "brand": "Trek", "model": "Domane", "model_id": 101},
            {"id": 2, "brand": "Trek", "model": "Madone", "model_id": 102},
            {"id": 3, "brand": "Trek", "model": "Emonda", "model_id": 103},
            {"id": 4, "brand": "Trek", "model": "Fuel EX", "model_id": 104},
            {"id": 5, "brand": "Giant", "model": "Defy", "model_id": 105},
            {"id": 6, "brand": "Giant", "model": "TCR", "model_id": 106},
            {"id": 7, "brand": "Giant", "model": "Reign", "model_id": 107},
            {"id": 8, "brand": "Giant", "model": "Trance", "model_id": 108},
            {"id": 9, "brand": "Specialized", "model": "Roubaix", "model_id": 109},
            {"id": 10, "brand": "Specialized", "model": "Venge", "model_id": 110},
            {"id": 11, "brand": "Specialized", "model": "Stumpjumper", "model_id": 111},
            {"id": 12, "brand": "Specialized", "model": "Enduro", "model_id": 112},
    ]
    return jsonify({"bicycles": bicycles_data})
    

@app.route("/api/getbicycle", methods=['GET'])
def get_bicycle():

    bicycles = Bicycle.query.all()
    return jsonify (bicycles([{"id": Bicycle.id, "brand":Bicycle.brand, "model":Bicycle.model, "model id": Bicycle.model_id, "bicycle_pdf": Bicycle.bicycle_pdf} for bicycle in bicycles]))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route("/api/addbicycle", methods=['POST'])
def addbicycles():
    data = request.get_json()
    new_bicycle = Bicycle(
        brand=data['brand'],
        model=data['model'],
        model_id=data['model_id'],
        bicycle_pdf = data['bicycle_pdf']
    )
    if 'bicycle_pdf' not in request.files:
        return jsonify({"error": "No pdf in bicycle"}), 400
    file = request.files['bicycle_pdf']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        new_bicycle.bicycle_pdf = file_path
    
    if new_bicycle.model_id in data and data['model_id'] is not None:
        new_bicycle.model_id = data['model_id']
    else:
        new_bicycle.model_id = None
    
    db.session.add(new_bicycle)
    db.session.commit()
    return jsonify({
        "message": "Bicycle has been added", "bicycle": new_bicycle.id
    }), 201

@app.route("/api/bicycle", methods=['POST'])
def updatebicycle():
    data = request.get_json()
    bicycle = Bicycle()
    bicycle.verified = True
    return jsonify({
        bicycle,
        "updated bicycle", 201
    })

@app.route("/register", methods=[ 'POST'])
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
    
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "password": new_user.hashed_password,
        "firstName": new_user.firstName,
        "lastName": new_user.lastName,
        "isAdmin": new_user.isAdmin
    })

@app.route("/signin", methods=['GET', 'POST'])
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
    app.run(debug=True, port=5000)
    #app.run(host='0.0.0.0', port=5000, debug=True)


# activation of flask through terminal:
# 1. .\venv\Scripts\activate
# 2. python main.py
