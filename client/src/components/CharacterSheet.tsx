import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { 
  User, 
  Shield, 
  Sparkles, 
  Dumbbell, 
  Brain, 
  Heart, 
  BookOpen, 
  Zap, 
  Users, 
  Sword, 
  Crown,
  Trophy,
  Activity
} from 'lucide-react';

export const CharacterSheet: React.FC = () => {
  const { character, setCharacter } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await api.character.get();
        setProfileData(data);
      } catch (err) {
        console.error('Error loading character details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [character]);

  if (!character) return null;

  // Stat values
  const stats = [
    { key: 'strength', label: 'Strength', val: character.strength, icon: Dumbbell, color: 'text-indigo-600 dark:text-indigo-400', barColor: 'bg-indigo-500', desc: 'Physical fitness & resistance training' },
    { key: 'intellect', label: 'Intellect', val: character.intellect, icon: Brain, color: 'text-cyan-600 dark:text-cyan-400', barColor: 'bg-cyan-500', desc: 'Coding, technical study & problem solving' },
    { key: 'vitality', label: 'Vitality', val: character.vitality, icon: Heart, color: 'text-emerald-600 dark:text-emerald-400', barColor: 'bg-emerald-500', desc: 'Sleep quality, nutrition & hydration' },
    { key: 'wisdom', label: 'Wisdom', val: character.wisdom, icon: BookOpen, color: 'text-violet-600 dark:text-violet-400', barColor: 'bg-violet-500', desc: 'Reading books, reflection & mindfulness' },
    { key: 'agility', label: 'Agility', val: character.agility, icon: Zap, color: 'text-amber-600 dark:text-amber-400', barColor: 'bg-amber-500', desc: 'Discipline, time blocking & task velocity' },
    { key: 'charisma', label: 'Charisma', val: character.charisma, icon: Users, color: 'text-fuchsia-600 dark:text-fuchsia-400', barColor: 'bg-fuchsia-500', desc: 'Communication, networking & collaboration' },
  ];

  // Radar Polygon Coordinates for 6 attributes (Center 150, 150; Radius 100)
  const maxScale = 50; // Reference max stat
  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  const points = stats.map((stat, idx) => {
    const angle = (Math.PI / 3) * idx - Math.PI / 2;
    const scaledVal = Math.min(stat.val, maxScale) / maxScale;
    const r = radius * Math.max(0.15, scaledVal);
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="space-y-6">
      
      {/* Top Identity Card */}
      <div className="surface rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        
        {/* Class Crest / Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-100 via-white to-indigo-50 dark:from-[#171922] dark:via-[#12131a] dark:to-[#0c0d14] border-2 border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center shadow-md dark:shadow-xl">
            <Shield className="w-14 h-14 text-indigo-600 dark:text-indigo-400 fill-indigo-500/20" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-[#12131a] border border-indigo-500 rounded-full px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:text-indigo-400 shadow">
            Lv. {character.level}
          </div>
        </div>


        {/* Hero Credentials */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-fantasy text-2xl sm:text-3xl font-bold text-title">
              {character.name}
            </h1>
            <span className="badge-gold px-3 py-0.5 rounded-full text-xs font-bold tracking-wide">
              {character.heroClass}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs text-body font-semibold">Active Title:</span>
            <select
              value={character.title}
              onChange={async (e) => {
                const newTitle = e.target.value;
                try {
                  const res = await api.character.update({ title: newTitle });
                  if (res && res.character) {
                    setCharacter(res.character);
                  }
                } catch (err: any) {
                  alert(err.message || 'Failed to equip title');
                }
              }}
              className="input rounded-lg px-2.5 py-1 text-xs text-indigo-800 dark:text-indigo-300 font-serif italic focus:outline-none focus:border-indigo-500 transition cursor-pointer shadow-sm"
            >
              {[
                'The Awakened',
                'Novice Adventurer',
                'Task Slayer',
                'Iron Will Vanguard',
                'Code Mage',
                'Architect of Focus',
                'Mythic Champion',
                'Zephyr Conqueror'
              ].map(t => (
                <option key={t} value={t} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                  "{t}"
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
            <div className="surface-elevated px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-muted">Max HP:</span>{' '}
              <span className="font-bold text-rose-600 dark:text-rose-400">{character.maxHp}</span>
            </div>
            <div className="surface-elevated px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-muted">XP to Next Level:</span>{' '}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{character.nextLevelXp - character.currentXp} XP</span>
            </div>
            <div className="surface-elevated px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-muted">Completed Quests:</span>{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{profileData?.stats?.totalCompletedQuests || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Milestone Progression Roadmap */}
      <div className="surface rounded-2xl p-5 shadow-sm">
        <h3 className="font-fantasy text-sm font-bold text-title mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          Level Milestone Progression Roadmap
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { lvl: 1, title: 'Awakened', perk: 'Base Combat Stats', unlocked: character.level >= 1 },
            { lvl: 2, title: 'Apprentice', perk: '+15% Boss Damage', unlocked: character.level >= 2 },
            { lvl: 3, title: 'Veteran', perk: '+10% Gold Rewards', unlocked: character.level >= 3 },
            { lvl: 5, title: 'Master', perk: 'Relic Slot Synergy', unlocked: character.level >= 5 },
            { lvl: 10, title: 'Grandmaster', perk: 'Mythic Title & Glow', unlocked: character.level >= 10 },
          ].map((m, idx) => (
            <div
              key={m.lvl}
              className={`card-hover-lift p-3 rounded-xl border flex flex-col items-center text-center transition ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              } ${
                m.unlocked
                  ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-500/40 text-indigo-900 dark:text-indigo-300 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#151722] border-slate-200 dark:border-[#222533] text-slate-500 opacity-60'
              }`}
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                m.unlocked ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30 font-extrabold' : 'bg-slate-200 dark:bg-[#1a1d2b] text-slate-600 dark:text-slate-400'
              }`}>
                Level {m.lvl}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{m.title}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{m.perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Stats Grid & Radar Polygon Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 6-Axis Radar Spider Chart (5 Cols) */}
        <div className="lg:col-span-5 surface rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
          <h3 className="font-fantasy text-base font-bold text-title mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            Attribute Radar
          </h3>
          <p className="text-[11px] text-body text-center mb-4">
            Visual balance of your real-world developmental domains
          </p>

          <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto">
            {/* Background Grid Rings */}
            {gridLevels.map((lvl) => {
              const gridPoints = [0, 1, 2, 3, 4, 5].map((idx) => {
                const angle = (Math.PI / 3) * idx - Math.PI / 2;
                const r = radius * lvl;
                return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
              }).join(' ');
              return (
                <polygon
                  key={lvl}
                  points={gridPoints}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  className="text-slate-400 dark:text-slate-600"
                />
              );
            })}

            {/* Radar Axes */}
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const angle = (Math.PI / 3) * idx - Math.PI / 2;
              const x2 = centerX + radius * Math.cos(angle);
              const y2 = centerY + radius * Math.sin(angle);
              return (
                <line
                  key={idx}
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                  className="text-slate-400 dark:text-slate-600"
                />
              );
            })}

            {/* Hero Attribute Polygon */}
            <polygon
              points={points}
              fill="rgba(99, 102, 241, 0.2)"
              stroke="#6366f1"
              strokeWidth="2.5"
              className="transition-all duration-500 ease-out"
            />

            {/* Stat Points & Labels */}
            {stats.map((stat, idx) => {
              const angle = (Math.PI / 3) * idx - Math.PI / 2;
              const scaledVal = Math.min(stat.val, maxScale) / maxScale;
              const r = radius * Math.max(0.15, scaledVal);
              const x = centerX + r * Math.cos(angle);
              const y = centerY + r * Math.sin(angle);

              // Label Position
              const lx = centerX + (radius + 20) * Math.cos(angle);
              const ly = centerY + (radius + 20) * Math.sin(angle);

              return (
                <g key={stat.key}>
                  <circle cx={x} cy={y} r="4.5" fill="#06b6d4" stroke="currentColor" strokeWidth="1.5" className="text-white dark:text-slate-950" />
                  <text
                    x={lx}
                    y={ly + 4}
                    fill="currentColor"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="text-slate-900 dark:text-slate-100"
                  >
                    {stat.label.substring(0, 3)} ({stat.val})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detailed Attribute Breakdown (7 Cols) */}
        <div className="lg:col-span-7 surface rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-fantasy text-base font-bold text-title">
            Attribute Specializations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.key}
                  className="card-hover-lift surface-panel rounded-xl p-3.5 space-y-2 hover:border-indigo-500/40 transition shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs font-bold text-title">{stat.label}</span>
                    </div>
                    <span className="text-sm font-black text-title font-mono">
                      {stat.val}
                    </span>
                  </div>

                  <p className="text-[10px] text-body line-clamp-1">
                    {stat.desc}
                  </p>

                  <div className="w-full progress-track rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`${stat.barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, (stat.val / maxScale) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Equipped Gear Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#222533]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
              <Sword className="w-3.5 h-3.5 text-indigo-500" />
              Equipped Loadout
            </h4>

            {profileData?.equippedGear && profileData.equippedGear.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileData.equippedGear.map((eg: any) => (
                  <div key={eg.id} className="surface-elevated border-indigo-500/30 rounded-xl p-3 flex items-center space-x-3 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-title block truncate">
                        {eg.item.name}
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400/90 font-medium">
                        {eg.item.category} • +{eg.item.damageBonus || 0} Boss DMG
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic">
                No artifacts currently equipped. Visit the Armoury to equip forged gear.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};