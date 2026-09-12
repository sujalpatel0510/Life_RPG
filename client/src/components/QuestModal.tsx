import React, { useState, useEffect } from 'react';
import { Quest, StatCategory, QuestDifficulty, QuestType } from '../types';
import { useSound } from '../context/SoundContext';
import { X, Sparkles, Coins, Gem, Dumbbell, Brain, Heart, BookOpen, Zap, Users } from 'lucide-react';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questData: any) => Promise<void>;
  questToEdit?: Quest | null;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  questToEdit,
}) => {
  const { playClick, playCoin } = useSound();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<StatCategory>('INTELLECT');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('MEDIUM');
  const [questType, setQuestType] = useState<QuestType>('TODO');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (questToEdit) {
      setTitle(questToEdit.title);
      setDescription(questToEdit.description || '');
      setCategory(questToEdit.category);
      setDifficulty(questToEdit.difficulty);
      setQuestType(questToEdit.questType);
    } else {
      setTitle('');
      setDescription('');
      setCategory('INTELLECT');
      setDifficulty('MEDIUM');
      setQuestType('TODO');
    }
    setError('');
  }, [questToEdit, isOpen]);

  if (!isOpen) return null;

  const categories: { id: StatCategory; label: string; icon: any; color: string }[] = [
    { id: 'STRENGTH', label: 'Strength', icon: Dumbbell, color: 'text-indigo-500 border-indigo-500/30' },
    { id: 'INTELLECT', label: 'Intellect', icon: Brain, color: 'text-cyan-500 border-cyan-500/30' },
    { id: 'VITALITY', label: 'Vitality', icon: Heart, color: 'text-emerald-500 border-emerald-500/30' },
    { id: 'WISDOM', label: 'Wisdom', icon: BookOpen, color: 'text-violet-500 border-violet-500/30' },
    { id: 'AGILITY', label: 'Agility', icon: Zap, color: 'text-amber-500 border-amber-500/30' },
    { id: 'CHARISMA', label: 'Charisma', icon: Users, color: 'text-fuchsia-500 border-fuchsia-500/30' },
  ];

  const difficulties: { id: QuestDifficulty; label: string; xp: number; gold: number; gems: number }[] = [
    { id: 'TRIVIAL', label: 'Trivial', xp: 20, gold: 8, gems: 0 },
    { id: 'EASY', label: 'Easy', xp: 40, gold: 15, gems: 0 },
    { id: 'MEDIUM', label: 'Medium', xp: 75, gold: 30, gems: 1 },
    { id: 'HARD', label: 'Hard', xp: 150, gold: 60, gems: 2 },
    { id: 'EPIC', label: 'Epic', xp: 300, gold: 120, gems: 5 },
  ];

  const activeReward = difficulties.find(d => d.id === difficulty) || difficulties[2];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a name for this quest or heroic objective.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        difficulty,
        questType,
      });
      playCoin();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to summon quest.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-modal-backdrop">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-modal-card text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-fantasy text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            {questToEdit ? 'Reforge Quest Objective' : 'Summon New Quest'}
          </h2>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Quest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read 20 pages of System Design, 1 Hour Gym Workout..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Details & Lore (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add specifics, criteria, or sub-tasks..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition resize-none"
            />
          </div>

          {/* Quest Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Quest Cadence
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['TODO', 'DAILY', 'HABIT', 'STORY'] as QuestType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setQuestType(t)}
                  className={`btn-tactile py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                    questType === t
                      ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-400 dark:border-indigo-500 text-indigo-900 dark:text-indigo-400 shadow-sm font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Character Attribute Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Associated Attribute
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`btn-tactile flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition ${
                      isSelected
                        ? `${c.color} bg-indigo-50 dark:bg-slate-800/80 shadow-sm ring-1 ring-indigo-400/40 font-bold`
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {difficulties.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`btn-tactile py-2 px-1 text-center rounded-lg border text-xs font-bold transition ${
                    difficulty === d.id
                      ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-400 dark:border-indigo-500 text-indigo-900 dark:text-indigo-400 shadow-sm font-extrabold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Bounty Preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Conquest Bounty:</span>
            <div className="flex items-center space-x-3 font-bold">
              <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> +{activeReward.xp} XP
              </span>
              <span className="text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" /> +{activeReward.gold} Gold
              </span>
              {activeReward.gems > 0 && (
                <span className="text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                  <Gem className="w-3.5 h-3.5 text-cyan-500" /> +{activeReward.gems} Gem
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-tactile px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Summoning...' : questToEdit ? 'Save Changes' : 'Summon Quest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};