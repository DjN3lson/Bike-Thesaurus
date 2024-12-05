from flask import Flask, jsonify, request, session, Response, make_response
from flask_session import Session
from flask_cors import CORS, cross_origin
import os
from werkzeug.utils import secure_filename 
import base64, binascii

from models import db, Bicycle
from config import ApplicationConfig


app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config.from_object(ApplicationConfig)

db.init_app(app)



with app.app_context(): 
    db.create_all() #This creates the table



server_session = Session(app)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.before_request
def handle_preflight():
    if request.method == 'POST':
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res
        

@app.route("/bicycles", methods=["GET"])
def listbicycles():
    all_bicycles = Bicycle.query.all()
    print(all_bicycles)
    json_bicycles = list(map(lambda x: x.to_json(), all_bicycles))
    return jsonify ({"bicycles": json_bicycles})


@app.route("/addbicycle", methods=["POST"])
def addbicycles():
    brand = request.form.get("brand")
    model = request.form.get("model")
    model_id = request.form.get("model_id")
    bicycle_pdf = request.files.get("bicycle_pdf")
    
    if not brand or not model:
        return jsonify(
            ({"message": "Missing brand or model"}), 400
        )
    
    existing_bicycle = Bicycle.query.filter_by(model_id = model_id).first()
    if existing_bicycle:
            return jsonify({"message": "This bicycle already exists"}), 400
    
    
    if bicycle_pdf and allowed_file(bicycle_pdf.filename):
        try:
            filename = f"{secure_filename(brand)}_{secure_filename(model)}_{secure_filename(model_id)}.{bicycle_pdf.filename.rsplit('.', 1)[1].lower()}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            bicycle_pdf.save(file_path)
        except(binascii.Error, Exception) as e:
            return jsonify({"message": f"File save failed: {str(e)}"}), 500
    else:
        return jsonify({"message": "Invalid file type or no file provided"}), 400
        
    new_bicycle = Bicycle(brand = brand, model = model, model_id = model_id, bicycle_pdf = file_path )
    
    try:
        db.session.add(new_bicycle)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

    return jsonify({
        "message": f"Bicycle {new_bicycle.id} has been added"}), 201


@app.route("/editbicycle/<int:bicycle_id>", methods=["PATCH"])
def updatebicycle(bicycle_id):
    bicycle = Bicycle.query.get(bicycle_id)

    if not bicycle:
        return jsonify({"message": "Bicycle not found"})
    
    data = request.json or request.form
    brand = data.get("brand", bicycle.brand)
    model = data.get("model", bicycle.model)
    model_id = data.get("model_id", bicycle.model_id)
   

    if model_id != bicycle.model_id:
        existing_bicycle = Bicycle.query.filter_by(model_id = model_id)
        if existing_bicycle:
            return jsonify({"message": "Model ID already in use"}), 400

    bicycle_pdf = request.files.get("bicycle_pdf")
    if bicycle_pdf and allowed_file(bicycle_pdf.filename):
        try:
            filename = f"{secure_filename(brand)}_{secure_filename(model)}_{secure_filename(model_id)}.{bicycle_pdf.filename.rsplit('.', 1)[1].lower()}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

            if bicycle.bicycle_pdf and os.path.exists(bicycle.bicycle_pdf):
                os.remove(bicycle.bicycle_pdf)
            
            bicycle_pdf.save(file_path)
        except (binascii.Error, Exception) as e:
            return jsonify({"message": f"File save failed: {str(e)}"}),500
    
    bicycle.brand = brand
    bicycle.model = model
    bicycle.model_id = model_id

    try:    
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Database error: {str(e)}"}),500
    return jsonify({ "message": "Bicycle updated"}), 201


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    #app.run(host='0.0.0.0', port=5000, debug=True)


# activation of flask through terminal:
# 1. .\venv\Scripts\activate
# 2. python main.py
