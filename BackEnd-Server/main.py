from flask import Flask, jsonify, request, session, Response, send_from_directory
from flask_session import Session
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import shutil


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
    model_id = data.get("model_id") or data.get("0000")
    
    
    bicycle_pdf_files = request.files.getlist("pdfs") 
    
    if not brand:
        return jsonify({"message": "Missing brand value"}), 400
    elif not model:
        return jsonify({"message": "Missing model value"}), 400
    elif not model_id:
        return jsonify({"message": "Missing model id value"}), 400
    elif not bicycle_pdf_files:
        return jsonify({"message": "Missing bicycle pdf files"}), 400
    
    existing_bicycle = Bicycle.query.filter_by(model_id=model_id).first()
    
    if existing_bicycle:
            return jsonify({"message": "This bicycle already exists"}), 400
    
    new_bicycle = Bicycle(brand=brand, model=model, model_id=model_id)
    
    
    bicycle_upload_folder = app.config['BICYCLE_FOLDER']
    os.makedirs(bicycle_upload_folder, exist_ok=True)
    bicycle_folder = os.path.join(bicycle_upload_folder, f"{brand}_{model}_{model_id}")
    os.makedirs(bicycle_folder, exist_ok=True)

    bicycle_pdf_instances = []

    try:
        # Process each uploaded PDF
        for pdf_file in bicycle_pdf_files:
            if not allowed_file(pdf_file.filename):
                return jsonify({"message": "Invalid file type"}), 400

            # Secure filename and save
            filename = secure_filename(pdf_file.filename)
            file_path = os.path.join(bicycle_folder, filename)
            pdf_file.save(file_path)

            # Associate PDF with the new bicycle
            new_pdf = BicyclePdfs(bicycle_pdf=file_path, bicycle =new_bicycle)
            bicycle_pdf_instances.append(new_pdf)

        
        db.session.add(new_bicycle)
        for pdf_instance in bicycle_pdf_instances:
            db.session.add(pdf_instance)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error: {str(e)}"}), 500

    return jsonify({"message": f"Bicycle {new_bicycle.id} added successfully"}), 201


@app.route("/editbicycle/<int:bicycle_id>", methods=["PATCH"])
def updatebicycle(bicycle_id):
    bicycle = Bicycle.query.get(bicycle_id)

    if not bicycle:
        return jsonify({"message": "Bicycle not found"}), 404
    
    data = request.form
    new_brand = data.get("brand", bicycle.brand)
    new_model = data.get("model", bicycle.model)
    new_model_id = data.get("model_id", bicycle.model_id)

    if new_model_id != bicycle.model_id:
        existing = Bicycle.query.filter_by(model_id = new_model_id).first()
        if existing:
            return jsonify({"message": "Model ID already in use"}), 400

    new_bicycle_pdfs = request.files.getlist("pdfs")

    try:
        if any([new_brand != bicycle.brand,
                new_model != bicycle.model,
                new_model_id != bicycle.model_id]):
            old_folder = os.path.join(app.config['BICYCLE_FOLDER'], f"{bicycle.brand}_{bicycle.model}_{bicycle.model_id}")
            new_folder = os.path.join(app.config['BICYCLE_FOLDER'], f"{new_brand}_{new_model}_{new_model_id}")

            os.makedirs(new_folder, exist_ok=True)

            for pdf in bicycle.pdfs:
                old_path = pdf.bicycle_pdf
                if os.path.exists(old_path):
                    filename = os.path.basename(old_path)
                    new_path = os.path.join(new_folder, filename)
                    os.rename(old_path, new_path)
                    pdf.bicycle_pdf = new_path
            
            if os.path.exists(old_folder) and not os.listdir(old_folder):
                os.rmdir(old_folder)
            
        if new_bicycle_pdfs:
            current_folder = os.path.join(app.config['BICYCLE_FOLDER'], f"{new_brand}_{new_model}_{new_model_id}")
            os.makedirs(current_folder, exist_ok=True)

            for pdf_file in new_bicycle_pdfs:
                if not allowed_file(pdf_file.filename):
                    return jsonify({"message": "Error in the file type"}), 400
                
                filename = secure_filename(pdf_file.filename)
                file_path = os.path.join(current_folder, filename)
                pdf_file.save(file_path)

                new_pdf = BicyclePdfs(bicycle_pdf = file_path, bicycle = bicycle)
                db.session.add(new_pdf)
        
        bicycle.brand = new_brand
        bicycle.model = new_model
        bicycle.model_id = new_model_id

        db.session.commit()
        return jsonify({"message": "Bicycle was updated successfully", "bicycle: " : bicycle.to_json()}), 200        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Update failed: {str(e)}"}), 500

@app.route("/deletebicycle/<bicycle_id>", methods=["DELETE", "OPTIONS"])
def deletebicycle(bicycle_id):
    bicycle = Bicycle.query.get(bicycle_id)
    
    data = request.form
    
    brand = data.get("brand", bicycle.brand)
    model = data.get("model", bicycle.model)
    model_id = data.get("model_id", bicycle.model_id)
    
    
    if bicycle is None:
        return jsonify({"message": "Bicycle was not found" }),404
    
    current_folder = os.path.join(app.config['BICYCLE_FOLDER'], f"{brand}_{model}_{model_id}")
    
    print(f"Folder path: {current_folder}")
    print(current_folder)
    

    try:
        db.session.delete(bicycle)
        db.session.commit()

        if os.path.exists(current_folder):
            print("Folder exists, proceeding to delete.")
            shutil.rmtree(current_folder) 
            print("Folder deleted successfully.")
        else:
            print("Folder does not exist.")
        
        return jsonify({"message": "Bicycle and Folder was deleted sucessfully "}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Bicycle deleted failed: {str(e)}"}),500
   

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
    part_model_id = data.get("part_id")
    name = data.get("name")
    part_model_name = data.get("part_model_name")
    parts_pdf = request.files.get("pdfs")

    if not name:
        return jsonify({"message": "Missing name"}), 400
    elif not bicycle_id:
        return jsonify({"message": "Missing bicycle_id"}), 400
    elif not part_model_id:
        return jsonify({"message": "Missing model id"}), 400
    elif not part_model_name:
        return jsonify({"message": "Missing part model ame"}), 400
    
    existing_part = BicycleParts.query.filter_by(part_id = part_model_id).first()

    if existing_part:
        return jsonify({"message": "This bicycle part already exists"}), 400
    
    if not allowed_file(parts_pdf.filename):
        return jsonify({"message": "Invalid file type"}), 400
    if parts_pdf is None:
        return jsonify({"message": "No file provided"}), 400
    if not app.config['ALLOWED_EXTENSIONS']:
        return jsonify({"message": "Invalid file type"}), 400
    part_upload_folder = app.config['PARTS_FOLDER']
    os.makedirs(part_upload_folder, exist_ok=True)

    try:
        original_file = secure_filename(parts_pdf.filename)
        file_path = os.path.join(part_upload_folder, original_file)

        parts_pdf.save(file_path)
    except (Exception) as e:
        return jsonify({"message": f"file save failed: {str(e)}"}), 500
    
    new_part = BicycleParts(bicycle_id = bicycle_id, part_model_id = part_model_id, name = name, part_model_name = part_model_name, parts_pdf = parts_pdf)

    try:
        db.session.add(new_part)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}),400
    return jsonify({
        "message": f"Bicycle {new_part.id} has been added"
    }), 201

@app.route ("/editbicyclepart/<int:bicycle_part_id>", methods=["PATCH"])
def updatebicyclepart(bicycle_part_id):
    part = BicycleParts.query.get(bicycle_part_id)
    
    if not part:
        return jsonify({"message": "Bicycle not found"})
    
    data = request.form
    bicycle_id = data.get("bicycle_id", part.bicycle_id)
    name = data.get("name", part.name)
    model_name = data.get("part_model_name", part.model_name)
    part_model_id = data.get("part_model_id", part.part_model_id) or data.get("part_model_id", "0000")

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
