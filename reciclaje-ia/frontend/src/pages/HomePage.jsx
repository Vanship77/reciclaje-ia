import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  // Carrusel de imágenes
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop',
      title: '♻️ Clasifica tus Residuos',
      description: 'Usa inteligencia artificial para identificar y clasificar correctamente tus residuos.'
    },
    {
      image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&h=400&fit=crop',
      title: '🌍 Cuida el Planeta',
      description: 'Cada clasificación cuenta. Contribuye al reciclaje y gana puntos.'
    },
    {
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
      title: '🏆 Gana Puntajes',
      description: 'Compite con otros usuarios y conviértete en el mejor reciclador.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Beneficios del sistema
  const beneficios = [
    { icono: '🤖', titulo: 'IA Avanzada', descripcion: 'Clasifica residuos con inteligencia artificial de última generación.' },
    { icono: '📱', titulo: 'Fácil de Usar', descripcion: 'Solo apunta con tu cámara y obtén resultados instantáneos.' },
    { icono: '🌱', titulo: 'Impacto Ambiental', descripcion: 'Contribuye al reciclaje y reduce tu huella de carbono.' },
    { icono: '🏅', titulo: 'Gamificación', descripcion: 'Gana puntos, sube de nivel y compite con otros usuarios.' },
    { icono: '📊', titulo: 'Estadísticas', descripcion: 'Visualiza tu progreso y el impacto de tus acciones.' },
    { icono: '🔒', titulo: 'Seguro', descripcion: 'Tus datos están protegidos con autenticación segura.' }
  ];

  // Estadísticas del sistema
  const estadisticas = [
    { valor: '6+', label: 'Clases de Residuos' },
    { valor: '95%', label: 'Precisión IA' },
    { valor: '1000+', label: 'Clasificaciones Realizadas' },
    { valor: '24/7', label: 'Disponibilidad' }
  ];

  return (
    <Layout hideFooter={true}>
      {/* Hero Section con Carrusel */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden rounded-xl -mt-4">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg md:text-xl max-w-2xl mx-auto">{slide.description}</p>
                  {!isAuthenticated && (
                    <div className="mt-6 flex gap-4 justify-center flex-wrap">
                      <Link
                        to="/registro"
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-all"
                      >
                        Comenzar Ahora
                      </Link>
                      <Link
                        to="/login"
                        className="bg-white hover:bg-gray-100 text-gray-800 px-8 py-3 rounded-full font-semibold transition-all"
                      >
                        Iniciar Sesión
                      </Link>
                    </div>
                  )}
                  {isAuthenticated && (
                    <div className="mt-6">
                      <Link
                        to="/dashboard"
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-all"
                      >
                        Ir al Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
        >
          ❯
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-green-500 w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Sección de Beneficios */}
      <section className="py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          🌟 Beneficios del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="text-4xl mb-4">{item.icono}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {item.titulo}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {item.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Estadísticas */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          📊 Nuestro Impacto
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {estadisticas.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500">
                {item.valor}
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-300">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Cómo Funciona */}
      <section className="py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          🚀 ¿Cómo Funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              📸
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
              1. Toma una Foto
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Usa tu cámara para capturar una imagen del residuo.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🤖
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
              2. Clasificación IA
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Nuestra IA identifica y clasifica el residuo automáticamente.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🏆
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
              3. Gana Puntos
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Acumula puntos y asciende en el ranking de recicladores.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 px-4 bg-green-600 dark:bg-green-800 rounded-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¡Únete al Cambio!
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Comienza a clasificar residuos hoy mismo y contribuye a un planeta más limpio.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/registro"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all"
              >
                Registrarse Gratis
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold transition-all"
              >
                Iniciar Sesión
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all"
            >
              Ir al Dashboard
            </Link>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;