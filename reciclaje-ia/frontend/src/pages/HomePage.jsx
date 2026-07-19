// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRecycle, FaCamera, FaChartBar, FaTrophy, FaUsers, FaLeaf, FaRobot, FaMicrochip, FaMapMarkerAlt, FaClock, FaPhone, FaStar, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const HomePage = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [fotoIndex, setFotoIndex] = useState(0);

  const slides = [
    {
      icon: <FaRecycle className="text-6xl text-green-400" />,
      title: '♻️ Recicla con Inteligencia',
      description: 'Nuestra IA detecta automáticamente el tipo de residuo y te da puntos al instante.'
    },
    {
      icon: <FaLeaf className="text-6xl text-green-400" />,
      title: '🌿 Ayuda al Planeta',
      description: 'Cada residuo que reciclas reduce la contaminación. ¡Pequeñas acciones generan grandes cambios!'
    },
    {
      icon: <FaTrophy className="text-6xl text-yellow-400" />,
      title: '🏆 Gana Puntos y Sube en el Ranking',
      description: 'Compite con otros recicladores y demuestra quién es el más comprometido.'
    },
    {
      icon: <FaMicrochip className="text-6xl text-blue-400" />,
      title: '🔌 Compatible con Arduino',
      description: 'Conecta tu basurero inteligente con sensor infrarrojo para detección automática.'
    }
  ];

  const testimonials = [
    { name: 'Carlos M.', text: '"EcoRecicla me ha ayudado a ser más consciente del reciclaje. ¡Es adictivo!"', rating: 5 },
    { name: 'Laura G.', text: '"La mejor app de reciclaje. La IA funciona perfecto con todos los materiales."', rating: 5 },
    { name: 'Prof. Ana R.', text: '"Increíble cómo la tecnología puede ayudar al medio ambiente. ¡Mis alumnos lo aman!"', rating: 5 },
    { name: 'Familia Gómez', text: '"Desde que usamos EcoRecicla, hemos reducido nuestros residuos significativamente."', rating: 5 },
    { name: 'Javier R.', text: '"El sistema de ranking me motiva a reciclar más cada día. ¡6 clases de reciclaje!"', rating: 5 }
  ];

  // ===== FOTOS PARA EL CARRUSEL (6 imágenes de reciclaje) =====
  const fotos = [
    {
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
      title: 'Reciclaje de Plástico',
      desc: 'Clasificando botellas de plástico para su reciclaje'
    },
    {
      url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=800&q=80',
      title: 'Reciclaje de Vidrio',
      desc: 'Separando vidrio por colores para un mejor reciclaje'
    },
    {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      title: 'Reciclaje Electrónico',
      desc: 'Desechando electrónicos de forma responsable'
    },
    {
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
      title: 'Bosques y Naturaleza',
      desc: 'Cuidando nuestros bosques y el medio ambiente'
    },
    {
      url: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800&q=80',
      title: 'Reciclaje de Papel',
      desc: 'Dando nueva vida al papel y cartón'
    },
    {
      url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80',
      title: 'Comunidad Reciclando',
      desc: 'Unidos por un planeta más limpio y sostenible'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFotoIndex((prev) => (prev + 1) % fotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [fotos.length]);

  return (
    <div className="space-y-12">
      {/* ===== HERO SECTION (SIN BOTONES) ===== */}
      <section className="text-center py-12 animate-fadeInUp">
        <div className="flex justify-center mb-6">
          <FaRecycle className="text-7xl text-green-500 animate-pulse-slow" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          ♻️ <span className="text-green-400">EcoRecicla</span>
        </h1>
        <p className="text-xl text-gray-200 mt-4 max-w-2xl mx-auto">
          Clasificación inteligente de residuos con Inteligencia Artificial.
          Detecta, clasifica y gana puntos mientras salvas el planeta.
        </p>
        {user && (
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/dashboard" className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
              <FaChartBar className="inline mr-2" /> Ir al Dashboard
            </Link>
          </div>
        )}
      </section>

      {/* ===== QUIÉNES SOMOS (NUEVO) ===== */}
      <section className="glass-card rounded-2xl p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            <FaInfoCircle className="inline text-green-400 mr-3" />
            ¿Quiénes Somos?
          </h2>
          <p className="text-lg text-gray-200 text-center leading-relaxed">
            <span className="text-green-400 font-semibold">EcoRecicla</span> nació con la misión de hacer que el reciclaje sea 
            <span className="text-white font-semibold"> fácil, divertido y accesible</span> para todos. 
            Somos un equipo apasionado por la tecnología y el medio ambiente, convencidos de que 
            <span className="text-green-300"> pequeñas acciones pueden generar grandes cambios</span>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-xl p-4 text-center text-white">
              <FaRecycle className="text-4xl text-green-400 mx-auto mb-2" />
              <h4 className="font-bold">♻️ Sostenibilidad</h4>
              <p className="text-sm text-gray-300">Comprometidos con el medio ambiente</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center text-white">
              <FaRobot className="text-4xl text-blue-400 mx-auto mb-2" />
              <h4 className="font-bold">🤖 Innovación</h4>
              <p className="text-sm text-gray-300">Tecnología IA de vanguardia</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center text-white">
              <FaUsers className="text-4xl text-yellow-400 mx-auto mb-2" />
              <h4 className="font-bold">👥 Comunidad</h4>
              <p className="text-sm text-gray-300">Recicladores unidos por el planeta</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Nuestra plataforma utiliza <span className="text-green-400 font-semibold">Inteligencia Artificial</span> para clasificar 
              <span className="text-white font-semibold"> 6 tipos de residuos</span> (plástico, vidrio, lata, papel, cartón y basura) 
              en tiempo real, incentivando a las personas a reciclar mediante un sistema de puntos y ranking.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CARRUSEL DE FOTOS (6 IMÁGENES) ===== */}
      <section className="glass-card rounded-2xl overflow-hidden">
        <h3 className="text-xl font-bold text-white text-center pt-6 pb-2">
          <FaCamera className="inline text-green-400 mr-2" />
          Galería de Reciclaje
        </h3>
        <div className="relative h-96 overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${fotoIndex * 100}%)` }}
          >
            {fotos.map((foto, index) => (
              <div key={index} className="min-w-full h-full relative">
                <img
                  src={foto.url}
                  alt={foto.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h4 className="text-2xl font-bold text-white">{foto.title}</h4>
                  <p className="text-gray-200">{foto.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setFotoIndex((prev) => (prev - 1 + fotos.length) % fotos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
          >
            ◀
          </button>
          <button
            onClick={() => setFotoIndex((prev) => (prev + 1) % fotos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
          >
            ▶
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {fotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setFotoIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === fotoIndex ? 'bg-green-500 w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS MINI ===== */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '♻️', label: 'Residuos reciclados', tooltip: 'Cada residuo reciclado evita contaminación' },
          { icon: '🌍', label: 'Impacto ambiental positivo', tooltip: 'Reciclar ahorra energía y recursos' },
          { icon: '🏆', label: 'Puntos por reciclar', tooltip: '+10 pts (plástico), +15 pts (vidrio), etc.' },
          { icon: '🤖', label: 'IA: EfficientNetB0', tooltip: 'Red neuronal para clasificar 6 tipos de residuos' }
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-4 text-center text-white group relative">
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-sm font-medium">{stat.label}</div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {stat.tooltip}
            </div>
          </div>
        ))}
      </section>

      {/* ===== CARRUSEL PRINCIPAL ===== */}
      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="relative h-80 overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full h-full flex flex-col items-center justify-center p-8 text-center text-white bg-black/30">
                <div className="mb-4">{slide.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                <p className="text-lg max-w-xl opacity-90">{slide.description}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
          >
            ◀
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
          >
            ▶
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-green-500 w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PUNTAJES POR MATERIAL ===== */}
      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          <FaStar className="inline text-yellow-400 mr-2" />
          ¿Cuántos puntos por material?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: '🥤', label: 'Plástico', points: '+10 pts', color: 'text-blue-400' },
            { icon: '🍾', label: 'Vidrio', points: '+15 pts', color: 'text-green-400' },
            { icon: '🥫', label: 'Lata', points: '+10 pts', color: 'text-red-400' },
            { icon: '📄', label: 'Papel', points: '+8 pts', color: 'text-yellow-400' },
            { icon: '📦', label: 'Cartón', points: '+12 pts', color: 'text-purple-400' },
            { icon: '🗑️', label: 'Basura', points: '+5 pts', color: 'text-gray-400' }
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-xl p-4 text-center text-white hover:scale-105 transition-transform">
              <div className="text-3xl">{item.icon}</div>
              <div className="text-sm mt-1">{item.label}</div>
              <div className={`font-bold ${item.color}`}>{item.points}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          <FaUsers className="inline text-green-400 mr-2" />
          Usuarios satisfechos
        </h3>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-full px-4">
                <div className="glass-card rounded-xl p-6 text-center text-white max-w-2xl mx-auto">
                  <div className="text-yellow-400 text-xl mb-2">{'⭐'.repeat(t.rating)}</div>
                  <p className="text-lg italic">{t.text}</p>
                  <div className="mt-4 font-semibold text-green-400">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-green-500 w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== UBICACIÓN ===== */}
      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          <FaMapMarkerAlt className="inline text-green-400 mr-2" />
          Nuestra Ubicación
        </h3>
        <div className="rounded-xl overflow-hidden h-64">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.799765884483!2d-78.4864099!3d-0.1805999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a5a8c9a6d5f%3A0x5a9e0b6b4f3c4e4f!2sQuito%2C%20Ecuador!5e0!3m2!1ses!2sec!4v1699999999999"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Ubicación EcoRecicla"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-white">
          <div className="flex items-center gap-3 justify-center">
            <FaMapMarkerAlt className="text-green-400" />
            <span>Quito - Ecuador</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <FaClock className="text-green-400" />
            <span>Lun - Vie: 8:00 AM - 6:00 PM</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <FaPhone className="text-green-400" />
            <span>+593 95 870 2143</span>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="glass-card rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">¿Listo para empezar a reciclar?</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
          Únete a la comunidad de recicladores y gana puntos mientras cuidas el planeta.
          <br />¡Clasificamos 6 tipos de residuos!
        </p>
        {!user ? (
          <Link to="/registro" className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
            <FaUsers /> CREAR CUENTA AHORA
          </Link>
        ) : (
          <Link to="/clasificar" className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
            <FaCamera /> CLASIFICAR AHORA
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;