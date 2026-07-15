// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRanking, getHistorial, getPuntajes } from '../api/authApi';
import { FaUser, FaStar, FaRecycle, FaTrophy, FaHistory, FaChartBar } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [puntajes, setPuntajes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rankingRes, historialRes, puntajesRes] = await Promise.all([
          getRanking(),
          getHistorial(),
          getPuntajes()
        ]);
        setRanking(rankingRes.data || []);
        setHistorial(historialRes.data || []);
        setPuntajes(puntajesRes.data || {});
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPuntosPorMaterial = (material) => {
    const mapa = {
      'plastico': '🥤',
      'vidrio': '🍾',
      'lata': '🥫',
      'papel': '📄',
      'carton': '📦',
      'basura': '🗑️'
    };
    return mapa[material] || '♻️';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">
          <FaChartBar className="inline text-green-400 mr-2" />
          Dashboard
        </h1>
        <div className="flex items-center gap-4 text-white">
          <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
            <FaUser /> {user?.nombre}
          </span>
          <span className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
            <FaStar className="text-yellow-400" /> {user?.puntos || 0} pts
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <FaTrophy className="text-yellow-400 text-2xl" />
            <div>
              <div className="text-sm opacity-70">Tu posición</div>
              <div className="text-2xl font-bold">
                #{ranking.findIndex(r => r.nombre === user?.nombre) + 1 || '—'}
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <FaRecycle className="text-green-400 text-2xl" />
            <div>
              <div className="text-sm opacity-70">Total reciclajes</div>
              <div className="text-2xl font-bold">{historial.length}</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-400 text-2xl" />
            <div>
              <div className="text-sm opacity-70">Puntos totales</div>
              <div className="text-2xl font-bold">{user?.puntos || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Puntajes por material */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          <FaStar className="inline text-yellow-400 mr-2" />
          Puntajes por material
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(puntajes).map(([material, puntos]) => (
            <div key={material} className="bg-white/5 rounded-lg p-3 text-center text-white">
              <div className="text-2xl">{getPuntosPorMaterial(material)}</div>
              <div className="text-sm capitalize">{material}</div>
              <div className="font-bold text-green-400">+{puntos} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          <FaTrophy className="inline text-yellow-400 mr-2" />
          Ranking Global
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="text-gray-400">Cargando ranking...</div>
          ) : ranking.length === 0 ? (
            <div className="text-gray-400">No hay reciclajes aún</div>
          ) : (
            ranking.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.nombre === user?.nombre
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                  </span>
                  <span className="text-white">{item.nombre}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">♻️ {item.reciclajes || 0}</span>
                  <span className="font-bold text-yellow-400">⭐ {item.puntos || 0}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Historial */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          <FaHistory className="inline text-green-400 mr-2" />
          Últimas clasificaciones
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="text-gray-400">Cargando historial...</div>
          ) : historial.length === 0 ? (
            <div className="text-gray-400">No hay clasificaciones aún</div>
          ) : (
            historial.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPuntosPorMaterial(item.material)}</span>
                  <span className="text-white capitalize">{item.material}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {(item.confianza || 0).toFixed(1)}%
                  </span>
                  <span className="font-bold text-green-400">+{item.puntos || 0} pts</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;