import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useSound } from '../context/SoundContext';
import { Sword, Shield, Sparkles, Plus, ExternalLink, X } from 'lucide-react';

interface EquippedLoadoutCardProps {
  onOpenArmoury: () => void;
}

export const EquippedLoadoutCard: React.FC<EquippedLoadoutCardProps> = ({ onOpenArmoury }) => {
  const { playClick, playEquip } = useSound();
  const [loadout, setLoadout] = useState<{ weapon: any; armor: any; relic: any }>({
    weapon: null,
    armor: null,
    relic: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchLoadout = async () => {
    try {
      setLoading(true);
      const data = await api.character.get();
      if (data && data.equippedGear) {
        const weapon = data.equippedGear.find((g: any) => g.item.category === 'WEAPON')?.item || null;
        const armor = data.equippedGear.find((g: any) => g.item.category === 'ARMOR')?.item || null;
        const relic = data.equippedGear.find((g: any) => g.item.category === 'RELIC')?.item || null;
        setLoadout({ weapon, armor, relic });
      }
    } catch (err) {
      console.error('Failed to load paperdoll loadout:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoadout();
  }, []);

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60';
      case 'UNCOMMON': return 'border-emerald-300 dark:border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-950/20';
      case 'RARE': return 'border-blue-300 dark:border-blue-500/60 bg-blue-50/60 dark:bg-blue-950/30 item-glow-rare';
      case 'EPIC': return 'border-purple-300 dark:border-purple-500/60 bg-purple-50/60 dark:bg-purple-950/30 item-glow-epic';
      case 'LEGENDARY': return 'border-rose-400/80 dark:border-rose-500/70 bg-rose-50/60 dark:bg-rose-950/30 item-glow-legendary animate-pulse-glow';
      default: return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60';
    }
  };

  const slots = [
    { type: 'Weapon Slot', key: 'weapon', item: loadout.weapon, defaultIcon: Sword, label: 'Primary Weapon' },
    { type: 'Armor Slot', key: 'armor', item: loadout.armor, defaultIcon: Shield, label: 'Cuirass / Mail' },
    { type: 'Relic Slot', key: 'relic', item: loadout.relic, defaultIcon: Sparkles, label: 'Arcane Relic' },
  ];

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <h3 className="font-fantasy font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          Active Armaments
        </h3>
        <button
          onClick={() => {
            playClick();
            onOpenArmoury();
          }}
          className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1"
        >
          <span>Armoury</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {slots.map((s) => {
            const Icon = s.defaultIcon;
            const item = s.item;

            if (item) {
              return (
                <div
                  key={s.key}
                  className={`card-hover-lift relative rounded-2xl border p-3 flex items-center justify-between transition-all ${getRarityGlow(item.rarity)}`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-current flex items-center justify-center flex-shrink-0 text-rose-600 dark:text-rose-400 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-rose-700 dark:text-rose-400/90 font-medium">
                        {item.rarity} • {item.damageBonus > 0 ? `+${item.damageBonus} Boss DMG` : `+${item.statBonusVit || item.statBonusInt || item.statBonusStr} Stat`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={s.key}
                onClick={() => {
                  playClick();
                  onOpenArmoury();
                }}
                className="w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/40 bg-slate-50 dark:bg-slate-900/30 p-3 flex items-center justify-between group transition text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:text-rose-500 transition shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 block">
                      Empty {s.label}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Visit Armoury to forge gear
                    </span>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-rose-500 transition mr-1" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};