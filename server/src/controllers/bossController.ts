import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getActiveBoss = async (req: Request, res: Response): Promise<void> => {
  try {
    let boss = await prisma.boss.findFirst({
      where: { isActive: true },
      orderBy: { level: 'asc' },
    });

    // If no active boss, resurrect or create default boss
    if (!boss) {
      boss = await prisma.boss.create({
        data: {
          name: 'Ignis, the Procrastination Wyrm',
          title: 'Devourer of Hours',
          description: 'A colossal shadow beast that feeds on delayed work and forgotten habits. Slay it by conquering your daily quests!',
          hp: 1500,
          maxHp: 1500,
          level: 3,
          rewardGold: 500,
          rewardXp: 800,
          rewardBadge: 'Wyrm Slayer',
          avatar: 'dragon',
          isActive: true,
        },
      });
    }

    res.json({ boss });
  } catch (error: any) {
    console.error('Fetch boss error:', error);
    res.status(500).json({ message: 'Failed to summon boss status.', error: error.message });
  }
};

export const resurrectBoss = async (req: Request, res: Response): Promise<void> => {
  try {
    const boss = await prisma.boss.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (boss) {
      const updated = await prisma.boss.update({
        where: { id: boss.id },
        data: {
          hp: boss.maxHp,
          isActive: true,
        },
      });
      res.json({ message: 'The Boss has risen from the underworld!', boss: updated });
    } else {
      res.status(404).json({ message: 'No boss record found.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to resurrect boss.', error: error.message });
  }
};
