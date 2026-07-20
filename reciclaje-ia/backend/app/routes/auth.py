from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import db, Usuario

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('cedula'):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    cedula = data['cedula']
    if len(cedula) != 10 or not cedula.isdigit():
        return jsonify({'error': 'Cédula debe tener 10 dígitos'}), 400
    
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email ya registrado'}), 400
    
    if Usuario.query.filter_by(cedula=cedula).first():
        return jsonify({'error': 'Cédula ya registrada'}), 400
    
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

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = Usuario.query.filter_by(email=data.get('email')).first()
    
    if usuario and usuario.check_password(data.get('password')):
        token = create_access_token(identity=str(usuario.id))
        return jsonify({
            'token': token,
            'usuario': usuario.to_dict()
        }), 200
    
    return jsonify({'error': 'Credenciales inválidas'}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    return jsonify(usuario.to_dict()), 200