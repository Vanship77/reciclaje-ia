from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    CORS(app)
    jwt.init_app(app)
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
    
    from app.routes.auth import auth_bp
    from app.routes.clasificacion import clasificacion_bp
    from app.routes.ranking import ranking_bp
    from app.routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(clasificacion_bp)
    app.register_blueprint(ranking_bp)
    app.register_blueprint(admin_bp)
    
    @app.route('/health')
    def health():
        return jsonify({'estado': 'OK'}), 200
    
    return app
