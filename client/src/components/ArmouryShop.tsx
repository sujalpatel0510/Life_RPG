import React, { useState, useEffect } from 'react';
import { ShopItem, ItemCategory } from '../types';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { 
  ShoppingBag, 
  Coins, 
  Gem, 
  Sword, 
  Shield, 
  Sparkles, 
  Zap, 
  Flame, 
  Check, 
  Crown,
  Heart,
  Wand2
} from 'lucide-react';

export const ArmouryShop: React.FC = () => {
  const { character, setCharacter } = useAuth();
  const { playClick, playCoin, playEquip } = useSound();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [equippingId, setEquippingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.shop.getItems();
      if (data && data.items) {
        setItems(data.items);
      }
    } catch (err: any) {
      console.error('Failed to load Armoury:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleBuy = async (item: ShopItem) => {
    if (!character) return;
    if (character.gold < item.priceGold || character.gems < item.priceGems) {
      setStatusMessage('⚠️ Insufficient gold or gems in your treasury!');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setPurchasingId(item.id);
    playClick();
    try {
      const res = await api.shop.buy(item.id);
      playCoin();
      if (res.character) {
        setCharacter(res.character);
      }
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isOwned: true } : i));
      setStatusMessage(`✨ Acquired ${item.name}! Check your inventory.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage(`⚠️ ${err.message || 'Purchase failed.'}`);
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setPurchasingId(null);
    }
  };

  const handleEquip = async (item: ShopItem) => {
    setEquippingId(item.id);
    playEquip();
    try {
      const res = await api.shop.equip(item.id);
      if (res.character) {
        setCharacter(res.character);
      }
      // Re-fetch to synchronize active equipped states
      await fetchItems();
      setStatusMessage(`🛡️ ${res.message}`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage(`⚠️ ${err.message || 'Failed to equip.'}`);
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setEquippingId(null);
    }
  };

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'border-slate-700 bg-slate-900/60 text-slate-300';
      case 'UNCOMMON': return 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400';
      case 'RARE': return 'border-blue-500/50 bg-blue-950/30 text-blue-400 item-glow-rare';
      case 'EPIC': return 'border-purple-500/50 bg-purple-950/30 text-purple-300 item-glow-epic';
      case 'LEGENDARY': return 'border-amber-500/60 bg-amber-950/30 text-amber-300 item-glow-legendary animate-pulse-glow';
      default: return 'border-slate-700 bg-slate-900/60 text-slate-300';
    }
  };

  const getItemIcon = (icon: string) => {
    switch (icon) {
      case 'sword': return Sword;
      case 'shield': return Shield;
      case 'wand': return Wand2;
      case 'zap': return Zap;
      case 'flame': return Flame;
      case 'crown': return Crown;
      case 'heart': return Heart;
      default: return Sparkles;
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  const categories = [
    { id: 'ALL', label: 'All Artifacts' },
    { id: 'WEAPON', label: 'Weapons' },
    { id: 'ARMOR', label: 'Armor' },
    { id: 'RELIC', label: 'Relics' },
    { id: 'POTION', label: 'Potions' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Armoury Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101626] border border-slate-800 rounded-2xl p-6">
        <div>
          <h2 className="font-fantasy text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            The Royal Armoury & Item Emporium
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Exchange your quest gold and gems for equipment that boosts your real-world productivity stats and boss damage.
          </p>
        </div>

        {/* Treasury Display */}
        {character && (
          <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-700 px-4 py-2.5 rounded-xl flex-shrink-0">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-sm">
              <Coins className="w-4 h-4" />
              <span>{character.gold} Gold</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold text-sm">
              <Gem className="w-4 h-4" />
              <span>{character.gems} Gems</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Toast */}
      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-fade-in">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-amber-400 hover:text-amber-200">✕</button>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              playClick();
              setSelectedCategory(c.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === c.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-[#101626] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Item Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const Icon = getItemIcon(item.icon);
            const isOwned = item.isOwned;
            const isEquipped = item.isEquipped;

            return (
              <div 
                key={item.id}
                className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 ${getRarityStyle(item.rarity)}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-current flex items-center justify-center flex-shrink-0 shadow">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-current">
                        {item.rarity}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-fantasy text-base font-bold text-slate-100 mt-3">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Stat Bonus Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.statBonusStr > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-500/30">
                        +{item.statBonusStr} STR
                      </span>
                    )}
                    {item.statBonusInt > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/60 text-blue-400 border border-blue-500/30">
                        +{item.statBonusInt} INT
                      </span>
                    )}
                    {item.statBonusVit > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        +{item.statBonusVit} VIT
                      </span>
                    )}
                    {item.statBonusWis > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/60 text-purple-300 border border-purple-500/30">
                        +{item.statBonusWis} WIS
                      </span>
                    )}
                    {item.statBonusAgi > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950/60 text-orange-400 border border-orange-500/30">
                        +{item.statBonusAgi} AGI
                      </span>
                    )}
                    {item.statBonusCha > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-950/60 text-pink-400 border border-pink-500/30">
                        +{item.statBonusCha} CHA
                      </span>
                    )}
                    {item.damageBonus > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-950/60 text-yellow-400 border border-yellow-500/30">
                        +{item.damageBonus} BOSS DMG
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-xs font-bold">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> {item.priceGold}
                    </span>
                    {item.priceGems > 0 && (
                      <span className="text-cyan-400 flex items-center gap-1">
                        <Gem className="w-3.5 h-3.5" /> {item.priceGems}
                      </span>
                    )}
                  </div>

                  <div>
                    {isOwned ? (
                      item.category !== 'POTION' ? (
                        <button
                          onClick={() => handleEquip(item)}
                          disabled={equippingId === item.id}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isEquipped
                              ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-500'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          {isEquipped && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          <span>{isEquipped ? 'Equipped' : 'Equip'}</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400">In Stash</span>
                      )
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={purchasingId === item.id}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition shadow"
                      >
                        {purchasingId === item.id ? 'Forging...' : 'Forge & Buy'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};