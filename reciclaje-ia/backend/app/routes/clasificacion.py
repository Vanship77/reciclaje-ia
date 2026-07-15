from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import db, Historial
from app.services.clasificador import ClasificadorService
import base64
import cv2
import numpy as np
import os
import tempfile

clasificacion_bp = Blueprint('clasificacion', __name__)
clasificador = ClasificadorService()

@clasificacion_bp.route('/clasificar_webcam', methods=['POST'])
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

@clasificacion_bp.route('/clasificar_archivo', methods=['POST'])
@jwt_required()
def clasificar_archivo():
    try:
        if 'archivo' not in request.files:
            return jsonify({'error': 'No se proporcionó archivo'}), 400
        
        archivo = request.files['archivo']
        if archivo.filename == '':
            return jsonify({'error': 'Archivo vacío'}), 400
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            archivo.save(tmp.name)
            img = cv2.imread(tmp.name)
            os.unlink(tmp.name)
        
        if img is None:
            return jsonify({'error': 'Error al procesar la imagen'}), 400
        
        resultado = clasificador.clasificar(img)
        return jsonify(resultado), 200
        
    except Exception as e:
        print(f"❌ Error en clasificación: {e}")
        return jsonify({'error': str(e)}), 500

@clasificacion_bp.route('/modelo/estado', methods=['GET'])
@jwt_required()
def get_estado_modelo():
    estado = clasificador.get_estado()
    return jsonify(estado), 200

@clasificacion_bp.route('/modelo/entrenar', methods=['POST'])
@jwt_required()
def entrenar_modelo():
    usuario_id = get_jwt_identity()
    from app.models.user import Usuario
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario or usuario.rol != 'admin':
        return jsonify({'error': 'Acceso denegado'}), 403
    
    resultado = clasificador.entrenar_modelo()
    return jsonify(resultado), 200