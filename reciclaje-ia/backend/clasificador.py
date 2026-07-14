import cv2
import numpy as np
import tensorflow as tf
import json
import os

class ClasificadorService:
    def __init__(self):
        print("="*60)
        print("🌿 INICIANDO ECOCLASIFICADOR IA")
        print("="*60)
        
        self.modelo = None
        self.clases = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
        self.input_size = (224, 224)
        self.modo_demo = False
        self.entrenando = False
        self.progreso_entrenamiento = 0
        
        self.modelo_path = os.getenv('MODELO_PATH', 'modelo/modelo_trashnet.h5')
        self.clases_path = os.getenv('CLASES_PATH', 'modelo/clases.json')
        self.dataset_path = os.getenv('DATASET_PATH', 'dataset/trashnet')
        
        os.makedirs('modelo', exist_ok=True)
        os.makedirs('dataset', exist_ok=True)
        
        self.cargar_modelo()
        print("="*60)
    
    def cargar_modelo(self):
        try:
            if os.path.exists(self.modelo_path):
                print(f"📥 Cargando modelo desde: {self.modelo_path}")
                self.modelo = tf.keras.models.load_model(self.modelo_path)
                
                if os.path.exists(self.clases_path):
                    with open(self.clases_path, 'r') as f:
                        self.clases = json.load(f)
                
                self.modo_demo = False
                print(f"✅ Modelo cargado exitosamente")
                print(f"📋 Clases: {self.clases}")
                return True
            else:
                print("⚠️ Modelo no encontrado - Modo DEMO activado")
                self.modo_demo = True
                self.crear_modelo_demo()
                return False
        except Exception as e:
            print(f"❌ Error cargando modelo: {e}")
            self.modo_demo = True
            self.crear_modelo_demo()
            return False
    
    def crear_modelo_demo(self):
        self.modelo = tf.keras.Sequential([
            tf.keras.layers.Input(shape=(224, 224, 3)),
            tf.keras.layers.Conv2D(32, 3, activation='relu', padding='same'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu', padding='same'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(128, 3, activation='relu', padding='same'),
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(6, activation='softmax')
        ])
        self.modelo.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    def preprocesar(self, imagen):
        if imagen is None:
            return None
        imagen = cv2.resize(imagen, self.input_size)
        if len(imagen.shape) == 3 and imagen.shape[2] == 3:
            imagen = cv2.cvtColor(imagen, cv2.COLOR_BGR2RGB)
        imagen = np.array(imagen, dtype=np.float32) / 255.0
        return np.expand_dims(imagen, axis=0)
    
    def clasificar(self, imagen):
        try:
            tensor = self.preprocesar(imagen)
            if tensor is None or self.modo_demo or self.modelo is None:
                return self._respuesta_demo()
            
            probabilidades = self.modelo.predict(tensor, verbose=0)[0]
            indice = int(np.argmax(probabilidades))
            confianza = float(probabilidades[indice])
            
            if confianza < 0.3:
                return self._respuesta_demo()
            
            ranking = []
            for i in np.argsort(probabilidades)[::-1][:3]:
                ranking.append({
                    'clase': self.clases[i] if i < len(self.clases) else f'clase_{i}',
                    'confianza': float(probabilidades[i])
                })
            
            return {
                'clase': self.clases[indice] if indice < len(self.clases) else 'desconocido',
                'indice': indice,
                'confianza': confianza,
                'ranking': ranking,
                'modo_demo': False
            }
        except Exception as e:
            print(f"❌ Error en clasificación: {e}")
            return self._respuesta_demo()
    
    def _respuesta_demo(self):
        return {
            'clase': 'plastic',
            'indice': 4,
            'confianza': 0.85,
            'ranking': [
                {'clase': 'plastic', 'confianza': 0.85},
                {'clase': 'glass', 'confianza': 0.08},
                {'clase': 'metal', 'confianza': 0.07}
            ],
            'modo_demo': True
        }
    
    def entrenar_modelo(self, dataset_path=None):
        if self.entrenando:
            return {'error': 'Ya hay un entrenamiento en progreso'}
        
        try:
            self.entrenando = True
            self.progreso_entrenamiento = 0
            
            if dataset_path is None:
                dataset_path = self.dataset_path
            
            if not os.path.exists(dataset_path):
                return {
                    'error': f'Dataset no encontrado en {dataset_path}',
                    'sugerencia': 'Descarga TrashNet de Kaggle y colócalo en dataset/trashnet/'
                }
            
            from tensorflow.keras.preprocessing.image import ImageDataGenerator
            
            datagen = ImageDataGenerator(
                rescale=1./255,
                rotation_range=20,
                width_shift_range=0.2,
                height_shift_range=0.2,
                shear_range=0.2,
                zoom_range=0.2,
                horizontal_flip=True,
                validation_split=0.2
            )
            
            train_generator = datagen.flow_from_directory(
                dataset_path,
                target_size=self.input_size,
                batch_size=32,
                class_mode='categorical',
                subset='training'
            )
            
            validation_generator = datagen.flow_from_directory(
                dataset_path,
                target_size=self.input_size,
                batch_size=32,
                class_mode='categorical',
                subset='validation'
            )
            
            self.clases = list(train_generator.class_indices.keys())
            with open(self.clases_path, 'w') as f:
                json.dump(self.clases, f)
            
            self.progreso_entrenamiento = 30
            
            base_model = tf.keras.applications.EfficientNetB0(
                input_shape=(224, 224, 3),
                include_top=False,
                weights='imagenet'
            )
            base_model.trainable = False
            
            model = tf.keras.Sequential([
                base_model,
                tf.keras.layers.GlobalAveragePooling2D(),
                tf.keras.layers.Dense(128, activation='relu'),
                tf.keras.layers.Dropout(0.5),
                tf.keras.layers.Dense(len(self.clases), activation='softmax')
            ])
            
            model.compile(
                optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                loss='categorical_crossentropy',
                metrics=['accuracy']
            )
            
            self.progreso_entrenamiento = 40
            
            epochs = 10
            steps_per_epoch = train_generator.samples // train_generator.batch_size
            validation_steps = validation_generator.samples // validation_generator.batch_size
            
            for epoch in range(epochs):
                print(f"Epoch {epoch+1}/{epochs}")
                history = model.fit(
                    train_generator,
                    steps_per_epoch=steps_per_epoch,
                    epochs=1,
                    validation_data=validation_generator,
                    validation_steps=validation_steps,
                    verbose=1
                )
                self.progreso_entrenamiento = 40 + ((epoch + 1) / epochs) * 50
            
            model.save(self.modelo_path)
            self.modelo = model
            self.modo_demo = False
            self.progreso_entrenamiento = 100
            
            self.entrenando = False
            return {
                'success': True,
                'mensaje': 'Modelo entrenado correctamente',
                'clases': self.clases
            }
        except Exception as e:
            print(f"❌ Error en entrenamiento: {e}")
            self.entrenando = False
            return {'error': str(e), 'success': False}
    
    def get_estado(self):
        return {
            'modo_demo': self.modo_demo,
            'entrenando': self.entrenando,
            'progreso': self.progreso_entrenamiento,
            'clases': self.clases,
            'modelo_cargado': self.modelo is not None,
            'ruta_modelo': self.modelo_path
        }