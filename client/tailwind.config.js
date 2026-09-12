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
        rpg: {
          onyx: '#0c0e14',
          dark: '#090a0f',
          card: '#13151f',
          cardLight: '#181b28',
          border: '#232736',
          crimson: '#e11d48',
          crimsonHover: '#f43f5e',
          ruby: '#f43f5e',
          rubyLight: '#fb7185',
          silver: '#cbd5e1',
          silverLight: '#f1f5f9',
          ember: '#f97316',
          gem: '#06b6d4',
          vitality: '#10b981',
          wisdom: '#a855f7',
        }
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(225, 29, 72, 0.65))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 5px rgba(225, 29, 72, 0.25))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
