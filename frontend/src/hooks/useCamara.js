import { useState, useRef, useCallback } from 'react';

# TODO: Implementar hook useCamara
# 1. videoRef y canvasRef
# 2. iniciar() - usar getUserMedia y asignar al video
# 3. detener() - detener todos los tracks
# 4. capturar() - tomar foto del video y devolver blob

export const useCamara = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);

  const iniciar = useCallback(async () => {
    # TODO: Iniciar cámara
    # try {
    #   const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    #   videoRef.current.srcObject = mediaStream;
    #   setStream(mediaStream);
    #   setIsActive(true);
    # } catch (err) {
    #   setError('Error al acceder a la cámara');
    # }
  }, []);

  const detener = useCallback(() => {
    # TODO: Detener cámara
    # if (stream) {
    #   stream.getTracks().forEach(track => track.stop());
    #   setStream(null);
    #   setIsActive(false);
    # }
  }, [stream]);

  const capturar = useCallback(() => {
    # TODO: Capturar imagen
    # 1. Dibujar video en canvas
    # 2. Convertir a blob
    # return blob;
    return null;
  }, []);

  return {
    videoRef,
    canvasRef,
    isActive,
    error,
    iniciar,
    detener,
    capturar,
  };
};
