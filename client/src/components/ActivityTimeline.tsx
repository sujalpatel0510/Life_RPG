import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { History, CheckCircle, ShoppingBag, Trophy, Flame, Clock } from 'lucide-react';

export const ActivityTimeline: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await api.character.get();
        if (data && data.activityLogs) {
          setLogs(data.activityLogs);
        }
      } catch (err) {
        console.error('Failed to load chronicles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const parseDetails = (detailsStr: string) => {
    try {
      return JSON.parse(detailsStr);
    } catch {
      return { info: detailsStr };
    }
  };

  const getActionMeta = (type: string) => {
    switch (type) {
      case 'QUEST_COMPLETED':
        return { label: 'Quest Conquered', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' };
      case 'ITEM_BOUGHT':
        return { label: 'Artifact Forged', icon: ShoppingBag, color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' };
      case 'LEVEL_UP':
        return { label: 'Hero Ascension', icon: Trophy, color: 'text-purple-400 bg-purple-950/40 border-purple-500/30' };
      case 'BOSS_HIT':
        return { label: 'Boss Strike', icon: Flame, color: 'text-red-400 bg-red-950/40 border-red-500/30' };
      default:
        return { label: 'Milestone', icon: History, color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6">
        <h2 className="font-fantasy text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <History className="w-6 h-6 text-amber-400" />
          Chronicles of Heroic Feats
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Immutable historical audit log of completed quests, armoury transactions, and stat milestones recorded in PostgreSQL.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-16 rounded-xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => {
            const meta = getActionMeta(log.actionType);
            const Icon = meta.icon;
            const details = parseDetails(log.details);
            const date = new Date(log.createdAt).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div 
                key={log.id} 
                className="card-hover-lift animate-fade-in-up bg-[#101626] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-amber-500/40 transition shadow-sm"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-200">
                        {meta.label}
                      </span>
                      {details.category && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {details.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {details.questTitle || details.itemName || 'Milestone achieved'}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {details.xpEarned && (
                    <div className="text-xs font-bold text-amber-400">
                      +{details.xpEarned} XP
                    </div>
                  )}
                  {details.costGold && (
                    <div className="text-xs font-bold text-yellow-400">
                      -{details.costGold} Gold
                    </div>
                  )}
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 justify-end">
                    <Clock className="w-3 h-3" />
                    {date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#0e1424] border border-slate-800">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No heroic feats recorded yet in this chronicle.</p>
        </div>
      )}
    </div>
  );
};