import cv2
import numpy as np
import tensorflow as tf
import json
import os

# TODO: Implementar el servicio de clasificación
# 1. Cargar el modelo desde 'modelo/modelo_residuos.keras'
# 2. Cargar las clases desde 'modelo/classes.json'
# 3. Implementar preprocesamiento de imágenes (resize 224x224, normalización)
# 4. Implementar método clasificar() que reciba una imagen y devuelva la predicción

class ClasificadorService:
    def __init__(self):
        # TODO: Inicializar el modelo y las clases
        # self.modelo = tf.keras.models.load_model('modelo/modelo_residuos.keras')
        # with open('modelo/classes.json', 'r') as f:
        #     self.clases = json.load(f)
        pass
    
    def preprocesar(self, imagen):
        # TODO: Preprocesar imagen
        # 1. Redimensionar a (224, 224)
        # 2. Convertir a RGB
        # 3. Normalizar con preprocess_input
        pass
    
    def clasificar(self, imagen):
        # TODO: Clasificar imagen
        # 1. Preprocesar
        # 2. Ejecutar modelo
        # 3. Obtener clase y confianza
        # 4. Devolver resultado
        pass
