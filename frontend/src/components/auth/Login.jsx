import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

# TODO: Implementar Login
# 1. Formulario con email y password
# 2. Llamar a función login del contexto
# 3. Redirigir a dashboard al iniciar sesión

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    # TODO: Llamar a login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Iniciar sesión
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          # TODO: Implementar formulario
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Iniciar sesión
          </button>
          <Link to="/registro" className="text-green-600 text-sm">
            ¿No tienes cuenta? Regístrate
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
