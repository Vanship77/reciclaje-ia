import api from './axiosConfig';

export const login = (email, password) => {
  return api.post('/api/login', { email, password });
};

export const registro = (userData) => {
  return api.post('/api/registro', userData);
};

export const getRanking = () => {
  return api.get('/api/ranking');
};

export const getPuntajes = () => {
  return api.get('/api/puntajes');
};

export const getUsuarios = () => {
  return api.get('/api/usuarios');
};

export const actualizarUsuario = (id, data) => {
  return api.put(`/api/usuarios/${id}`, data);
};

export const eliminarUsuario = (id) => {
  return api.delete(`/api/usuarios/${id}`);
};

export const clasificarImagen = (formData) => {
  return api.post('/api/clasificar_webcam', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getHistorial = () => {
  return api.get('/api/historial');
};