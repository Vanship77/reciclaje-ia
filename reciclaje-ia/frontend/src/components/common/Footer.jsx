// frontend/src/components/common/Footer.jsx
import React from 'react';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`py-6 px-4 ${darkMode ? 'bg-dark-card' : 'bg-gray-800'} text-center`}>
      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} text-sm`}>
        ♻️ EcoClasificador IA - Sistema Inteligente de Clasificación de Residuos
      </p>
      <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-1`}>
        © {new Date().getFullYear()} - Todos los derechos reservados
      </p>
    </footer>
  );
};

export default Footer;