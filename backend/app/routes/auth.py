from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User
from app.validaciones import validar_cedula_ecuatoriana

auth_bp = Blueprint('auth', __name__, url_prefix='/api')


@auth_bp.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()

    cedula = data.get('cedula')
    email = data.get('email')
    nombre = data.get('nombre')
    password = data.get('password')

    # Validar que todos los campos estén presentes
    if not all([cedula, email, nombre, password]):
        return jsonify({'error': 'Todos los campos son obligatorios'}), 400

    # Validar formato de cédula ecuatoriana
    resultado_validacion = validar_cedula_ecuatoriana(cedula)
    if not resultado_validacion['valida']:
        return jsonify({'error': resultado_validacion['mensaje']}), 400

    # Verificar que la cédula no esté registrada
    if User.query.filter_by(cedula=cedula).first():
        return jsonify({'error': 'La cédula ya está registrada'}), 409

    # Verificar que el email no esté registrado
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    # Hashear la contraseña antes de guardarla
    password_hash = generate_password_hash(password)

    nuevo_usuario = User(
        cedula=cedula,
        email=email,
        nombre=nombre,
        password=password_hash,
        rol='usuario',
        puntaje_total=0
    )

    db.session.add(nuevo_usuario)
    db.session.commit()

    # Generar token JWT para el usuario recién registrado
    token = create_access_token(identity=str(nuevo_usuario.id))

    return jsonify({
        'mensaje': 'Usuario registrado exitosamente',
        'token': token,
        'usuario': {
            'id': nuevo_usuario.id,
            'nombre': nuevo_usuario.nombre,
            'email': nuevo_usuario.email,
            'rol': nuevo_usuario.rol
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Email y contraseña son obligatorios'}), 400

    # Buscar usuario por email
    usuario = User.query.filter_by(email=email).first()

    # Verificar que exista y que la contraseña coincida
    if not usuario or not check_password_hash(usuario.password, password):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    # Generar token JWT
    token = create_access_token(identity=str(usuario.id))

    return jsonify({
        'mensaje': 'Inicio de sesión exitoso',
        'token': token,
        'usuario': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'rol': usuario.rol
        }
    }), 200