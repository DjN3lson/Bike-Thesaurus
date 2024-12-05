from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from uuid import uuid4


metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

def get_uuid():
    return uuid4().hex;


class Bicycle(db.Model):
    __tablename__ = "bicycles"
    id = db.Column (db.Integer, primary_key=True, default=get_uuid)
    brand = db.Column (db.String(255), index=True, unique=False)
    model = db.Column (db.String(255), index=True, unique=False)
    model_id = db.Column (db.Integer, index=True, unique = True)
    bicycle_pdf = db.Column(db.String(255), index=True, unique=True)

    def to_json(self):
        return {
            "id": self.id,
            "brand":self.brand,
            "model":self.model,
            "model_id":self.model_id,
            "bicycle_pdf":self.bicycle_pdf
        }