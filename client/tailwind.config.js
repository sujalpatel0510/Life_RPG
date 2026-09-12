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
          // Primary brand colors - deep mystical indigo
          primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
          // Secondary - warm amber/gold
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03',
          },
          // Accent - teal/cyan
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e',
          },
          // Dark mode surfaces - rich midnight
          dark: {
            bg: '#0a0e1a',
            bgSecondary: '#111523',
            surface: '#161b2e',
            surfaceHover: '#1d2340',
            border: '#252d4a',
            borderHover: '#333d5e',
          },
          // Light mode surfaces - warm cream
          light: {
            bg: '#faf9f5',
            bgSecondary: '#f5f3ed',
            surface: '#ffffff',
            surfaceHover: '#fefcf8',
            border: '#e8e4db',
            borderHover: '#dcd8ce',
          },
          // Stat colors
          stats: {
            strength: '#e85d75',    // warm rose
            intellect: '#60a5fa',   // sky blue
            vitality: '#34d399',    // emerald
            wisdom: '#a78bfa',      // violet
            agility: '#fbbf24',     // amber
            charisma: '#f472b6',    // pink
          }
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
        'spin-slow': 'spin 3s linear infinite',
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
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}