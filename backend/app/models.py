from flask_pymongo import PyMongo

mongo = PyMongo()

class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password

class Bicycle:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model