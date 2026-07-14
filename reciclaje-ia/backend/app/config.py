import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'mi_clave_secreta_super_segura')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'mi_clave_secreta_super_segura')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///reciclaje.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuraciones del modelo
    MODELO_PATH = os.getenv('MODELO_PATH', 'modelo/modelo_trashnet.h5')
    CLASES_PATH = os.getenv('CLASES_PATH', 'modelo/clases.json')
    DATASET_PATH = os.getenv('DATASET_PATH', 'dataset/trashnet')