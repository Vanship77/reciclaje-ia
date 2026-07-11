import api from './axiosConfig';

# TODO: Implementar funciones de la API
# - login(email, password)
# - registro(userData)
# - getRanking()
# - getPuntajes()
# - getUsuarios()
# - actualizarUsuario(id, data)
# - eliminarUsuario(id)
# - clasificarImagen(formData)
# - getHistorial()

export const login = (email, password) => {
  # TODO: Llamar a POST /api/login
  return api.post('/api/login', { email, password });
};

export const registro = (userData) => {
  # TODO: Llamar a POST /api/registro
  return api.post('/api/registro', userData);
};

export const getRanking = () => {
  # TODO: Llamar a GET /api/ranking
  return api.get('/api/ranking');
};

export const getPuntajes = () => {
  # TODO: Llamar a GET /api/puntajes
  return api.get('/api/puntajes');
};

export const getUsuarios = () => {
  # TODO: Llamar a GET /api/usuarios
  return api.get('/api/usuarios');
};

export const actualizarUsuario = (id, data) => {
  # TODO: Llamar a PUT /api/usuarios/{id}
  return api.put(/api/usuarios/, data);
};

export const eliminarUsuario = (id) => {
  # TODO: Llamar a DELETE /api/usuarios/{id}
  return api.delete(/api/usuarios/);
};

export const clasificarImagen = (formData) => {
  # TODO: Llamar a POST /api/clasificar_webcam
  return api.post('/api/clasificar_webcam', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getHistorial = () => {
  # TODO: Llamar a GET /api/historial
  return api.get('/api/historial');
};
