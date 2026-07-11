import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

# TODO: Configurar Axios
# 1. Crear instancia con baseURL
# 2. Interceptor para añadir token JWT en cada petición
# 3. Interceptor para manejar error 401 (redirigir a login)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

# TODO: Agregar interceptor para token
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = Bearer ;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
