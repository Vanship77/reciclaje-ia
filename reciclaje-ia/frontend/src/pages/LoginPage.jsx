// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRecycle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creando, setCreando] = useState(false);
  const [mensajeCreacion, setMensajeCreacion] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('🔍 Login exitoso - Datos:', data);
        console.log('🔍 Rol recibido:', data.usuario.rol);
        
        // Guardar token y usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
        
        // Redirigir según rol - USAR NAVEGACIÓN DIRECTA
        if (data.usuario.rol === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // ===== CREAR USUARIOS DE PRUEBA =====
  const crearUsuariosPrueba = async () => {
    setCreando(true);
    setMensajeCreacion('');

    const usuarios = [
      { nombre: 'Florentino', email: 'florentino@administrador.com', password: 'admin123', cedula: '1234567890' },
      { nombre: 'Belén', email: 'belen@usuario.com', password: 'belen123', cedula: '0987654321' },
      { nombre: 'Carlos', email: 'carlos@usuario.com', password: 'carlos123', cedula: '1111111111' },
      { nombre: 'Laura', email: 'laura@usuario.com', password: 'laura123', cedula: '2222222222' },
      { nombre: 'Ana', email: 'ana@usuario.com', password: 'ana123', cedula: '3333333333' },
      { nombre: 'Javier', email: 'javier@usuario.com', password: 'javier123', cedula: '4444444444' },
      { nombre: 'Familia Gómez', email: 'gomez@usuario.com', password: 'gomez123', cedula: '5555555555' }
    ];

    let creados = 0;

    for (const u of usuarios) {
      try {
        const response = await fetch('/api/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(u)
        });
        if (response.ok || response.status === 400) {
          creados++;
        }
      } catch (error) {
        console.error(error);
      }
    }

    setMensajeCreacion(`✅ ${creados} usuarios creados/actualizados`);
    setCreando(false);
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="glass-card rounded-2xl max-w-md w-full p-8 animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaRecycle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">EcoRecicla</h1>
          <p className="text-gray-300 mt-2">Inicia sesión para comenzar</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {mensajeCreacion && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-lg mb-4 text-sm text-center">
            {mensajeCreacion}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-green-400 hover:text-green-300 font-medium">
            Regístrate
          </Link>
        </p>

        {/* Botón para crear usuarios de prueba */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center mb-3">
            🔧 ¿Sin usuarios? Crea usuarios de prueba automáticamente
          </p>
          <button
            onClick={crearUsuariosPrueba}
            disabled={creando}
            className="w-full py-2 bg-blue-500/30 hover:bg-blue-500/50 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            <FaUserPlus />
            {creando ? '⏳ Creando...' : '🔧 Crear usuarios de prueba'}
          </button>
        </div>

        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-gray-400 text-center">
            📝 Usuarios de prueba:
            <br />
            <span className="text-green-300">Admin:</span> florentino@administrador.com / admin123
            <br />
            <span className="text-blue-300">Usuario:</span> belen@usuario.com / belen123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;