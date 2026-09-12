import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '../context/SoundContext';
import { Trophy, Sparkles, Star, ArrowUpRight } from 'lucide-react';

interface LevelUpCelebrationProps {
  newLevel: number;
  onClose: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ newLevel, onClose }) => {
  const { playLevelUp, playClick } = useSound();

  useEffect(() => {
    playLevelUp();

    // Respect users who prefer reduced motion: skip confetti fireworks
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    // Trigger fireworks
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#38bdf8', '#ffffff'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#4f46e5', '#6366f1', '#a855f7', '#06b6d4', '#e0e7ff'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [newLevel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-modal-backdrop">
      <div className="relative max-w-md w-full bg-white dark:bg-gradient-to-b dark:from-[#161f36] dark:to-[#0d1222] border-2 border-indigo-500 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(99,102,241,0.35)] animate-modal-card text-slate-900 dark:text-slate-100">
        
        {/* Glow Halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.8)] border-4 border-white dark:border-slate-900">
          <Trophy className="w-12 h-12 text-white fill-white/20" />
        </div>

        <div className="mt-8 space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ascension Milestone</span>
          </div>

          <h2 className="font-fantasy text-3xl sm:text-4xl font-black text-indigo-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-300 dark:via-violet-200 dark:to-cyan-400 tracking-wide">
            LEVEL UP!
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Your mortal discipline has forged true power. You have achieved:
          </p>

          <div className="py-4 px-6 bg-indigo-50 dark:bg-slate-900/80 rounded-xl border border-indigo-300 dark:border-indigo-500/30 inline-block shadow-sm">
            <span className="font-fantasy text-4xl sm:text-5xl font-black text-indigo-800 dark:text-indigo-300">
              Level {newLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left pt-2">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-3 shadow-sm">
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-medium">All Attributes</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> Stat Buffs
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-3 shadow-sm">
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-medium">Boss Strike</span>
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-indigo-500 text-indigo-500" /> Increased Damage
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="btn-tactile w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-fantasy font-bold text-base shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            CLAIM YOUR GLORY
          </button>
        </div>
      </div>
    </div>
  );
};