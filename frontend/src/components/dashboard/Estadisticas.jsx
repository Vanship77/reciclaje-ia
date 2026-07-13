import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';

const Estadisticas = () => {
  const [datosHistorial, setDatosHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Colores para cada tipo de material reciclado
  const COLORES_MATERIALES = {
    Plastico: '#3B82F6', // Azul Tailwind
    Vidrio: '#10B981',   // Verde Tailwind
    Lata: '#F59E0B'      // Ámbar Tailwind
  };

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const respuesta = await fetch('/api/historial');
        
        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el historial de reciclaje');
        }
        
        const data = await respuesta.json();
        
        /* Asumimos que el backend devuelve un arreglo de este tipo:
         [
           { categoria: 'Plastico', cantidad: 45 },
           { categoria: 'Vidrio', cantidad: 20 },
           { categoria: 'Lata', cantidad: 35 }
         ]
        */
        setDatosHistorial(data);
        
      } catch (err) {
        console.error('Error en Estadisticas:', err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerHistorial();
  }, []);

  // Renderizado condicional de estados
  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 font-medium animate-pulse">
        Cargando gráfica de reciclaje...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 font-medium bg-red-50 rounded-lg">
        ⚠️ {error}
      </div>
    );
  }

  if (datosHistorial.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Aún no tienes clasificaciones. ¡Empieza a reciclar!
      </div>
    );
  }

  return (
    <div className="w-full h-72 mt-4">
      {/* ResponsiveContainer asegura que la gráfica se adapte a móviles y escritorio */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={datosHistorial}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          {/* Cuadrícula de fondo ligera */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          
          {/* Ejes X e Y configurados para que sean legibles */}
          <XAxis 
            dataKey="categoria" 
            tick={{ fill: '#6B7280', fontSize: 14, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          
          {/* Tooltip flotante al pasar el mouse por las barras */}
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          {/* Barra principal mapeada a los colores correspondientes */}
          <Bar dataKey="cantidad" name="Objetos Reciclados" radius={[4, 4, 0, 0]}>
            {datosHistorial.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORES_MATERIALES[entry.categoria] || '#9CA3AF'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Estadisticas;