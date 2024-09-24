from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#In-memory storage for bicycles
bicycles = []


@app.route('/api.bicycles', methods=['GET'])
def get_bicycles():
    return jsonify(bicycles)

@app.route('/api/bicycles', methods=['POST'])
def add_bicycle():
    data = request.json
    if 'model' not in data or 'manual' not in data:
        return jsonify({"error": "Model and manual are required"})
    
    bicycles.append(data)
    return jsonify(data),201

@app.route('/api/bycicles/<string:model', methods=['GET'])
def get_bicycle_manual(model):
    for bicycle in bicycles:
        if bicycle['model'] == model:
            return jsonify(bicycle), 200
    return jsonify({"error": "Bicycle not found"}),404

if __name__=='__main__':
    app.run(port=5328)