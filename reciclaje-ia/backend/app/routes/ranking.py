from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.user import User

ranking_bp = Blueprint('ranking', __name__, url_prefix='/api')

@ranking_bp.route('/ranking', methods=['GET'])
def ranking():
    usuarios = User.query.order_by(User.puntaje_total.desc()).limit(10).all()
    
    return jsonify([{
        'id': u.id,
        'nombre': u.nombre,
        'email': u.email,
        'puntaje_total': u.puntaje_total,
        'ultima_clasificacion': u.ultima_clasificacion.isoformat() if u.ultima_clasificacion else None
    } for u in usuarios])

@ranking_bp.route('/puntajes', methods=['GET'])
@jwt_required()
def puntajes():
    usuarios = User.query.order_by(User.puntaje_total.desc()).all()
    
    return jsonify([{
        'id': u.id,
        'nombre': u.nombre,
        'email': u.email,
        'puntaje_total': u.puntaje_total
    } for u in usuarios])