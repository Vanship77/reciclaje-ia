# Carpeta para el modelo de IA
## EN ESTA CARPETA AGREGAN los siguientes archivos:

1. **modelo_residuos.keras** - Modelo entrenado de TensorFlow/Keras
   - Arquitectura: EfficientNetB0
   - Entrenado con el dataset TrashNet
   - Clasifica 6 tipos de residuos: cardboard, glass, metal, paper, plastic, trash

2. **classes.json** - Archivo con las clases del modelo
   - Lista de las 6 clases en el orden que espera el modelo
   - Ejemplo: ["cardboard", "glass", "metal", "paper", "plastic", "trash"]

## Instrucciones para obtener el modelo:

1. Entrenar el modelo con el dataset TrashNet
2. Guardar el modelo como 'modelo_residuos.keras'
3. Exportar las clases a 'classes.json'

## Estructura esperada:

modelo/
├── modelo_residuos.keras # Modelo entrenado
└── classes.json # Lista de clases
