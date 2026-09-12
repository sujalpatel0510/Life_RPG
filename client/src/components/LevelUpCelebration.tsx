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

    // Trigger fireworks
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#F59E0B', '#EAB308', '#EC4899', '#3B82F6'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#8B5CF6', '#F97316'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [newLevel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-md w-full bg-gradient-to-b from-[#161f36] to-[#0d1222] border-2 border-amber-500/60 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-scale-up">
        
        {/* Glow Halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.8)] border-4 border-slate-900">
          <Trophy className="w-12 h-12 text-slate-950 fill-amber-900/40" />
        </div>

        <div className="mt-8 space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ascension Milestone</span>
          </div>

          <h2 className="font-fantasy text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 tracking-wide">
            LEVEL UP!
          </h2>

          <p className="text-slate-300 text-sm">
            Your mortal discipline has forged true power. You have achieved:
          </p>

          <div className="py-4 px-6 bg-slate-900/80 rounded-xl border border-amber-500/30 inline-block">
            <span className="font-fantasy text-4xl sm:text-5xl font-black text-amber-400">
              Level {newLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left pt-2">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block font-medium">All Attributes</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> Stat Buffs
              </span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Boss Strike</span>
              <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-rose-500" /> Increased Damage
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-fantasy font-bold text-base shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            CLAIM YOUR GLORY
          </button>
        </div>
      </div>
    </div>
  );
};