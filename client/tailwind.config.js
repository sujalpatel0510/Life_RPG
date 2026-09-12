/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          dark: '#0B0F19',
          card: '#121829',
          border: '#2A344D',
          gold: '#F59E0B',
          goldLight: '#FDE68A',
          gem: '#06B6D4',
          crimson: '#EF4444',
          mana: '#3B82F6',
          vitality: '#10B981',
          wisdom: '#A855F7',
          agility: '#F97316',
          charisma: '#EC4899',
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
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.6))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.2))' },
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
