import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { QuestBoard } from '../components/QuestBoard';
import { BossRaid } from '../components/BossRaid';
import { ArmouryShop } from '../components/ArmouryShop';
import { CharacterSheet } from '../components/CharacterSheet';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { LevelUpCelebration } from '../components/LevelUpCelebration';
import { useAuth } from '../context/AuthContext';
import { Database, ShieldCheck, Cpu } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { character } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('quests');
  const [levelUpModal, setLevelUpModal] = useState<number | null>(null);

  const handleLevelUp = (newLevel: number) => {
    setLevelUpModal(newLevel);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100">
      
      {/* Top RPG Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {activeTab === 'quests' && (
          <div className="space-y-8">
            {/* Boss Banner Preview */}
            <BossRaid />
            
            {/* Core Quest System */}
            <QuestBoard onLevelUp={handleLevelUp} />
          </div>
        )}

        {activeTab === 'boss' && (
          <div className="space-y-6">
            <BossRaid />
            <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6">
              <h3 className="font-fantasy text-lg font-bold text-slate-200 mb-2">
                Conquest Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                To inflict critical strikes upon this raid boss, complete your real-world tasks in the Quest Log. 
                Higher difficulty quests and equipped weapons in your Armoury deal massive bonus damage multipliers!
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

      {/* Footer / Hackathon Compliance Bar */}
      <footer className="border-t border-slate-800/80 bg-[#060911] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-fantasy font-bold text-slate-400">LIFE RPG</span>
            <span>• Tech Zephyr 4.0 Hackathon Build</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <Database className="w-3.5 h-3.5" /> PostgreSQL 17 Connected
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <Cpu className="w-3.5 h-3.5" /> Express + Prisma Backend
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Server-side Anti-Cheat
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};