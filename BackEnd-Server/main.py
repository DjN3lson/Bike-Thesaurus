from flask import Flask, jsonify, request, session, Response, send_from_directory
from flask_session import Session
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename 


from models import db, Bicycle, BicyclePdfs, BicycleParts
from config import ApplicationConfig


app = Flask(__name__, static_folder='build')
CORS(app, supports_credentials=True, )

app.config.from_object(ApplicationConfig)

db.init_app(app)

with app.app_context(): 
    db.create_all() #This creates the table

server_session = Session(app)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        res = Response()
        res.headers['Access-Control-Allow-Origin'] = '*'  # Adjust to your domain for production
        res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        res.headers['Access-Control-Max-Age'] = '3600'
        return res


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/bicycles", methods=["GET"])
def listbicycles():
    try:
        all_bicycles = Bicycle.query.all()
        json_bicycles = [b.to_json() for b in all_bicycles]
        return jsonify ({"bicycles": json_bicycles}),200
    except Exception as e:
        return jsonify({"message": f"error in printing the bicycles {str(e)}"}),500

@app.route("/uploads/<path:filename>")
def serve_pdf(filename):
    return send_from_directory('uploads', filename)


@app.route("/addbicycle", methods=["POST"])
def addbicycles():
    data = request.form
    brand = data.get("brand")
    model = data.get("model")
    model_id = request.get("model_id") or "0000"
    bicycle_pdf = request.files.get("pdfs")
    
    if not brand:
        return jsonify({"message": "Missing brand value"}), 400
    elif not model:
        return jsonify({"message": "Mssing model value"}), 400
    elif not model_id:
        return jsonify({"message": "Missing model id value"}), 400
    elif not bicycle_pdf:
        return  jsonify({"message": "Missing bicycle pdf file"}), 400
    
    existing_bicycle = Bicycle.query.filter_by(model_id = model_id).first()
    
    if existing_bicycle:
            return jsonify({"message": "This bicycle already exists"}), 400
    
    if not allowed_file(bicycle_pdf.filename):
        return jsonify({"message": "Invalid file type"}), 400
    
    if bicycle_pdf is None:
        return jsonify({"message": "No file provided"}), 400
    
    if not app.config['ALLOWED_EXTENSIONS']:
        return jsonify({"message": "Invalid file type"})
    
    if bicycle_folder is None:
        bicycle_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'Bicycles')
        os.makedirs(bicycle_folder, exist_ok=True)

    try:
        original_file = secure_filename(bicycle_pdf.filename)    
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], original_file)

        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        bicycle_pdf.save(file_path)
    
    except(Exception) as e:
        return jsonify({"message": f"File save failed: {str(e)}"}), 500

        
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
    
    data = request.form
    brand = data.get("brand", bicycle.brand)
    model = data.get("model", bicycle.model)
    model_id = data.get("model_id", bicycle.model_id) or ("model_id", "0000")

    bicycle_pdf = request.files.get("pdfs")

    if bicycle_pdf and allowed_file(bicycle_pdf.filename):
        try:
            filename = f"{secure_filename(brand)}_{secure_filename(model)}_{secure_filename(model_id)}.{bicycle_pdf.filename.rsplit('.', 1)[1].lower()}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

            if bicycle.bicycle_pdf and os.path.exists(bicycle.bicycle_pdf):
                os.remove(bicycle.bicycle_pdf)
            
            bicycle_pdf.save(file_path)
            bicycle.bicycle_pdf = file_path
        except (Exception) as e:
            return jsonify({"message": f"File save failed: {str(e)}"}),500
    
    bicycle.brand = brand
    bicycle.model = model
    bicycle.model_id = model_id

    try:    
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Bicycle Database error: {str(e)}"}),500
    return jsonify({ "message": "Bicycle updated"}), 201

@app.route("/deletebicycle/<bicycle_id>", methods=["DELETE", "OPTIONS"])
def deletebicycle(bicycle_id):
    bicycle = Bicycle.query.get(bicycle_id)
    
    if bicycle is None:
        
        return jsonify({"message": "Bicycle was not found" }),404
    
    try:
        db.session.delete(bicycle)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Deletion error: {str(e)}"}),500
    return jsonify({"messsage": "Bicycle was deleted successfully"}),201

@app.route("/bicyclepartslist", methods=["GET"])
def listParts():
    try:
        parts = BicycleParts.query.all()
        json_parts = [b.to_json() for b in parts]
        return jsonify ({"bicycles": json_parts}),200
    except Exception as e:
        return jsonify({"message": f"error in printing the bicycles {str(e)}"}),500

@app.route("/addbicycleparts", methods=["POST"])
def addBicycleParts():
    data = request.form
    bicycle_id = data.get("bicycle_id")
    part_id = data.get("part_id")
    name = data.get("name")
    part_model_name = data.get("part_model_name")
    parts_pdf = request.files.get("pdfs")

    if not name:
        return jsonify({"message": "Missing name"}), 400
    elif not bicycle_id:
        return jsonify({"message": "Missing bicycle_id"}), 400
    elif not part_id:
        return jsonify({"message": "Missing part_id"}), 400
    elif not part_model_name:
        return jsonify({"message": "Missing Part Model Name"}), 400
    
    existing_part = BicycleParts.query.filter_by(part_id = part_id).first()
    if existing_part:
        return jsonify({"message": "This bicycle part already exists"}), 400
    
@app.route ("/editbicyclepart/<int:bicycle_part_id", methods=["PATCH"])
def updatebicyclepart(bicycle_part_id):
    part = BicycleParts.query.get(bicycle_part_id)
    
    if not part:
        return jsonify({"message": "Bicycle not found"})
    
    data = request.form
    bicycle_id = data.get("bicycle_id", part.bicycle_id)
    name = data.get("name", part.name)
    model_name = data.get("part_model_name", part.model_name)
    part_model_id = data.get("part_model_id", part.part_model_id) or("part_model_id", "0000")

    parts_pdf = request.files.get("parts_pdfs")

    if parts_pdf and allowed_file(parts_pdf.filename):
        try:
            filename = f"{secure_filename(name)} {secure_filename(model_name)} {secure_filename(part_model_id)}.{parts_pdf.filename.rsplit('.', 1)[1].lower()}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

            if part.parts_pdf and os.path.exists(part.parts_pdf):
                os.remove(part.parts_pdf)

            parts_pdf.save(file_path)
            part.parts_pdf = file_path
        except (Exception) as e:
            return jsonify({"message": f"file save failed: {str(e)}"}), 500
    
    part.bicycle_id = bicycle_id
    part.name = name
    part.model_name = model_name
    part.model_id = part_model_id

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message" f"Part Database error: {str(e)}"}), 500
    return jsonify({"message": "Part updated"}), 201

@app.route("/deletepart/<part_id>", methods=["DELETE", 'OPTIONS'])
def deletebicyclepart(part_id):
    part = BicycleParts.query.get(part_id)

    if part is None:
        return jsonify({"message": "Part was not found"}), 404
    
    try:
        db.session.delete(part)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Part Deletion error {str(e)}"}), 500
    return jsonify({"message", "Part was deleted successfully"}), 201
    

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    #app.run(host='0.0.0.0', port=5000, debug=True)


# activation of flask through terminal:
# 1. .\venv\Scripts\activate
# 2. python main.py
