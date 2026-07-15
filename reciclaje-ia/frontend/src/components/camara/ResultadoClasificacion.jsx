import React from 'react';
import { FaDownload, FaShare, FaStar } from 'react-icons/fa';
import { getColorByMaterial, getIconoByMaterial, CLASES_RESIDUOS } from '../../utils/constants';

const ResultadoClasificacion = ({ resultado, onDownload, onShare }) => {
  const { clase, clase_display, clase_es, confianza, puntaje_obtenido, ranking } = resultado;
  const color = getColorByMaterial(clase);
  const icono = getIconoByMaterial(clase);
  const nombre = clase_display || clase_es || clase;

  // Obtener mensaje según confianza
  const getMensajeConfianza = (conf) => {
    if (conf > 0.9) return '🌟 Excelente identificación!';
    if (conf > 0.7) return '👍 Buena identificación.';
    if (conf > 0.5) return '🤔 Identificación aceptable.';
    return '⚠️ Baja confianza. Intenta con otra imagen.';
  };

  return (
    <div className="card dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header con color del material */}
      <div className="p-4" style={{ backgroundColor: `${color}20` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{icono}</span>
            <div>
              <h3 className="text-xl font-bold capitalize">{nombre}</h3>
              <p className="text-sm opacity-75">{CLASES_RESIDUOS[clase]?.nombre || clase}</p>
            </div>
          </div>
          {puntaje_obtenido > 0 && (
            <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full">
              <FaStar className="text-yellow-300" />
              <span className="font-bold">+{puntaje_obtenido}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cuerpo del resultado */}
      <div className="p-4 space-y-4">
        {/* Barra de confianza */}
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Confianza</span>
            <span className="font-semibold">{(confianza * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${confianza * 100}%`,
                backgroundColor: confianza > 0.7 ? '#22c55e' : confianza > 0.5 ? '#eab308' : '#ef4444'
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {getMensajeConfianza(confianza)}
          </p>
        </div>

        {/* Ranking de otras clases */}
        {ranking && ranking.length > 1 && (
          <div className="border-t dark:border-gray-700 pt-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Otras posibilidades:</p>
            <div className="space-y-1">
              {ranking.slice(1, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span>{getIconoByMaterial(item.clase)}</span>
                  <span className="flex-1 capitalize text-gray-600 dark:text-gray-400">
                    {item.clase_display || item.clase_es || item.clase}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(item.confianza * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-3 border-t dark:border-gray-700">
          <button
            onClick={onDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaDownload />
            <span>Descargar</span>
          </button>
          <button
            onClick={onShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <FaShare />
            <span>Compartir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultadoClasificacion;