# fix_model.py
import tensorflow as tf

# Cargar el modelo
modelo = tf.keras.models.load_model('modelo/modelo_trashnet.keras')

# Guardar en formato antiguo (sin compilar)
modelo.save('modelo_fijo.keras', save_format='keras')

# También guardar como SavedModel
modelo.save('modelo_fijo', save_format='tf')

print("✅ Modelo guardado en formato antiguo")