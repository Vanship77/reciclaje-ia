from flask import Blueprint, jsonify

ranking_bp = Blueprint('ranking', __name__, url_prefix='/api')

@ranking_bp.route('/ranking', methods=['GET'])
def ranking():
    # TODO: Implementar ranking
    return jsonify({'mensaje': 'Ranking pendiente'}), 200
