from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    # TODO: Agregar campos: cedula, email, nombre, password, rol, puntaje_total

class Clasificacion(db.Model):
    __tablename__ = 'clasificaciones'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    # TODO: Agregar campos: clase, confianza, puntaje_obtenido, fecha
