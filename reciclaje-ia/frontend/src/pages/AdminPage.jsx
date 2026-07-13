import React from 'react';
import Layout from '../components/layout/Layout';
import PanelAdmin from '../components/admin/PanelAdmin';

const AdminPage = () => {
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Panel de Administración
        </h1>
        <PanelAdmin />
      </div>
    </Layout>
  );
};

export default AdminPage;