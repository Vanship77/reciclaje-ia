// src/pages/ClasificacionPage.jsx
import React from 'react';
import CamaraClasificacion from '../components/camara/CamaraClasificacion';

const ClasificacionPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        📷 Clasificación en tiempo real
      </h1>
      <CamaraClasificacion />
    </div>
  );
};

export default ClasificacionPage;