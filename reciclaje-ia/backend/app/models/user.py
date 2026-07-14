from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    cedula = db.Column(db.String(10), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    rol = db.Column(db.String(20), default='usuario')
    creado = db.Column(db.DateTime, default=datetime.now)
    
    # Relaciones
    puntajes = db.relationship('Puntaje', backref='usuario', lazy=True)
    historial = db.relationship('Historial', backref='usuario', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'nombre': self.nombre,
            'cedula': self.cedula,
            'rol': self.rol,
            'creado': self.creado.isoformat() if self.creado else None
        }

class Puntaje(db.Model):
    __tablename__ = 'puntajes'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    puntos = db.Column(db.Integer, default=0)
    material = db.Column(db.String(50))
    creado = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'puntos': self.puntos,
            'material': self.material,
            'creado': self.creado.isoformat() if self.creado else None
        }

class Historial(db.Model):
    __tablename__ = 'historial'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    material = db.Column(db.String(50))
    confianza = db.Column(db.Float)
    modo_demo = db.Column(db.Boolean, default=True)
    fecha = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'material': self.material,
            'confianza': self.confianza,
            'modo_demo': self.modo_demo,
            'fecha': self.fecha.isoformat() if self.fecha else None
        }