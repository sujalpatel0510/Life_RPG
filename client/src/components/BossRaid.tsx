import React, { useState, useEffect } from 'react';
import { Boss } from '../types';
import { api } from '../utils/api';
import { useSound } from '../context/SoundContext';
import { 
  Flame, 
  ShieldAlert, 
  Trophy, 
  RefreshCw, 
  Skull, 
  Sword,
  Target,
  Sparkles,
  Gift
} from 'lucide-react';

interface BossRaidProps {
  lastDamage?: { amount: number; timestamp: number } | null;
}

export const BossRaid: React.FC<BossRaidProps> = ({ lastDamage }) => {
  const { playClick, playAttack, playCoin } = useSound();
  const [boss, setBoss] = useState<Boss | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResurrecting, setIsResurrecting] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<number | null>(null);

  const fetchBoss = async () => {
    try {
      setLoading(true);
      const data = await api.boss.getActive();
      if (data && data.boss) {
        setBoss(data.boss);
      }
    } catch (err: any) {
      console.error('Failed to summon boss status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoss();
  }, []);

  // Trigger visual strike and damage pop when boss is attacked
  useEffect(() => {
    if (lastDamage && lastDamage.amount > 0) {
      setIsHit(true);
      setFloatingDamage(lastDamage.amount);

      // Deduct locally for instant reactive feel
      setBoss(prev => {
        if (!prev) return null;
        const newHp = Math.max(0, prev.hp - lastDamage.amount);
        return { ...prev, hp: newHp };
      });

      const timer1 = setTimeout(() => setIsHit(false), 500);
      const timer2 = setTimeout(() => setFloatingDamage(null), 1500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [lastDamage]);

  const handleResurrect = async () => {
    setIsResurrecting(true);
    playClick();
    try {
      const data = await api.boss.resurrect();
      if (data && data.boss) {
        setBoss(data.boss);
        playCoin();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to summon next boss.');
    } finally {
      setIsResurrecting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 skeleton">
        <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 skeleton" />
        <div className="h-6 w-48 mx-auto bg-slate-200 dark:bg-slate-800 rounded skeleton" />
      </div>
    );
  }

  if (!boss) return null;

  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.hp / boss.maxHp) * 100)));
  const isDefeated = boss.hp <= 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 dark:from-[#131b2e] dark:via-[#0d1322] dark:to-[#070b16] border border-indigo-200 dark:border-indigo-500/30 p-6 sm:p-8 boss-glow shadow-md dark:shadow-2xl transition-all">
      
      {/* Background Ambient Runes */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        
        {/* Boss Creature Avatar with Damage Reaction */}
        <div className="relative flex-shrink-0">
          
          {/* Floating Damage Text Popup */}
          {floatingDamage && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 font-fantasy font-black text-2xl text-rose-500 drop-shadow-[0_2px_8px_rgba(244,63,94,0.9)] animate-float-up pointer-events-none whitespace-nowrap">
              💥 -{floatingDamage} DMG!
            </div>
          )}

          <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
            isDefeated
              ? 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 opacity-70 grayscale'
              : isHit
              ? 'animate-boss-hit bg-rose-500/20 border-rose-400 ring-4 ring-rose-500/50'
              : 'bg-gradient-to-tr from-indigo-100 via-white to-slate-100 dark:from-indigo-900/30 dark:via-slate-900/50 dark:to-slate-950 border-indigo-300 dark:border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.15)] dark:shadow-[0_0_40px_rgba(99,102,241,0.25)] animate-pulse-glow animate-creature-idle'
          }`}>

            {isDefeated ? (
              <div className="text-center p-2">
                <Gift className="w-16 h-16 text-indigo-400 mx-auto animate-chest-pulse" />
                <span className="text-[11px] font-fantasy font-bold text-indigo-500 dark:text-indigo-300 block mt-1">
                  VICTORY CHEST
                </span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <Flame className="w-20 h-20 text-rose-500 fill-rose-600/70 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                <Skull className="w-7 h-7 text-slate-100 absolute -bottom-1 opacity-90" />
              </div>
            )}
          </div>

          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white dark:bg-slate-950 border border-indigo-400/50 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap shadow">
            {isDefeated ? 'Boss Slayed!' : `Tier ${boss.level} World Boss`}
          </div>
        </div>

        {/* Boss Details & Health Bar */}
        <div className="flex-1 w-full space-y-4 text-center md:text-left">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isDefeated ? 'Raid Victorious' : 'Active World Raid'}</span>
            </div>

            <h2 className="font-fantasy text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {boss.name}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-medium italic">
              "{boss.title}"
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              {boss.description}
            </p>
          </div>

          {/* Boss HP Bar */}
          <div className="space-y-1.5 max-w-xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-rose-500" /> Raid Boss Vitality
              </span>
              <span className={hpPercent > 30 ? 'text-rose-600 dark:text-rose-400 font-mono' : 'text-rose-500 animate-pulse font-mono'}>
                {boss.hp} / {boss.maxHp} HP ({hpPercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-300 dark:border-slate-700/80 p-0.5 shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  hpPercent > 50 
                    ? 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                    : hpPercent > 20
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_12px_rgba(245,158,11,0.7)]'
                    : 'bg-gradient-to-r from-rose-600 to-purple-600 animate-pulse'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Raid Mechanics & Victory Rewards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
            <div className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 flex items-center space-x-3 text-left shadow-sm">
              <Sword className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 block">Strike Action</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400">Completing quests unleashes real physical damage based on your STR & weapons.</span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 flex items-center space-x-3 text-left shadow-sm">
              <Trophy className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 block">Bounty Rewards</span>
                <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold">
                  +{boss.rewardGold} Gold, +{boss.rewardXp} XP & Title "{boss.rewardBadge}"
                </span>
              </div>
            </div>
          </div>

          {/* Resurrect Button when defeated */}
          {isDefeated && (
            <div className="pt-2">
              <button
                onClick={handleResurrect}
                disabled={isResurrecting}
                className="btn-tactile inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-fantasy font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                <RefreshCw className={`w-4 h-4 ${isResurrecting ? 'animate-spin' : ''}`} />
                <span>SUMMON NEXT BEHEMOTH</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};