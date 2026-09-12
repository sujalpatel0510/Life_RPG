import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';
import { calculateProgression, getBaseQuestRewards, calculateStreak } from '../utils/rpgEngine';
import { QuestDifficulty, StatCategory, QuestType } from '@prisma/client';

export const getQuests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, questType, isCompleted } = req.query;

    const whereClause: any = { userId: req.userId };

    if (category) {
      whereClause.category = category as StatCategory;
    }
    if (questType) {
      whereClause.questType = questType as QuestType;
    }
    if (isCompleted !== undefined) {
      whereClause.isCompleted = isCompleted === 'true';
    }

    const quests = await prisma.quest.findMany({
      where: whereClause,
      orderBy: [
        { isCompleted: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({ quests });
  } catch (error: any) {
    console.error('Fetch quests error:', error);
    res.status(500).json({ message: 'Error retrieving quest log.', error: error.message });
  }
};

export const createQuest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, difficulty, questType, dueDate } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({ message: 'Quest title cannot be empty.' });
      return;
    }

    const validDifficulty = (difficulty as QuestDifficulty) || QuestDifficulty.MEDIUM;
    const baseRewards = getBaseQuestRewards(validDifficulty);

    const quest = await prisma.quest.create({
      data: {
        userId: req.userId!,
        title: title.trim(),
        description: description ? description.trim() : null,
        category: (category as StatCategory) || StatCategory.INTELLECT,
        difficulty: validDifficulty,
        questType: (questType as QuestType) || QuestType.TODO,
        xpReward: baseRewards.xpReward,
        goldReward: baseRewards.goldReward,
        gemReward: baseRewards.gemReward,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.status(201).json({ message: 'Quest added to your journal!', quest });
  } catch (error: any) {
    console.error('Create quest error:', error);
    res.status(500).json({ message: 'Failed to summon new quest.', error: error.message });
  }
};

export const updateQuest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, category, difficulty, questType, dueDate } = req.body;

    const existingQuest = await prisma.quest.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingQuest) {
      res.status(404).json({ message: 'Quest not found or unauthorized.' });
      return;
    }

    let xpReward = existingQuest.xpReward;
    let goldReward = existingQuest.goldReward;
    let gemReward = existingQuest.gemReward;

    if (difficulty && difficulty !== existingQuest.difficulty) {
      const rewards = getBaseQuestRewards(difficulty as QuestDifficulty);
      xpReward = rewards.xpReward;
      goldReward = rewards.goldReward;
      gemReward = rewards.gemReward;
    }

    const updatedQuest = await prisma.quest.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existingQuest.title,
        description: description !== undefined ? description : existingQuest.description,
        category: category || existingQuest.category,
        difficulty: difficulty || existingQuest.difficulty,
        questType: questType || existingQuest.questType,
        dueDate: dueDate ? new Date(dueDate) : existingQuest.dueDate,
        xpReward,
        goldReward,
        gemReward,
      },
    });

    res.json({ message: 'Quest chronicle updated!', quest: updatedQuest });
  } catch (error: any) {
    console.error('Update quest error:', error);
    res.status(500).json({ message: 'Failed to update quest.', error: error.message });
  }
};

export const deleteQuest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existingQuest = await prisma.quest.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingQuest) {
      res.status(404).json({ message: 'Quest not found or unauthorized.' });
      return;
    }

    await prisma.quest.delete({
      where: { id },
    });

    res.json({ message: 'Quest banished from your journal.' });
  } catch (error: any) {
    console.error('Delete quest error:', error);
    res.status(500).json({ message: 'Failed to delete quest.', error: error.message });
  }
};

export const completeQuest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const quest = await prisma.quest.findFirst({
      where: { id, userId: req.userId },
    });

    if (!quest) {
      res.status(404).json({ message: 'Quest not found or unauthorized.' });
      return;
    }

    if (quest.isCompleted && quest.questType !== QuestType.HABIT) {
      res.status(400).json({ message: 'Quest already marked as conquered!' });
      return;
    }

    const character = await prisma.character.findUnique({
      where: { userId: req.userId },
    });

    if (!character) {
      res.status(404).json({ message: 'Character profile missing.' });
      return;
    }

    // Get equipped gear bonuses
    const equippedItems = await prisma.userItem.findMany({
      where: { userId: req.userId, isEquipped: true },
      include: { item: true },
    });

    const bonusDmg = equippedItems.reduce((acc, curr) => acc + curr.item.damageBonus, 0);

    // Calculate progression
    const progression = calculateProgression(character.level, character.currentXp, quest.xpReward);
    const baseRewards = getBaseQuestRewards(quest.difficulty);

    // Stat increments
    const statUpdates: any = {};
    if (quest.category === StatCategory.STRENGTH) statUpdates.strength = character.strength + baseRewards.statGain;
    if (quest.category === StatCategory.INTELLECT) statUpdates.intellect = character.intellect + baseRewards.statGain;
    if (quest.category === StatCategory.VITALITY) {
      statUpdates.vitality = character.vitality + baseRewards.statGain;
      statUpdates.maxHp = character.maxHp + baseRewards.statGain * 5;
      statUpdates.hp = Math.min(character.maxHp + baseRewards.statGain * 5, character.hp + baseRewards.statGain * 5);
    }
    if (quest.category === StatCategory.WISDOM) statUpdates.wisdom = character.wisdom + baseRewards.statGain;
    if (quest.category === StatCategory.AGILITY) statUpdates.agility = character.agility + baseRewards.statGain;
    if (quest.category === StatCategory.CHARISMA) statUpdates.charisma = character.charisma + baseRewards.statGain;

    // Streak calculation
    const streakResult = calculateStreak(character.lastActiveDate);
    let newStreakDays = character.streakDays;
    if (streakResult.streakIncremented) {
      newStreakDays += 1;
    } else if (streakResult.newStreak === 1 && !streakResult.streakIncremented) {
      newStreakDays = 1;
    }

    // Update character
    const updatedCharacter = await prisma.character.update({
      where: { userId: req.userId },
      data: {
        level: progression.newLevel,
        currentXp: progression.newCurrentXp,
        nextLevelXp: progression.nextLevelXp,
        gold: character.gold + quest.goldReward,
        gems: character.gems + quest.gemReward,
        streakDays: newStreakDays,
        lastActiveDate: new Date(),
        ...statUpdates,
      },
    });

    // Update quest status
    const updatedQuest = await prisma.quest.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        streakCount: quest.questType === QuestType.HABIT ? quest.streakCount + 1 : quest.streakCount,
      },
    });

    // Boss damage calculation
    const activeBoss = await prisma.boss.findFirst({
      where: { isActive: true },
    });

    let bossDamage = 0;
    let bossDefeated = false;
    let bossInfo: any = null;

    if (activeBoss && activeBoss.hp > 0) {
      bossDamage = Math.round(quest.xpReward * 0.6 + character.strength * 0.4 + bonusDmg);
      const remainingHp = Math.max(0, activeBoss.hp - bossDamage);
      bossDefeated = remainingHp === 0;

      bossInfo = await prisma.boss.update({
        where: { id: activeBoss.id },
        data: {
          hp: remainingHp,
          isActive: remainingHp > 0,
        },
      });

      // Boss defeat rewards
      if (bossDefeated) {
        await prisma.character.update({
          where: { userId: req.userId },
          data: {
            gold: updatedCharacter.gold + activeBoss.rewardGold,
            gems: updatedCharacter.gems + 15,
            title: activeBoss.rewardBadge,
          },
        });
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.userId!,
        actionType: 'QUEST_COMPLETED',
        details: JSON.stringify({
          questTitle: quest.title,
          category: quest.category,
          xpEarned: quest.xpReward,
          goldEarned: quest.goldReward,
          levelsGained: progression.levelsGained,
          bossDamage,
        }),
      },
    });

    res.json({
      message: 'Quest victoriously completed!',
      quest: updatedQuest,
      character: updatedCharacter,
      reward: {
        xp: quest.xpReward,
        gold: quest.goldReward,
        gems: quest.gemReward,
        category: quest.category,
        statGain: baseRewards.statGain,
      },
      progression: {
        leveledUp: progression.levelsGained > 0,
        levelsGained: progression.levelsGained,
        newLevel: progression.newLevel,
      },
      bossEncounter: {
        damageDealt: bossDamage,
        bossDefeated,
        remainingBossHp: bossInfo ? bossInfo.hp : null,
      },
    });
  } catch (error: any) {
    console.error('Complete quest error:', error);
    res.status(500).json({ message: 'Failed to claim quest victory.', error: error.message });
  }
};
