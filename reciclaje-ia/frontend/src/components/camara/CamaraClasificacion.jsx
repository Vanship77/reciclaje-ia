// src/components/camara/CamaraClasificacion.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCamera, FaStop, FaRedo, FaCheck, FaSpinner } from 'react-icons/fa';

const CamaraClasificacion = () => {
  const { token } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => detenerCamara();
  }, []);

  // ===== INICIAR CÁMARA =====
  const iniciarCamara = async () => {
    try {
      // Detener cualquier stream anterior
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setStream(mediaStream);
        setIsActive(true);
        setError(null);
        console.log('✅ Cámara activada');
      }
    } catch (err) {
      console.error('❌ Error al activar cámara:', err);
      setError('No se pudo acceder a la cámara. Verifica permisos.');
    }
  };

  // ===== DETENER CÁMARA =====
  const detenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    console.log('⏹️ Cámara detenida');
  };

  // ===== CAPTURAR IMAGEN =====
  const capturarImagen = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('No hay video disponible');
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Asegurar que el video tenga dimensiones
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('El video no está listo');
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setImagen(dataUrl);
    detenerCamara();
    console.log('📸 Imagen capturada');
  };

  // ===== CLASIFICAR =====
  const clasificar = async () => {
    if (!imagen) {
      setError('Primero captura una imagen');
      return;
    }

    setCargando(true);
    setResultado(null);
    setError(null);

    try {
      const response = await fetch('/api/clasificar_webcam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imagen })
      });

      const data = await response.json();
      console.log('📊 Respuesta de clasificación:', data);

      if (response.ok) {
        if (data.resultado) {
          setResultado(data.resultado);
          if (data.resultado.puntos) {
            setHistorial(prev => [{
              id: Date.now(),
              material: data.resultado.clase_es || data.resultado.clase,
              puntos: data.resultado.puntos,
              confianza: data.resultado.confianza,
              fecha: new Date().toISOString()
            }, ...prev]);
          }
        } else {
          setError(data.error || 'No se pudo clasificar');
        }
      } else {
        setError(data.error || 'Error al clasificar');
      }
    } catch (err) {
      console.error('❌ Error en clasificación:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  // ===== REINICIAR =====
  const reiniciar = () => {
    setImagen(null);
    setResultado(null);
    setError(null);
    iniciarCamara();
  };

  // ===== EMOJIS Y COLORES =====
  const getEmoji = (material) => {
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

  const getColor = (material) => {
    const mapa = {
      'plastico': 'bg-blue-500',
      'vidrio': 'bg-green-500',
      'lata': 'bg-red-500',
      'papel': 'bg-yellow-500',
      'carton': 'bg-purple-500',
      'basura': 'bg-gray-500'
    };
    return mapa[material] || 'bg-gray-500';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Estado de la cámara */}
      <div className={`p-3 rounded-lg flex items-center gap-2 ${
        isActive ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-500/20 border border-gray-500/30'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
        <span className="text-white text-sm">
          {isActive ? '📷 Cámara activa' : '⏸️ Cámara inactiva'}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="float-right">✕</button>
        </div>
      )}

      {/* Controles de cámara */}
      {!isActive && !imagen ? (
        <button
          onClick={iniciarCamara}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <FaCamera /> Activar cámara
        </button>
      ) : (
        <div className="space-y-4">
          {/* Vista previa */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {!imagen ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={imagen} alt="Captura" className="w-full h-full object-contain" />
            )}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Overlay de carga */}
            {cargando && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-white text-center">
                  <FaSpinner className="animate-spin text-4xl mx-auto mb-2" />
                  <p>Clasificando...</p>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-2 flex-wrap">
            {!imagen ? (
              <button
                onClick={capturarImagen}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FaCamera /> Capturar
              </button>
            ) : (
              <>
                <button
                  onClick={clasificar}
                  disabled={cargando}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {cargando ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  {cargando ? 'Clasificando...' : 'Clasificar'}
                </button>
                <button
                  onClick={reiniciar}
                  className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <FaRedo /> Reiniciar
                </button>
              </>
            )}
            {isActive && (
              <button
                onClick={detenerCamara}
                className="px-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <FaStop /> Detener
              </button>
            )}
          </div>
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="glass-card rounded-xl p-6 animate-fadeInUp">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${getColor(resultado.clase_es)} flex items-center justify-center text-3xl`}>
              {getEmoji(resultado.clase_es)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white capitalize">{resultado.clase_display || resultado.clase_es}</h3>
              <p className="text-gray-300">Confianza: {resultado.confianza?.toFixed(1) || 0}%</p>
              {resultado.puntos && (
                <p className="text-green-400 font-bold">+{resultado.puntos} pts</p>
              )}
              {resultado.modo_demo && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">Modo Demo</span>
              )}
            </div>
          </div>

          {/* Ranking */}
          {resultado.ranking && resultado.ranking.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm font-semibold text-gray-300 mb-2">Otras posibilidades:</p>
              <div className="space-y-2">
                {resultado.ranking.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm">{getEmoji(item.clase_es)}</span>
                    <span className="text-sm capitalize text-white flex-1">{item.clase_es}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getColor(item.clase_es)} rounded-full`}
                        style={{ width: `${item.confianza || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{(item.confianza || 0).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consejo */}
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-white">
              💡 <span className="font-semibold">Consejo:</span> El {resultado.clase_display || resultado.clase_es} debe ir en el contenedor
              {resultado.clase_es === 'plastico' && ' amarillo (plásticos)'}
              {resultado.clase_es === 'vidrio' && ' verde (vidrio)'}
              {resultado.clase_es === 'lata' && ' azul (metales)'}
              {resultado.clase_es === 'papel' && ' azul (papel)'}
              {resultado.clase_es === 'carton' && ' azul (cartón)'}
              {resultado.clase_es === 'basura' && ' de restos (orgánico)'}
            </p>
          </div>
        </div>
      )}

      {/* Historial rápido */}
      {historial.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Últimas clasificaciones</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {historial.slice(0, 5).map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-white border-b border-white/5 py-1">
                <span className="flex items-center gap-2">
                  <span>{getEmoji(item.material)}</span>
                  <span className="capitalize">{item.material}</span>
                </span>
                <span className="text-green-400">+{item.puntos} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CamaraClasificacion;