import cv2
import numpy as np
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User, Clasificacion
from app.services.clasificador import ClasificadorService
from datetime import datetime

clasificacion_bp = Blueprint('clasificacion', __name__, url_prefix='/api')
clasificador = ClasificadorService()

@clasificacion_bp.route('/clasificar_webcam', methods=['POST'])
@jwt_required()
def clasificar_webcam():
    user_id = get_jwt_identity()
    
    if 'imagen' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400
    
    file = request.files['imagen']
    imagen_bytes = file.read()
    nparr = np.frombuffer(imagen_bytes, np.uint8)
    imagen = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if imagen is None:
        return jsonify({'error': 'No se pudo procesar la imagen'}), 400
    
    try:
        resultado = clasificador.clasificar(imagen)
        
        puntaje = 0
        if resultado['confianza'] >= 0.90:
            puntaje = 10
        elif resultado['confianza'] >= 0.80:
            puntaje = 7
        elif resultado['confianza'] >= 0.70:
            puntaje = 5
        elif resultado['confianza'] >= 0.60:
            puntaje = 3
        
        user = User.query.get(user_id)
        if user:
            clasificacion = Clasificacion(
                usuario_id=user_id,
                clase=resultado['clase'],
                confianza=resultado['confianza'],
                puntaje_obtenido=puntaje
            )
            db.session.add(clasificacion)
            user.puntaje_total += puntaje
            user.ultima_clasificacion = datetime.utcnow()
            db.session.commit()
        
        clases_es = {
            'cardboard': 'Cartón',
            'glass': 'Vidrio',
            'metal': 'Metal',
            'paper': 'Papel',
            'plastic': 'Plástico',
            'trash': 'Basura'
        }
        
        return jsonify({
            'clase': resultado['clase'],
            'clase_es': clases_es.get(resultado['clase'], resultado['clase']),
            'confianza': float(resultado['confianza']),
            'puntaje_obtenido': puntaje,
            'ranking': resultado.get('ranking', [])[:3]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@clasificacion_bp.route('/historial', methods=['GET'])
@jwt_required()
def historial():
    user_id = get_jwt_identity()
    clasificaciones = Clasificacion.query.filter_by(usuario_id=user_id).order_by(
        Clasificacion.fecha.desc()
    ).limit(50).all()
    
    return jsonify([{
        'id': c.id,
        'clase': c.clase,
        'confianza': c.confianza,
        'puntaje': c.puntaje_obtenido,
        'fecha': c.fecha.isoformat()
    } for c in clasificaciones])