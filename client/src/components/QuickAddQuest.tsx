import React, { useState } from 'react';
import { StatCategory, QuestType, QuestDifficulty } from '../types';
import { useSound } from '../context/SoundContext';
import { 
  Plus, 
  Dumbbell, 
  Brain, 
  Heart, 
  BookOpen, 
  Zap, 
  Users, 
  CornerDownLeft,
  Sparkles
} from 'lucide-react';

interface QuickAddQuestProps {
  onAdd: (questData: any) => Promise<void>;
}

export const QuickAddQuest: React.FC<QuickAddQuestProps> = ({ onAdd }) => {
  const { playClick, playCoin } = useSound();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StatCategory>('INTELLECT');
  const [questType, setQuestType] = useState<QuestType>('TODO');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { id: StatCategory; label: string; icon: any; color: string }[] = [
    { id: 'INTELLECT', label: 'Intellect', icon: Brain, color: 'text-cyan-500 hover:border-cyan-500/50' },
    { id: 'STRENGTH', label: 'Strength', icon: Dumbbell, color: 'text-indigo-500 hover:border-indigo-500/50' },
    { id: 'VITALITY', label: 'Vitality', icon: Heart, color: 'text-emerald-500 hover:border-emerald-500/50' },
    { id: 'WISDOM', label: 'Wisdom', icon: BookOpen, color: 'text-violet-500 hover:border-violet-500/50' },
    { id: 'AGILITY', label: 'Agility', icon: Zap, color: 'text-amber-500 hover:border-amber-500/50' },
    { id: 'CHARISMA', label: 'Charisma', icon: Users, color: 'text-fuchsia-500 hover:border-fuchsia-500/50' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        category,
        questType,
        difficulty: 'MEDIUM' as QuestDifficulty,
      });
      playCoin();
      setTitle('');
    } catch (err) {
      console.error('Failed to quick-add quest:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="surface border border-slate-300 dark:border-slate-700 hover:border-indigo-500/40 rounded-2xl p-2.5 sm:p-3 shadow-sm transition-all duration-300 focus-within:border-indigo-500/60 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 text-indigo-500">
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick add quest objective... (e.g., '10 LeetCode MCQs', 'Drink 1L Water', 'Review PR')"
          className="flex-1 bg-transparent text-title placeholder:text-muted text-xs sm:text-sm focus:outline-none px-2"
          disabled={isSubmitting}
        />

        {/* Enter key badge button */}
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="btn-tactile flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl btn-primary text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 flex-shrink-0 cursor-pointer"
          title="Press Enter to Summon"
        >
          <span>{isSubmitting ? 'Summoning...' : 'Add'}</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Attribute Chips & Cadence Row */}
      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] uppercase font-bold text-muted tracking-wider mr-1">
            Stat:
          </span>
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = category === c.id;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => {
                  playClick();
                  setCategory(c.id);
                }}
                className={`btn-tactile flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-500/60 text-indigo-800 dark:text-indigo-300 ring-1 ring-indigo-400/40 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cadence Pills */}
        <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
          {(['TODO', 'DAILY', 'HABIT'] as QuestType[]).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => {
                playClick();
                setQuestType(type);
              }}
              className={`btn-tactile px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase transition ${
                questType === type
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm font-extrabold border border-indigo-200 dark:border-transparent'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

    </form>
  );
};