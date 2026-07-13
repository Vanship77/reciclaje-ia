import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`shadow-md ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">♻️</span>
              <span className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                EcoClasificador IA
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link 
                to="/" 
                className={`${darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'} px-3 py-2 rounded-md`}
              >
                Inicio
              </Link>
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`${darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'} px-3 py-2 rounded-md`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/clasificar" 
                    className={`${darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'} px-3 py-2 rounded-md`}
                  >
                    Clasificar
                  </Link>
                  {isAdmin && (
                    <>
                      <Link 
                        to="/admin" 
                        className={`${darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'} px-3 py-2 rounded-md`}
                      >
                        Administración
                      </Link>
                      <Link 
                        to="/api-test" 
                        className={`${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'} px-3 py-2 rounded-md font-medium`}
                      >
                        🧪 API Test
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all ${
                darkMode ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-800 hover:bg-gray-700'
              } text-white`}
              aria-label="Cambiar modo oscuro/claro"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  👤 {user?.nombre || user?.email}
                </span>
                <span className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  🏆 {user?.puntaje_total || 0} pts
                </span>
                <button
                  onClick={handleLogout}
                  className={`${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} px-3 py-2 rounded-md text-sm`}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`${darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'} px-3 py-2 rounded-md text-sm`}
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;