
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta Lorie Perú - 5 Colores Unificados
        'lorie': {
          'cream': '#FFF9F0',       // RGB(255, 249, 240) - Fondo claro
          'beige': '#F5E6D3',       // RGB(245, 230, 211) - Fondo secundario
          'rose': '#A67C7C',        // RGB(166, 124, 124) - Acento suave
          'brown': '#8B5A5A',       // RGB(139, 90, 90) - Principal/Textos
          'dark': '#6B4444',        // RGB(107, 68, 68) - Énfasis/Hover
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
