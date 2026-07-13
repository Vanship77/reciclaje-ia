import React, { useState, useEffect } from 'react';

const Ranking = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerRanking = async () => {
      try {
        // Consumiendo el endpoint especificado en tus tareas
        const respuesta = await fetch('/api/ranking');
        
        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el ranking');
        }
        
        const data = await respuesta.json();
        
        /* Asumimos que el backend devuelve un arreglo de máximo 10 usuarios:
         [
           { id: 1, nombre: 'Ana G.', puntaje: 2500 },
           { id: 2, nombre: 'Carlos M.', puntaje: 2100 },
           ...
         ]
        */
        setUsuarios(data);
        
      } catch (err) {
        console.error('Error en Ranking:', err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerRanking();
  }, []);

  // Función auxiliar para renderizar medallas o números
  const obtenerMedalla = (posicion) => {
    switch (posicion) {
      case 0: return '🥇'; // Primer lugar
      case 1: return '🥈'; // Segundo lugar
      case 2: return '🥉'; // Tercer lugar
      default: return <span className="text-gray-500 font-medium text-sm">{posicion + 1}</span>;
    }
  };

  // Renderizado condicional: Carga
  if (cargando) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-400 font-medium animate-pulse">
        Cargando top recicladores...
      </div>
    );
  }

  // Renderizado condicional: Error
  if (error) {
    return (
      <div className="flex justify-center items-center p-4 text-red-500 text-sm bg-red-50 rounded-lg">
        ⚠️ {error}
      </div>
    );
  }

  // Renderizado condicional: Sin datos
  if (usuarios.length === 0) {
    return (
      <div className="flex justify-center items-center p-6 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Aún no hay usuarios en el ranking. ¡Sé el primero!
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {usuarios.map((usuario, index) => (
          <li 
            key={usuario.id || index} 
            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-4">
              {/* Contenedor de la posición / Medalla */}
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${index < 3 ? 'bg-yellow-50 text-xl' : 'bg-gray-100'}`}>
                {obtenerMedalla(index)}
              </div>
              
              {/* Nombre del usuario */}
              <span className={`font-medium ${index < 3 ? 'text-gray-800' : 'text-gray-600'}`}>
                {usuario.nombre || `Usuario ${index + 1}`}
              </span>
            </div>
            
            {/* Puntaje */}
            <div className="font-bold text-green-600 group-hover:scale-105 transition-transform">
              {usuario.puntaje} <span className="text-xs text-gray-400 font-normal">pts</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ranking;