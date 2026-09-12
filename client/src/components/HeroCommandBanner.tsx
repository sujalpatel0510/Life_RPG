import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { 
  Shield, 
  Flame, 
  Coins, 
  Gem, 
  Sparkles, 
  Sword, 
  Plus, 
  Wand2, 
  Zap, 
  Heart,
  ShoppingBag
} from 'lucide-react';

interface HeroCommandBannerProps {
  onOpenSummonModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HeroCommandBanner: React.FC<HeroCommandBannerProps> = ({ 
  onOpenSummonModal, 
  onNavigateTab 
}) => {
  const { character } = useAuth();
  const { playClick } = useSound();

  if (!character) return null;

  const xpPercent = Math.min(100, Math.round((character.currentXp / character.nextLevelXp) * 100));
  const hpPercent = Math.min(100, Math.round((character.hp / character.maxHp) * 100));
  const streakBonus = Math.min(25, character.streakDays * 5);

  const getClassIcon = (heroClass: string) => {
    switch (heroClass) {
      case 'WARRIOR': return Sword;
      case 'MAGE': return Wand2;
      case 'ROGUE': return Zap;
      case 'PALADIN': return Shield;
      default: return Shield;
    }
  };

  const getClassCrestStyle = (heroClass: string) => {
    switch (heroClass) {
      case 'WARRIOR': return 'from-indigo-600 via-indigo-700 to-indigo-900 border-indigo-400/50 shadow-indigo-600/30';
      case 'MAGE': return 'from-violet-600 via-purple-700 to-indigo-950 border-violet-400/50 shadow-violet-600/30';
      case 'ROGUE': return 'from-cyan-600 via-teal-700 to-slate-900 border-cyan-400/50 shadow-cyan-600/30';
      case 'PALADIN': return 'from-amber-500 via-amber-600 to-amber-800 border-amber-300/80 shadow-amber-500/30';
      default: return 'from-indigo-600 via-indigo-700 to-indigo-900 border-indigo-400/50 shadow-indigo-600/30';
    }
  };

  const ClassIcon = getClassIcon(character.heroClass);
  const crestGradient = getClassCrestStyle(character.heroClass);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0d1424] border border-slate-200/90 dark:border-indigo-500/30 p-5 sm:p-7 shadow-lg shadow-indigo-950/5 dark:shadow-2xl transition-all">
      {/* Background Decorative Halos */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-500/10 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Column: Hero Identity & Greeting */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Crest with glowing level ring */}
          <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => onNavigateTab('character')}>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${crestGradient} flex items-center justify-center shadow-lg border transition-transform duration-300 group-hover:scale-105`}>
              <ClassIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white/20" />
            </div>
            <div className="absolute -bottom-2 -right-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-500 shadow text-[11px] font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap">
              Lv. {character.level}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-fantasy text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-wide">
                {character.name}
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {character.heroClass}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 italic">
                "{character.title}"
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md line-clamp-1 sm:line-clamp-none">
              Welcome back, champion. Forge your legacy by fulfilling your daily quests.
            </p>

            {/* Quick badges (Streak flame & Treasury) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
                <span>{character.streakDays} Day Streak</span>
                <span className="text-[10px] text-orange-600/80 dark:text-orange-300 font-normal">
                  (+{streakBonus}% XP)
                </span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{character.gold} Gold</span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-bold">
                <Gem className="w-3.5 h-3.5 text-cyan-500" />
                <span>{character.gems} Gems</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Interactive XP & Health Progress */}
        <div className="w-full lg:w-72 space-y-2.5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-2xl">
          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400">
                <Sparkles className="w-3 h-3" /> Level Progression
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                {character.currentXp} / {character.nextLevelXp} XP ({xpPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-slate-700 p-0.5">
              <div 
                className="bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Health Bar */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <Heart className="w-3 h-3 fill-rose-500/40 text-rose-500" /> Vitality Pool
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                {character.hp} / {character.maxHp} HP
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-700 p-0.5">
              <div 
                className="bg-gradient-to-r from-rose-600 to-red-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Quick Action CTA Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Quick Summon */}
          <button
            onClick={() => {
              playClick();
              onOpenSummonModal();
            }}
            className="btn-tactile flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl btn-primary text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
            title="Summon New Quest (Shortcut: N)"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Summon Quest (N)</span>
          </button>

          {/* Raid Boss CTA */}
          <button
            onClick={() => {
              playClick();
              onNavigateTab('boss');
            }}
            className="btn-tactile flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold transition"
            title="Jump to World Boss Raid (Shortcut: 2)"
          >
            <Sword className="w-4 h-4 text-rose-500" />
            <span>World Boss (2)</span>
          </button>

          {/* Armoury CTA */}
          <button
            onClick={() => {
              playClick();
              onNavigateTab('armoury');
            }}
            className="btn-tactile p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition"
            title="Open Armoury (Shortcut: 3)"
            aria-label="Armoury"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
