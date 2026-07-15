// src/api/authApi.js - VERSIÓN COMPLETA CON TODAS LAS FUNCIONES
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== INTERCEPTORES ==========
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// AUTENTICACIÓN
// ============================================================

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const registro = async (userData) => {
  try {
    const response = await api.post('/registro', userData);
    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

export const register = registro; // Alias

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return response;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
};

export const getMe = getCurrentUser; // Alias

// ============================================================
// CLASIFICACIÓN - TODAS LAS VARIANTES
// ============================================================

/**
 * Clasificar imagen desde FormData (para archivos)
 */
export const clasificarImagen = async (formData, token = null) => {
  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.post('/clasificar_webcam', formData, { headers });
    return response;
  } catch (error) {
    console.error('Error en clasificarImagen:', error);
    throw error;
  }
};

/**
 * Clasificar imagen desde archivo (FormData)
 */
export const clasificarArchivo = async (formData, token = null) => {
  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.post('/clasificar_archivo', formData, { headers });
    return response;
  } catch (error) {
    console.error('Error en clasificarArchivo:', error);
    throw error;
  }
};

/**
 * Clasificar imagen desde Base64 (para webcam)
 */
export const clasificarWebcam = async (imagenBase64, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.post('/clasificar_webcam', { imagen: imagenBase64 }, { headers });
    return response;
  } catch (error) {
    console.error('Error en clasificarWebcam:', error);
    throw error;
  }
};

// ============================================================
// MODELO - TODAS LAS VARIANTES
// ============================================================

/**
 * Obtener estado del modelo (con token opcional)
 */
export const obtenerEstadoModelo = async (token = null) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.get('/modelo/estado', { headers });
    return response;
  } catch (error) {
    console.error('Error obteniendo estado del modelo:', error);
    throw error;
  }
};

/**
 * Obtener estado del modelo (alias)
 */
export const getEstadoModelo = async () => {
  try {
    const response = await api.get('/modelo/estado');
    return response;
  } catch (error) {
    console.error('Error obteniendo estado del modelo:', error);
    throw error;
  }
};

/**
 * Entrenar el modelo
 */
export const entrenarModelo = async (datasetPath = null) => {
  try {
    const response = await api.post('/modelo/entrenar', { dataset_path: datasetPath });
    return response;
  } catch (error) {
    console.error('Error entrenando modelo:', error);
    throw error;
  }
};

// ============================================================
// HISTORIAL
// ============================================================

export const getHistorial = async () => {
  try {
    const response = await api.get('/historial');
    return response;
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    throw error;
  }
};

export const getHistory = getHistorial; // Alias

// ============================================================
// PUNTAJES Y RANKING
// ============================================================

export const getPuntajes = async () => {
  try {
    const response = await api.get('/puntajes');
    return response;
  } catch (error) {
    console.error('Error obteniendo puntajes:', error);
    throw error;
  }
};

export const getScores = getPuntajes; // Alias

export const getRanking = async () => {
  try {
    const response = await api.get('/ranking');
    return response;
  } catch (error) {
    console.error('Error obteniendo ranking:', error);
    throw error;
  }
};

export const getLeaderboard = getRanking; // Alias

export const crearPuntaje = async (data) => {
  try {
    const response = await api.post('/puntajes', data);
    return response;
  } catch (error) {
    console.error('Error creando puntaje:', error);
    throw error;
  }
};

export const createScore = crearPuntaje; // Alias

// ============================================================
// ADMIN - USUARIOS (TODAS LAS OPERACIONES CRUD)
// ============================================================

export const getUsuarios = async () => {
  try {
    const response = await api.get('/admin/usuarios');
    return response;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

export const getUsers = getUsuarios; // Alias

export const actualizarUsuario = async (usuarioId, data) => {
  try {
    const response = await api.put(`/admin/usuarios/${usuarioId}`, data);
    return response;
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
};

export const updateUser = actualizarUsuario; // Alias

export const eliminarUsuario = async (usuarioId) => {
  try {
    const response = await api.delete(`/admin/usuarios/${usuarioId}`);
    return response;
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
};

export const deleteUser = eliminarUsuario; // Alias

export const cambiarRolUsuario = async (usuarioId, rol) => {
  try {
    const response = await api.patch(`/admin/usuarios/${usuarioId}/rol`, { rol });
    return response;
  } catch (error) {
    console.error('Error cambiando rol:', error);
    throw error;
  }
};

export const changeUserRole = cambiarRolUsuario; // Alias

export const crearUsuario = async (userData) => {
  try {
    const response = await api.post('/admin/usuarios', userData);
    return response;
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
};

export const createUser = crearUsuario; // Alias

// ============================================================
// ADMIN - ESTADÍSTICAS
// ============================================================

export const getEstadisticasAdmin = async () => {
  try {
    const response = await api.get('/admin/estadisticas');
    return response;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
};

export const getAdminStats = getEstadisticasAdmin; // Alias

// ============================================================
// TEST
// ============================================================

export const testApi = async (method = 'GET', data = null) => {
  try {
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await api.get('/test');
        break;
      case 'POST':
        response = await api.post('/test', data);
        break;
      case 'PUT':
        response = await api.put('/test', data);
        break;
      case 'DELETE':
        response = await api.delete('/test');
        break;
      default:
        throw new Error('Método no soportado');
    }
    return response;
  } catch (error) {
    console.error('Error en test:', error);
    throw error;
  }
};

// ============================================================
// EXPORTACIÓN POR DEFECTO
// ============================================================

export default api;