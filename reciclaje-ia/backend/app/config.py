import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-dev-secret')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://reciclaje_user:reciclaje_password@db:5432/reciclaje_db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 86400
    MODELO_PATH = os.getenv('MODELO_PATH', 'modelo/modelo_residuos.keras')
    CLASES_PATH = os.getenv('CLASES_PATH', 'modelo/classes.json')
    CONFIANZA_MINIMA = float(os.getenv('CONFIANZA_MINIMA', 0.60))