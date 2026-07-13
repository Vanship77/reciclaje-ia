import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import api from '../api/axiosConfig';

const ApiTestPage = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState('verificando');
  const [formData, setFormData] = useState({
    cedula: '1101160032',
    email: 'Florentino@administrador.com',
    nombre: 'Florentino Jimenez',
    password: 'admin123'
  });

  // Verificar token al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTokenStatus('no-token');
    } else {
      setTokenStatus('token-existe');
    }
  }, []);

  const testGet = async () => {
    setLoading(true);
    try {
      const res = await api.get('/health');
      setResponse({ type: 'GET /health', data: res.data });
    } catch (error) {
      setResponse({ type: 'GET /health', error: error.message });
    }
    setLoading(false);
  };

  const testPostRegistro = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/registro', formData);
      setResponse({ type: 'POST /api/registro', data: res.data });
    } catch (error) {
      setResponse({ type: 'POST /api/registro', error: error.response?.data || error.message });
    }
    setLoading(false);
  };

  const testPostLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/login', {
        email: formData.email,
        password: formData.password
      });
      setResponse({ type: 'POST /api/login', data: res.data });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setTokenStatus('token-existe');
        alert('✅ Login exitoso! Token guardado.');
      }
    } catch (error) {
      setResponse({ type: 'POST /api/login', error: error.response?.data || error.message });
    }
    setLoading(false);
  };

  const testGetUsuarios = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setResponse({ type: 'GET /api/usuarios', error: '❌ No hay token. Inicia sesión primero.' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.get('/api/usuarios');
      setResponse({ type: 'GET /api/usuarios', data: res.data });
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response?.status === 401 || error.response?.status === 422) {
        setResponse({ 
          type: 'GET /api/usuarios', 
          error: '❌ Token inválido o expirado. Vuelve a iniciar sesión.' 
        });
        // Opcional: redirigir a login después de unos segundos
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 3000);
      } else {
        setResponse({ type: 'GET /api/usuarios', error: error.response?.data || error.message });
      }
    }
    setLoading(false);
  };

  const testPutUsuario = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setResponse({ type: 'PUT /api/usuarios/1', error: '❌ No hay token. Inicia sesión primero.' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.put('/api/usuarios/1', {
        rol: 'admin',
        puntaje_total: 100
      });
      setResponse({ type: 'PUT /api/usuarios/1', data: res.data });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        setResponse({ 
          type: 'PUT /api/usuarios/1', 
          error: '❌ Token inválido o expirado. Vuelve a iniciar sesión.' 
        });
      } else {
        setResponse({ type: 'PUT /api/usuarios/1', error: error.response?.data || error.message });
      }
    }
    setLoading(false);
  };

  const testDeleteUsuario = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setResponse({ type: 'DELETE /api/usuarios/2', error: '❌ No hay token. Inicia sesión primero.' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.delete('/api/usuarios/2');
      setResponse({ type: 'DELETE /api/usuarios/2', data: res.data });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        setResponse({ 
          type: 'DELETE /api/usuarios/2', 
          error: '❌ Token inválido o expirado. Vuelve a iniciar sesión.' 
        });
      } else {
        setResponse({ type: 'DELETE /api/usuarios/2', error: error.response?.data || error.message });
      }
    }
    setLoading(false);
  };

  // Verificar si el token es válido
  const verificarToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificar token para verificar expiración
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        if (Date.now() >= exp) {
          setResponse({ 
            type: 'Verificación', 
            error: '❌ Token expirado. Inicia sesión nuevamente.' 
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTokenStatus('no-token');
        } else {
          setResponse({ 
            type: 'Verificación', 
            data: { mensaje: '✅ Token válido', expira: new Date(exp).toLocaleString() } 
          });
        }
      } catch (e) {
        setResponse({ 
          type: 'Verificación', 
          error: '❌ Token inválido' 
        });
      }
    } else {
      setResponse({ 
        type: 'Verificación', 
        error: '❌ No hay token guardado' 
      });
    }
  };

  // Limpiar token (cerrar sesión)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTokenStatus('no-token');
    setResponse({ type: 'Logout', data: { mensaje: '✅ Sesión cerrada correctamente' } });
  };

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">🧪 Panel de Pruebas API</h1>
        
        {/* Estado del Token */}
        <div className={`card mb-6 ${tokenStatus === 'token-existe' ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">🔐 Estado del Token</h3>
              <p className={`text-sm ${tokenStatus === 'token-existe' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {tokenStatus === 'token-existe' ? '✅ Token presente' : '❌ No hay token'}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={verificarToken} className="btn-secondary text-sm">
                Verificar Token
              </button>
              <button onClick={logout} className="btn-danger text-sm">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">📝 Datos de Prueba</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cédula</label>
              <input
                type="text"
                value={formData.cedula}
                onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <button onClick={testGet} className="btn-primary text-sm">📡 GET /health</button>
          <button onClick={testPostRegistro} className="btn-primary text-sm">📝 POST /registro</button>
          <button onClick={testPostLogin} className="btn-primary text-sm">🔑 POST /login</button>
          <button onClick={testGetUsuarios} className="btn-primary text-sm">👥 GET /usuarios</button>
          <button onClick={testPutUsuario} className="btn-primary text-sm">✏️ PUT /usuarios/1</button>
          <button onClick={testDeleteUsuario} className="btn-danger text-sm">🗑️ DELETE /usuarios/2</button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        {response && (
          <div className="card dark:bg-dark-card">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">📋 Respuesta</h3>
            <div className={`p-4 rounded-lg overflow-auto max-h-96 ${response.error ? 'bg-red-900/20 border border-red-500' : 'bg-gray-900'}`}>
              <pre className={`text-sm whitespace-pre-wrap ${response.error ? 'text-red-300' : 'text-white'}`}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApiTestPage;