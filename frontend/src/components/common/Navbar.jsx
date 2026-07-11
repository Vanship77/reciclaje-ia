import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

# TODO: Implementar Navbar
# 1. Mostrar nombre de usuario y puntaje
# 2. Enlaces a Dashboard, Clasificar, Admin (si es admin)
# 3. Botón de logout

const Navbar = () => {
  # TODO: Obtener usuario y funciones de AuthContext
  # const { user, logout, isAdmin } = useAuth();
  # const navigate = useNavigate();

  const handleLogout = () => {
    # TODO: Cerrar sesión
    # logout();
    # navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl">♻️</span>
              <span className="text-xl font-bold text-green-600">Reciclaje IA</span>
            </Link>
            # TODO: Agregar enlaces de navegación
          </div>
          <div className="flex items-center space-x-4">
            # TODO: Mostrar info del usuario
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
