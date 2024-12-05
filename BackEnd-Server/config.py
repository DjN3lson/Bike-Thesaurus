from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import os


load_dotenv()

class ApplicationConfig():
    SECRET_KEY = os.environ["SECRET_KEY"] #Create a .env file in server folder and put SECRET_KEY = [and your secret key]
    SQLAlCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URI"] #Load DATABASE_URI from .env
    #configuration for MySQL
    SESSION_TYPE = "filesystem"
    SESSION_PERMANENT = False
    SESSION_USER_SIGNER = True

    UPLOAD_FOLDER = 'uploads/'
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'doc', 'jpg', 'docx', 'txt'}

