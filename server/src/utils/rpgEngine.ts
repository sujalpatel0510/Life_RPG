import { QuestDifficulty, StatCategory } from '@prisma/client';

export interface LevelProgressionResult {
  newLevel: number;
  newCurrentXp: number;
  nextLevelXp: number;
  levelsGained: number;
}

export const getXpRequiredForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

export const calculateProgression = (
  currentLevel: number,
  currentXp: number,
  xpEarned: number
): LevelProgressionResult => {
  let level = currentLevel;
  let xp = currentXp + xpEarned;
  let nextXp = getXpRequiredForLevel(level);
  let levelsGained = 0;

  while (xp >= nextXp) {
    xp -= nextXp;
    level += 1;
    levelsGained += 1;
    nextXp = getXpRequiredForLevel(level);
  }

  return {
    newLevel: level,
    newCurrentXp: xp,
    nextLevelXp: nextXp,
    levelsGained,
  };
};

export const getBaseQuestRewards = (difficulty: QuestDifficulty) => {
  switch (difficulty) {
    case 'TRIVIAL':
      return { xpReward: 20, goldReward: 8, gemReward: 0, statGain: 1 };
    case 'EASY':
      return { xpReward: 40, goldReward: 15, gemReward: 0, statGain: 1 };
    case 'MEDIUM':
      return { xpReward: 75, goldReward: 30, gemReward: 1, statGain: 2 };
    case 'HARD':
      return { xpReward: 150, goldReward: 60, gemReward: 2, statGain: 3 };
    case 'EPIC':
      return { xpReward: 300, goldReward: 120, gemReward: 5, statGain: 5 };
    default:
      return { xpReward: 50, goldReward: 20, gemReward: 1, statGain: 1 };
  }
};

export const calculateStreak = (lastActiveDate: Date | null): { newStreak: number; streakIncremented: boolean } => {
  if (!lastActiveDate) {
    return { newStreak: 1, streakIncremented: true };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastActive = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate());
  const diffTime = today.getTime() - lastActive.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already active today
    return { newStreak: 0, streakIncremented: false }; // 0 means keep existing
  } else if (diffDays === 1) {
    // Consecutive day
    return { newStreak: 1, streakIncremented: true }; // Increment existing by 1
  } else {
    // Streak broken
    return { newStreak: 1, streakIncremented: false }; // Reset to 1
  }
};
