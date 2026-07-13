from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    cedula = db.Column(db.String(10), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), default='usuario')
    puntaje_total = db.Column(db.Integer, default=0)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    ultima_clasificacion = db.Column(db.DateTime)
    
    clasificaciones = db.relationship('Clasificacion', backref='usuario', lazy=True)

class Clasificacion(db.Model):
    __tablename__ = 'clasificaciones'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    clase = db.Column(db.String(20), nullable=False)
    confianza = db.Column(db.Float, nullable=False)
    puntaje_obtenido = db.Column(db.Integer, default=0)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)