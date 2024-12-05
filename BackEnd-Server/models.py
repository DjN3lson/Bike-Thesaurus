from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData


metadata = MetaData()

db = SQLAlchemy(metadata=metadata)


class Bicycle(db.Model):
    __tablename__ = "bicycles"
    id = db.Column (db.Integer, primary_key=True)
    brand = db.Column (db.String(255), index=True, unique=False)
    model = db.Column (db.String(255), index=True, unique=False)
    model_id = db.Column (db.Integer, index=True, unique = False)
    bicycle_pdf = db.Column(db.String(255), index=True, unique=False)

    def to_json(self):
        return {
            "id": self.id,
            "brand":self.brand,
            "model":self.model,
            "model_id":self.model_id,
            "bicycle_pdf":self.bicycle_pdf
        }