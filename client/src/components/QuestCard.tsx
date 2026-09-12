import React, { useState } from 'react';
import { Quest } from '../types';
import { useSound } from '../context/SoundContext';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Coins, 
  Sparkles, 
  Gem, 
  Flame, 
  Dumbbell, 
  Brain, 
  Heart, 
  BookOpen, 
  Zap, 
  Users 
} from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string, e: React.MouseEvent) => Promise<void>;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => Promise<void>;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, onEdit, onDelete }) => {
  const { playClick, playQuestComplete } = useSound();
  const [isCompleting, setIsCompleting] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'STRENGTH':
        return { label: 'Strength', icon: Dumbbell, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/30' };
      case 'INTELLECT':
        return { label: 'Intellect', icon: Brain, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30' };
      case 'VITALITY':
        return { label: 'Vitality', icon: Heart, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30' };
      case 'WISDOM':
        return { label: 'Wisdom', icon: BookOpen, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30' };
      case 'AGILITY':
        return { label: 'Agility', icon: Zap, color: 'text-amber-600 dark:text-orange-400 bg-amber-50 dark:bg-orange-950/40 border-amber-200 dark:border-orange-500/30' };
      case 'CHARISMA':
        return { label: 'Charisma', icon: Users, color: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-500/30' };
      default:
        return { label: 'General', icon: Sparkles, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30' };
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'TRIVIAL': return 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60';
      case 'EASY': return 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30';
      case 'MEDIUM': return 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30';
      case 'HARD': return 'text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-950/30';
      case 'EPIC': return 'text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 animate-pulse';
      default: return 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const catMeta = getCategoryMeta(quest.category);
  const CategoryIcon = catMeta.icon;

  const handleComplete = async (e: React.MouseEvent) => {
    if (quest.isCompleted && quest.questType !== 'HABIT') return;
    setIsCompleting(true);
    setJustCompleted(true);
    playQuestComplete();
    try {
      await onComplete(quest.id, e);
    } finally {
      setIsCompleting(false);
      setTimeout(() => setJustCompleted(false), 800);
    }
  };

  return (
    <div 
      className={`group relative card-hover-lift animate-fade-in-up bg-[#101626]/90 border rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
        justCompleted
          ? 'border-amber-400 bg-amber-950/30 scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/50'
          : quest.isCompleted 
          ? 'border-slate-800/60 opacity-60 bg-slate-900/40' 
          : 'border-slate-800/90 hover:border-amber-500/50 hover:shadow-[0_8px_25px_-5px_rgba(245,158,11,0.15)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        
        {/* Checkmark Action Button */}
        <button
          onClick={handleComplete}
          disabled={isCompleting || (quest.isCompleted && quest.questType !== 'HABIT')}
          aria-label={quest.isCompleted ? 'Completed Quest' : 'Complete Quest'}
          className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-200 transform btn-tactile ${
            quest.isCompleted
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'border-slate-700 bg-slate-900/90 hover:border-amber-400 text-transparent hover:text-amber-400 hover:scale-105 active:scale-95 shadow-sm'
          } ${isCompleting ? 'scale-125' : ''}`}
        >
          <Check className={`w-4 h-4 stroke-[3] ${quest.isCompleted ? 'text-white' : ''}`} />
        </button>

        {/* Quest Information */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Category Tag */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${catMeta.color}`}>
              <CategoryIcon className="w-3 h-3" />
              {catMeta.label}
            </span>

            {/* Difficulty Badge */}
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(quest.difficulty)}`}>
              {quest.difficulty}
            </span>

            {/* Type Tag */}
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-400 font-medium">
              {quest.questType}
            </span>

            {/* Habit Streak and Increment button */}
            {quest.questType === 'HABIT' && (
              <div className="inline-flex items-center gap-1 bg-orange-950/40 px-2 py-0.5 rounded-lg border border-orange-500/30">
                <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                <span className="text-[11px] text-orange-400 font-bold">{quest.streakCount} Streak</span>
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={isCompleting}
                  title="Increment habit streak"
                  className="ml-1 px-1.5 py-0.2 rounded bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 hover:text-white text-[10px] font-bold transition"
                >
                  +1 Rep
                </button>
              </div>
            )}
          </div>

          <h3 className={`font-semibold text-sm sm:text-base text-slate-100 leading-snug transition ${
            quest.isCompleted ? 'line-through text-slate-400' : 'group-hover:text-amber-200'
          }`}>
            {quest.title}
          </h3>

          {quest.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {quest.description}
            </p>
          )}

          {/* Reward Badges */}
          <div className="flex items-center gap-3 mt-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              +{quest.xpReward} XP
            </span>
            <span className="flex items-center gap-1 text-yellow-300">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              +{quest.goldReward} Gold
            </span>
            {quest.gemReward > 0 && (
              <span className="flex items-center gap-1 text-cyan-400">
                <Gem className="w-3.5 h-3.5 text-cyan-400" />
                +{quest.gemReward} Gem
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons (Edit / Delete) */}
        <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
          <button
            onClick={() => {
              playClick();
              onEdit(quest);
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Edit Quest"
            aria-label="Edit Quest"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              playClick();
              onDelete(quest.id);
            }}
            className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
            title="Banish Quest"
            aria-label="Delete Quest"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};