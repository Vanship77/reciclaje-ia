import cv2
import numpy as np
import tensorflow as tf
import json
import os
from tensorflow.keras.applications.efficientnet import preprocess_input

class ClasificadorService:
    def __init__(self):
        print("="*60)
        print("CARGANDO MODELO DE CLASIFICACIÓN")
        print("="*60)
        
        modelo_path = os.getenv('MODELO_PATH', 'modelo/modelo_residuos.keras')
        clases_path = os.getenv('CLASES_PATH', 'modelo/clases.json')
        
        # Intentar cargar el modelo
        try:
            self.modelo = tf.keras.models.load_model(
                modelo_path,
                custom_objects={'preprocess_input': preprocess_input},
                compile=False
            )
            print(f"✅ Modelo cargado desde: {modelo_path}")
        except Exception as e:
            print(f"⚠️ Error cargando el modelo: {e}")
            print("📌 Usando modo demo (sin modelo real)")
            self.modelo = None
        
        # Cargar clases
        try:
            with open(clases_path, 'r') as f:
                self.clases = json.load(f)
            print(f"✅ Clases cargadas: {self.clases}")
        except:
            self.clases = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
            print("⚠️ Usando clases por defecto")
        
        self.input_size = (224, 224)
        print("="*60)
    
    def preprocesar(self, imagen):
        if imagen is None:
            return None
        imagen = cv2.resize(imagen, self.input_size)
        if len(imagen.shape) == 3 and imagen.shape[2] == 3:
            imagen = cv2.cvtColor(imagen, cv2.COLOR_BGR2RGB)
        imagen = np.array(imagen, dtype=np.float32)
        imagen = np.expand_dims(imagen, axis=0)
        imagen = preprocess_input(imagen)
        return imagen
    
    def clasificar(self, imagen):
        # Modo demo si no hay modelo
        if self.modelo is None:
            return {
                'clase': 'plastic',
                'indice': 4,
                'confianza': 0.95,
                'ranking': [
                    {'clase': 'plastic', 'confianza': 0.95},
                    {'clase': 'glass', 'confianza': 0.03},
                    {'clase': 'metal', 'confianza': 0.02}
                ]
            }
        
        try:
            tensor = self.preprocesar(imagen)
            if tensor is None:
                raise ValueError("Error en el preprocesamiento")
            
            probabilidades = self.modelo.predict(tensor, verbose=0)[0]
            indice = int(np.argmax(probabilidades))
            confianza = float(probabilidades[indice])
            
            ranking = []
            for i in np.argsort(probabilidades)[::-1][:3]:
                ranking.append({
                    'clase': self.clases[i],
                    'confianza': float(probabilidades[i])
                })
            
            return {
                'clase': self.clases[indice],
                'indice': indice,
                'confianza': confianza,
                'ranking': ranking
            }
        except Exception as e:
            print(f"Error en clasificación: {e}")
            return {
                'clase': 'plastic',
                'indice': 4,
                'confianza': 0.50,
                'ranking': [
                    {'clase': 'plastic', 'confianza': 0.50},
                    {'clase': 'glass', 'confianza': 0.25},
                    {'clase': 'metal', 'confianza': 0.25}
                ]
            }