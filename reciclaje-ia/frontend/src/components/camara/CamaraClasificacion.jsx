import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCamara } from '../../hooks/useCamara';
import { clasificarImagen } from '../../api/authApi';
import { CLASES_RESIDUOS } from '../../utils/constants';
import ResultadoClasificacion from './ResultadoClasificacion';

const CamaraClasificacion = () => {
  const { user } = useAuth();
  const { videoRef, canvasRef, isActive, error: camError, iniciar, detener, capturar } = useCamara();
  const [clasificando, setClasificando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);

  const handleClasificar = async () => {
    const blob = await capturar();
    if (!blob) {
      setError('No se pudo capturar la imagen');
      return;
    }

    setClasificando(true);
    setError(null);

    const formData = new FormData();
    formData.append('imagen', blob, 'captura.jpg');

    try {
      const response = await clasificarImagen(formData);
      setResultado(response.data);
      
      setHistorial(prev => [{
        id: Date.now(),
        clase: response.data.clase,
        clase_es: response.data.clase_es,
        confianza: response.data.confianza,
        puntaje: response.data.puntaje_obtenido,
        fecha: new Date().toISOString()
      }, ...prev]);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al clasificar');
    } finally {
      setClasificando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Clasificación en Tiempo Real</h2>

      {!isActive ? (
        <button
          onClick={iniciar}
          className="btn-primary w-full py-3 text-lg"
        >
          📷 Iniciar Cámara
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto max-h-96"
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClasificar}
              disabled={clasificando}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {clasificando ? 'Clasificando...' : '🔍 Clasificar'}
            </button>
            <button
              onClick={detener}
              className="btn-danger"
            >
              Detener
            </button>
          </div>
        </div>
      )}

      {(camError || error) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {camError || error}
        </div>
      )}

      {resultado && (
        <ResultadoClasificacion resultado={resultado} />
      )}

      {historial.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Últimas clasificaciones</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {historial.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <span>{CLASES_RESIDUOS[item.clase]?.icono || '♻️'}</span>
                  <span className="font-medium">{item.clase_es}</span>
                  <span className="text-sm text-gray-500">
                    {(item.confianza * 100).toFixed(1)}%
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  +{item.puntaje} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CamaraClasificacion;