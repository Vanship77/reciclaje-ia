/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores para modo oscuro
        dark: {
          bg: '#0f172a',      // Fondo principal oscuro
          card: '#1e293b',    // Tarjetas oscuras
          border: '#334155',  // Bordes oscuros
          text: '#f1f5f9',    // Texto claro
          muted: '#94a3b8',   // Texto secundario
        }
      }
    },
  },
  plugins: [],
}