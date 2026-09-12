export type HeroClass = 'WARRIOR' | 'MAGE' | 'ROGUE' | 'PALADIN';

export type StatCategory = 
  | 'STRENGTH' 
  | 'INTELLECT' 
  | 'VITALITY' 
  | 'WISDOM' 
  | 'AGILITY' 
  | 'CHARISMA';

export type QuestDifficulty = 'TRIVIAL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC';

export type QuestType = 'HABIT' | 'DAILY' | 'TODO' | 'STORY';

export type ItemCategory = 'WEAPON' | 'ARMOR' | 'RELIC' | 'POTION' | 'BADGE';

export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Character {
  id: string;
  userId: string;
  name: string;
  heroClass: HeroClass;
  title: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  gold: number;
  gems: number;
  hp: number;
  maxHp: number;
  strength: number;
  intellect: number;
  vitality: number;
  wisdom: number;
  agility: number;
  charisma: number;
  streakDays: number;
  lastActiveDate: string | null;
  avatarUrl?: string | null;
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: StatCategory;
  difficulty: QuestDifficulty;
  questType: QuestType;
  xpReward: number;
  goldReward: number;
  gemReward: number;
  isCompleted: boolean;
  completedAt?: string | null;
  dueDate?: string | null;
  streakCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  priceGold: number;
  priceGems: number;
  statBonusStr: number;
  statBonusInt: number;
  statBonusVit: number;
  statBonusWis: number;
  statBonusAgi: number;
  statBonusCha: number;
  damageBonus: number;
  icon: string;
  isOwned?: boolean;
  isEquipped?: boolean;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  description: string;
  hp: number;
  maxHp: number;
  level: number;
  rewardGold: number;
  rewardXp: number;
  rewardBadge: string;
  avatar: string;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  actionType: string;
  details: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  character: Character;
  inventory?: { item: ShopItem; isEquipped: boolean }[];
}