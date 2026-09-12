import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { useTheme } from '../context/ThemeContext';
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
  Zap,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHotkeys: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenHotkeys }) => {
  const { character, logout } = useAuth();
  const { isMuted, toggleMute, playClick } = useSound();
  const { theme, toggleTheme } = useTheme();

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
      case 'WARRIOR': return 'from-rose-600 to-red-800 border-rose-400/50 shadow-rose-600/25';
      case 'MAGE': return 'from-violet-600 to-purple-800 border-violet-400/50 shadow-violet-600/25';
      case 'ROGUE': return 'from-red-600 to-zinc-800 border-red-400/50 shadow-red-600/25';
      case 'PALADIN': return 'from-slate-200 to-slate-400 border-slate-300/80 shadow-slate-500/25 text-slate-900';
      default: return 'from-rose-600 to-red-900 border-rose-500/50 shadow-rose-600/25';
    }
  };

  const ClassIcon = getClassIcon(character.heroClass);
  const crestGradient = getClassCrestStyle(character.heroClass);

  const navItems = [
    { id: 'quests', label: 'Quest Log', icon: Scroll, shortcut: '1' },
    { id: 'boss', label: 'World Boss', icon: Sword, shortcut: '2' },
    { id: 'armoury', label: 'Armoury', icon: ShoppingBag, shortcut: '3' },
    { id: 'character', label: 'Hero Sheet', icon: User, shortcut: '4' },
    { id: 'history', label: 'Chronicles', icon: History, shortcut: '5' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c111e]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 shadow-sm">
      {/* Top Banner - Hero Vitals & Currencies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Hero Identity */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${crestGradient} flex items-center justify-center shadow-lg border`}>
                <ClassIcon className="w-6 h-6 text-slate-950 fill-slate-950/20" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 border border-rose-500 rounded-full px-1.5 py-0.2 text-[10px] font-bold text-rose-700 dark:text-rose-400 shadow-sm">
                Lv.{character.level}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-fantasy text-base font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                  {character.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900/50">
                  {character.heroClass}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                {character.title}
              </p>
            </div>
          </div>

          {/* Vitals Progress Bars (XP & HP) */}
          <div className="flex-1 max-w-md min-w-[220px] space-y-1.5 hidden md:block">
            {/* XP Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-bold">
                  <Sparkles className="w-3 h-3 text-rose-500" /> XP Progress
                </span>
                <span>{character.currentXp} / {character.nextLevelXp} ({xpPercent}%)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-slate-700/60 p-0.5">
                <div 
                  className="bg-gradient-to-r from-rose-600 via-rose-500 to-red-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* HP Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                  <Heart className="w-3 h-3 fill-red-500/40 text-red-500" /> Health Pool
                </span>
                <span>{character.hp} / {character.maxHp} HP</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-700/60 p-0.5">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Currencies, Streaks, Hotkeys & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Streak Counter */}
            <div 
              className="badge-streak flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold"
              title="Consecutive Days Streak"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-xs font-bold">{character.streakDays}d Streak</span>
            </div>

            {/* Gold */}
            <div 
              className="badge-gold flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold"
              title="Gold Treasury"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold">{character.gold}</span>
            </div>

            {/* Gems */}
            <div 
              className="badge-gem flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold"
              title="Arcane Gems"
            >
              <Gem className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-bold">{character.gems}</span>
            </div>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={() => {
                playClick();
                toggleTheme();
              }}
              className="btn-tactile p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition shadow-sm"
              title={theme === 'dark' ? 'Switch to Parchment Light Theme' : 'Switch to Dark Realm Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Hotkeys Modal Button */}
            <button
              onClick={() => {
                playClick();
                onOpenHotkeys();
              }}
              className="btn-tactile p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition shadow-sm"
              title="Keyboard Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
            >
              <Keyboard className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                toggleMute();
                playClick();
              }}
              className="btn-tactile p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition shadow-sm"
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
              }}
              className="btn-tactile p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/30 transition shadow-sm"
              title="Retire from Realm (Logout)"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile XP Bar */}
        <div className="mt-2 block md:hidden">
          <div className="flex justify-between text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            <span>XP: {character.currentXp} / {character.nextLevelXp}</span>
            <span>HP: {character.hp} / {character.maxHp}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-700">
            <div 
              className="bg-gradient-to-r from-rose-600 to-red-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs with Shortcut badges */}
      <div className="border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/95 dark:bg-[#090d17]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    playClick();
                    setActiveTab(item.id);
                  }}
                  className={`btn-tactile flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-rose-500/20 dark:bg-rose-500/15 text-rose-900 dark:text-rose-300 border border-rose-400 dark:border-rose-500/40 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  <span className="hidden lg:inline text-[9px] px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-bold">
                    {item.shortcut}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};