from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User

admin_bp = Blueprint('admin', __name__, url_prefix='/api')

def verificar_admin(user_id):
    user = User.query.get(user_id)
    return user and user.rol == 'admin'

@admin_bp.route('/usuarios', methods=['GET'])
@jwt_required()
def listar_usuarios():
    user_id = get_jwt_identity()
    if not verificar_admin(user_id):
        return jsonify({'error': 'Acceso denegado'}), 403
    
    usuarios = User.query.order_by(User.id).all()
    
    return jsonify([{
        'id': u.id,
        'cedula': u.cedula,
        'email': u.email,
        'nombre': u.nombre,
        'rol': u.rol,
        'puntaje_total': u.puntaje_total,
        'fecha_registro': u.fecha_registro.isoformat()
    } for u in usuarios])

@admin_bp.route('/usuarios/<int:usuario_id>', methods=['PUT'])
@jwt_required()
def actualizar_usuario(usuario_id):
    user_id = get_jwt_identity()
    if not verificar_admin(user_id):
        return jsonify({'error': 'Acceso denegado'}), 403
    
    user = User.query.get(usuario_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    data = request.get_json()
    if 'rol' in data:
        user.rol = data['rol']
    if 'puntaje_total' in data:
        user.puntaje_total = data['puntaje_total']
    
    db.session.commit()
    return jsonify({'mensaje': 'Usuario actualizado correctamente'})

@admin_bp.route('/usuarios/<int:usuario_id>', methods=['DELETE'])
@jwt_required()
def eliminar_usuario(usuario_id):
    user_id = get_jwt_identity()
    if not verificar_admin(user_id):
        return jsonify({'error': 'Acceso denegado'}), 403
    
    if usuario_id == user_id:
        return jsonify({'error': 'No puedes eliminar tu propio usuario'}), 400
    
    user = User.query.get(usuario_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({'mensaje': 'Usuario eliminado correctamente'})