import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';

export const getCharacter = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const character = await prisma.character.findUnique({
      where: { userId: req.userId },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!character) {
      res.status(404).json({ message: 'Character profile not found.' });
      return;
    }

    // Get equipped gear
    const equippedGear = await prisma.userItem.findMany({
      where: {
        userId: req.userId,
        isEquipped: true,
      },
      include: {
        item: true,
      },
    });

    // Get completed quests count & total earned stats
    const totalCompletedQuests = await prisma.quest.count({
      where: {
        userId: req.userId,
        isCompleted: true,
      },
    });

    // Get recent activity logs
    const activityLogs = await prisma.activityLog.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({
      character,
      equippedGear,
      stats: {
        totalCompletedQuests,
      },
      activityLogs,
    });
  } catch (error: any) {
    console.error('Fetch character error:', error);
    res.status(500).json({ message: 'Failed to retrieve character sheet.', error: error.message });
  }
};

export const updateCharacter = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, title, avatarUrl } = req.body;

    const updated = await prisma.character.update({
      where: { userId: req.userId },
      data: {
        name: name ? name.trim() : undefined,
        title: title ? title.trim() : undefined,
        avatarUrl: avatarUrl || undefined,
      },
    });

    res.json({ message: 'Hero profile updated.', character: updated });
  } catch (error: any) {
    console.error('Update character error:', error);
    res.status(500).json({ message: 'Failed to update hero details.', error: error.message });
  }
};
