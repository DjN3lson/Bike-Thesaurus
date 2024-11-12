from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from uuid import uuid4

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

def get_uuid():
    return uuid4().hex;

class User(db.Model):
    __tablename__ = "users" #for table name
    id = db.Column( db.Integer, primary_key=True, default=get_uuid)
    email = db.Column( db.String, unique=True)
    password = db.Column ( db.String(255), unique=True)
    firstName = db.Column( db.String(50))
    lastName = db.Column( db.String(100))
    isAdmin = db.Column( db.Boolean, unique=True)


class Bicycle(db.Model):
    __tablename__ = "bicycles"
    id = db.Column (db.Integer, primary_key=True)
    brand = db.Column (db.String, unique=False)
    model = db.Column (db.String, unique=True)
    model_id = db.Column (db.Integer, unique = True)