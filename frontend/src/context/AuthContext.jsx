import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, registro as apiRegistro } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implementar AuthContext
  // 1. Efecto para cargar usuario de localStorage al iniciar
  // 2. Función login() - llamar a API y guardar token
  // 3. Función registro() - llamar a API y guardar token
  // 4. Función logout() - limpiar localStorage
  // 5. Exponer: user, loading, isAuthenticated, isAdmin, login, registro, logout

  useEffect(() => {
    // TODO: Cargar usuario desde localStorage
    // const token = localStorage.getItem('token');
    // const userData = localStorage.getItem('user');
    // if (token && userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // TODO: Implementar login
    // 1. Llamar a apiLogin
    // 2. Guardar token y user en localStorage
    // 3. Actualizar estado user
    setError(null);
    try {
      // const response = await apiLogin(email, password);
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // localStorage.setItem('user', JSON.stringify(user));
      // setUser(user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      return { success: false, error: err.response?.data?.error };
    }
  };

  const registro = async (userData) => {
    // TODO: Implementar registro
    // 1. Llamar a apiRegistro
    // 2. Guardar token y user en localStorage
    // 3. Actualizar estado user
    setError(null);
    try {
      // const response = await apiRegistro(userData);
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // localStorage.setItem('user', JSON.stringify(user));
      // setUser(user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
      return { success: false, error: err.response?.data?.error };
    }
  };

  const logout = () => {
    // TODO: Implementar logout
    // 1. Limpiar localStorage
    // 2. Resetear estado user
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    registro,
    logout,
    isAdmin: user?.rol === 'admin',
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
