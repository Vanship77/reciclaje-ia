// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Layout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-forest-bg dark:bg-forest-bg-dark bg-cover bg-center bg-fixed transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;