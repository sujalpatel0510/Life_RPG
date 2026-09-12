import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useSound } from '../context/SoundContext';

interface HotkeyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotkeyGuideModal: React.FC<HotkeyGuideModalProps> = ({ isOpen, onClose }) => {
  const { playClick } = useSound();

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', desc: 'Summon New Quest Dialog' },
    { key: '1', desc: 'Navigate to Quest Log' },
    { key: '2', desc: 'Navigate to World Boss Raid' },
    { key: '3', desc: 'Navigate to Armoury Shop' },
    { key: '4', desc: 'Navigate to Hero Sheet & Radar' },
    { key: '5', desc: 'Navigate to Chronicles & History' },
    { key: 'T', desc: 'Toggle Light / Dark Theme' },
    { key: 'M', desc: 'Toggle Sound Effects (Mute / Unmute)' },
    { key: '?', desc: 'Toggle this Hotkeys Reference' },
    { key: 'Esc', desc: 'Close any active modal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] border border-rose-500/50 rounded-2xl p-6 shadow-2xl animate-scale-up text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-fantasy font-bold text-lg">
            <Keyboard className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Power-User Hotkeys</span>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800/80 my-4 text-xs">
          {shortcuts.map((s) => (
            <div key={s.key} className="py-2.5 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-medium">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="btn-tactile w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition"
        >
          Got it, Adventurer
        </button>
      </div>
    </div>
  );
};