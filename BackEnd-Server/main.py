from flask import Flask, jsonify, request, session, Response, send_from_directory 
from flask_session import Session
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import shutil


from models import db, Bicycle, BicyclePdfs, BicycleParts, PartPdfs
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
    
    bicycle_pdf_files = request.files.getlist("pdfs") 
    
    if not brand:
        return jsonify({"message": "Missing brand value"}), 400
    elif not model:
        return jsonify({"message": "Missing model value"}), 400
    elif not bicycle_pdf_files:
        return jsonify({"message": "Missing bicycle pdf files"}), 400
    
    existing_bicycle = Bicycle.query.filter_by(brand = brand, model = model).first()
    
    if existing_bicycle:
        return jsonify({"message": "This bicycle already exists"}), 400
    
    new_bicycle = Bicycle(brand=brand, model=model)
    
    bicycle_upload_folder = app.config['BICYCLE_FOLDER']
    os.makedirs(bicycle_upload_folder, exist_ok=True)
    bicycle_folder = os.path.join(bicycle_upload_folder, f"{brand}_{model}")
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
            new_pdf = BicyclePdfs(bicycle_pdf=file_path, bicycle=new_bicycle)
            bicycle_pdf_instances.append(new_pdf)

        
        db.session.add(new_bicycle)
        for pdf_instance in bicycle_pdf_instances:
            db.session.add(pdf_instance)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error in the addition of new bicycles: {str(e)}"}), 500

    return jsonify({"message": f"Bicycle {new_bicycle.id} added successfully"}), 201


@app.route("/editbicycle/<int:bicycle_id>", methods=["PATCH"])
def updatebicycle(bicycle_id):
    bicycle = Bicycle.query.get(bicycle_id)

    if not bicycle:
        return jsonify({"message": "Bicycle not found"}), 404
    
    data = request.form
    new_brand = data.get("brand", bicycle.brand)
    new_model = data.get("model", bicycle.model)

    new_bicycle_pdfs = request.files.getlist("pdfs")

    try:
        if any([new_brand != bicycle.brand, new_model != bicycle.model]):
            old_folder = os.path.join(app.config['BICYCLE_FOLDER'], f"{bicycle.brand}_{bicycle.model}")
            new_folder = os.path.join(app.config['BICYCLE_FOLDER'], f"{new_brand}_{new_model}")

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
            current_folder = os.path.join(app.config['BICYCLE_FOLDER'], f"{new_brand}_{new_model}")
            os.makedirs(current_folder, exist_ok=True)

            for pdf_file in new_bicycle_pdfs:
                if not allowed_file(pdf_file.filename):
                    return jsonify({"message": "Error in the file type"}), 400
                
                filename = secure_filename(pdf_file.filename)
                file_path = os.path.join(current_folder, filename)
                pdf_file.save(file_path)

                new_pdf = BicyclePdfs(bicycle_pdf=file_path, bicycle=bicycle)
                db.session.add(new_pdf)
        
        bicycle.brand = new_brand
        bicycle.model = new_model

        db.session.commit()
        return jsonify({"message": "Bicycle was updated successfully", "Bicycle": bicycle.to_json()}), 200        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Update failed: {str(e)}"}), 500

@app.route("/deletebicycle/<bicycle_id>", methods=["DELETE", "OPTIONS"])
def deletebicycle(bicycle_id):
    bicycle = Bicycle.query.get(bicycle_id)
    
    if bicycle is None:
        return jsonify({"message": "Bicycle was not found"}), 404
    
    current_folder = os.path.join(app.config['BICYCLE_FOLDER'], f"{bicycle.brand}_{bicycle.model}")
    
    try:
        db.session.delete(bicycle)
        db.session.commit()

        if os.path.exists(current_folder):
            shutil.rmtree(current_folder) 
        
        return jsonify({"message": "Bicycle and Folder was deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Bicycle deletion error: {str(e)}"}), 500
   

@app.route("/bicyclepartslist", methods=["GET"])
def listParts():
    try:
        parts = BicycleParts.query.all()
        json_parts = [b.to_json() for b in parts]
        return jsonify ({"bicycle parts": json_parts}),200
    except Exception as e:
        return jsonify({"message": f"error in printing the bicycles parts {str(e)}"}),500

@app.route("/addbicyclepart", methods=["POST"])
def addBicycleParts():
    data = request.form
    brand = data.get("brand")
    model_name = data.get("model_name")
    component_type = data.get("component_type")
    part_pdfs = request.files.getlist("part_pdf")

    existing_part = BicycleParts.query.filter_by(brand=brand,model_name=model_name, component_type = component_type ).first()
    if existing_part:
        return jsonify({"message": "Part already exists"}), 400

    if not brand:
        return ({"message": "Missing brand value"}), 400
    elif not model_name:
        return ({"message": "Missing model_name value"}), 400
    elif not component_type:
        return ({"message": "Missing component_type value"}), 400
    elif not part_pdfs:
        return ({"message": "Missing part_pdfs value"}), 400
    
    new_part = BicycleParts(brand=brand, model_name=model_name, component_type=component_type)

    parts_upload_folder = app.config["PARTS_FOLDER"]
    os.makedirs(parts_upload_folder, exist_ok=True)
    part_folder = os.path.join(parts_upload_folder, f"{brand}_{model_name}_{component_type}")
    os.makedirs(part_folder, exist_ok=True)

    parts_pdf_instances = []

    try:
        for pdf_file in part_pdfs:
            if not allowed_file(pdf_file.filename):
                return jsonify({"message": "Invalid file type"}),400
            
            filename = secure_filename(pdf_file.filename) 
            file_path = os.path.join(part_folder, filename)
            pdf_file.save(file_path)

            new_pdf = PartPdfs(part_pdf=file_path, part = new_part)
            parts_pdf_instances.append(new_pdf)


        db.session.add(new_part)
        for pdf_instance in parts_pdf_instances:
            db.session.add(pdf_instance)
        db.session.commit()
   
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error in the addition of part: {str(e)}"}),500
   
    return jsonify({
        "message": f"Bicycle part {new_part.id} has been added"}), 201

@app.route ("/editbicyclepart/<int:id>", methods=["PATCH"])
def updatebicyclepart(id):
    part = BicycleParts.query.get(id)
    
    if not part:
        return jsonify({"message": "Part not found"}), 404
    
    data = request.form
    new_brand = data.get("brand", part.brand)
    new_model_name = data.get("model_name", part.model_name)
    new_component_type = data.get("component_type", part.component_type)

    new_bicycle_part_pdf = request.files.getlist("part_pdfs")
    
    try:
        if any([new_brand != part.brand, new_model_name != part.model_name, new_component_type != part.component_type]):

            old_folder = os.path.join(app.config['PARTS_FOLDER'], f"{part.brand}_{part.model_name}_ {part.component_type}")
            new_folder = os.path.join(app.config['PARTS_FOLDER'], f"{part.brand}_{part.model_name}_ {part.component_type}")

            os.makedirs(new_folder, exist_ok=True)

            for pdf in part.part_pdfs:
                old_path = pdf.part_pdf
                if os.path.exists(old_path):
                    filename = os.path.basename(old_path)
                    new_path = os.path.join(new_folder, filename)
                    os.rename(old_path, new_path)
                    pdf.part_pdf = new_path
            
            if os.path.exists(old_folder) and not os.listdir(old_folder):
                os.rmdir(old_folder)

        if new_bicycle_part_pdf:
            current_folder = os.path.join(app.config['PARTS_FOLDER'], f"{new_brand}_{new_model_name}_{new_component_type}")
            os.makedirs(current_folder, exist_ok=True)

            for pdf_file in new_bicycle_part_pdf:
                if not allowed_file(pdf_file.filename):
                    return jsonify({"message": "Error in the file type"}), 400
                
                filename = secure_filename(pdf_file.filename)
                file_path = os.path.join(current_folder, filename)
                pdf_file.save(file_path)

                new_pdf = PartPdfs(part_pdf = file_path, part=part)
                db.session.add(new_pdf)
        
        part.brand = new_brand
        part.model_name = new_model_name
        part.component_type = new_component_type

        db.session.commit()
        return jsonify({"message": "Part updated successfully", "Part": part.to_json()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Update failed: {str(e)}"}), 500

@app.route("/deletebicyclepart/<int:id>", methods=["DELETE", 'OPTIONS'])
def deletebicyclepart(id):
    part = BicycleParts.query.get(id)

    if part is None:
        return jsonify({"message": "Part was not found"}), 404
    
    current_folder = os.path.join(app.config['PARTS_FOLDER'], f"{part.brand}_{part.model_name}_{part.component_type}")

    try:
        db.session.delete(part)
        db.session.commit()
        if os.path.exists(current_folder):
            shutil.rmtree(current_folder)
        return jsonify({"message": "Part and Folder was deleted successfuly"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Part deletion error: {str(e)}"}), 500
    

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    #app.run(host='0.0.0.0', port=5000, debug=True)


# activation of flask through terminal:
# 1. .\venv\Scripts\activate
# 2. python main.py
