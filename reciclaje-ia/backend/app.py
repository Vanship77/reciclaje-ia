# backend/app.py - API REST para React (CORREGIDO - usando password)
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
import psycopg2
import psycopg2.extras
import hashlib
import time
from datetime import datetime
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'tu_clave_secreta_muy_segura')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt_clave_secreta')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

CORS(app, origins=['http://localhost:5173', 'http://localhost:5174', 'http://localhost:80'])

jwt = JWTManager(app)

DB_CONFIG = {
    'host': 'localhost',
    'database': 'reciclaje_db',
    'user': 'postgres',
    'password': 'vanship77',
    'port': '5432'
}

def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    conn.set_client_encoding('UTF8')
    return conn

# ========== CLASES (6) ==========
CLASSES = ['glass', 'metal', 'plastic', 'paper', 'cardboard', 'trash']

MAPEO = {
    'glass': 'vidrio',
    'metal': 'lata',
    'plastic': 'plastico',
    'paper': 'papel',
    'cardboard': 'carton',
    'trash': 'basura'
}

MAPEO_DISPLAY = {
    'glass': 'VIDRIO',
    'metal': 'LATA',
    'plastic': 'PLÁSTICO',
    'paper': 'PAPEL',
    'cardboard': 'CARTÓN',
    'trash': 'BASURA'
}

ICONOS = {
    'glass': '🍾',
    'metal': '🥫',
    'plastic': '🥤',
    'paper': '📄',
    'cardboard': '📦',
    'trash': '🗑️'
}

COLORES = {
    'glass': '#2ecc71',
    'metal': '#e74c3c',
    'plastic': '#3498db',
    'paper': '#f39c12',
    'cardboard': '#8e44ad',
    'trash': '#7f8c8d'
}

PUNTOS_BASE = {
    'vidrio': 15,
    'lata': 10,
    'plastico': 10,
    'papel': 8,
    'carton': 12,
    'basura': 5
}

def hash_contrasena(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ========== CARGAR MODELO ==========
print("🔄 Cargando modelo EfficientNetB0 (6 clases)...")
rutas_modelo = ['modelo_residuos.keras', 'modelos_guardados/clasificador_efficientnet.keras']
modelo = None
for ruta in rutas_modelo:
    if os.path.exists(ruta):
        try:
            modelo = tf.keras.models.load_model(ruta)
            print(f"✅ Modelo cargado desde: {ruta}")
            print(f"📋 Clases: {CLASSES}")
            break
        except Exception as e:
            print(f"⚠️ Error cargando {ruta}: {e}")

if modelo is None:
    print("❌ No se encontró modelo. Modo DEMO activado.")

def preprocesar_imagen(imagen_cv2):
    img_rgb = cv2.cvtColor(imagen_cv2, cv2.COLOR_BGR2RGB)
    img_resized = cv2.resize(img_rgb, (224, 224))
    img_array = np.array(img_resized, dtype=np.float32)
    img_array = preprocess_input(img_array)
    return np.expand_dims(img_array, axis=0)

def clasificar_imagen(imagen_cv2):
    if modelo is None:
        return {
            'clase': 'plastic',
            'clase_es': 'plastico',
            'clase_display': 'PLÁSTICO',
            'icono': '🥤',
            'color': '#3498db',
            'confianza': 85.0,
            'modo_demo': True,
            'ranking': [
                {'clase': 'plastic', 'clase_es': 'plastico', 'confianza': 85.0},
                {'clase': 'glass', 'clase_es': 'vidrio', 'confianza': 8.0},
                {'clase': 'metal', 'clase_es': 'lata', 'confianza': 7.0}
            ]
        }
    try:
        img_procesada = preprocesar_imagen(imagen_cv2)
        prediccion = modelo.predict(img_procesada, verbose=0)
        clase_idx = np.argmax(prediccion[0])
        confianza = float(prediccion[0][clase_idx]) * 100
        clase = CLASSES[clase_idx]
        
        ranking = []
        for i in np.argsort(prediccion[0])[::-1][:3]:
            clase_i = CLASSES[i]
            ranking.append({
                'clase': clase_i,
                'clase_es': MAPEO.get(clase_i, clase_i),
                'confianza': float(prediccion[0][i]) * 100
            })
        
        if confianza < 50:
            return {
                'clase': 'desconocido',
                'clase_es': 'desconocido',
                'clase_display': 'DESCONOCIDO',
                'icono': '❓',
                'color': '#95a5a6',
                'confianza': confianza,
                'modo_demo': False,
                'ranking': ranking
            }
        
        return {
            'clase': clase,
            'clase_es': MAPEO.get(clase, clase),
            'clase_display': MAPEO_DISPLAY.get(clase, clase.upper()),
            'icono': ICONOS.get(clase, '♻️'),
            'color': COLORES.get(clase, '#95a5a6'),
            'confianza': confianza,
            'modo_demo': False,
            'ranking': ranking
        }
    except Exception as e:
        print(f"❌ Error en clasificación: {e}")
        return {
            'clase': 'plastic',
            'clase_es': 'plastico',
            'clase_display': 'PLÁSTICO',
            'icono': '🥤',
            'color': '#3498db',
            'confianza': 85.0,
            'modo_demo': True,
            'ranking': [
                {'clase': 'plastic', 'clase_es': 'plastico', 'confianza': 85.0},
                {'clase': 'glass', 'clase_es': 'vidrio', 'confianza': 8.0},
                {'clase': 'metal', 'clase_es': 'lata', 'confianza': 7.0}
            ]
        }

# ========== RUTAS ==========

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email y contraseña requeridos'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, nombre, email, password, rol, puntaje_total FROM usuarios WHERE email = %s", (email,))
        usuario = cursor.fetchone()
        conn.close()
        
        if not usuario:
            return jsonify({'error': 'Credenciales incorrectas'}), 401
        
        password_hash = hash_contrasena(password)
        if usuario[3] != password_hash:
            return jsonify({'error': 'Credenciales incorrectas'}), 401
        
        access_token = create_access_token(identity=usuario[0])
        
        return jsonify({
            'token': access_token,
            'usuario': {
                'id': usuario[0],
                'nombre': usuario[1],
                'email': usuario[2],
                'rol': usuario[4],
                'puntos': usuario[5] or 0
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error en login: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/registro', methods=['POST'])
def registro():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        email = data.get('email')
        password = data.get('password')
        cedula = data.get('cedula', '')
        
        if not nombre or not email or not password:
            return jsonify({'error': 'Todos los campos son requeridos'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        password_hash = hash_contrasena(password)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'El email ya está registrado'}), 400
        
        cursor.execute("SELECT id FROM usuarios WHERE cedula = %s", (cedula,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'La cédula ya está registrada'}), 400
        
        # ✅ CORREGIDO: usa 'password' en lugar de 'contrasena'
        cursor.execute("""
            INSERT INTO usuarios (cedula, nombre, email, password, rol, puntaje_total) 
            VALUES (%s, %s, %s, %s, 'usuario', 0) RETURNING id
        """, (cedula, nombre, email, password_hash))
        
        usuario_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        
        return jsonify({
            'mensaje': 'Usuario registrado exitosamente',
            'id': usuario_id
        }), 201
        
    except Exception as e:
        print(f"❌ Error en registro: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    try:
        usuario_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, nombre, email, rol, puntaje_total FROM usuarios WHERE id = %s", (usuario_id,))
        usuario = cursor.fetchone()
        conn.close()
        
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify({
            'id': usuario[0],
            'nombre': usuario[1],
            'email': usuario[2],
            'rol': usuario[3],
            'puntos': usuario[4] or 0
        }), 200
        
    except Exception as e:
        print(f"❌ Error en me: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/clasificar_webcam', methods=['POST'])
@jwt_required()
def clasificar_webcam():
    try:
        usuario_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'imagen' not in data:
            return jsonify({'error': 'No se proporcionó imagen'}), 400
        
        import base64
        imagen_base64 = data['imagen'].split(',')[1] if ',' in data['imagen'] else data['imagen']
        imagen_bytes = base64.b64decode(imagen_base64)
        
        nparr = np.frombuffer(imagen_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Error al procesar la imagen'}), 400
        
        resultado = clasificar_imagen(img)
        
        if resultado['clase'] == 'desconocido':
            return jsonify({'resultado': resultado, 'guardado': False}), 200
        
        tipo_es = resultado['clase_es']
        puntos = PUNTOS_BASE.get(tipo_es, 10)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM tipos_residuo WHERE nombre = %s", (tipo_es,))
        tipo_resultado = cursor.fetchone()
        
        if tipo_resultado:
            tipo_id = tipo_resultado[0]
            cursor.execute("""
                INSERT INTO registros_reciclaje (id_usuario, id_tipo_residuo, puntos_ganados, confianza_ia) 
                VALUES (%s, %s, %s, %s) RETURNING id
            """, (usuario_id, tipo_id, puntos, resultado['confianza'] / 100))
            
            cursor.execute("""
                UPDATE usuarios SET puntaje_total = puntaje_total + %s 
                WHERE id = %s RETURNING puntaje_total
            """, (puntos, usuario_id))
            
            nuevos_puntos = cursor.fetchone()[0]
            conn.commit()
            conn.close()
            
            resultado['puntos'] = puntos
            resultado['puntos_totales'] = nuevos_puntos
        
        return jsonify({'resultado': resultado, 'guardado': True}), 200
        
    except Exception as e:
        print(f"❌ Error en clasificar_webcam: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/historial', methods=['GET'])
@jwt_required()
def get_historial():
    try:
        usuario_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.id, t.nombre, r.puntos_ganados, r.confianza_ia, r.fecha_hora
            FROM registros_reciclaje r
            JOIN tipos_residuo t ON r.id_tipo_residuo = t.id
            WHERE r.id_usuario = %s
            ORDER BY r.fecha_hora DESC
            LIMIT 20
        """, (usuario_id,))
        
        historial = []
        for row in cursor.fetchall():
            historial.append({
                'id': row[0],
                'material': row[1],
                'puntos': row[2],
                'confianza': row[3] * 100 if row[3] else 0,
                'fecha': row[4].isoformat() if row[4] else None
            })
        
        conn.close()
        return jsonify(historial), 200
        
    except Exception as e:
        print(f"❌ Error en historial: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ranking', methods=['GET'])
def get_ranking():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                u.nombre,
                u.puntaje_total as puntos,
                COUNT(r.id) as reciclajes
            FROM usuarios u
            LEFT JOIN registros_reciclaje r ON u.id = r.id_usuario
            WHERE u.rol != 'admin'
            GROUP BY u.id, u.nombre, u.puntaje_total
            ORDER BY u.puntaje_total DESC
            LIMIT 10
        """)
        
        ranking = []
        for i, row in enumerate(cursor.fetchall()):
            ranking.append({
                'posicion': i + 1,
                'nombre': row[0],
                'puntos': row[1] or 0,
                'reciclajes': row[2] or 0
            })
        
        conn.close()
        return jsonify(ranking), 200
        
    except Exception as e:
        print(f"❌ Error en ranking: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/puntajes', methods=['GET'])
def get_puntajes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT nombre, puntos_base FROM tipos_residuo")
        resultados = cursor.fetchall()
        conn.close()
        
        puntajes = {}
        for nombre, puntos in resultados:
            puntajes[nombre] = puntos
        
        return jsonify(puntajes), 200
        
    except Exception as e:
        print(f"❌ Error en puntajes: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/modelo/estado', methods=['GET'])
@jwt_required()
def get_estado_modelo():
    return jsonify({
        'modo_demo': modelo is None,
        'modelo_cargado': modelo is not None,
        'clases': CLASSES,
        'clases_es': MAPEO
    }), 200

@app.route('/api/admin/usuarios', methods=['GET'])
@jwt_required()
def get_usuarios():
    try:
        usuario_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s", (usuario_id,))
        rol = cursor.fetchone()
        
        if not rol or rol[0] != 'admin':
            conn.close()
            return jsonify({'error': 'Acceso denegado'}), 403
        
        cursor.execute("SELECT id, cedula, nombre, email, rol, puntaje_total FROM usuarios WHERE rol != 'admin'")
        usuarios = []
        for row in cursor.fetchall():
            usuarios.append({
                'id': row[0],
                'cedula': row[1],
                'nombre': row[2],
                'email': row[3],
                'rol': row[4],
                'puntos': row[5] or 0
            })
        
        conn.close()
        return jsonify(usuarios), 200
        
    except Exception as e:
        print(f"❌ Error en admin/usuarios: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/estadisticas', methods=['GET'])
@jwt_required()
def get_estadisticas_admin():
    try:
        usuario_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s", (usuario_id,))
        rol = cursor.fetchone()
        
        if not rol or rol[0] != 'admin':
            conn.close()
            return jsonify({'error': 'Acceso denegado'}), 403
        
        cursor.execute("SELECT COUNT(*) FROM usuarios WHERE rol != 'admin'")
        total_usuarios = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM registros_reciclaje")
        total_clasificaciones = cursor.fetchone()[0]
        
        cursor.execute("SELECT SUM(puntos_ganados) FROM registros_reciclaje")
        total_puntos = cursor.fetchone()[0] or 0
        
        cursor.execute("""
            SELECT t.nombre, COUNT(r.id) 
            FROM registros_reciclaje r
            JOIN tipos_residuo t ON r.id_tipo_residuo = t.id
            GROUP BY t.nombre
            ORDER BY COUNT(r.id) DESC
        """)
        materiales = []
        for row in cursor.fetchall():
            materiales.append({
                'nombre': row[0],
                'cantidad': row[1]
            })
        
        conn.close()
        
        return jsonify({
            'total_usuarios': total_usuarios,
            'total_clasificaciones': total_clasificaciones,
            'total_puntos': total_puntos,
            'materiales': materiales
        }), 200
        
    except Exception as e:
        print(f"❌ Error en admin/estadisticas: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET', 'POST', 'PUT', 'DELETE'])
def test():
    if request.method == 'GET':
        return jsonify({'mensaje': 'API funcionando correctamente'}), 200
    elif request.method == 'POST':
        return jsonify({'mensaje': 'POST exitoso', 'data': request.get_json()}), 201
    elif request.method == 'PUT':
        return jsonify({'mensaje': 'PUT exitoso', 'data': request.get_json()}), 200
    elif request.method == 'DELETE':
        return jsonify({'mensaje': 'DELETE exitoso'}), 200

if __name__ == '__main__':
    print("=" * 50)
    print("🌿 ECOCLASIFICADOR IA - API REST")
    print("=" * 50)
    print(f"📋 Clases: {CLASSES}")
    print(f"🚀 Servidor: http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)