/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'selector', // Actualizado para Tailwind 4
  theme: {
    extend: {
      colors: {
        azure: {
          50: '#F2F5FC',
          100: '#E2EAF7',
          200: '#CBDAF2',
          300: '#7DA3DD',
          400: '#537CD0',
          500: '#4A6BC6',
          600: '#405BB5',
          700: '#394994',
          800: '#324076',
          900: '#222949',
          950: '#1a1f3a',
        },
        // Colores específicos para dark mode - Esquema moderno
        dark: {
          bg: '#0a0b1e',        // Azul muy oscuro, más sofisticado
          surface: '#1a1b3a',   // Superficie con tinte azul
          card: '#252759',      // Cards con contraste mejorado
          text: '#f1f5f9',      // Texto más brillante
          muted: '#94a3b8',     // Texto secundario
          accent: '#3b82f6',    // Azul vibrante para acentos
          border: '#334155',    // Bordes sutiles
          hover: '#2d3985',     // Estados hover
        },
        // Gradientes modernos para dark mode
        'dark-gradient': {
          primary: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
          secondary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          accent: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
        }
      },
      // Efectos glassmorphism
      backdropBlur: {
        xs: '2px',
      },
      // Animaciones personalizadas
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(74, 107, 198, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(74, 107, 198, 0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
