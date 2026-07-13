import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPuntajes } from '../../api/authApi';
import Estadisticas from './Estadisticas';
import Ranking from './Ranking';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [puntaje, setPuntaje] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerPuntaje = async () => {
      try {
        const response = await getPuntajes();
        if (response.data) {
          const usuarioPuntaje = response.data.find(u => u.id === user?.id);
          setPuntaje(usuarioPuntaje?.puntaje_total || 0);
        }
      } catch (err) {
        console.error('Error al obtener puntaje:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      obtenerPuntaje();
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card dark:bg-dark-card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bienvenido</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {user?.nombre || user?.email}
          </p>
        </div>
        <div className="card dark:bg-dark-card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Puntaje Total</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            {puntaje} pts
          </p>
        </div>
        <div className="card dark:bg-dark-card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rol</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card dark:bg-dark-card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📊 Estadísticas</h3>
          <Estadisticas />
        </div>
        <div className="card dark:bg-dark-card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🏆 Top Recicladores</h3>
          <Ranking />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;