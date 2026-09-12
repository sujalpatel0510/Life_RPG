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
  const { character } = useAuth();
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
    { key: 'strength', label: 'Strength', val: character.strength, icon: Dumbbell, color: 'text-red-400', barColor: 'bg-red-500', desc: 'Physical fitness & resistance training' },
    { key: 'intellect', label: 'Intellect', val: character.intellect, icon: Brain, color: 'text-blue-400', barColor: 'bg-blue-500', desc: 'Coding, technical study & problem solving' },
    { key: 'vitality', label: 'Vitality', val: character.vitality, icon: Heart, color: 'text-emerald-400', barColor: 'bg-emerald-500', desc: 'Sleep quality, nutrition & hydration' },
    { key: 'wisdom', label: 'Wisdom', val: character.wisdom, icon: BookOpen, color: 'text-purple-400', barColor: 'bg-purple-500', desc: 'Reading books, reflection & mindfulness' },
    { key: 'agility', label: 'Agility', val: character.agility, icon: Zap, color: 'text-orange-400', barColor: 'bg-orange-500', desc: 'Discipline, time blocking & task velocity' },
    { key: 'charisma', label: 'Charisma', val: character.charisma, icon: Users, color: 'text-pink-400', barColor: 'bg-pink-500', desc: 'Communication, networking & collaboration' },
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
      <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
        
        {/* Class Crest / Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-amber-950 border-2 border-amber-500/40 flex items-center justify-center shadow-xl">
            <Shield className="w-14 h-14 text-amber-400 fill-amber-500/20" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-amber-500 rounded-full px-2.5 py-0.5 text-xs font-bold text-amber-400">
            Lv. {character.level}
          </div>
        </div>

        {/* Hero Credentials */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-fantasy text-2xl sm:text-3xl font-bold text-slate-100">
              {character.name}
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
              {character.heroClass}
            </span>
          </div>

          <p className="text-sm text-slate-400 italic">
            "{character.title}"
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Max HP:</span>{' '}
              <span className="font-bold text-rose-400">{character.maxHp}</span>
            </div>
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">XP to Next Level:</span>{' '}
              <span className="font-bold text-amber-400">{character.nextLevelXp - character.currentXp} XP</span>
            </div>
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Completed Quests:</span>{' '}
              <span className="font-bold text-emerald-400">{profileData?.stats?.totalCompletedQuests || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid & Radar Polygon Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 6-Axis Radar Spider Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-[#101626] border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
          <h3 className="font-fantasy text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Attribute Radar
          </h3>
          <p className="text-[11px] text-slate-400 text-center mb-4">
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
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="2,2"
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
                  stroke="#1e293b"
                  strokeWidth="1"
                />
              );
            })}

            {/* Hero Attribute Polygon */}
            <polygon
              points={points}
              fill="rgba(245, 158, 11, 0.3)"
              stroke="#F59E0B"
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
                  <circle cx={x} cy={y} r="4" fill="#F59E0B" stroke="#0B0F19" strokeWidth="1.5" />
                  <text
                    x={lx}
                    y={ly + 4}
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {stat.label.substring(0, 3)} ({stat.val})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detailed Attribute Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-[#101626] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-fantasy text-base font-bold text-slate-200">
            Attribute Specializations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.key}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs font-bold text-slate-200">{stat.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-100 font-mono">
                      {stat.val}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {stat.desc}
                  </p>

                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
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
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sword className="w-3.5 h-3.5 text-amber-400" />
              Equipped Loadout
            </h4>

            {profileData?.equippedGear && profileData.equippedGear.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileData.equippedGear.map((eg: any) => (
                  <div key={eg.id} className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-200 block truncate">
                        {eg.item.name}
                      </span>
                      <span className="text-[10px] text-amber-400/90 font-medium">
                        {eg.item.category} • +{eg.item.damageBonus || 0} Boss DMG
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No artifacts currently equipped. Visit the Armoury to equip forged gear.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};