import React, { useState, useEffect } from 'react';
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
  Zap,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

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
    { id: 'quests', path: '/quests', label: 'Quest Log', icon: Scroll, shortcut: '1' },
    { id: 'boss', path: '/boss', label: 'World Boss Raid', icon: Sword, shortcut: '2' },
    { id: 'armoury', path: '/armoury', label: 'Armoury Shop', icon: ShoppingBag, shortcut: '3' },
    { id: 'character', path: '/character', label: 'Hero Character Sheet', icon: User, shortcut: '4' },
    { id: 'history', path: '/history', label: 'Chronicles Timeline', icon: History, shortcut: '5' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 surface-overlay border-b border-slate-200 dark:border-[#222533] shadow-sm">
        {/* Top Banner - Hero Vitals & Controls */}
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-2.5">
          <div className="flex items-center justify-between gap-3">
            
            {/* Left: Logo & Hero Identity */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div 
                className="relative group cursor-pointer flex-shrink-0" 
                onClick={() => navigate('/character')}
                title="View Hero Sheet"
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${crestGradient} flex items-center justify-center shadow-md border transition-transform duration-200 group-hover:scale-105`}>
                  <ClassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white/20" />
                </div>
                <div className="absolute -bottom-1 -right-1 surface border border-indigo-500/60 rounded-full px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold text-indigo-700 dark:text-indigo-400 shadow-sm">
                  Lv.{character.level}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-fantasy text-sm sm:text-base font-bold text-title tracking-wide truncate max-w-[130px] sm:max-w-none">
                    {character.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800/60 flex-shrink-0">
                    {character.heroClass}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted italic truncate max-w-[140px] sm:max-w-none">
                  {character.title}
                </p>
              </div>
            </div>

            {/* Center: Vitals Progress Bars (XP & HP) - Shown on Laptops / Tablets */}
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

            {/* Right: Desktop Controls (Currencies, Hotkeys, Audio, Theme, Logout) */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              {/* Streak Counter */}
              <div 
                className="badge-streak flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs"
                title="Consecutive Days Streak"
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="font-bold">{character.streakDays}d</span>
              </div>

              {/* Gold */}
              <div 
                className="badge-gold flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs"
                title="Gold Treasury"
              >
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="font-bold">{character.gold}</span>
              </div>

              {/* Gems */}
              <div 
                className="badge-gem flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs"
                title="Arcane Gems"
              >
                <Gem className="w-4 h-4 text-cyan-500" />
                <span className="font-bold">{character.gems}</span>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Hotkeys Modal Button */}
              <button
                onClick={() => {
                  playClick();
                  onOpenHotkeys();
                }}
                className="btn-tactile p-2 rounded-lg surface hover:bg-slate-100 dark:hover:bg-[#171922] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#222533] transition shadow-sm"
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
                className="btn-tactile p-2 rounded-lg surface hover:bg-slate-100 dark:hover:bg-[#171922] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#222533] transition shadow-sm"
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
                className="btn-tactile p-2 rounded-lg surface hover:bg-rose-50 dark:hover:bg-rose-950/35 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 border border-slate-200 dark:border-[#222533] hover:border-rose-300 dark:hover:border-rose-900/40 transition shadow-sm"
                title="Retire from Realm (Logout)"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Mobile Clean Header (Gold Badge + Hamburger Button ONLY) */}
            <div className="flex md:hidden items-center space-x-2 flex-shrink-0">
              {/* Quick Gold Pill */}
              <div 
                className="badge-gold flex items-center space-x-1 px-2.5 py-1 rounded-xl font-bold text-xs shadow-sm"
                title="Gold Treasury"
              >
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{character.gold}</span>
              </div>

              {/* Hamburger Menu Toggle Button */}
              <button
                onClick={() => {
                  playClick();
                  setIsMobileMenuOpen(prev => !prev);
                }}
                className="btn-tactile p-2 rounded-xl surface border border-slate-200 dark:border-[#222533] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#171922] transition shadow-sm"
                title={isMobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
                aria-label={isMobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Menu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Laptop / Desktop Top Navigation Tabs with Shortcut badges */}
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

      {/* Mobile Hamburger Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-fade-in md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Hamburger Navigation Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[88%] max-w-sm z-50 surface border-l border-slate-200 dark:border-[#222533] shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        <div className="p-5 space-y-5">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222533]">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-fantasy font-bold text-base text-title tracking-wide">
                Realm Navigation
              </span>
            </div>
            <button
              onClick={() => {
                playClick();
                setIsMobileMenuOpen(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#f4f5f8] hover:bg-slate-100 dark:hover:bg-[#1f2230] transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Profile & Vitals Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#151722] border border-slate-200 dark:border-[#222533] space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${crestGradient} flex items-center justify-center shadow-md border flex-shrink-0`}>
                <ClassIcon className="w-6 h-6 text-white fill-white/20" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-fantasy font-bold text-sm text-title truncate">
                    {character.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/60">
                    Lv.{character.level}
                  </span>
                </div>
                <p className="text-[11px] text-muted italic truncate">
                  "{character.title}"
                </p>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-semibold text-body mb-0.5">
                <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                  <Sparkles className="w-3 h-3 text-indigo-500" /> XP Progress
                </span>
                <span className="font-mono text-[9px] text-muted">{character.currentXp} / {character.nextLevelXp} ({xpPercent}%)</span>
              </div>
              <div className="w-full progress-track rounded-full h-2 overflow-hidden progress-shine">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* HP Vitality Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-semibold text-body mb-0.5">
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                  <Heart className="w-3 h-3 fill-rose-500/40 text-rose-500" /> Vitality Pool
                </span>
                <span className="font-mono text-[9px] text-muted">{character.hp} / {character.maxHp} HP</span>
              </div>
              <div className="w-full progress-track rounded-full h-2 overflow-hidden progress-shine">
                <div 
                  className="bg-gradient-to-r from-rose-600 to-red-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Hero Treasury Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="badge-streak p-2 rounded-xl text-center flex flex-col items-center">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse mb-0.5" />
              <span className="text-xs font-bold">{character.streakDays}d</span>
              <span className="text-[9px] text-orange-600 dark:text-orange-400">+{streakBonus}% XP</span>
            </div>
            <div className="badge-gold p-2 rounded-xl text-center flex flex-col items-center">
              <Coins className="w-4 h-4 text-amber-500 mb-0.5" />
              <span className="text-xs font-bold">{character.gold}</span>
              <span className="text-[9px] text-amber-700 dark:text-amber-400">Gold</span>
            </div>
            <div className="badge-gem p-2 rounded-xl text-center flex flex-col items-center">
              <Gem className="w-4 h-4 text-cyan-500 mb-0.5" />
              <span className="text-xs font-bold">{character.gems}</span>
              <span className="text-[9px] text-cyan-700 dark:text-cyan-400">Gems</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider px-1">
              Realm Destinations
            </span>
            <nav className="space-y-1.5 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || activeTab === item.id || (item.id === 'quests' && location.pathname === '/');
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playClick();
                      navigate(item.path);
                      if (setActiveTab) setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`btn-tactile w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 shadow-sm font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151722] border border-transparent'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 dark:bg-[#1f2230] text-slate-600 dark:text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1 text-xs">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* System & Experience Controls */}
          <div className="pt-2 border-t border-slate-200 dark:border-[#222533] space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider px-1">
              Preferences
            </span>

            {/* Theme Toggle in Menu */}
            <div className="flex items-center justify-between p-2.5 rounded-xl surface-panel border border-slate-200 dark:border-[#222533]">
              <span className="text-xs font-medium text-body">Appearance</span>
              <ThemeToggle showLabels={true} size="sm" />
            </div>

            {/* Audio Toggle in Menu */}
            <button
              onClick={() => {
                toggleMute();
                playClick();
              }}
              className="btn-tactile w-full flex items-center justify-between p-2.5 rounded-xl surface-panel border border-slate-200 dark:border-[#222533] text-body hover:text-title transition"
            >
              <div className="flex items-center space-x-2">
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                <span className="text-xs font-medium">Sound Effects</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isMuted 
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40' 
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
              }`}>
                {isMuted ? 'Muted' : 'Enabled'}
              </span>
            </button>
          </div>

        </div>

        {/* Drawer Footer / Logout Button */}
        <div className="p-5 border-t border-slate-200 dark:border-[#222533] bg-slate-50/50 dark:bg-[#0c0d14]/50">
          <button
            onClick={() => {
              playClick();
              setIsMobileMenuOpen(false);
              logout();
              navigate('/login');
            }}
            className="btn-tactile w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 font-bold text-xs shadow-sm transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Retire from Realm (Logout)</span>
          </button>
        </div>
      </div>
    </>
  );
};