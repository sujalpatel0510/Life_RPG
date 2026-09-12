import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { cn } from '../utils/cn';

interface ThemeToggleProps {
  size?: 'sm' | 'md';
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'sm', className, showLabels = false }) => {
  const { theme, setTheme } = useTheme();
  const { playClick } = useSound();
  const isDark = theme === 'dark';

  const iconClass = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const padClass = size === 'md' ? 'px-2.5 py-1.5' : 'px-2 py-1';

  return (
    <div
      role="radiogroup"
      aria-label="Color Theme Switcher"
      className={cn(
        "inline-flex items-center p-0.5 rounded-xl border transition-all duration-200",
        "bg-slate-100 dark:bg-[#151722] border-slate-200 dark:border-[#222533] shadow-inner",
        className
      )}
    >
      {/* Light Option */}
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        onClick={() => {
          if (isDark) {
            playClick();
            setTheme('light');
          }
        }}
        className={cn(
          "btn-tactile flex items-center gap-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
          padClass,
          !isDark
            ? "bg-white text-amber-700 shadow-sm font-bold border border-slate-200"
            : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        )}
        title="Activate Studio Light Theme (Shortcut: T)"
        aria-label="Studio Light Theme"
      >
        <Sun className={cn(iconClass, !isDark ? "text-amber-500 fill-amber-500/20" : "text-slate-400")} />
        {showLabels && <span>Light</span>}
      </button>

      {/* Dark Option */}
      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        onClick={() => {
          if (!isDark) {
            playClick();
            setTheme('dark');
          }
        }}
        className={cn(
          "btn-tactile flex items-center gap-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
          padClass,
          isDark
            ? "bg-[#1f2230] text-indigo-400 shadow-sm font-bold border border-[#2d3247]"
            : "text-slate-500 hover:text-slate-900 dark:hover:text-[#f4f5f8]"
        )}
        title="Activate Executive Dark Theme (Shortcut: T)"
        aria-label="Executive Dark Theme"
      >
        <Moon className={cn(iconClass, isDark ? "text-indigo-400 fill-indigo-400/20" : "text-slate-400")} />
        {showLabels && <span>Dark</span>}
      </button>
    </div>
  );
};

export default ThemeToggle;