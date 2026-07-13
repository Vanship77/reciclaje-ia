import React, { useState, useEffect } from 'react';
// Importamos los componentes que construiremos en los siguientes pasos
import Estadisticas from './Estadisticas';
import Ranking from './Ranking';

const Dashboard = () => {
  // Estado para almacenar el puntaje del usuario
  const [puntaje, setPuntaje] = useState(0);
  const [cargando, setCargando] = useState(true);

  // Hook useEffect para consumir la API de puntajes al montar el componente
  useEffect(() => {
    const obtenerPuntaje = async () => {
      try {
        const respuesta = await fetch('/api/puntajes');
        
        if (!respuesta.ok) {
          throw new Error('Error al conectar con el servidor');
        }
        
        const data = await respuesta.json();
        // Asumiendo que el JSON devuelve algo como { "puntaje": 150 }
        setPuntaje(data.puntaje || 0);
        
      } catch (error) {
        console.error('Error al cargar el puntaje:', error);
        // Aquí podrías agregar un estado de error si quieres mostrar un mensaje en pantalla
      } finally {
        setCargando(false);
      }
    };

    obtenerPuntaje();
  }, []); // El array vacío asegura que esto solo se ejecute una vez al cargar

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* Cabecera del Dashboard */}
      <header className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-700">♻️ EcoClasificador IA</h1>
          <p className="text-gray-500">Panel de Control de Reciclaje</p>
        </div>
        
        {/* Botón para ir a la cámara (Opcional, asumiendo que es una ruta o modal) */}
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow-md">
          📷 Clasificar Nueva Basura
        </button>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        
        {/* Tarjeta de Puntaje del Usuario */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Tu Impacto Ambiental</h2>
          
          {cargando ? (
            <div className="animate-pulse text-green-600 text-4xl font-bold py-2">Calculando...</div>
          ) : (
            <div className="text-6xl font-extrabold text-green-600 flex items-center justify-center gap-3 py-2">
              <span>🌱</span>
              <span>{puntaje}</span>
              <span className="text-2xl text-gray-400 font-medium">pts</span>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">¡Sigue separando Plástico, Vidrio y Latas para subir de nivel!</p>
        </section>

        {/* Layout en Grid para insertar las Estadísticas y el Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sección de Estadísticas (Ocupa 2 columnas en pantallas grandes) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">📊 Historial de Clasificación</h3>
            {/* Componente Tarea 2 */}
            <Estadisticas />
          </div>

          {/* Sección de Ranking (Ocupa 1 columna) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🏆 Top Recicladores</h3>
            {/* Componente Tarea 3 */}
            <Ranking />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;