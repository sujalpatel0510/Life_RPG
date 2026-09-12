import React, { useState, useEffect } from 'react';
import { Quest, StatCategory } from '../types';
import { api } from '../utils/api';
import { QuestCard } from './QuestCard';
import { QuestModal } from './QuestModal';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Plus, Search, Filter, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface QuestBoardProps {
  onLevelUp: (level: number) => void;
}

export const QuestBoard: React.FC<QuestBoardProps> = ({ onLevelUp }) => {
  const { character, setCharacter } = useAuth();
  const { playClick, playAttack } = useSound();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCadence, setActiveCadence] = useState<string>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questToEdit, setQuestToEdit] = useState<Quest | null>(null);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const fetchQuests = async () => {
    try {
      setLoading(true);
      const data = await api.quests.getAll();
      if (data && data.quests) {
        setQuests(data.quests);
      }
    } catch (err: any) {
      console.error('Error fetching quests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleSaveQuest = async (questData: any) => {
    if (questToEdit) {
      const res = await api.quests.update(questToEdit.id, questData);
      setQuests(prev => prev.map(q => q.id === questToEdit.id ? res.quest : q));
    } else {
      const res = await api.quests.create(questData);
      setQuests(prev => [res.quest, ...prev]);
    }
    setQuestToEdit(null);
  };

  const handleCompleteQuest = async (id: string) => {
    try {
      const res = await api.quests.complete(id);
      
      // Update quest in local list
      setQuests(prev => prev.map(q => q.id === id ? res.quest : q));
      
      // Update character state
      if (res.character) {
        setCharacter(res.character);
      }

      // Show celebratory notice
      let notice = `⚔️ Quest Conquered! +${res.reward.xp} XP, +${res.reward.gold} Gold.`;
      if (res.bossEncounter?.damageDealt > 0) {
        playAttack();
        notice += ` Dealt ${res.bossEncounter.damageDealt} DMG to the Boss!`;
      }
      setBannerNotice(notice);
      setTimeout(() => setBannerNotice(null), 5000);

      // Check level up
      if (res.progression?.leveledUp) {
        onLevelUp(res.progression.newLevel);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to complete quest.');
    }
  };

  const handleDeleteQuest = async (id: string) => {
    if (!confirm('Are you sure you wish to banish this quest objective?')) return;
    try {
      await api.quests.delete(id);
      setQuests(prev => prev.filter(q => q.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to banish quest.');
    }
  };

  // Filtering
  const filteredQuests = quests.filter(quest => {
    if (activeCadence !== 'ALL' && quest.questType !== activeCadence) return false;
    if (activeCategory !== 'ALL' && quest.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return quest.title.toLowerCase().includes(query) || (quest.description && quest.description.toLowerCase().includes(query));
    }
    return true;
  });

  const cadences = [
    { id: 'ALL', label: 'All Quests' },
    { id: 'DAILY', label: 'Dailies' },
    { id: 'HABIT', label: 'Habits' },
    { id: 'TODO', label: 'To-Dos' },
    { id: 'STORY', label: 'Epic Stories' },
  ];

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Stats' },
    { id: 'STRENGTH', label: 'Strength' },
    { id: 'INTELLECT', label: 'Intellect' },
    { id: 'VITALITY', label: 'Vitality' },
    { id: 'WISDOM', label: 'Wisdom' },
    { id: 'AGILITY', label: 'Agility' },
    { id: 'CHARISMA', label: 'Charisma' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner Notice (Boss damage / Quest XP toast) */}
      {bannerNotice && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-fade-in">
          <span>{bannerNotice}</span>
          <button onClick={() => setBannerNotice(null)} className="text-amber-400 hover:text-amber-200">✕</button>
        </div>
      )}

      {/* Control Bar: Search, Filters & Summon Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quest chronicles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101626] border border-slate-700/80 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500/70 transition"
          />
        </div>

        {/* Summon Quest Button */}
        <button
          onClick={() => {
            playClick();
            setQuestToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-fantasy font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>SUMMON QUEST</span>
        </button>
      </div>

      {/* Cadence Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {cadences.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              playClick();
              setActiveCadence(c.id);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeCadence === c.id
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-[#101626] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playClick();
              setActiveCategory(cat.id);
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-slate-700 text-amber-300 border border-amber-500/40'
                : 'text-slate-500 hover:text-slate-300 bg-slate-900/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Quest Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 rounded-xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={handleCompleteQuest}
              onEdit={(q) => {
                setQuestToEdit(q);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteQuest}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl bg-[#0e1424] border border-dashed border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h3 className="font-fantasy text-lg font-bold text-slate-200">
              No Active Quests in Your Journal
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Summon your daily obligations, workout routines, or study sprints to begin leveling up your real-world stats.
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              setIsModalOpen(true);
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-amber-500/30 transition"
          >
            Summon First Objective
          </button>
        </div>
      )}

      {/* Quest Creation/Edit Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setQuestToEdit(null);
        }}
        onSave={handleSaveQuest}
        questToEdit={questToEdit}
      />
    </div>
  );
};