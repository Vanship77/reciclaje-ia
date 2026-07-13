import React, { useState } from 'react';
import TablaUsuarios from './TablaUsuarios';

const PanelAdmin = () => {
  const [activeTab, setActiveTab] = useState('usuarios');

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'usuarios'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'estadisticas'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            📊 Estadísticas
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'usuarios' && <TablaUsuarios />}
        {activeTab === 'estadisticas' && (
          <div className="card dark:bg-dark-card">
            <p className="text-gray-500 dark:text-gray-400">Estadísticas generales del sistema</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAdmin;