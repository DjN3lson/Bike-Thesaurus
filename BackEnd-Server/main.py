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

# with app.app_context():
#     db.create_all()

server_session = Session(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.before_request
def handle_preflight():
    if request.method == 'POST':
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res
    

def bicycleList():
    bicycle1 = Bicycle(
        id=1,
        brand="Trek",
        model="Domane",
        model_id=101,
        bicycle_pdf="uploads/bicycle1.pdf"
    )
    
    bicycle2 = Bicycle(
        id=2,
        brand="Giant",
        model="Defy",
        model_id=102,
        bicycle_pdf="uploads/bicycle2.pdf"
    )
    
    bicycle3 = Bicycle(
        id=3,
        brand="Specialized",
        model="Roubaix",
        model_id=103,
        bicycle_pdf="uploads/bicycle3.pdf"
    )

    db.session.add(bicycle1)
    db.session.add(bicycle2)
    db.session.add(bicycle3)
    db.session.commit()

@app.route("/api/getbicycle", methods=['GET', 'POST'])
def get_bicycle():

    bicycles = Bicycle.query.all()
    print(bicycles)

    return jsonify ([{
        "id": bicycle.id, 
        "brand":bicycle.brand, 
        "model":bicycle.model, 
        "model id": bicycle.model_id, 
        "bicycle_pdf": bicycle.bicycle_pdf
        } for bicycle in bicycles])




@app.route("/api/addbicycle", methods=['POST'])
def addbicycles():
    data = request.form
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
        "message": "Bicycle has been added", 
        "bicycle":{
            "id": new_bicycle.id,
            "brand": new_bicycle.brand,
            "model": new_bicycle.model,
            "model_id": new_bicycle.model_id,
            "bicycle_pdf": new_bicycle.bicycle_pdf
        }
    }), 201

@app.route("/api/editbicycle", methods=['POST'])
def updatebicycle():
    data = request.get_json()
    bicycle = Bicycle()
    bicycle.verified = True
    return jsonify({
        bicycle,
        "updated bicycle", 201
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    #app.run(host='0.0.0.0', port=5000, debug=True)


# activation of flask through terminal:
# 1. .\venv\Scripts\activate
# 2. python main.py
