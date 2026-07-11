from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api')

@admin_bp.route('/usuarios', methods=['GET'])
@jwt_required()
def listar_usuarios():
    # TODO: Implementar listado de usuarios
    return jsonify({'mensaje': 'Listado pendiente'}), 200
