import React, { useState, useEffect } from 'react';
import { getRanking } from '../../api/authApi';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerRanking = async () => {
      try {
        const response = await getRanking();
        setRanking(response.data || []);
      } catch (err) {
        console.error('Error al obtener ranking:', err);
        setError('No se pudo cargar el ranking de usuarios');
      } finally {
        setLoading(false);
      }
    };
    obtenerRanking();
  }, []);

  const obtenerMedalla = (posicion) => {
    switch (posicion) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">#{posicion + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-400 dark:text-gray-500 font-medium animate-pulse">
        Cargando top recicladores...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4 text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg">
        ⚠️ {error}
      </div>
    );
  }

  if (ranking.length === 0) {
    return (
      <div className="flex justify-center items-center p-6 text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
        Aún no hay usuarios en el ranking. ¡Sé el primero!
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {ranking.map((user, index) => (
          <li 
            key={user.id || index} 
            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${index < 3 ? 'bg-yellow-50 dark:bg-yellow-900/30 text-xl' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {obtenerMedalla(index)}
              </div>
              <span className={`font-medium ${index < 3 ? 'text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {user.nombre || `Usuario ${index + 1}`}
              </span>
            </div>
            <div className="font-bold text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform">
              {user.puntaje_total} <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">pts</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ranking;