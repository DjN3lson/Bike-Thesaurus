from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import os


load_dotenv()

class ApplicationConfig():
    SECRET_KEY = os.environ["SECRET_KEY"] #Create a .env file in server folder and put SECRET_KEY = [and your secret key]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URI"] #Load DATABASE_URI from .env
    
    SESSION_TYPE = "filesystem"
    SESSION_PERMANENT = False
    SESSION_USER_SIGNER = True

    FRONTEND_PUBLIC_FOLDER = os.path.abspath('../FrontEnd-Client/public/uploads')
    UPLOAD_FOLDER = FRONTEND_PUBLIC_FOLDER
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'doc', 'jpg', 'docx', 'txt', 'jpeg'}

