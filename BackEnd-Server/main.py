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


def bicycles():
    try:
        static_bicycles = [
            Bicycle(id=1, brand="Trek", model="ModelX", model_id=13579, bicycle_pdf="uploads/trek_modelx.pdf"),
            Bicycle(id=2, brand="Giant", model="Defy", model_id=24680, bicycle_pdf="uploads/giant_defy.pdf"),
            Bicycle(id=3, brand="Specialized", model="Roubaix", model_id=13580, bicycle_pdf="uploads/specialized_roubaix.pdf"),
            Bicycle(id=4, brand="Cannondale", model="Synapse", model_id=13581, bicycle_pdf="uploads/cannondale_synapse.pdf"),
        ]
        for bicycle in static_bicycles:
            db.session.add(bicycle)
        db.session.commit()
    except Exception as e:
        print("message: ", str(e))


with app.app_context(): 
#     db.create_all() #This creates the table
    bicycles()


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
    brand = request.json.get("brand")
    model = request.json.get("model")
    model_id = request.json.get("model_id")
    bicycle_pdf = request.json.get("bicycle_pdf")
    
    if not brand or not model or not bicycle_pdf:
        return jsonify(
            ({"message": "Missing brand or model"}), 400
        )
    
    existing_bicycle = Bicycle.query.filter_by(id = id).first()
    if existing_bicycle:
            return jsonify({"message": "This bicycle already exists"}), 400
    
    if bicycle_pdf.startswith("http"):
        #case 1: if its URL
        file_path = bicycle_pdf
    else:
        try:
            #case 2: if its a base64, decode and save file
            pdf_bytes = base64.b64decode(bicycle_pdf)
            filename = f"{secure_filename(brand)}_{secure_filename(model)}_{secure_filename(model_id)}.pdf"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            with open(file_path, "wb") as pdf_file:
                pdf_file.write(pdf_bytes)
        except (binascii.Error, Exception) as e:
            return jsonify({"message": f"Error processing pdf: {str(e)}"}),400
        
    new_bicycle = Bicycle(brand = brand, model = model, model_id = model_id, bicycle_pdf = bicycle_pdf )
    
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
    
    data = request.json
    bicycle.brand = data.get("brand", bicycle.brand)
    bicycle.model = data.get("model", bicycle.model)
    bicycle.model_id = data.get("model_id", bicycle.model_id)
    bicycle.bicycle_pdf = data.get("bicycle_pdf", bicycle.bicycle_pdf)


    db.session.commit()
    return jsonify({ "message": "Bicycle updated"}), 201


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    #app.run(host='0.0.0.0', port=5000, debug=True)


# activation of flask through terminal:
# 1. .\venv\Scripts\activate
# 2. python main.py
