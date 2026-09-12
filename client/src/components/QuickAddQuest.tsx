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
    { id: 'INTELLECT', label: 'Intellect', icon: Brain, color: 'text-blue-400 hover:border-blue-500/50' },
    { id: 'STRENGTH', label: 'Strength', icon: Dumbbell, color: 'text-red-400 hover:border-red-500/50' },
    { id: 'VITALITY', label: 'Vitality', icon: Heart, color: 'text-emerald-400 hover:border-emerald-500/50' },
    { id: 'WISDOM', label: 'Wisdom', icon: BookOpen, color: 'text-purple-400 hover:border-purple-500/50' },
    { id: 'AGILITY', label: 'Agility', icon: Zap, color: 'text-orange-400 hover:border-orange-500/50' },
    { id: 'CHARISMA', label: 'Charisma', icon: Users, color: 'text-pink-400 hover:border-pink-500/50' },
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
      className="bg-[#101626]/90 border border-slate-700/80 hover:border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-lg transition-all duration-300 focus-within:border-amber-500/60 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.12)]"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick add quest objective... (e.g., '10 LeetCode MCQs', 'Drink 1L Water', 'Review PR')"
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none px-2"
          disabled={isSubmitting}
        />

        {/* Enter key badge button */}
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="btn-tactile flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20 flex-shrink-0 cursor-pointer"
          title="Press Enter to Summon"
        >
          <span>{isSubmitting ? 'Summoning...' : 'Add'}</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Attribute Chips & Cadence Row */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-1">
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
                className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold transition ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500/60 text-amber-300 ring-1 ring-amber-400/30'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cadence Pills */}
        <div className="flex items-center space-x-1">
          {(['TODO', 'DAILY', 'HABIT'] as QuestType[]).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => {
                playClick();
                setQuestType(type);
              }}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition ${
                questType === type
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-500 hover:text-slate-300'
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