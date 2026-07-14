import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing import image
import os
import json
from PIL import Image

class ClasificadorService:
    def __init__(self):
        print("="*60)
        print("🌿 INICIANDO ECOCLASIFICADOR IA")
        print("="*60)
        
        # === CONFIGURACIÓN DESDE TU PROYECTO FUNCIONAL ===
        self.CLASES = ['glass', 'metal', 'plastic', 'paper', 'cardboard', 'trash']
        self.CLASES_ES = {
            'glass': 'vidrio',
            'metal': 'lata', 
            'plastic': 'plastico',
            'paper': 'papel',
            'cardboard': 'carton',
            'trash': 'basura'
        }
        self.CLASES_DISPLAY = {
            'glass': 'VIDRIO',
            'metal': 'LATA',
            'plastic': 'PLÁSTICO',
            'paper': 'PAPEL',
            'cardboard': 'CARTÓN',
            'trash': 'BASURA'
        }
        self.COLORES = {
            'glass': '#2ecc71',
            'metal': '#e74c3c',
            'plastic': '#3498db',
            'paper': '#f39c12',
            'cardboard': '#8e44ad',
            'trash': '#7f8c8d'
        }
        self.ICONOS = {
            'glass': '🍾',
            'metal': '🥫',
            'plastic': '🥤',
            'paper': '📄',
            'cardboard': '📦',
            'trash': '🗑️'
        }
        
        self.tamano_imagen = (224, 224)
        self.umbral_confianza = 0.75
        self.modo_demo = False
        self.modelo = None
        
        # Rutas de modelo
        self.rutas_modelo = [
            'modelo/modelo_trashnet.keras',
            'modelo_residuos.keras',
            'modelos_guardados/clasificador_efficientnet.keras'
        ]
        
        self.cargar_modelo()
        print("="*60)
    
    def cargar_modelo(self):
        """Carga el modelo EfficientNet entrenado"""
        for ruta in self.rutas_modelo:
            if os.path.exists(ruta):
                try:
                    print(f"📥 Cargando modelo desde: {ruta}")
                    self.modelo = tf.keras.models.load_model(ruta)
                    print(f"✅ Modelo cargado exitosamente")
                    print(f"📋 Clases: {self.CLASES}")
                    self.modo_demo = False
                    return True
                except Exception as e:
                    print(f"⚠️ Error cargando {ruta}: {e}")
        
        print("⚠️ Modelo no encontrado - Modo DEMO activado")
        self.modo_demo = True
        self.modelo = None
        return False
    
    def preprocesar_imagen(self, imagen):
        """Preprocesa la imagen para EfficientNet"""
        if imagen is None:
            return None
        
        # Si es numpy array (OpenCV), convertir a PIL
        if isinstance(imagen, np.ndarray):
            imagen = Image.fromarray(cv2.cvtColor(imagen, cv2.COLOR_BGR2RGB))
        
        # Redimensionar
        img = imagen.resize(self.tamano_imagen)
        img_array = np.array(img, dtype=np.float32)
        img_array = preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    def clasificar(self, imagen):
        """Clasifica una imagen usando el modelo entrenado"""
        try:
            if self.modo_demo or self.modelo is None:
                return self._respuesta_demo()
            
            # Preprocesar
            tensor = self.preprocesar_imagen(imagen)
            if tensor is None:
                return self._respuesta_demo()
            
            # Predecir
            prediccion = self.modelo.predict(tensor, verbose=0)
            indice = np.argmax(prediccion[0])
            confianza = float(prediccion[0][indice])
            clase = self.CLASES[indice]
            
            # Verificar umbral
            if confianza < self.umbral_confianza:
                return {
                    'clase': 'desconocido',
                    'clase_display': 'DESCONOCIDO',
                    'clase_es': 'desconocido',
                    'confianza': confianza * 100,
                    'modo_demo': False,
                    'probabilidades': self._get_probabilidades(prediccion[0])
                }
            
            # Crear ranking
            ranking = []
            indices_ordenados = np.argsort(prediccion[0])[::-1]
            for i in indices_ordenados[:3]:
                clase_i = self.CLASES[i]
                ranking.append({
                    'clase': clase_i,
                    'clase_display': self.CLASES_DISPLAY.get(clase_i, clase_i.upper()),
                    'clase_es': self.CLASES_ES.get(clase_i, clase_i),
                    'icono': self.ICONOS.get(clase_i, '♻️'),
                    'color': self.COLORES.get(clase_i, '#95a5a6'),
                    'confianza': float(prediccion[0][i]) * 100
                })
            
            return {
                'clase': clase,
                'clase_display': self.CLASES_DISPLAY.get(clase, clase.upper()),
                'clase_es': self.CLASES_ES.get(clase, clase),
                'icono': self.ICONOS.get(clase, '♻️'),
                'color': self.COLORES.get(clase, '#95a5a6'),
                'confianza': confianza * 100,
                'ranking': ranking,
                'modo_demo': False,
                'probabilidades': self._get_probabilidades(prediccion[0])
            }
            
        except Exception as e:
            print(f"❌ Error en clasificación: {e}")
            return self._respuesta_demo()
    
    def _get_probabilidades(self, prediccion):
        """Obtiene las probabilidades para todas las clases"""
        return {
            self.CLASES[i]: float(prediccion[i]) * 100
            for i in range(len(self.CLASES))
        }
    
    def _respuesta_demo(self):
        """Respuesta para modo demo"""
        return {
            'clase': 'plastic',
            'clase_display': 'PLÁSTICO',
            'clase_es': 'plastico',
            'icono': '🥤',
            'color': '#3498db',
            'confianza': 85.0,
            'ranking': [
                {
                    'clase': 'plastic',
                    'clase_display': 'PLÁSTICO',
                    'clase_es': 'plastico',
                    'icono': '🥤',
                    'color': '#3498db',
                    'confianza': 85.0
                },
                {
                    'clase': 'glass',
                    'clase_display': 'VIDRIO',
                    'clase_es': 'vidrio',
                    'icono': '🍾',
                    'color': '#2ecc71',
                    'confianza': 8.0
                },
                {
                    'clase': 'metal',
                    'clase_display': 'LATA',
                    'clase_es': 'lata',
                    'icono': '🥫',
                    'color': '#e74c3c',
                    'confianza': 7.0
                }
            ],
            'modo_demo': True
        }
    
    def entrenar_modelo(self, dataset_path=None):
        """Entrena el modelo - usa el script externo"""
        return {
            'success': False,
            'mensaje': 'Usa el script entrenar_modelo.py para entrenar'
        }
    
    def get_estado(self):
        """Obtiene el estado actual del clasificador"""
        return {
            'modo_demo': self.modo_demo,
            'modelo_cargado': self.modelo is not None,
            'clases': self.CLASES,
            'clases_es': self.CLASES_ES,
            'umbral_confianza': self.umbral_confianza,
            'tamano_imagen': self.tamano_imagen
        }