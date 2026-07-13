import { useRef, useCallback } from 'react';

const useCamara = () => {
  // Referencia al elemento <video> en el DOM
  const videoRef = useRef(null);
  // Referencia para guardar el stream de la cámara y poder detenerlo después
  const streamRef = useRef(null);

  // 1. Iniciar la cámara
  const iniciar = useCallback(async () => {
    try {
      // Solicitamos acceso solo a video (idealmente la cámara trasera si es móvil)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } 
      });
      
      // Guardamos el stream en nuestra referencia
      streamRef.current = stream;
      
      // Conectamos el stream de video al elemento <video>
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      // Aquí podrías manejar alertas si el usuario deniega los permisos
    }
  }, []);

  // 2. Detener la cámara
  const detener = useCallback(() => {
    if (streamRef.current) {
      // Recorremos todos los "tracks" (pistas de video/audio) y los apagamos
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      
      // Limpiamos las referencias
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
    }
  }, []);

  // 3. Capturar imagen del video y devolver un Blob
  const capturar = useCallback(() => {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      
      if (!video) {
        reject(new Error('No hay video activo para capturar'));
        return;
      }

      try {
        // Creamos un canvas invisible en memoria con las dimensiones del video
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dibujamos el fotograma actual del video en el canvas
        const contexto = canvas.getContext('2d');
        contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertimos el contenido del canvas a un archivo Blob (formato JPEG)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Error al generar el archivo Blob'));
            }
          },
          'image/jpeg',
          0.9 // Calidad de compresión (90%)
        );
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  // Retornamos los métodos y referencias necesarios para usar en el componente
  return {
    videoRef,
    iniciar,
    detener,
    capturar
  };
};

export default useCamara;
