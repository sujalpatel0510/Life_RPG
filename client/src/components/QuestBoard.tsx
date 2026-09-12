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
      onAddFloatingText(`+${res.reward.xp} XP`, '#6366f1', clickX - 20, clickY - 20);
      setTimeout(() => {
        onAddFloatingText(`+${res.reward.gold} Gold`, '#f59e0b', clickX + 15, clickY - 35);
      }, 120);

      // Handle boss strike damage
      if (res.bossEncounter?.damageDealt > 0) {
        playAttack();
        onBossDamage(res.bossEncounter.damageDealt);
        setTimeout(() => {
          onAddFloatingText(`⚔️ -${res.bossEncounter.damageDealt} Boss DMG!`, '#f43f5e', clickX - 10, clickY - 55);
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

  // Partition active vs completed quests
  const activeQuests = filteredQuests.filter(q => !q.isCompleted || q.questType === 'HABIT');
  const completedQuests = filteredQuests.filter(q => q.isCompleted && q.questType !== 'HABIT');
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* 1-Click Quick Add Bar */}
      <QuickAddQuest onAdd={handleQuickAdd} />

      {/* Control Bar: Search, Filters & Detailed Summon Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active quests, tags, or lore..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl input text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition shadow-sm"
          />
        </div>

        {/* Summon Quest Modal Trigger */}
        <button
          onClick={() => {
            playClick();
            setQuestToEdit(null);
            setModalOpen(true);
          }}
          className="btn-tactile flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl btn-primary text-white font-fantasy font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>DETAILED SUMMON (N)</span>
        </button>
      </div>

      {/* Cadence Segmented Controller & Category Pills */}
      <div className="space-y-3">
        {/* Cadence Tabs (Segmented bar) */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#151722] border border-slate-200 dark:border-[#222533] overflow-x-auto no-scrollbar max-w-full">
          {cadences.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                playClick();
                setActiveCadence(c.id);
              }}
              className={`btn-tactile flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCadence === c.id
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm font-bold border border-slate-200/50 dark:border-transparent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#f4f5f8]'
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeCadence === c.id 
                  ? 'bg-indigo-50 dark:bg-black/30 text-indigo-700 dark:text-white' 
                  : 'bg-slate-200/70 dark:bg-[#1f2230] text-slate-600 dark:text-slate-400'
              }`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClick();
                setActiveCategory(cat.id);
              }}
              className={`btn-tactile px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-600/50 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#f4f5f8] bg-white dark:bg-[#151722] border border-slate-200 dark:border-[#222533]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>


      {/* Quest Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 rounded-2xl bg-slate-100 dark:bg-[#151722] border border-slate-200 dark:border-[#222533] skeleton" />
          ))}
        </div>
      ) : activeQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeQuests.map((quest) => (
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
        <div className="text-center py-16 px-4 rounded-3xl surface border-2 border-dashed border-slate-300 dark:border-[#222533] space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-fantasy text-lg font-bold text-title">
              No Active Quests in Your Journal
            </h3>
            <p className="text-xs text-body max-w-sm mx-auto mt-1">
              Type in the Quick-Add bar above or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#171922] text-indigo-600 dark:text-indigo-400 font-mono text-[10px] border border-slate-200 dark:border-[#222533]">N</kbd> to summon your first objective.
            </p>
          </div>
        </div>
      )}

      {/* Conquered Chronicles Accordion (Completed Quests Archive) */}
      {completedQuests.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-[#222533]">
          <button
            type="button"
            onClick={() => {
              playClick();
              setShowCompleted(prev => !prev);
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#12131a] hover:bg-slate-100 dark:hover:bg-[#171922] border border-slate-200 dark:border-[#222533] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-[#f4f5f8] transition"
          >
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Conquered Chronicles</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[10px] font-bold">
                {completedQuests.length}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {showCompleted ? '▲ Hide Completed' : '▼ Show Completed'}
            </span>
          </button>


          {showCompleted && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fade-in">
              {completedQuests.map((quest) => (
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
          )}
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