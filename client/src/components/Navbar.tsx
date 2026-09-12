import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { 
  Shield, 
  Flame, 
  Coins, 
  Gem, 
  Volume2, 
  VolumeX, 
  LogOut, 
  Heart,
  Sparkles,
  Sword,
  Scroll,
  ShoppingBag,
  User,
  History
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { character, logout } = useAuth();
  const { isMuted, toggleMute, playClick } = useSound();

  if (!character) return null;

  const xpPercent = Math.min(100, Math.round((character.currentXp / character.nextLevelXp) * 100));
  const hpPercent = Math.min(100, Math.round((character.hp / character.maxHp) * 100));

  const navItems = [
    { id: 'quests', label: 'Quest Log', icon: Scroll },
    { id: 'boss', label: 'World Boss', icon: Sword },
    { id: 'armoury', label: 'Armoury', icon: ShoppingBag },
    { id: 'character', label: 'Hero Sheet', icon: User },
    { id: 'history', label: 'Chronicles', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c111e]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      {/* Top Banner - Hero Vitals & Currencies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Hero Identity */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
                <Shield className="w-6 h-6 text-slate-950 fill-amber-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-amber-500/50 rounded-full px-1.5 py-0.2 text-[10px] font-bold text-amber-400">
                Lv.{character.level}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-fantasy text-base font-bold text-slate-100 tracking-wide">
                  {character.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400/90 font-medium border border-slate-700">
                  {character.heroClass}
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">
                {character.title}
              </p>
            </div>
          </div>

          {/* Vitals Progress Bars (XP & HP) */}
          <div className="flex-1 max-w-md min-w-[220px] space-y-1.5 hidden md:block">
            {/* XP Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-0.5">
                <span className="flex items-center gap-1 text-amber-400">
                  <Sparkles className="w-3 h-3" /> XP Progress
                </span>
                <span>{character.currentXp} / {character.nextLevelXp} ({xpPercent}%)</span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/60 p-0.5">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* HP Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-0.5">
                <span className="flex items-center gap-1 text-rose-400">
                  <Heart className="w-3 h-3 fill-rose-500/40" /> Health
                </span>
                <span>{character.hp} / {character.maxHp} HP</span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/60 p-0.5">
                <div 
                  className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Currencies, Streaks & Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Streak Counter */}
            <div 
              className="flex items-center space-x-1.5 bg-orange-950/40 border border-orange-500/30 px-2.5 py-1 rounded-lg text-orange-400"
              title="Consecutive Days Streak"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-500 animate-pulse" />
              <span className="text-xs font-bold">{character.streakDays}d Streak</span>
            </div>

            {/* Gold */}
            <div 
              className="flex items-center space-x-1.5 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg text-amber-300"
              title="Gold Coins"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">{character.gold}</span>
            </div>

            {/* Gems */}
            <div 
              className="flex items-center space-x-1.5 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-lg text-cyan-300"
              title="Arcane Gems"
            >
              <Gem className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold">{character.gems}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                toggleMute();
                playClick();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                playClick();
                logout();
              }}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition"
              title="Retire from Realm (Logout)"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile XP Bar */}
        <div className="mt-2 block md:hidden">
          <div className="flex justify-between text-[10px] font-semibold text-slate-300 mb-0.5">
            <span>XP: {character.currentXp} / {character.nextLevelXp}</span>
            <span>HP: {character.hp} / {character.maxHp}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-slate-800/60 bg-[#090d17]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};