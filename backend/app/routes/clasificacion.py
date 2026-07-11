from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

clasificacion_bp = Blueprint('clasificacion', __name__, url_prefix='/api')

@clasificacion_bp.route('/clasificar_webcam', methods=['POST'])
@jwt_required()
def clasificar_webcam():
    # TODO: Implementar clasificación
    return jsonify({'mensaje': 'Clasificación pendiente'}), 200
