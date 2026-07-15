// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        console.log('🔍 Usuario cargado desde localStorage:', parsed);
        console.log('🔍 Rol del usuario:', parsed.rol);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }

      console.log('🔍 Login exitoso - Usuario:', data.usuario);
      console.log('🔍 Rol del usuario:', data.usuario.rol);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      setUser(data.usuario);
      
      return { success: true, user: data.usuario };
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: 'Error al conectar con el servidor' };
    }
  };

  const registro = async (userData) => {
    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Error al registrarse' };
      }

      return { success: true };
      
    } catch (error) {
      return { success: false, error: 'Error al conectar con el servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    registro,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    token: localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};