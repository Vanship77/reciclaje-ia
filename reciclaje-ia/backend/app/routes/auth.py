from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models.user import User
from app.utils.validaciones import validar_cedula_ecuatoriana

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()
    
    campos = ['cedula', 'email', 'nombre', 'password']
    for campo in campos:
        if not data.get(campo):
            return jsonify({'error': f'El campo {campo} es obligatorio'}), 400
    
    validacion = validar_cedula_ecuatoriana(data['cedula'])
    if not validacion['valida']:
        return jsonify({'error': validacion['mensaje']}), 400
    
    if User.query.filter_by(cedula=data['cedula']).first():
        return jsonify({'error': 'La cédula ya está registrada'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 400
    
    user = User(
        cedula=data['cedula'],
        email=data['email'],
        nombre=data['nombre'],
        password=generate_password_hash(data['password']),
        rol=data.get('rol', 'usuario')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # ✅ Convertir a string
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user.id,
            'cedula': user.cedula,
            'email': user.email,
            'nombre': user.nombre,
            'rol': user.rol,
            'puntaje_total': user.puntaje_total
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña son obligatorios'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Credenciales inválidas'}), 401
    
    # ✅ Convertir a string
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user.id,
            'cedula': user.cedula,
            'email': user.email,
            'nombre': user.nombre,
            'rol': user.rol,
            'puntaje_total': user.puntaje_total
        }
    })