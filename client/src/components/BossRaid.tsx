import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Gift,
  ExternalLink
} from 'lucide-react';

interface BossRaidProps {
  lastDamage?: { amount: number; timestamp: number } | null;
  compact?: boolean;
  onNavigateArena?: () => void;
}

export const BossRaid: React.FC<BossRaidProps> = ({ lastDamage, compact = false, onNavigateArena }) => {
  const navigate = useNavigate();
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
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4 skeleton">
        <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 skeleton" />
        <div className="h-6 w-48 mx-auto bg-slate-100 dark:bg-slate-800 rounded skeleton" />
      </div>
    );
  }

  if (!boss) return null;

  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.hp / boss.maxHp) * 100)));
  const isDefeated = boss.hp <= 0;

  if (compact) {
    return (
      <div className="surface rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden border border-slate-200 dark:border-[#222533]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#222533]">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="font-fantasy font-bold text-sm text-title">
              World Boss Encounter
            </h3>
          </div>
          <button
            onClick={() => {
              playClick();
              if (onNavigateArena) onNavigateArena();
              else navigate('/boss');
            }}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <span>Full Raid</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Creature Box */}
        <div className="relative text-center">
          {floatingDamage && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 font-fantasy font-black text-xl text-rose-500 drop-shadow-[0_2px_8px_rgba(244,63,94,0.9)] animate-float-up-enhanced pointer-events-none whitespace-nowrap">
              💥 -{floatingDamage} DMG!
            </div>
          )}

          <div className={`w-28 h-28 mx-auto rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
            isDefeated
              ? 'bg-slate-100 dark:bg-[#151722] border-slate-300 dark:border-[#222533] opacity-70 grayscale'
              : isHit
              ? 'animate-boss-hit-enhanced bg-rose-500/20 border-rose-400 ring-4 ring-rose-500/50'
              : 'bg-gradient-to-tr from-indigo-100 via-white to-slate-100 dark:from-[#151722] dark:via-[#12131a] dark:to-[#0c0d14] border-indigo-300 dark:border-[#222533] shadow-[0_0_25px_rgba(99,102,241,0.15)] animate-pulse-glow animate-creature-idle'
          }`}>
            {isDefeated ? (
              <div className="text-center p-1">
                <Gift className="w-10 h-10 text-indigo-500 dark:text-indigo-400 mx-auto animate-chest-pulse" />
                <span className="text-[9px] font-fantasy font-bold text-indigo-700 dark:text-indigo-300 block mt-0.5">
                  VICTORY
                </span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <Flame className="w-14 h-14 text-rose-500 fill-rose-600/70 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
                <Skull className="w-5 h-5 text-slate-100 dark:text-slate-900 absolute -bottom-0.5 opacity-90" />
              </div>
            )}
          </div>

          <div className="mt-2.5">
            <h4 className="font-fantasy font-bold text-sm text-title">
              {boss.name}
            </h4>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium italic">
              Tier {boss.level} • "{boss.title}"
            </p>
          </div>
        </div>

        {/* HP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-rose-500" /> Vitality
            </span>
            <span className={hpPercent > 30 ? 'text-rose-600 dark:text-rose-400 font-mono' : 'text-rose-500 animate-pulse font-mono'}>
              {boss.hp} / {boss.maxHp} ({hpPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-[#1a1c26] rounded-full h-3 overflow-hidden p-0.5 border border-slate-300 dark:border-[#282c3e]">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                hpPercent > 50 
                  ? 'bg-gradient-to-r from-rose-600 to-red-500'
                  : hpPercent > 20
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-rose-600 to-purple-600 animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-[#222533]">
          <span>Bounty: +{boss.rewardGold}g • +{boss.rewardXp}xp</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">Complete Quests to Strike</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#12131a] border border-slate-200 dark:border-[#222533] p-6 sm:p-8 boss-glow shadow-md dark:shadow-2xl transition-all">
      
      {/* Background Ambient Runes */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">

        
        {/* Boss Creature Avatar with Damage Reaction */}
        <div className="relative flex-shrink-0">
          
          {/* Floating Damage Text Popup */}
          {floatingDamage && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 font-fantasy font-black text-2xl text-rose-500 drop-shadow-[0_2px_8px_rgba(244,63,94,0.9)] animate-float-up-enhanced pointer-events-none whitespace-nowrap">
              💥 -{floatingDamage} DMG!
            </div>
          )}

          <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
            isDefeated
              ? 'bg-slate-100 dark:bg-[#151722] border-slate-300 dark:border-[#222533] opacity-70 grayscale'
              : isHit
              ? 'animate-boss-hit-enhanced bg-rose-500/20 border-rose-400 ring-4 ring-rose-500/50'
              : 'bg-gradient-to-tr from-indigo-100 via-white to-slate-100 dark:from-[#151722] dark:via-[#12131a] dark:to-[#0c0d14] border-indigo-300 dark:border-[#222533] shadow-[0_0_40px_rgba(99,102,241,0.15)] animate-pulse-glow animate-creature-idle'
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
                <Skull className="w-7 h-7 text-slate-100 dark:text-slate-900 absolute -bottom-1 opacity-90" />
              </div>
            )}
          </div>

          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white dark:bg-[#171922] border border-indigo-400/50 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap shadow">
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

            <h2 className="font-fantasy text-2xl sm:text-3xl font-black text-title">
              {boss.name}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-medium italic">
              "{boss.title}"
            </p>
            <p className="text-xs text-body mt-2 max-w-xl">
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

            <div className="w-full progress-track rounded-full h-4 overflow-hidden p-0.5 shadow-inner">
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
            <div className="bg-slate-50 dark:bg-[#151722] border border-slate-200 dark:border-[#222533] rounded-xl p-3 flex items-center space-x-3 text-left shadow-sm">
              <Sword className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 block">Strike Action</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400">Completing quests unleashes real physical damage based on your STR & weapons.</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#151722] border border-slate-200 dark:border-[#222533] rounded-xl p-3 flex items-center space-x-3 text-left shadow-sm">
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
                className="btn-tactile inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl btn-primary text-white font-fantasy font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
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