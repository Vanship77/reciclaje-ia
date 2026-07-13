import React, { useState, useEffect } from 'react';
import { getUsuarios, actualizarUsuario, eliminarUsuario } from '../../api/authApi';
import LoadingSpinner from '../common/LoadingSpinner';

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa. Inicia sesión nuevamente.');
        setLoading(false);
        return;
      }
      const response = await getUsuarios();
      setUsuarios(response.data || []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      if (err.response?.status === 422) {
        setError('Token inválido o expirado. Inicia sesión nuevamente.');
      } else if (err.response?.status === 403) {
        setError('No tienes permisos de administrador.');
      } else {
        setError(err.response?.data?.error || err.message || 'Error al cargar usuarios');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (usuario) => {
    setEditando(usuario);
  };

  const handleGuardar = async () => {
    if (!editando) return;
    setLoading(true);
    try {
      await actualizarUsuario(editando.id, { 
        rol: editando.rol, 
        puntaje_total: editando.puntaje_total 
      });
      await cargarUsuarios();
      setEditando(null);
    } catch (err) {
      setError('Error al actualizar usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    setLoading(true);
    try {
      await eliminarUsuario(id);
      await cargarUsuarios();
    } catch (err) {
      setError('Error al eliminar usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Verificar token al cargar
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="card dark:bg-dark-card">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <p className="font-semibold">❌ {error}</p>
          {error.includes('token') || error.includes('sesión') ? (
            <button 
              onClick={() => window.location.href = '/login'}
              className="mt-2 btn-primary text-sm"
            >
              Ir a Iniciar Sesión
            </button>
          ) : (
            <button 
              onClick={cargarUsuarios}
              className="mt-2 btn-primary text-sm"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="card dark:bg-dark-card">
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No hay usuarios registrados
        </p>
      </div>
    );
  }

  return (
    <div className="card dark:bg-dark-card overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Lista de Usuarios</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Total: {usuarios.length}</span>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cédula</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Puntaje</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editando?.id === usuario.id ? (
                  <input
                    type="text"
                    value={editando.nombre}
                    onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                    className="input-field text-sm"
                  />
                ) : (
                  <span className="font-medium text-gray-900 dark:text-white">{usuario.nombre}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{usuario.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{usuario.cedula}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editando?.id === usuario.id ? (
                  <select
                    value={editando.rol}
                    onChange={(e) => setEditando({ ...editando, rol: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    usuario.rol === 'admin' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {usuario.rol === 'admin' ? 'Admin' : 'Usuario'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editando?.id === usuario.id ? (
                  <input
                    type="number"
                    value={editando.puntaje_total}
                    onChange={(e) => setEditando({ ...editando, puntaje_total: parseInt(e.target.value) || 0 })}
                    className="input-field text-sm w-20"
                  />
                ) : (
                  <span className="font-semibold text-green-600 dark:text-green-400">{usuario.puntaje_total} pts</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                {editando?.id === usuario.id ? (
                  <>
                    <button onClick={handleGuardar} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm">
                      💾 Guardar
                    </button>
                    <button onClick={() => setEditando(null)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                      ❌ Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditar(usuario)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                      ✏️ Editar
                    </button>
                    <button onClick={() => handleEliminar(usuario.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm">
                      🗑️ Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;