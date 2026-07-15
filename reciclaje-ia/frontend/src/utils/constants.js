// src/utils/constants.js

export const CLASES_RESIDUOS = {
  'plastic': {
    icono: '🥤',
    color: '#3498db',
    nombre: 'Plástico',
    consejo: 'Limpia y aplasta los envases antes de reciclarlos. ¡Puedes ganar puntos extras!'
  },
  'glass': {
    icono: '🍾',
    color: '#2ecc71',
    nombre: 'Vidrio',
    consejo: 'Retira las tapas y etiquetas. El vidrio es 100% reciclable y no pierde calidad.'
  },
  'metal': {
    icono: '🥫',
    color: '#e74c3c',
    nombre: 'Metal',
    consejo: 'Aplasta las latas para ahorrar espacio. El metal se puede reciclar infinitamente.'
  },
  'paper': {
    icono: '📄',
    color: '#f39c12',
    nombre: 'Papel',
    consejo: 'No arrugues el papel. Separa el papel limpio del que tiene residuos de comida.'
  },
  'cardboard': {
    icono: '📦',
    color: '#8e44ad',
    nombre: 'Cartón',
    consejo: 'Desarma y aplana las cajas. El cartón es uno de los materiales más reciclados.'
  },
  'trash': {
    icono: '🗑️',
    color: '#7f8c8d',
    nombre: 'Basura',
    consejo: 'Este material no es reciclable. Asegúrate de desecharlo correctamente.'
  },
  'desconocido': {
    icono: '❓',
    color: '#95a5a6',
    nombre: 'Desconocido',
    consejo: 'No se pudo identificar. Intenta con una imagen más clara.'
  }
};

export const getColorByMaterial = (material) => {
  return CLASES_RESIDUOS[material]?.color || '#95a5a6';
};

export const getConsejoByMaterial = (material) => {
  return CLASES_RESIDUOS[material]?.consejo || 'Recicla correctamente para cuidar el planeta. 🌍';
};

export const getIconoByMaterial = (material) => {
  return CLASES_RESIDUOS[material]?.icono || '♻️';
};

export const MATERIAL_PUNTOS = {
  'plastic': 10,
  'glass': 15,
  'metal': 10,
  'paper': 8,
  'cardboard': 12,
  'trash': 5,
  'desconocido': 0
};