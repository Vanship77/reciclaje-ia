from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import db, Puntaje, Historial

ranking_bp = Blueprint('ranking', __name__)

@ranking_bp.route('/puntajes', methods=['GET'])
def get_puntajes():
    puntajes = Puntaje.query.order_by(Puntaje.puntos.desc()).limit(10).all()
    return jsonify([p.to_dict() for p in puntajes]), 200

@ranking_bp.route('/puntajes', methods=['POST'])
@jwt_required()
def crear_puntaje():
    from flask import request
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

@ranking_bp.route('/historial', methods=['GET'])
@jwt_required()
def get_historial():
    usuario_id = get_jwt_identity()
    historial = Historial.query.filter_by(usuario_id=usuario_id).order_by(Historial.fecha.desc()).limit(20).all()
    return jsonify([h.to_dict() for h in historial]), 200