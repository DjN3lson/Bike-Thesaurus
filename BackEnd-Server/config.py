from dotenv import load_dotenv
import os
import redis

load_dotenv()

class ApplicationConfig():
    SECRET_KEY = os.environ["SECRET_KEY"] #Create a .env file in server folder and put SECRET_KEY = [and your secret key]
    SQLAlCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = "sqlite:////flaskdb.db"
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USER_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:8000")

