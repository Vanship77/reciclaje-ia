// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ClasificacionPage from './pages/ClasificacionPage';
import ApiTestPage from './pages/ApiTestPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <Layout>
                <HomePage />
              </Layout>
            } />
            <Route path="/login" element={
              <Layout showFooter={false}>
                <LoginPage />
              </Layout>
            } />
            <Route path="/registro" element={
              <Layout showFooter={false}>
                <RegistroPage />
              </Layout>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/clasificar" element={
              <PrivateRoute>
                <Layout>
                  <ClasificacionPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <Layout>
                  <AdminPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/api-test" element={
              <PrivateRoute>
                <Layout>
                  <ApiTestPage />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;