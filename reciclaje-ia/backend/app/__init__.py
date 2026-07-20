from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from dotenv import load_dotenv

# Importar db desde models
from app.models.user import db
from app.config import Config

load_dotenv()

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuración
    app.config.from_object(Config)
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    
    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=['http://localhost:5173', 'http://localhost:5174', 'http://localhost:80', 'http://localhost'])
    
    # Registrar blueprints - CORREGIDO
    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp
    from app.routes.clasificacion import clasificacion_bp
    from app.routes.ranking import ranking_bp
    
    # 🔥 CAMBIO: Ya no duplicamos url_prefix (está en el blueprint)
    app.register_blueprint(auth_bp)      # auth_bp ya tiene url_prefix='/api'
    app.register_blueprint(admin_bp)     # admin_bp ya tiene url_prefix='/api'
    app.register_blueprint(clasificacion_bp)  # clasificacion_bp ya tiene url_prefix='/api'
    app.register_blueprint(ranking_bp)   # ranking_bp ya tiene url_prefix='/api'
    
    # Ruta de test
    @app.route('/api/test', methods=['GET', 'POST', 'PUT', 'DELETE'])
    def test():
        from flask import jsonify, request
        if request.method == 'GET':
            return jsonify({'mensaje': 'API funcionando correctamente'}), 200
        elif request.method == 'POST':
            return jsonify({'mensaje': 'POST exitoso', 'data': request.get_json()}), 201
        elif request.method == 'PUT':
            return jsonify({'mensaje': 'PUT exitoso', 'data': request.get_json()}), 200
        elif request.method == 'DELETE':
            return jsonify({'mensaje': 'DELETE exitoso'}), 200
    
    # ============================================================
    # 🔥 RUTA /health - VERIFICAR ESTADO DEL BACKEND
    # ============================================================
    @app.route('/health')
    def health():
        from flask import jsonify
        return jsonify({
            'estado': 'OK',
            'modelo': 'EfficientNetB0',
            'version': '1.0'
        }), 200
    
    # Crear tablas y usuarios por defecto
    with app.app_context():
        db.create_all()
        
        # Crear admin por defecto
        from app.models.user import Usuario
        if not Usuario.query.filter_by(email='florentino@administrador.com').first():
            admin = Usuario(
                email='florentino@administrador.com',
                nombre='Florentino',
                cedula='1234567890',
                rol='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin creado: florentino@administrador.com / admin123")
        
        if not Usuario.query.filter_by(email='belen@usuario.com').first():
            usuario = Usuario(
                email='belen@usuario.com',
                nombre='Belén',
                cedula='0987654321',
                rol='usuario'
            )
            usuario.set_password('usuario123')
            db.session.add(usuario)
            db.session.commit()
            print("✅ Usuario creado: belen@usuario.com / usuario123")
    
    return app