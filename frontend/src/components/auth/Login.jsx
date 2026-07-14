import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const resultado = await login(email, password);
    setLoading(false);

    if (resultado.success) {
      navigate('/dashboard');
    } else {
      setError(resultado.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-gray-50 to-emerald-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-green-600 text-3xl shadow-lg shadow-green-600/30">
            ♻️
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido de vuelta a Reciclaje IA
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-8">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm rounded-lg p-3">
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.94 6.94a2 2 0 011.32-.94h11.48a2 2 0 011.32.94L10 11.06 2.94 6.94z" />
                    <path d="M18 8.12 10.53 12.5a1 1 0 01-1.06 0L2 8.12V13a2 2 0 002 2h12a2 2 0 002-2V8.12z" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v7a2 2 0 002 2h8a2 2 0 002-2v-7a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {mostrarPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.29 10.29 0 003.16-3.667 1.5 1.5 0 000-1.316C17.516 6.36 14.174 4 10 4a9.87 9.87 0 00-4.512 1.074L3.28 2.22zM7.53 6.47l1.45 1.45a2.5 2.5 0 013.098 3.098l1.45 1.45a4 4 0 00-5.998-5.998z" />
                      <path d="M2.22 16.72a.75.75 0 001.06 1.06l1.746-1.745A9.87 9.87 0 0010 18c4.174 0 7.516-2.36 9.02-5.777a1.5 1.5 0 000-1.316 10.29 10.29 0 00-2.363-3.257l-1.06 1.06A8.79 8.79 0 0117.6 11c-1.3 2.943-4.156 5-7.6 5a8.37 8.37 0 01-3.223-.638l-1.51 1.51z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.5 1.5 0 010-1.18C2.16 6.01 5.5 3.5 10 3.5s7.84 2.51 9.336 5.91a1.5 1.5 0 010 1.18C17.84 13.99 14.5 16.5 10 16.5S2.16 13.99.664 10.59zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-semibold text-green-600 hover:text-green-700">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
