from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/registro', methods=['POST'])
def registro():
    # TODO: Implementar registro
    return jsonify({'mensaje': 'Registro pendiente'}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    # TODO: Implementar login
    return jsonify({'mensaje': 'Login pendiente'}), 200
