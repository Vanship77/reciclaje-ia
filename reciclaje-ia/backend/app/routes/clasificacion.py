from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import db, Historial
from app.services.clasificador import ClasificadorService
import base64
import cv2
import numpy as np

clasificacion_bp = Blueprint('clasificacion', __name__, url_prefix='/api')
clasificador = ClasificadorService()

@clasificacion_bp.route('/clasificar_webcam', methods=['POST'])
@jwt_required()
def clasificar_webcam():
    try:
        usuario_id = get_jwt_identity()
        print(f"📥 Usuario {usuario_id} clasificando imagen...")
        
        # Verificar si es FormData o JSON
        if request.files:
            # Si viene como archivo (FormData)
            file = request.files['imagen']
            imagen_bytes = file.read()
            nparr = np.frombuffer(imagen_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        else:
            # Si viene como Base64 (JSON)
            data = request.get_json()
            if not data or 'imagen' not in data:
                return jsonify({'error': 'No se proporcionó imagen'}), 400
            
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
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500