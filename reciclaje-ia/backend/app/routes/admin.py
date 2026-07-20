from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import db, Usuario, Historial, Puntaje
from sqlalchemy import func

# 🔥 AÑADIR url_prefix='/api' AQUÍ
admin_bp = Blueprint('admin', __name__, url_prefix='/api')

@admin_bp.route('/admin/usuarios', methods=['GET'])
@jwt_required()
def get_usuarios():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol != 'admin':
        return jsonify({'error': 'Acceso denegado'}), 403
    
    usuarios = Usuario.query.all()
    return jsonify([u.to_dict() for u in usuarios]), 200

@admin_bp.route('/admin/estadisticas', methods=['GET'])
@jwt_required()
def get_estadisticas():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol != 'admin':
        return jsonify({'error': 'Acceso denegado'}), 403
    
    total_usuarios = Usuario.query.count()
    total_clasificaciones = Historial.query.count()
    total_puntajes = Puntaje.query.count()
    
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