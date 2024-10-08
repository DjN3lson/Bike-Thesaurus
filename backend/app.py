from flask import Flask, session
from flask_cors import CORS
from app.models import mongo  # Importing mongo from app.models
from app.auth import create_admin_user, login, logout  # Importing from app.auth
from app.resources import get_bicycles, add_bicycle, get_bicycle_manual  # Importing from app.resources

app = Flask(__name__)
app.secret_key = 'your_secret_key'

DATABASE_NAME = "biketribe"

app.config["MONGO_URI"] = f"mongodb://localhost:27017/{DATABASE_NAME}"  # Update with your MongoDB URI
CORS(app)

mongo.init_app(app)

# Uncomment the line below to create the admin user (run once and comment out again)
# create_admin_user()

@app.route('/app/login', methods=['POST'])
def admin_login():
    return login()

@app.route('/app/logout', methods=['POST'])
def admin_logout():
    return logout()

@app.route('/app/bicycles', methods=['GET'])
def bicycles():
    return get_bicycles()

@app.route('/app/bicycles', methods=['POST'])
def add_new_bicycle():
    return add_bicycle()

@app.route('/app/bicycles/<string:brand>', methods=['GET'])
def bicycle_manual(brand):
    return get_bicycle_manual(brand)

if __name__ == '__main__':
    app.run(port=5328)