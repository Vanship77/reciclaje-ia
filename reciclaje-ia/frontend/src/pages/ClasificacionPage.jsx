import React from 'react';
import Layout from '../components/layout/Layout';
import CamaraClasificacion from '../components/camara/CamaraClasificacion';

const ClasificacionPage = () => {
  return (
    <Layout>
      <div className="py-8">
        <CamaraClasificacion />
      </div>
    </Layout>
  );
};

export default ClasificacionPage;