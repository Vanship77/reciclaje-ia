// src/pages/ApiTestPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSync, FaSearch, FaRecycle, FaPlay, FaCode, FaDownload } from 'react-icons/fa';

const ApiTestPage = () => {
  const { token, user, isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [respuestaJson, setRespuestaJson] = useState(null);
  const [mostrarJson, setMostrarJson] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('GET');
  
  // Estado para el formulario POST
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cedula: '',
    password: 'admin123',
    rol: 'usuario'
  });
  
  // Estado para PUT (editar)
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({
    nombre: '',
    email: '',
    cedula: '',
    rol: 'usuario',
    puntos: 0
  });

  // Estado para DELETE
  const [eliminarId, setEliminarId] = useState(null);
  const [eliminarNombre, setEliminarNombre] = useState('');

  // ============================================================
  // GET - CARGAR USUARIOS
  // ============================================================
  const cargarUsuarios = async () => {
    if (!isAdmin) {
      setError('⚠️ Solo administradores pueden ver usuarios');
      return;
    }
    
    setCargando(true);
    setError(null);
    setMostrarJson(false);
    
    try {
      const response = await fetch('/api/admin/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 403) {
        setError('❌ Acceso denegado. Solo administradores.');
        setUsuarios([]);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
        setRespuestaJson({
          metodo: 'GET',
          endpoint: '/api/admin/usuarios',
          status: response.status,
          datos: data,
          timestamp: new Date().toISOString()
        });
        setMostrarJson(true);
        setExito('✅ Usuarios cargados correctamente');
        setTimeout(() => setExito(null), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Error al cargar usuarios');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  // ============================================================
  // POST - CREAR USUARIO
  // ============================================================
  const crearUsuario = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('⚠️ Solo administradores pueden crear usuarios');
      return;
    }
    
    setCargando(true);
    setError(null);
    setMostrarJson(false);
    
    try {
      const response = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      setRespuestaJson({
        metodo: 'POST',
        endpoint: '/api/admin/usuarios',
        status: response.status,
        enviado: formData,
        respuesta: data,
        timestamp: new Date().toISOString()
      });
      setMostrarJson(true);
      
      if (response.ok) {
        setExito(`✅ Usuario "${formData.nombre}" creado exitosamente`);
        setFormData({ nombre: '', email: '', cedula: '', password: 'admin123', rol: 'usuario' });
        cargarUsuarios();
        setTimeout(() => setExito(null), 3000);
      } else {
        setError(data.error || 'Error al crear usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  // ============================================================
  // PUT - ACTUALIZAR USUARIO
  // ============================================================
  const actualizarUsuario = async (id) => {
    if (!isAdmin) {
      setError('⚠️ Solo administradores pueden actualizar usuarios');
      return;
    }
    
    setCargando(true);
    setError(null);
    setMostrarJson(false);
    
    try {
      const response = await fetch(`/api/admin/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      
      const data = await response.json();
      
      setRespuestaJson({
        metodo: 'PUT',
        endpoint: `/api/admin/usuarios/${id}`,
        status: response.status,
        enviado: editData,
        respuesta: data,
        timestamp: new Date().toISOString()
      });
      setMostrarJson(true);
      
      if (response.ok) {
        setExito(`✅ Usuario actualizado exitosamente`);
        setEditandoId(null);
        cargarUsuarios();
        setTimeout(() => setExito(null), 3000);
      } else {
        setError(data.error || 'Error al actualizar usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  // ============================================================
  // DELETE - ELIMINAR USUARIO
  // ============================================================
  const eliminarUsuario = async (id, nombre) => {
    if (!isAdmin) {
      setError('⚠️ Solo administradores pueden eliminar usuarios');
      return;
    }
    
    if (!window.confirm(`¿Eliminar usuario "${nombre}"?`)) return;
    
    setCargando(true);
    setError(null);
    setMostrarJson(false);
    
    try {
      const response = await fetch(`/api/admin/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      setRespuestaJson({
        metodo: 'DELETE',
        endpoint: `/api/admin/usuarios/${id}`,
        status: response.status,
        respuesta: data,
        timestamp: new Date().toISOString()
      });
      setMostrarJson(true);
      
      if (response.ok) {
        setExito(`✅ Usuario "${nombre}" eliminado exitosamente`);
        cargarUsuarios();
        setTimeout(() => setExito(null), 3000);
      } else {
        setError(data.error || 'Error al eliminar usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  // ============================================================
  // FUNCIONES AUXILIARES
  // ============================================================
  const iniciarEdicion = (usuario) => {
    setEditandoId(usuario.id);
    setEditData({
      nombre: usuario.nombre,
      email: usuario.email,
      cedula: usuario.cedula || '',
      rol: usuario.rol,
      puntos: usuario.puntos || 0
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditData({ nombre: '', email: '', cedula: '', rol: 'usuario', puntos: 0 });
  };

  const descargarJson = () => {
    if (!respuestaJson) return;
    const blob = new Blob([JSON.stringify(respuestaJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api_response_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const limpiarJson = () => {
    setRespuestaJson(null);
    setMostrarJson(false);
  };

  // ============================================================
  // RENDERIZADO
  // ============================================================
  useEffect(() => {
    if (isAdmin) {
      cargarUsuarios();
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400">Esta página es solo para administradores.</p>
          <p className="text-gray-500 text-sm mt-2">Inicia sesión con una cuenta de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            <FaCode className="inline text-green-400 mr-2" />
            API Test - CRUD
          </h1>
          <p className="text-gray-400 text-sm mt-1">Prueba las operaciones CRUD en formato JSON</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={cargarUsuarios}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <FaSync className={`${cargando ? 'animate-spin' : ''}`} />
            Recargar
          </button>
          {respuestaJson && (
            <>
              <button
                onClick={descargarJson}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <FaDownload /> Descargar JSON
              </button>
              <button
                onClick={limpiarJson}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Limpiar
              </button>
            </>
          )}
        </div>
      </div>

      {/* MENSAJES */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg">
          ❌ {error}
          <button onClick={() => setError(null)} className="float-right">✕</button>
        </div>
      )}
      
      {exito && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-200 p-3 rounded-lg">
          {exito}
          <button onClick={() => setExito(null)} className="float-right">✕</button>
        </div>
      )}

      {/* ============================================================
          SELECTOR DE MÉTODO (GET, POST, PUT, DELETE)
          ============================================================ */}
      <div className="glass-card rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FaPlay className="text-green-400" />
          Selecciona el método a probar
        </h2>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { method: 'GET', color: 'bg-green-500', icon: '📋', desc: 'Listar usuarios' },
            { method: 'POST', color: 'bg-blue-500', icon: '➕', desc: 'Crear usuario' },
            { method: 'PUT', color: 'bg-yellow-500', icon: '✏️', desc: 'Actualizar usuario' },
            { method: 'DELETE', color: 'bg-red-500', icon: '🗑️', desc: 'Eliminar usuario' }
          ].map(({ method, color, icon, desc }) => (
            <button
              key={method}
              onClick={() => setMetodoSeleccionado(method)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-3 ${
                metodoSeleccionado === method
                  ? `${color} text-white shadow-lg`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <div className="text-left">
                <div className="font-bold">{method}</div>
                <div className="text-xs opacity-70">{desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ============================================================
            CONTENIDO SEGÚN MÉTODO SELECCIONADO
            ============================================================ */}
        
        {/* ===== GET ===== */}
        {metodoSeleccionado === 'GET' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-green-400 font-mono">GET /api/admin/usuarios</span>
                <p className="text-gray-400 text-sm mt-1">Obtiene la lista de todos los usuarios</p>
              </div>
              <button
                onClick={cargarUsuarios}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <FaPlay /> Enviar GET
              </button>
            </div>
            
            {/* Tabla de usuarios */}
            {cargando && !usuarios.length ? (
              <div className="text-center text-gray-400 py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4">Cargando usuarios...</p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No hay usuarios registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white text-sm">
                  <thead className="text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="text-left py-2 px-3">ID</th>
                      <th className="text-left py-2 px-3">Nombre</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Cédula</th>
                      <th className="text-left py-2 px-3">Rol</th>
                      <th className="text-left py-2 px-3">Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3">{u.id}</td>
                        <td className="py-2 px-3 font-medium">{u.nombre}</td>
                        <td className="py-2 px-3">{u.email}</td>
                        <td className="py-2 px-3">{u.cedula || '—'}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            u.rol === 'admin' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-bold text-green-400">{u.puntos || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 text-sm text-gray-400">
                  Total: {usuarios.length} usuarios
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== POST ===== */}
        {metodoSeleccionado === 'POST' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-blue-400 font-mono">POST /api/admin/usuarios</span>
                <p className="text-gray-400 text-sm mt-1">Crea un nuevo usuario</p>
              </div>
            </div>
            
            <form onSubmit={crearUsuario} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Nombre *"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Cédula"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                disabled={cargando}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {cargando ? 'Creando...' : '📤 Enviar POST'}
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">
              💡 Contraseña por defecto: <span className="text-yellow-400">admin123</span>
            </p>
          </div>
        )}

        {/* ===== PUT ===== */}
        {metodoSeleccionado === 'PUT' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-yellow-400 font-mono">PUT /api/admin/usuarios/{'{id}'}</span>
                <p className="text-gray-400 text-sm mt-1">Actualiza un usuario existente</p>
              </div>
            </div>
            
            {usuarios.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No hay usuarios para editar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white text-sm">
                  <thead className="text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="text-left py-2 px-3">ID</th>
                      <th className="text-left py-2 px-3">Nombre</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Cédula</th>
                      <th className="text-left py-2 px-3">Rol</th>
                      <th className="text-left py-2 px-3">Puntos</th>
                      <th className="text-left py-2 px-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3">{u.id}</td>
                        <td className="py-2 px-3">
                          {editandoId === u.id ? (
                            <input
                              type="text"
                              value={editData.nombre}
                              onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm w-full"
                            />
                          ) : (
                            u.nombre
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {editandoId === u.id ? (
                            <input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm w-full"
                            />
                          ) : (
                            u.email
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {editandoId === u.id ? (
                            <input
                              type="text"
                              value={editData.cedula}
                              onChange={(e) => setEditData({ ...editData, cedula: e.target.value })}
                              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm w-full"
                            />
                          ) : (
                            u.cedula || '—'
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {editandoId === u.id ? (
                            <select
                              value={editData.rol}
                              onChange={(e) => setEditData({ ...editData, rol: e.target.value })}
                              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                            >
                              <option value="usuario">Usuario</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded text-xs ${
                              u.rol === 'admin' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {u.rol}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {editandoId === u.id ? (
                            <input
                              type="number"
                              value={editData.puntos}
                              onChange={(e) => setEditData({ ...editData, puntos: parseInt(e.target.value) || 0 })}
                              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm w-20"
                            />
                          ) : (
                            <span className="font-bold text-green-400">{u.puntos || 0}</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {editandoId === u.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => actualizarUsuario(u.id)}
                                className="text-green-400 hover:text-green-300 text-sm font-semibold"
                              >
                                💾 Guardar
                              </button>
                              <button
                                onClick={cancelarEdicion}
                                className="text-gray-400 hover:text-gray-300 text-sm font-semibold"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => iniciarEdicion(u)}
                              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold flex items-center gap-1"
                            >
                              ✏️ Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== DELETE ===== */}
        {metodoSeleccionado === 'DELETE' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-red-400 font-mono">DELETE /api/admin/usuarios/{'{id}'}</span>
                <p className="text-gray-400 text-sm mt-1">Elimina un usuario</p>
              </div>
            </div>
            
            {usuarios.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No hay usuarios para eliminar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white text-sm">
                  <thead className="text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="text-left py-2 px-3">ID</th>
                      <th className="text-left py-2 px-3">Nombre</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Rol</th>
                      <th className="text-left py-2 px-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3">{u.id}</td>
                        <td className="py-2 px-3 font-medium">{u.nombre}</td>
                        <td className="py-2 px-3">{u.email}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            u.rol === 'admin' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => eliminarUsuario(u.id, u.nombre)}
                            className="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-1"
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================
          JSON RESPONSE
          ============================================================ */}
      {mostrarJson && respuestaJson && (
        <div className="glass-card rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FaCode className="text-green-400" />
              📦 Respuesta JSON
            </h3>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                respuestaJson.status < 400 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                Status: {respuestaJson.status}
              </span>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                respuestaJson.metodo === 'GET' ? 'bg-green-500/20 text-green-400' :
                respuestaJson.metodo === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                respuestaJson.metodo === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {respuestaJson.metodo}
              </span>
              <button
                onClick={descargarJson}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm font-semibold transition-colors"
              >
                📥 Descargar
              </button>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-sm font-mono text-green-300 whitespace-pre-wrap">
{JSON.stringify(respuestaJson, null, 2)}
            </pre>
          </div>
          
          <div className="mt-3 text-xs text-gray-400 flex justify-between">
            <span>Endpoint: {respuestaJson.endpoint}</span>
            <span>{respuestaJson.timestamp}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestPage;