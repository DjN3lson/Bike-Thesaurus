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
    pdfs = db.relationship('BicyclePdfs', backref='bicycle', lazy='dynamic')

    def to_json(self):
        return {
            "id": self.id,
            "brand":self.brand,
            "model":self.model,
            "model_id":self.model_id,
            "pdfs":[pdf.bicycle_pdf for pdf in self.pdfs]
        }
    
class BicyclePdfs(db.Model):
    __tablename__= "bicycle_pdfs"
    id = db.Column(db.Integer, primary_key=True)
    bicycle_id = db.Column(db.Integer, db.ForeignKey('bicycles.id'), unique=False)
    bicycle_pdf = db.Column(db.String(255), unique=False)

# class BicycleParts(db.Model):
#     __tablename__= "bicycleparts"
#     id = db.Column(db.Integer, primary_key=True)
#     bicycle_id = db.Column(db.Integer, db.ForeignKey('bicycles.model_id'), unique=False)
#     name = db.Column(db.String(255), index=True, unique=False)
#     model_name = db.Column(db.String(255), index=True, unique=False)
#     part_id = db.Column(db.Integer, index=True, unique=False)

# class PartPdfs(db.Model):
#     __tablename__="partpdfs"
#     id = db.Column(db.Integer, primary_key=True)
#     part_id = db.Column(db.Intefer, db.ForeignKey('bicycleparts.'))

