import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  History,
  Keyboard,
  Wand2,
  Zap
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHotkeys: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenHotkeys }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { character, logout } = useAuth();
  const { isMuted, toggleMute, playClick } = useSound();

  if (!character) return null;

  const xpPercent = Math.min(100, Math.round((character.currentXp / character.nextLevelXp) * 100));
  const hpPercent = Math.min(100, Math.round((character.hp / character.maxHp) * 100));

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
      case 'WARRIOR': return 'from-indigo-600 to-indigo-900 border-indigo-400/50 shadow-indigo-600/25';
      case 'MAGE': return 'from-violet-600 to-purple-900 border-violet-400/50 shadow-violet-600/25';
      case 'ROGUE': return 'from-cyan-600 to-slate-900 border-cyan-400/50 shadow-cyan-600/25';
      case 'PALADIN': return 'from-amber-500 to-amber-700 border-amber-300/80 shadow-amber-500/25 text-white';
      default: return 'from-indigo-600 to-indigo-900 border-indigo-500/50 shadow-indigo-600/25';
    }
  };

  const ClassIcon = getClassIcon(character.heroClass);
  const crestGradient = getClassCrestStyle(character.heroClass);

  const navItems = [
    { id: 'quests', path: '/quests', label: 'Quest Log', mobileLabel: 'Quests', icon: Scroll, shortcut: '1' },
    { id: 'boss', path: '/boss', label: 'World Boss', mobileLabel: 'Boss', icon: Sword, shortcut: '2' },
    { id: 'armoury', path: '/armoury', label: 'Armoury', mobileLabel: 'Armoury', icon: ShoppingBag, shortcut: '3' },
    { id: 'character', path: '/character', label: 'Hero Sheet', mobileLabel: 'Hero', icon: User, shortcut: '4' },
    { id: 'history', path: '/history', label: 'Chronicles', mobileLabel: 'History', icon: History, shortcut: '5' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 surface-overlay border-b border-slate-200 dark:border-[#222533] shadow-sm">
        {/* Top Banner - Hero Vitals & Currencies */}
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-12 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Logo & Hero Identity */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="relative group cursor-pointer flex-shrink-0" onClick={() => navigate('/character')}>
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${crestGradient} flex items-center justify-center shadow-md border transition-transform duration-200 group-hover:scale-105`}>
                  <ClassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white/20" />
                </div>
                <div className="absolute -bottom-1 -right-1 surface border border-indigo-500/60 rounded-full px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold text-indigo-700 dark:text-indigo-400 shadow-sm">
                  Lv.{character.level}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-fantasy text-sm sm:text-base font-bold text-title tracking-wide truncate max-w-[110px] xs:max-w-[140px] sm:max-w-none">
                    {character.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800/60 flex-shrink-0">
                    {character.heroClass}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted italic truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">
                  {character.title}
                </p>
              </div>
            </div>

            {/* Vitals Progress Bars (XP & HP) - Shown on Laptops / Tablets */}
            <div className="flex-1 max-w-md min-w-[200px] space-y-1.5 hidden md:block mx-4">
              {/* XP Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-body mb-0.5">
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                    <Sparkles className="w-3 h-3 text-indigo-500" /> XP Progress
                  </span>
                  <span className="font-mono text-[10px] text-muted">{character.currentXp} / {character.nextLevelXp} ({xpPercent}%)</span>
                </div>
                <div className="w-full progress-track rounded-full h-2 overflow-hidden progress-shine">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>

              {/* HP Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-body mb-0.5">
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                    <Heart className="w-3 h-3 fill-rose-500/40 text-rose-500" /> Vitality
                  </span>
                  <span className="font-mono text-[10px] text-muted">{character.hp} / {character.maxHp} HP</span>
                </div>
                <div className="w-full progress-track rounded-full h-2 overflow-hidden progress-shine">
                  <div 
                    className="bg-gradient-to-r from-rose-600 to-red-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Currencies, Streaks, Hotkeys & Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              
              {/* Streak Counter */}
              <div 
                className="badge-streak flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold text-xs"
                title="Consecutive Days Streak"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="font-bold">{character.streakDays}d</span>
              </div>

              {/* Gold */}
              <div 
                className="badge-gold flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold text-xs"
                title="Gold Treasury"
              >
                <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                <span className="font-bold">{character.gold}</span>
              </div>

              {/* Gems */}
              <div 
                className="badge-gem flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold text-xs"
                title="Arcane Gems"
              >
                <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500" />
                <span className="font-bold">{character.gems}</span>
              </div>

              {/* Theme Toggle Button (Light / Dark) */}
              <ThemeToggle />

              {/* Hotkeys Modal Button - hidden on mobile touchscreens without physical keyboard */}
              <button
                onClick={() => {
                  playClick();
                  onOpenHotkeys();
                }}
                className="btn-tactile hidden sm:inline-flex p-1.5 sm:p-2 rounded-lg surface hover:bg-slate-100 dark:hover:bg-[#171922] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#222533] transition shadow-sm"
                title="Keyboard Shortcuts (?)"
                aria-label="Keyboard Shortcuts"
              >
                <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </button>

              {/* Audio Toggle */}
              <button
                onClick={() => {
                  toggleMute();
                  playClick();
                }}
                className="btn-tactile p-1.5 sm:p-2 rounded-lg surface hover:bg-slate-100 dark:hover:bg-[#171922] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#222533] transition shadow-sm"
                title={isMuted ? 'Unmute Sound Effects (M)' : 'Mute Sound Effects (M)'}
                aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  playClick();
                  logout();
                  navigate('/login');
                }}
                className="btn-tactile p-1.5 sm:p-2 rounded-lg surface hover:bg-rose-50 dark:hover:bg-rose-950/35 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 border border-slate-200 dark:border-[#222533] hover:border-rose-300 dark:hover:border-rose-900/40 transition shadow-sm"
                title="Retire from Realm (Logout)"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Dual XP & HP Bars */}
          <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-[#222533]/60 grid grid-cols-2 gap-2.5 md:hidden">
            <div>
              <div className="flex justify-between text-[10px] font-semibold text-body mb-0.5">
                <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500" /> XP: {xpPercent}%
                </span>
                <span className="font-mono text-[9px] text-muted">{character.currentXp}/{character.nextLevelXp}</span>
              </div>
              <div className="w-full progress-track rounded-full h-1.5 overflow-hidden progress-shine">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold text-body mb-0.5">
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                  <Heart className="w-2.5 h-2.5 fill-rose-500/40 text-rose-500" /> HP: {hpPercent}%
                </span>
                <span className="font-mono text-[9px] text-muted">{character.hp}/{character.maxHp}</span>
              </div>
              <div className="w-full progress-track rounded-full h-1.5 overflow-hidden progress-shine">
                <div 
                  className="bg-gradient-to-r from-rose-600 to-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Laptop / Desktop Top Navigation Tabs with Shortcut badges (hidden on mobile) */}
        <div className="hidden md:block border-t border-slate-200 dark:border-[#222533] bg-slate-50/95 dark:bg-[#0c0d14]/95">
          <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" aria-label="Desktop Tabs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || activeTab === item.id || (item.id === 'quests' && location.pathname === '/');
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      playClick();
                      navigate(item.path);
                      if (setActiveTab) setActiveTab(item.id);
                    }}
                    className={`btn-tactile flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white dark:bg-[#171922] text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-[#2d3247] shadow-sm font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-title dark:hover:text-[#f8fafc] hover:bg-slate-100 dark:hover:bg-[#171922]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                    <span className={`hidden lg:inline text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' 
                        : 'bg-slate-200/80 dark:bg-[#1f2230] text-slate-600 dark:text-slate-400'
                    }`}>
                      {item.shortcut}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar - Native Mobile App Experience */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden surface-overlay border-t border-slate-200 dark:border-[#222533] shadow-2xl backdrop-blur-xl pb-safe"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-5 h-15 max-w-lg mx-auto px-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || activeTab === item.id || (item.id === 'quests' && location.pathname === '/');
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  playClick();
                  navigate(item.path);
                  if (setActiveTab) setActiveTab(item.id);
                }}
                className={`flex flex-col items-center justify-center py-1 relative transition-all rounded-xl ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                )}
                <div className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-500/10 dark:bg-indigo-500/20 scale-105' : ''
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap font-medium">
                  {item.mobileLabel}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
};