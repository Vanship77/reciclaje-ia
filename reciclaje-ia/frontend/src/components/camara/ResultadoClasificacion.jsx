import React from 'react';
import { CLASES_RESIDUOS } from '../../utils/constants';

const ResultadoClasificacion = ({ resultado }) => {
  const claseInfo = CLASES_RESIDUOS[resultado.clase];
  const confianza = resultado.confianza * 100;
  
  let nivel = '';
  let color = '';
  if (confianza >= 90) { nivel = 'Excelente'; color = 'text-green-600'; }
  else if (confianza >= 80) { nivel = 'Muy buena'; color = 'text-green-500'; }
  else if (confianza >= 70) { nivel = 'Buena'; color = 'text-yellow-500'; }
  else if (confianza >= 60) { nivel = 'Aceptable'; color = 'text-orange-500'; }
  else { nivel = 'Baja'; color = 'text-red-500'; }

  return (
    <div className="card border-2 border-green-200">
      <div className="flex items-center space-x-4">
        <div className="text-6xl">{claseInfo?.icono || '♻️'}</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">
            {claseInfo?.nombre || resultado.clase_es || resultado.clase}
          </h3>
          <div className="flex items-center space-x-4 mt-1">
            <span className={`font-semibold ${color}`}>
              {nivel} - {confianza.toFixed(1)}%
            </span>
            {resultado.puntaje_obtenido > 0 && (
              <span className="text-green-600 font-bold">
                +{resultado.puntaje_obtenido} pts
              </span>
            )}
          </div>
        </div>
      </div>

      {resultado.ranking && resultado.ranking.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Otras posibilidades:</p>
          <div className="space-y-1">
            {resultado.ranking.slice(1).map((item, index) => (
              <div key={index} className="text-sm text-gray-600">
                {CLASES_RESIDUOS[item.clase]?.icono} {CLASES_RESIDUOS[item.clase]?.nombre || item.clase}: {(item.confianza * 100).toFixed(1)}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultadoClasificacion;