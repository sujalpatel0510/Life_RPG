import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { cn } from '../utils/cn';

interface ThemeToggleProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'sm', className }) => {
  const { theme, toggleTheme } = useTheme();
  const { playClick } = useSound();
  const isDark = theme === 'dark';
  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const boxSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <button
      type="button"
      onClick={() => {
        playClick();
        toggleTheme();
      }}
      className={cn(
        "btn-tactile relative p-2 rounded-lg surface hover:bg-slate-100 dark:hover:bg-rpg-dark-surface-hover text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-rpg-dark-border transition shadow-sm",
        className
      )}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      <span className={`relative block ${boxSize}`}>
        {/* Sun - gold for light mode */}
        <Sun
          aria-hidden="true"
          className={`absolute inset-0 ${iconSize} text-rpg-gold-500 transition-all duration-500 ease-out ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Moon - teal for dark mode */}
        <Moon
          aria-hidden="true"
          className={`absolute inset-0 ${iconSize} text-rpg-teal-400 transition-all duration-500 ease-out ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;