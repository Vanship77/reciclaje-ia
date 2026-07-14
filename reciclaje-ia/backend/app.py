from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
import json
from dotenv import load_dotenv
import base64
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import tempfile

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuración
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///reciclaje.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'mi_clave_secreta_super_segura')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    
    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=['http://localhost:5173', 'http://localhost:5174', 'http://localhost:80', 'http://localhost'])
    
    # Importar modelos
    from models import Usuario, Puntaje, Historial
    
    # Importar clasificador
    from clasificador import ClasificadorService
    clasificador = ClasificadorService()
    
    # ============ RUTAS DE AUTENTICACIÓN ============
    
    @app.route('/api/registro', methods=['POST'])
    def registro():
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password') or not data.get('cedula'):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        # Validar cédula
        cedula = data['cedula']
        if len(cedula) != 10 or not cedula.isdigit():
            return jsonify({'error': 'Cédula debe tener 10 dígitos'}), 400
        
        # Verificar si existe
        if Usuario.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email ya registrado'}), 400
        
        if Usuario.query.filter_by(cedula=cedula).first():
            return jsonify({'error': 'Cédula ya registrada'}), 400
        
        # Crear usuario
        usuario = Usuario(
            email=data['email'],
            nombre=data.get('nombre', 'Usuario'),
            cedula=cedula,
            rol='usuario'
        )
        usuario.set_password(data['password'])
        
        db.session.add(usuario)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Usuario registrado exitosamente',
            'usuario': usuario.to_dict()
        }), 201
    
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        usuario = Usuario.query.filter_by(email=data.get('email')).first()
        
        if usuario and usuario.check_password(data.get('password')):
            token = create_access_token(identity=usuario.id)
            return jsonify({
                'token': token,
                'usuario': usuario.to_dict()
            }), 200
        
        return jsonify({'error': 'Credenciales inválidas'}), 401
    
    @app.route('/api/me', methods=['GET'])
    @jwt_required()
    def me():
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)
        
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify(usuario.to_dict()), 200
    
    # ============ RUTAS DE PUNTAJES ============
    
    @app.route('/api/puntajes', methods=['GET'])
    def get_puntajes():
        puntajes = Puntaje.query.order_by(Puntaje.puntos.desc()).limit(10).all()
        return jsonify([p.to_dict() for p in puntajes]), 200
    
    @app.route('/api/puntajes', methods=['POST'])
    @jwt_required()
    def crear_puntaje():
        usuario_id = get_jwt_identity()
        data = request.get_json()
        
        puntaje = Puntaje(
            usuario_id=usuario_id,
            puntos=data.get('puntos', 0),
            material=data.get('material', 'plastic')
        )
        
        db.session.add(puntaje)
        db.session.commit()
        
        return jsonify(puntaje.to_dict()), 201
    
    @app.route('/api/historial', methods=['GET'])
    @jwt_required()
    def get_historial():
        usuario_id = get_jwt_identity()
        historial = Historial.query.filter_by(usuario_id=usuario_id).order_by(Historial.fecha.desc()).limit(20).all()
        return jsonify([h.to_dict() for h in historial]), 200
    
    # ============ RUTAS DE CLASIFICACIÓN ============
    
    @app.route('/api/clasificar_webcam', methods=['POST'])
    @jwt_required()
    def clasificar_webcam():
        try:
            usuario_id = get_jwt_identity()
            data = request.get_json()
            
            if not data or 'imagen' not in data:
                return jsonify({'error': 'No se proporcionó imagen'}), 400
            
            # Decodificar imagen base64
            imagen_base64 = data['imagen'].split(',')[1] if ',' in data['imagen'] else data['imagen']
            imagen_bytes = base64.b64decode(imagen_base64)
            
            # Convertir a imagen OpenCV
            nparr = np.frombuffer(imagen_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return jsonify({'error': 'Error al procesar la imagen'}), 400
            
            # Clasificar
            resultado = clasificador.clasificar(img)
            
            # Guardar en historial
            historial = Historial(
                usuario_id=usuario_id,
                material=resultado['clase'],
                confianza=resultado['confianza'],
                modo_demo=resultado.get('modo_demo', False)
            )
            db.session.add(historial)
            db.session.commit()
            
            return jsonify({
                'resultado': resultado,
                'historial_id': historial.id
            }), 200
            
        except Exception as e:
            print(f"❌ Error en clasificación: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/clasificar_archivo', methods=['POST'])
    @jwt_required()
    def clasificar_archivo():
        try:
            if 'archivo' not in request.files:
                return jsonify({'error': 'No se proporcionó archivo'}), 400
            
            archivo = request.files['archivo']
            if archivo.filename == '':
                return jsonify({'error': 'Archivo vacío'}), 400
            
            # Guardar temporalmente
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
                archivo.save(tmp.name)
                img = cv2.imread(tmp.name)
                os.unlink(tmp.name)
            
            if img is None:
                return jsonify({'error': 'Error al procesar la imagen'}), 400
            
            # Clasificar
            resultado = clasificador.clasificar(img)
            
            return jsonify(resultado), 200
            
        except Exception as e:
            print(f"❌ Error en clasificación: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/modelo/estado', methods=['GET'])
    @jwt_required()
    def get_estado_modelo():
        estado = clasificador.get_estado()
        return jsonify(estado), 200
    
    @app.route('/api/modelo/entrenar', methods=['POST'])
    @jwt_required()
    def entrenar_modelo():
        # Verificar que sea admin
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)
        
        if not usuario or usuario.rol != 'admin':
            return jsonify({'error': 'Acceso denegado'}), 403
        
        resultado = clasificador.entrenar_modelo()
        return jsonify(resultado), 200
    
    # ============ RUTAS DE ADMIN ============
    
    @app.route('/api/admin/usuarios', methods=['GET'])
    @jwt_required()
    def get_usuarios():
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)
        
        if not usuario or usuario.rol != 'admin':
            return jsonify({'error': 'Acceso denegado'}), 403
        
        usuarios = Usuario.query.all()
        return jsonify([u.to_dict() for u in usuarios]), 200
    
    @app.route('/api/admin/estadisticas', methods=['GET'])
    @jwt_required()
    def get_estadisticas():
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)
        
        if not usuario or usuario.rol != 'admin':
            return jsonify({'error': 'Acceso denegado'}), 403
        
        # Estadísticas
        total_usuarios = Usuario.query.count()
        total_clasificaciones = Historial.query.count()
        total_puntajes = Puntaje.query.count()
        
        # Materiales más clasificados
        from sqlalchemy import func
        materiales = db.session.query(
            Historial.material,
            func.count(Historial.material)
        ).group_by(Historial.material).all()
        
        return jsonify({
            'total_usuarios': total_usuarios,
            'total_clasificaciones': total_clasificaciones,
            'total_puntajes': total_puntajes,
            'materiales': [{'nombre': m[0], 'cantidad': m[1]} for m in materiales]
        }), 200
    
    # ============ RUTA PARA TEST ============
    
    @app.route('/api/test', methods=['GET', 'POST', 'PUT', 'DELETE'])
    def test():
        if request.method == 'GET':
            return jsonify({'mensaje': 'API funcionando correctamente'}), 200
        elif request.method == 'POST':
            return jsonify({'mensaje': 'POST exitoso', 'data': request.get_json()}), 201
        elif request.method == 'PUT':
            return jsonify({'mensaje': 'PUT exitoso', 'data': request.get_json()}), 200
        elif request.method == 'DELETE':
            return jsonify({'mensaje': 'DELETE exitoso'}), 200
    
    # ============ CREAR TABLAS ============
    
    with app.app_context():
        db.create_all()
        
        # Crear admin por defecto si no existe
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

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)