import React, { useState, useEffect } from 'react';
import { getHistorial } from '../../api/authApi';
import { CLASES_RESIDUOS } from '../../utils/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Estadisticas = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getColor = (clase) => {
    return CLASES_RESIDUOS[clase]?.color || '#9CA3AF';
  };

  const getNombre = (clase) => {
    return CLASES_RESIDUOS[clase]?.nombre || clase;
  };

  const getIcono = (clase) => {
    return CLASES_RESIDUOS[clase]?.icono || '♻️';
  };

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const response = await getHistorial();
        setHistorial(response.data || []);
      } catch (err) {
        console.error('Error al obtener historial:', err);
        setError('No se pudo cargar el historial de reciclaje');
      } finally {
        setLoading(false);
      }
    };
    obtenerHistorial();
  }, []);

  const clasesCount = historial.reduce((acc, item) => {
    acc[item.clase] = (acc[item.clase] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(clasesCount).map(([clase, count]) => ({
    clase: clase,
    nombre: getNombre(clase),
    icono: getIcono(clase),
    count: count,
    color: getColor(clase),
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 dark:text-gray-500 font-medium animate-pulse">
        Cargando gráfica de reciclaje...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 rounded-lg">
        ⚠️ {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
        Aún no tienes clasificaciones. ¡Empieza a reciclar!
      </div>
    );
  }

  return (
    <div className="w-full h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.3} />
          
          <XAxis 
            dataKey="nombre" 
            tick={{ fill: '#6B7280', fontSize: 14, fontWeight: 500 }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={{ stroke: '#D1D5DB' }}
          />
          
          <YAxis 
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={{ stroke: '#D1D5DB' }}
          />
          
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
              color: '#1F2937'
            }}
            formatter={(value, name, props) => {
              const item = data.find(d => d.count === value);
              return [`${value} objetos`, `${item?.icono || ''} ${item?.nombre || ''}`];
            }}
          />
          
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value, entry) => {
              const item = data.find(d => d.nombre === value);
              return `${item?.icono || ''} ${value}`;
            }}
          />
          
          <Bar dataKey="count" name="Objetos Reciclados" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Estadisticas;