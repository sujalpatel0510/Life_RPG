import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { QuestBoard } from '../components/QuestBoard';
import { BossRaid } from '../components/BossRaid';
import { ArmouryShop } from '../components/ArmouryShop';
import { CharacterSheet } from '../components/CharacterSheet';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { LevelUpCelebration } from '../components/LevelUpCelebration';
import { HotkeyGuideModal } from '../components/HotkeyGuideModal';
import { FloatingCombatText, FloatingTextItem } from '../components/FloatingCombatText';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { useTheme } from '../context/ThemeContext';
import { AmbientEmbers } from '../components/AmbientEmbers';
import { EquippedLoadoutCard } from '../components/EquippedLoadoutCard';
import { Database, ShieldCheck, Cpu, Keyboard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { character } = useAuth();
  const { toggleMute, playClick } = useSound();
  const { toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('quests');
  const [levelUpModal, setLevelUpModal] = useState<number | null>(null);
  const [isHotkeysOpen, setIsHotkeysOpen] = useState(false);
  const [isSummonModalOpen, setIsSummonModalOpen] = useState(false);
  const [lastBossDamage, setLastBossDamage] = useState<{ amount: number; timestamp: number } | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  // Add floating combat text
  const addFloatingText = useCallback((text: string, color: string, x: number, y: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, text, color, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1600);
  }, []);

  const handleBossDamage = useCallback((damage: number) => {
    setLastBossDamage({ amount: damage, timestamp: Date.now() });
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'n') {
        e.preventDefault();
        playClick();
        setIsSummonModalOpen(true);
      } else if (key === '1') {
        e.preventDefault();
        playClick();
        setActiveTab('quests');
      } else if (key === '2') {
        e.preventDefault();
        playClick();
        setActiveTab('boss');
      } else if (key === '3') {
        e.preventDefault();
        playClick();
        setActiveTab('armoury');
      } else if (key === '4') {
        e.preventDefault();
        playClick();
        setActiveTab('character');
      } else if (key === '5') {
        e.preventDefault();
        playClick();
        setActiveTab('history');
      } else if (key === 't') {
        e.preventDefault();
        playClick();
        toggleTheme();
      } else if (key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (key === '?' || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        playClick();
        setIsHotkeysOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsHotkeysOpen(false);
        setIsSummonModalOpen(false);
        setLevelUpModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playClick, toggleMute]);

  return (
    <div className="min-h-screen relative flex flex-col bg-[#070a12] text-slate-100 selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* Dark Fantasy Floating Ambient Embers Background */}
      <AmbientEmbers />

      {/* Floating Combat Text Layer */}
      <FloatingCombatText items={floatingTexts} />

      {/* Top RPG Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenHotkeys={() => setIsHotkeysOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 z-10">
        
        {activeTab === 'quests' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Primary Quest Journal & Quick-Add */}
            <div className="lg:col-span-8 space-y-6">
              <QuestBoard 
                onLevelUp={(lvl) => setLevelUpModal(lvl)}
                onBossDamage={handleBossDamage}
                onAddFloatingText={addFloatingText}
                isModalOpenExternal={isSummonModalOpen}
                setIsModalOpenExternal={setIsSummonModalOpen}
              />
            </div>

            {/* Right 4 Cols: Tactical Sidebar (Boss Raid + Equipped Gear) */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              {/* World Boss Encounter */}
              <BossRaid lastDamage={lastBossDamage} />

              {/* Active Hero Loadout Paperdoll */}
              <EquippedLoadoutCard onOpenArmoury={() => setActiveTab('armoury')} />
            </div>
          </div>
        )}

        {activeTab === 'boss' && (
          <div className="space-y-6">
            <BossRaid lastDamage={lastBossDamage} />
            <div className="bg-[#101626] border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="font-fantasy text-xl font-bold text-slate-100 mb-2">
                Conquest & Raid Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                To inflict critical strikes upon this raid behemoth, complete real-world tasks in your Quest Log. 
                Higher difficulty quests, your Character Strength attribute, and equipped weapons in your Armoury deal massive bonus damage multipliers!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'armoury' && <ArmouryShop />}

        {activeTab === 'character' && <CharacterSheet />}

        {activeTab === 'history' && <ActivityTimeline />}
      </main>

      {/* Level Up Celebration Modal */}
      {levelUpModal !== null && (
        <LevelUpCelebration
          newLevel={levelUpModal}
          onClose={() => setLevelUpModal(null)}
        />
      )}

      {/* Hotkeys Guide Modal */}
      <HotkeyGuideModal
        isOpen={isHotkeysOpen}
        onClose={() => setIsHotkeysOpen(false)}
      />

      {/* Footer / Hackathon Compliance Bar */}
      <footer className="border-t border-slate-800/80 bg-[#060911] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-fantasy font-bold text-slate-300">LIFE RPG</span>
            <span>• Tech Zephyr 4.0 Hackathon Build</span>
            <button
              onClick={() => setIsHotkeysOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 ml-2"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Press '?' for Hotkeys</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Database className="w-3.5 h-3.5" /> PostgreSQL 17 Connected
            </span>
            <span className="flex items-center gap-1 text-blue-400 font-medium">
              <Cpu className="w-3.5 h-3.5" /> Express + Prisma Backend
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Anti-Cheat Server Engine
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};