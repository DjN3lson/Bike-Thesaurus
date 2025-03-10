from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class Bicycle(db.Model):
    __tablename__ = "bicycles"
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(255), index=True, unique=False)
    model = db.Column(db.String(255), index=True, unique=False)
    pdfs = db.relationship('BicyclePdfs', backref='bicycle', lazy='dynamic')

    def to_json(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model": self.model,
            "pdfs": [pdf.bicycle_pdf for pdf in self.pdfs]
        }

class BicyclePdfs(db.Model):
    __tablename__= "bicycle_pdfs"
    id = db.Column(db.Integer, primary_key=True)
    bicycle_id = db.Column(db.Integer, db.ForeignKey('bicycles.id'), unique=False)
    bicycle_pdf = db.Column(db.String(255), unique=False)

class BicycleParts(db.Model):
    __tablename__ = "bicycleparts"
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(255), index=True, unique= False)
    model_name = db.Column(db.String(255), index=True, unique = False)
    component_type = db.Column(db.String(100), index=True, unique=False)
    parts_pdfs = db.relationship('PartPdfs', backref='part', lazy='dynamic')

    def to_json(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model_name": self.model_name,
            "component_type": self.component_type,
            "parts_pdfs": [pdf.part_pdf for pdf in self.parts_pdfs]
        }

class PartPdfs(db.Model):
    __tablename__="partpdfs"
    id = db.Column(db.Integer, primary_key=True)
    part_id = db.Column(db.Integer, db.ForeignKey('bicycleparts.id'))
    part_pdf = db.Column(db.String(255), unique=False)