// src/components/common/Footer.jsx
import React from 'react';
import { FaRecycle, FaMapMarkerAlt, FaClock, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900/95 dark:bg-gray-950/95 text-white border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaRecycle className="text-green-500 text-2xl" />
              <span className="font-bold text-xl">EcoRecicla</span>
            </div>
            <p className="text-gray-400 text-sm">
              Clasificación inteligente de residuos con Inteligencia Artificial.
            </p>
            <div className="flex gap-3 mt-3">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaFacebook size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaTwitter size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaInstagram size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaYoutube size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaGithub size={18} /></a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold text-white mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-green-500 transition-colors">Inicio</a></li>
              <li><a href="/dashboard" className="hover:text-green-500 transition-colors">Dashboard</a></li>
              <li><a href="/clasificar" className="hover:text-green-500 transition-colors">Clasificar</a></li>
              <li><a href="/admin" className="hover:text-green-500 transition-colors">Admin</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-white mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500" />
                <span>Quito - Ecuador</span>
              </li>
              <li className="flex items-center gap-2">
                <FaClock className="text-green-500" />
                <span>Lun - Vie: 8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-green-500" />
                <span>+593 95 870 2143</span>
              </li>
            </ul>
          </div>

          {/* Tecnología */}
          <div>
            <h4 className="font-semibold text-white mb-3">Tecnología</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>🧠 IA: EfficientNetB0</li>
              <li>📷 Escaneo automático</li>
              <li>♻️ 6 Clases de reciclaje</li>
              <li>🔌 Arduino compatible</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EcoRecicla - Reciclaje inteligente con IA</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;