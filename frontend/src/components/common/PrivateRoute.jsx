import React from 'react';
import { Navigate } from 'react-router-dom';

# TODO: Implementar PrivateRoute
# 1. Verificar autenticación con useAuth()
# 2. Si no está autenticado, redirigir a /login
# 3. Si adminOnly y no es admin, redirigir a /dashboard

const PrivateRoute = ({ children, adminOnly = false }) => {
  # TODO: Obtener estado de autenticación
  # const { isAuthenticated, isAdmin, loading } = useAuth();
  
  # TODO: Mostrar loading mientras se verifica
  # if (loading) return <LoadingSpinner />;
  
  # TODO: Verificar autenticación y rol
  # if (!isAuthenticated) return <Navigate to="/login" />;
  # if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;
  
  return children;
};

export default PrivateRoute;
