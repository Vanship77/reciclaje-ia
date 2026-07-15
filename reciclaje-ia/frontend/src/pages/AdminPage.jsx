// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsuarios, getEstadisticasAdmin, crearUsuario, eliminarUsuario, actualizarUsuario } from '../api/authApi';
import { FaUsers, FaChartBar, FaUserPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const AdminPage = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCrear, setShowCrear] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', rol: 'usuario' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usuariosRes, statsRes] = await Promise.all([
        getUsuarios(),
        getEstadisticasAdmin()
      ]);
      setUsuarios(usuariosRes.data || []);
      setEstadisticas(statsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async () => {
    try {
      await crearUsuario(formData);
      setFormData({ nombre: '', email: '', password: '', rol: 'usuario' });
      setShowCrear(false);
      fetchData();
    } catch (error) {
      alert('Error al crear usuario');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await eliminarUsuario(id);
      fetchData();
    } catch (error) {
      alert('Error al eliminar usuario');
    }
  };

  const handleActualizar = async (id) => {
    try {
      await actualizarUsuario(id, formData);
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        <FaUsers className="inline text-green-400 mr-2" />
        Panel de Administración
      </h1>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold">{estadisticas.total_usuarios || 0}</div>
            <div className="text-sm opacity-70">Usuarios</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold">{estadisticas.total_clasificaciones || 0}</div>
            <div className="text-sm opacity-70">Reciclajes</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold">{estadisticas.total_puntos || 0}</div>
            <div className="text-sm opacity-70">Puntos totales</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold">{estadisticas.materiales?.length || 0}</div>
            <div className="text-sm opacity-70">Materiales</div>
          </div>
        </div>
      )}

      {/* Botón crear usuario */}
      <button
        onClick={() => setShowCrear(!showCrear)}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        <FaUserPlus /> {showCrear ? 'Cancelar' : 'Crear usuario'}
      </button>

      {/* Formulario crear usuario */}
      {showCrear && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Crear nuevo usuario</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
            <select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            onClick={handleCrear}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            Guardar usuario
          </button>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          <FaUsers className="inline text-green-400 mr-2" />
          Lista de usuarios
        </h3>
        {loading ? (
          <div className="text-gray-400">Cargando...</div>
        ) : usuarios.length === 0 ? (
          <div className="text-gray-400">No hay usuarios</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="text-sm text-gray-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-2 px-3">ID</th>
                  <th className="text-left py-2 px-3">Nombre</th>
                  <th className="text-left py-2 px-3">Email</th>
                  <th className="text-left py-2 px-3">Rol</th>
                  <th className="text-left py-2 px-3">Puntos</th>
                  <th className="text-left py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3">{u.id}</td>
                    <td className="py-2 px-3">
                      {editingId === u.id ? (
                        <input
                          type="text"
                          value={formData.nombre || u.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        />
                      ) : (
                        u.nombre
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {editingId === u.id ? (
                        <input
                          type="email"
                          value={formData.email || u.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        />
                      ) : (
                        u.email
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {editingId === u.id ? (
                        <select
                          value={formData.rol || u.rol}
                          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        >
                          <option value="usuario">Usuario</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs ${u.rol === 'admin' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>
                          {u.rol}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold text-green-400">{u.puntos || 0}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        {editingId === u.id ? (
                          <>
                            <button onClick={() => handleActualizar(u.id)} className="text-green-400 hover:text-green-300">
                              <FaSave />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300">
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingId(u.id); setFormData({ nombre: u.nombre, email: u.email, rol: u.rol }); }} className="text-blue-400 hover:text-blue-300">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleEliminar(u.id)} className="text-red-400 hover:text-red-300">
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;