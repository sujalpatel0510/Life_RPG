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
          indigo: '#6366f1',
          indigoHover: '#4f46e5',
          indigoLight: '#818cf8',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          cyanLight: '#22d3ee',
          dark: '#090d16',
          darkSurface: '#0d1322',
          card: '#111827',
          cardHover: '#162035',
          border: '#1e293b',
          gold: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
          slateMuted: '#94a3b8',
        }
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'tab-enter': 'tabEnter 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-pop': 'scalePop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(99, 102, 241, 0.55))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.2))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        tabEnter: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.995)' },
          '100%': { opacity: '1', transform: 'translateY(0px) scale(1)' },
        },
        scalePop: {
          '0%': { transform: 'scale(0.95)' },
          '70%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
