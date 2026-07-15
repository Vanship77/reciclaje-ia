// src/components/common/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  console.log('🔍 PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('🔍 PrivateRoute - isAdmin:', isAdmin);
  console.log('🔍 PrivateRoute - user:', user);
  console.log('🔍 PrivateRoute - adminOnly:', adminOnly);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔴 No autenticado, redirigiendo a login');
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    console.log('🔴 No es admin, redirigiendo a dashboard');
    return <Navigate to="/dashboard" />;
  }

  console.log('🟢 Acceso permitido');
  return children;
};

export default PrivateRoute;