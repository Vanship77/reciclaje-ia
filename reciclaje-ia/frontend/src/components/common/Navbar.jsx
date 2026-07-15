// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaRecycle, FaSun, FaMoon, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', show: !!user },
    { path: '/clasificar', label: 'Clasificar', show: !!user },
    { path: '/admin', label: 'Admin', show: isAdmin },
    { path: '/api-test', label: 'API Test', show: !!user },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Click para ir al inicio */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FaRecycle className="text-green-500 text-2xl" />
            <span className="font-bold text-xl text-gray-800 dark:text-white">EcoRecicla</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.show && (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Cambiar tema"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>

            {/* User menu - Desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <FaUser className="inline mr-1" /> {user.nombre}
                </span>
                <span className="text-sm font-bold text-green-500">⭐ {user.puntos || 0} pts</span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-500 transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="px-4 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              aria-label="Menú"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                link.show && (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors px-2 py-1"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-1 text-sm text-gray-700 dark:text-gray-300">
                    <FaUser /> {user.nombre} <span className="text-green-500 font-bold">⭐ {user.puntos || 0} pts</span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="text-left text-red-500 hover:text-red-600 px-2 py-1"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:text-green-500 transition-colors">
                    Iniciar sesión
                  </Link>
                  <Link to="/registro" onClick={() => setMenuOpen(false)} className="px-2 py-1 text-green-500 hover:text-green-600 font-medium">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;