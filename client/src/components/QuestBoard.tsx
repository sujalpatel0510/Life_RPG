import React, { useState, useEffect } from 'react';
import { Quest } from '../types';
import { api } from '../utils/api';
import { QuestCard } from './QuestCard';
import { QuestModal } from './QuestModal';
import { QuickAddQuest } from './QuickAddQuest';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Plus, Search, Filter, Sparkles, CheckCircle2, Flame } from 'lucide-react';

interface QuestBoardProps {
  onLevelUp: (level: number) => void;
  onBossDamage: (damage: number) => void;
  onAddFloatingText: (text: string, color: string, x: number, y: number) => void;
  isModalOpenExternal?: boolean;
  setIsModalOpenExternal?: (open: boolean) => void;
}

export const QuestBoard: React.FC<QuestBoardProps> = ({ 
  onLevelUp, 
  onBossDamage, 
  onAddFloatingText,
  isModalOpenExternal,
  setIsModalOpenExternal
}) => {
  const { character, setCharacter } = useAuth();
  const { playClick, playAttack } = useSound();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCadence, setActiveCadence] = useState<string>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [questToEdit, setQuestToEdit] = useState<Quest | null>(null);

  const isModalOpen = isModalOpenExternal !== undefined ? isModalOpenExternal : internalModalOpen;
  const setModalOpen = (val: boolean) => {
    if (setIsModalOpenExternal) {
      setIsModalOpenExternal(val);
    } else {
      setInternalModalOpen(val);
    }
  };

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

  const handleQuickAdd = async (questData: any) => {
    const res = await api.quests.create(questData);
    if (res && res.quest) {
      setQuests(prev => [res.quest, ...prev]);
    }
  };

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

  const handleCompleteQuest = async (id: string, e: React.MouseEvent) => {
    try {
      const res = await api.quests.complete(id);
      
      // Update quest in local state
      setQuests(prev => prev.map(q => q.id === id ? res.quest : q));
      
      // Update character in state
      if (res.character) {
        setCharacter(res.character);
      }

      // Calculate origin coordinates for floating text
      const clickX = e.clientX || window.innerWidth / 2;
      const clickY = e.clientY || window.innerHeight / 2;

      // Trigger floating combat text
      onAddFloatingText(`+${res.reward.xp} XP`, '#F59E0B', clickX - 20, clickY - 20);
      setTimeout(() => {
        onAddFloatingText(`+${res.reward.gold} Gold`, '#FBBF24', clickX + 15, clickY - 35);
      }, 120);

      // Handle boss strike damage
      if (res.bossEncounter?.damageDealt > 0) {
        playAttack();
        onBossDamage(res.bossEncounter.damageDealt);
        setTimeout(() => {
          onAddFloatingText(`⚔️ -${res.bossEncounter.damageDealt} Boss DMG!`, '#EF4444', clickX - 10, clickY - 55);
        }, 240);
      }

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

  // Counts for filters
  const counts = {
    ALL: quests.length,
    DAILY: quests.filter(q => q.questType === 'DAILY').length,
    HABIT: quests.filter(q => q.questType === 'HABIT').length,
    TODO: quests.filter(q => q.questType === 'TODO').length,
    STORY: quests.filter(q => q.questType === 'STORY').length,
  };

  // Filtered List
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
    { id: 'ALL', label: 'All Quests', count: counts.ALL },
    { id: 'DAILY', label: 'Dailies', count: counts.DAILY },
    { id: 'HABIT', label: 'Habits', count: counts.HABIT },
    { id: 'TODO', label: 'To-Dos', count: counts.TODO },
    { id: 'STORY', label: 'Story Quests', count: counts.STORY },
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
      
      {/* 1-Click Quick Add Bar */}
      <QuickAddQuest onAdd={handleQuickAdd} />

      {/* Control Bar: Search, Filters & Detailed Summon Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active quests or lore..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101626] border border-slate-700/80 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500/70 transition"
          />
        </div>

        {/* Summon Quest Modal Trigger */}
        <button
          onClick={() => {
            playClick();
            setQuestToEdit(null);
            setModalOpen(true);
          }}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-fantasy font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>DETAILED SUMMON (N)</span>
        </button>
      </div>

      {/* Cadence Filters with Count Badges */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {cadences.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              playClick();
              setActiveCadence(c.id);
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCadence === c.id
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-[#101626] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span>{c.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeCadence === c.id ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {c.count}
            </span>
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
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-slate-800 text-amber-300 border border-amber-500/50 shadow-sm'
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
            <div key={n} className="h-32 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
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
                setModalOpen(true);
              }}
              onDelete={handleDeleteQuest}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0e1424] border border-dashed border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h3 className="font-fantasy text-lg font-bold text-slate-200">
              No Active Quests in Your Journal
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Type in the Quick-Add bar above or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-[10px]">N</kbd> to summon your first objective.
            </p>
          </div>
        </div>
      )}

      {/* Quest Creation/Edit Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setQuestToEdit(null);
        }}
        onSave={handleSaveQuest}
        questToEdit={questToEdit}
      />
    </div>
  );
};