from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class Bicycle(db.Model):
    __tablename__ = "bicycles"
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(255), index=True, unique=False)
    model = db.Column(db.String(255), index=True, unique=False)
    pdfs = db.relationship('BicyclePdfs', backref='bicycle', lazy='dynamic', cascade='all, delete-orphan')

    def to_json(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model": self.model,
            "pdfs": [pdf.to_json() for pdf in self.pdfs]
        }

class BicyclePdfs(db.Model):
    __tablename__= "bicycle_pdfs"
    id = db.Column(db.Integer, primary_key=True)
    bicycle_id = db.Column(db.Integer, db.ForeignKey('bicycles.id'), unique=False)
    bicycle_pdf = db.Column(db.String(255), unique=False)

    def to_json(self):
        return {
            "id": self.id,
            "bicycle_pdf": self.bicycle_pdf
        }

class BicycleParts(db.Model):
    __tablename__ = "bicycleparts"
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(255), index=True, unique= False)
    model_name = db.Column(db.String(255), index=True, unique = False)
    component_type = db.Column(db.String(100), index=True, unique=False)
    part_pdfs = db.relationship('PartPdfs', backref='part', lazy='dynamic')

    def to_json(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model_name": self.model_name,
            "component_type": self.component_type,
            "part_pdfs": [pdf.to_json() for pdf in self.part_pdfs]
        }

class PartPdfs(db.Model):
    __tablename__="partpdfs"
    id = db.Column(db.Integer, primary_key=True)
    part_id = db.Column(db.Integer, db.ForeignKey('bicycleparts.id'))
    part_pdf = db.Column(db.String(255), unique=False)