// src/components/camara/CamaraClasificacion.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCamera, FaStop, FaRedo, FaCheck, FaSpinner, FaHistory, FaBrain, FaSync } from 'react-icons/fa';

const CamaraClasificacion = () => {
  const { token, user } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [modoDemo, setModoDemo] = useState(false);
  const [autoDetect, setAutoDetect] = useState(false);
  const [mensajeOverlay, setMensajeOverlay] = useState('🔍 Enfoca un residuo');
  const [colorOverlay, setColorOverlay] = useState('bg-black/60');
  const [contadorClasificaciones, setContadorClasificaciones] = useState(0);
  const autoDetectInterval = useRef(null);
  const isProcessingRef = useRef(false);

  // ===== LIMPIAR AL DESMONTAR =====
  useEffect(() => {
    return () => {
      detenerCamara();
      if (autoDetectInterval.current) {
        clearInterval(autoDetectInterval.current);
      }
    };
  }, []);

  // ===== MOSTRAR TOAST =====
  const mostrarToast = (titulo, mensaje, tipo = 'success') => {
    const toast = document.createElement('div');
    const colores = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500'
    };
    const iconos = {
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };

    toast.className = `fixed top-20 right-4 ${colores[tipo] || 'bg-gray-800'} text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fadeInUp max-w-sm`;
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">${iconos[tipo] || '📢'}</span>
        <div>
          <div class="font-bold">${titulo}</div>
          <div class="text-sm opacity-90">${mensaje}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white/50 hover:text-white">
          ✕
        </button>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
      }
    }, 4000);
  };

  // ===== INICIAR CÁMARA =====
  const iniciarCamara = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      setImagen(null);
      setResultado(null);
      setError(null);
      setMensajeOverlay('🔍 Buscando cámara...');
      setColorOverlay('bg-blue-500/60');
      isProcessingRef.current = false;

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            console.log('📹 Video cargado');
            resolve();
          };
          if (videoRef.current.videoWidth > 0) resolve();
        });
        await videoRef.current.play();
        setStream(mediaStream);
        setIsActive(true);
        setError(null);
        setMensajeOverlay('🟢 Escaneando...');
        setColorOverlay('bg-green-500/60');
        console.log('✅ Cámara activada');

        // Iniciar auto-detección si está activada
        if (autoDetect) {
          setTimeout(() => iniciarDeteccionAutomatica(), 1000);
        }
      }
    } catch (err) {
      console.error('❌ Error al activar cámara:', err);
      setError('No se pudo acceder a la cámara. Verifica permisos.');
      setMensajeOverlay('❌ Error al acceder a la cámara');
      setColorOverlay('bg-red-500/60');
    }
  };

  // ===== DETENER CÁMARA =====
  const detenerCamara = () => {
    if (autoDetectInterval.current) {
      clearInterval(autoDetectInterval.current);
      autoDetectInterval.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
    setIsActive(false);
    setImagen(null);
    setResultado(null);
    isProcessingRef.current = false;
    setMensajeOverlay('⏸️ Cámara detenida');
    setColorOverlay('bg-gray-500/60');
    console.log('⏹️ Cámara detenida');
  };

  // ===== CLASIFICAR IMAGEN (FUNCIÓN CORREGIDA - SIN PROXY) =====
  const clasificarImagen = async (imagenData) => {
    if (isProcessingRef.current) return null;
    isProcessingRef.current = true;

    try {
      setMensajeOverlay('⏳ Clasificando...');
      setColorOverlay('bg-yellow-500/60');

      const tokenActual = localStorage.getItem('token');

      if (!tokenActual) {
        console.error('❌ No hay token. Inicia sesión de nuevo.');
        setError('Sesión expirada. Inicia sesión de nuevo.');
        setMensajeOverlay('❌ Sesión expirada');
        setColorOverlay('bg-red-500/60');
        isProcessingRef.current = false;
        setTimeout(() => window.location.href = '/login', 2000);
        return null;
      }

      console.log('🔑 Token:', tokenActual.substring(0, 30) + '...');

      // Convertir Base64 a Blob
      const response = await fetch(imagenData);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('imagen', blob, 'captura.jpg');

      console.log('📤 Enviando imagen a clasificar...');

      // 🔥 USAR URL COMPLETA DEL BACKEND (SIN PROXY)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/clasificar_webcam`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenActual}`
        },
        body: formData
      });

      // 🔥 VERIFICAR TOKEN INVÁLIDO
      if (res.status === 401) {
        console.error('❌ Token inválido o expirado');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Sesión expirada. Inicia sesión de nuevo.');
        setMensajeOverlay('❌ Sesión expirada');
        setColorOverlay('bg-red-500/60');
        setTimeout(() => window.location.href = '/login', 2000);
        isProcessingRef.current = false;
        return null;
      }

      const data = await res.json();
      console.log('📊 Respuesta clasificación:', data);

      if (res.ok && data.resultado) {
        const resultadoData = data.resultado;
        setResultado(resultadoData);
        setModoDemo(resultadoData.modo_demo || false);
        setContadorClasificaciones(prev => prev + 1);

        const clase = resultadoData.clase_display || resultadoData.clase_es || resultadoData.clase || 'Desconocido';
        const puntos = resultadoData.puntos || resultadoData.puntaje_obtenido || 0;
        const confianza = (resultadoData.confianza * 100 || 0).toFixed(1);

        setMensajeOverlay(`
        <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
          <div style="font-size:20px; font-weight:bold; color:#4ade80;">
            ✅ ${clase.toUpperCase()}
          </div>
          <div style="font-size:16px; color:#fbbf24;">
            ⭐ +${puntos} pts
          </div>
          <div style="font-size:12px; color:#94a3b8;">
            Confianza: ${confianza}%
          </div>
        </div>
      `);
        setColorOverlay('bg-green-500/80');

        if (resultadoData.puntos) {
          setHistorial(prev => [{
            id: Date.now(),
            material: resultadoData.clase_es || resultadoData.clase || 'desconocido',
            puntos: resultadoData.puntos,
            confianza: resultadoData.confianza,
            fecha: new Date().toISOString()
          }, ...prev]);

          mostrarToast(
            `♻️ ${clase.toUpperCase()}`,
            `+${resultadoData.puntos} pts`,
            'success'
          );
        }

        setTimeout(() => {
          if (isActive && autoDetect) {
            setMensajeOverlay('🟢 Escaneando...');
            setColorOverlay('bg-green-500/60');
          } else if (isActive) {
            setMensajeOverlay('🔍 Enfoca un residuo');
            setColorOverlay('bg-black/60');
          }
        }, 3000);

        return resultadoData;

      } else {
        console.log('⚠️ No se pudo clasificar:', data);
        setMensajeOverlay('🔍 Esperando residuo...');
        setColorOverlay('bg-blue-500/60');
        return null;
      }

    } catch (err) {
      console.error('❌ Error en clasificación:', err);
      setMensajeOverlay('❌ Error de conexión');
      setColorOverlay('bg-red-500/60');
      return null;
    } finally {
      isProcessingRef.current = false;
    }
  };

  // ===== CAPTURAR Y CLASIFICAR (AUTO) =====
  const capturarYClasificar = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessingRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    await clasificarImagen(dataUrl);
  };

  // ===== DETECCIÓN AUTOMÁTICA =====
  const toggleAutoDetect = () => {
    if (!isActive) {
      setError('Primero activa la cámara');
      return;
    }

    if (autoDetect) {
      detenerDeteccionAutomatica();
    } else {
      iniciarDeteccionAutomatica();
    }
  };

  const iniciarDeteccionAutomatica = () => {
    if (autoDetectInterval.current) {
      clearInterval(autoDetectInterval.current);
    }
    setAutoDetect(true);
    setMensajeOverlay('🟢 Escaneando automáticamente...');
    setColorOverlay('bg-green-500/60');
    console.log('🔄 Detección automática activada (cada 3 segundos)');

    autoDetectInterval.current = setInterval(() => {
      if (isActive && !isProcessingRef.current) {
        capturarYClasificar();
      }
    }, 3000);
  };

  const detenerDeteccionAutomatica = () => {
    if (autoDetectInterval.current) {
      clearInterval(autoDetectInterval.current);
      autoDetectInterval.current = null;
    }
    setAutoDetect(false);
    setMensajeOverlay('⏸️ Detección pausada');
    setColorOverlay('bg-yellow-500/60');
    console.log('⏸️ Detección automática detenida');
  };

  // ===== CAPTURAR MANUAL =====
  const capturarImagen = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('No hay video disponible');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

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
    setMensajeOverlay('📸 Imagen capturada');
    setColorOverlay('bg-blue-500/60');
    console.log('📸 Imagen capturada');
  };

  // ===== CLASIFICAR MANUAL =====
  const clasificarManual = async () => {
    if (!imagen) {
      setError('Primero captura una imagen');
      return;
    }
    await clasificarImagen(imagen);
  };

  // ===== REINICIAR =====
  const reiniciar = () => {
    setImagen(null);
    setResultado(null);
    setError(null);
    setMensajeOverlay('🔍 Reiniciando...');
    setColorOverlay('bg-blue-500/60');
    if (autoDetectInterval.current) {
      clearInterval(autoDetectInterval.current);
      autoDetectInterval.current = null;
    }
    setAutoDetect(false);
    isProcessingRef.current = false;
    setTimeout(() => iniciarCamara(), 300);
  };

  // ===== EMOJIS Y COLORES =====
  const getEmoji = (material) => {
    const mapa = {
      'plastico': '🥤', 'plastic': '🥤',
      'vidrio': '🍾', 'glass': '🍾',
      'lata': '🥫', 'metal': '🔩',
      'papel': '📄', 'paper': '📄',
      'carton': '📦', 'cardboard': '📦',
      'basura': '🗑️', 'trash': '🗑️'
    };
    return mapa[material?.toLowerCase()] || '♻️';
  };

  const getColor = (material) => {
    const mapa = {
      'plastico': 'bg-blue-500', 'plastic': 'bg-blue-500',
      'vidrio': 'bg-green-500', 'glass': 'bg-green-500',
      'lata': 'bg-red-500', 'metal': 'bg-gray-500',
      'papel': 'bg-yellow-500', 'paper': 'bg-yellow-500',
      'carton': 'bg-purple-500', 'cardboard': 'bg-purple-500',
      'basura': 'bg-gray-500', 'trash': 'bg-gray-500'
    };
    return mapa[material?.toLowerCase()] || 'bg-gray-500';
  };

  const getNombreAmigable = (clase) => {
    const mapa = {
      'plastic': 'Plástico', 'plastico': 'Plástico',
      'glass': 'Vidrio', 'vidrio': 'Vidrio',
      'metal': 'Metal', 'lata': 'Lata',
      'paper': 'Papel', 'papel': 'Papel',
      'cardboard': 'Cartón', 'carton': 'Cartón',
      'trash': 'Basura', 'basura': 'Basura'
    };
    return mapa[clase?.toLowerCase()] || clase;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="glass-card rounded-xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600/30 to-blue-600/30 p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <FaCamera />
            </div>
            <h1 className="text-2xl font-bold text-white">♻️ Detección Inteligente</h1>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-gray-300 text-sm">Detección automática en tiempo real</p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                <FaSync className={`inline mr-1 ${autoDetect ? 'animate-spin' : ''}`} />
                Auto: {autoDetect ? 'ON' : 'OFF'}
              </span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                📊 {contadorClasificaciones} clasificaciones
              </span>
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
            <FaBrain /> IA: EfficientNetB0
            {modoDemo && <span className="ml-1 text-yellow-300">(Modo Demo)</span>}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Estado */}
          <div className={`p-3 rounded-lg flex items-center gap-2 mb-4 ${isActive ? 'bg-green-500/20 border border-green-500/30' :
            imagen ? 'bg-blue-500/20 border border-blue-500/30' :
              'bg-gray-500/20 border border-gray-500/30'
            }`}>
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : imagen ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
            <span className="text-white text-sm">
              {isActive ? '📷 Cámara activa' : imagen ? '📸 Imagen capturada' : '⏸️ Cámara inactiva'}
            </span>
            {autoDetect && isActive && (
              <span className="ml-2 text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded-full animate-pulse">
                🔄 Escaneando...
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg mb-4">
              {error}
              <button onClick={() => setError(null)} className="float-right">✕</button>
            </div>
          )}

          {/* Vista previa */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {!imagen ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: isActive ? 'block' : 'none' }}
              />
            ) : (
              <img src={imagen} alt="Captura" className="w-full h-full object-contain" />
            )}

            {!isActive && !imagen && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 text-white">
                <FaCamera className="text-6xl text-gray-600 mb-4" />
                <p className="text-gray-400">Activa la cámara para empezar</p>
                <p className="text-gray-500 text-sm mt-2">La detección será automática</p>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay */}
            {(isActive || imagen) && (
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 ${colorOverlay} px-4 py-2 rounded-full text-white text-sm whitespace-nowrap transition-all duration-300 max-w-[90%] overflow-hidden`}
                dangerouslySetInnerHTML={{ __html: mensajeOverlay }}
              />
            )}

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
          <div className="flex gap-2 flex-wrap mt-4">
            {!isActive && !imagen && (
              <button
                onClick={iniciarCamara}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25"
              >
                <FaCamera /> Activar cámara
              </button>
            )}

            {isActive && !imagen && (
              <>
                <button
                  onClick={capturarImagen}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <FaCamera /> Capturar
                </button>
                <button
                  onClick={toggleAutoDetect}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${autoDetect ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-500 hover:bg-purple-600'
                    } text-white`}
                >
                  <FaSync className={`inline mr-1 ${autoDetect ? 'animate-spin' : ''}`} />
                  {autoDetect ? '⏸️ Pausar Auto' : '▶️ Auto'}
                </button>
                <button
                  onClick={detenerCamara}
                  className="px-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <FaStop /> Detener
                </button>
              </>
            )}

            {imagen && (
              <>
                <button
                  onClick={clasificarManual}
                  disabled={cargando}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
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
          </div>

          {/* Resultado */}
          {resultado && (
            <div className="mt-6 glass-card rounded-xl p-6 animate-fadeInUp border border-white/10">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${getColor(resultado.clase || resultado.clase_es)} flex items-center justify-center text-3xl`}>
                  {getEmoji(resultado.clase || resultado.clase_es)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white capitalize">
                    {resultado.clase_display || getNombreAmigable(resultado.clase_es || resultado.clase)}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-gray-300 text-sm">
                      Confianza: {(resultado.confianza * 100 || 0).toFixed(1)}%
                    </span>
                    {(resultado.puntos || resultado.puntaje_obtenido) && (
                      <span className="text-green-400 font-bold text-sm">
                        +{resultado.puntos || resultado.puntaje_obtenido} pts
                      </span>
                    )}
                    {modoDemo && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Modo Demo</span>
                    )}
                  </div>
                </div>
              </div>

              {resultado.ranking && resultado.ranking.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold text-gray-300 mb-2">Otras posibilidades:</p>
                  <div className="space-y-2">
                    {resultado.ranking.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm">{getEmoji(item.clase)}</span>
                        <span className="text-sm capitalize text-white flex-1">{getNombreAmigable(item.clase)}</span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getColor(item.clase)} rounded-full`}
                            style={{ width: `${(item.confianza || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{((item.confianza || 0) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-white">
                  💡 <span className="font-semibold">Consejo:</span> El {resultado.clase_display || getNombreAmigable(resultado.clase_es || resultado.clase)} debe ir en el contenedor
                  {['plastic', 'plastico'].includes(resultado.clase?.toLowerCase() || resultado.clase_es?.toLowerCase()) && ' amarillo (plásticos)'}
                  {['glass', 'vidrio'].includes(resultado.clase?.toLowerCase() || resultado.clase_es?.toLowerCase()) && ' verde (vidrio)'}
                  {['metal', 'lata'].includes(resultado.clase?.toLowerCase() || resultado.clase_es?.toLowerCase()) && ' azul (metales)'}
                  {['paper', 'papel'].includes(resultado.clase?.toLowerCase() || resultado.clase_es?.toLowerCase()) && ' azul (papel)'}
                  {['cardboard', 'carton'].includes(resultado.clase?.toLowerCase() || resultado.clase_es?.toLowerCase()) && ' azul (cartón)'}
                  {['trash', 'basura'].includes(resultado.clase?.toLowerCase() || resultado.clase_es?.toLowerCase()) && ' de restos (orgánico)'}
                </p>
              </div>
            </div>
          )}

          {/* Historial */}
          {historial.length > 0 && (
            <div className="mt-4 glass-card rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <FaHistory /> Últimas clasificaciones ({contadorClasificaciones} total)
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {historial.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-white border-b border-white/5 py-1">
                    <span className="flex items-center gap-2">
                      <span>{getEmoji(item.material)}</span>
                      <span className="capitalize">{getNombreAmigable(item.material)}</span>
                    </span>
                    <span className="text-green-400">+{item.puntos} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CamaraClasificacion;