import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';
import { ItemCategory } from '@prisma/client';

export const getShopItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const items = await prisma.shopItem.findMany({
      orderBy: [
        { category: 'asc' },
        { priceGold: 'asc' },
      ],
    });

    // Also get what current user already owns
    const userItems = await prisma.userItem.findMany({
      where: { userId: req.userId },
      select: { itemId: true, isEquipped: true },
    });

    const ownedMap = new Map<string, boolean>();
    const equippedMap = new Map<string, boolean>();

    userItems.forEach(ui => {
      ownedMap.set(ui.itemId, true);
      equippedMap.set(ui.itemId, ui.isEquipped);
    });

    const itemsWithOwnership = items.map(item => ({
      ...item,
      isOwned: !!ownedMap.get(item.id),
      isEquipped: !!equippedMap.get(item.id),
    }));

    res.json({ items: itemsWithOwnership });
  } catch (error: any) {
    console.error('Fetch shop error:', error);
    res.status(500).json({ message: 'Failed to access Armoury merchant.', error: error.message });
  }
};

export const buyItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      res.status(400).json({ message: 'Item ID is required.' });
      return;
    }

    const item = await prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      res.status(404).json({ message: 'Item not found in Armoury catalog.' });
      return;
    }

    // Check if already owned (for non-potions)
    if (item.category !== ItemCategory.POTION) {
      const alreadyOwned = await prisma.userItem.findUnique({
        where: {
          userId_itemId: {
            userId: req.userId!,
            itemId,
          },
        },
      });

      if (alreadyOwned) {
        res.status(400).json({ message: 'You already possess this legendary artifact!' });
        return;
      }
    }

    const character = await prisma.character.findUnique({
      where: { userId: req.userId },
    });

    if (!character) {
      res.status(404).json({ message: 'Character profile missing.' });
      return;
    }

    if (character.gold < item.priceGold || character.gems < item.priceGems) {
      res.status(400).json({
        message: 'Insufficient treasury funds! Complete more quests to earn Gold and Gems.',
      });
      return;
    }

    // Deduct funds and add item
    const [updatedCharacter, userItem] = await prisma.$transaction([
      prisma.character.update({
        where: { userId: req.userId },
        data: {
          gold: character.gold - item.priceGold,
          gems: character.gems - item.priceGems,
        },
      }),
      prisma.userItem.upsert({
        where: {
          userId_itemId: {
            userId: req.userId!,
            itemId,
          },
        },
        create: {
          userId: req.userId!,
          itemId,
          isEquipped: false,
        },
        update: {
          acquiredAt: new Date(),
        },
        include: {
          item: true,
        },
      }),
      prisma.activityLog.create({
        data: {
          userId: req.userId!,
          actionType: 'ITEM_BOUGHT',
          details: JSON.stringify({
            itemName: item.name,
            category: item.category,
            costGold: item.priceGold,
            costGems: item.priceGems,
          }),
        },
      }),
    ]);

    res.json({
      message: 'Forged and claimed ' + item.name + '!',
      item: userItem,
      character: updatedCharacter,
    });
  } catch (error: any) {
    console.error('Buy item error:', error);
    res.status(500).json({ message: 'Transaction failed at the merchant.', error: error.message });
  }
};

export const equipItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.body;

    const userItem = await prisma.userItem.findUnique({
      where: {
        userId_itemId: {
          userId: req.userId!,
          itemId,
        },
      },
      include: {
        item: true,
      },
    });

    if (!userItem) {
      res.status(404).json({ message: 'Item not in your inventory.' });
      return;
    }

    const item = userItem.item;

    // If already equipped, unequip it
    if (userItem.isEquipped) {
      const updatedUserItem = await prisma.userItem.update({
        where: { id: userItem.id },
        data: { isEquipped: false },
        include: { item: true },
      });

      // Remove stat bonuses from character
      const character = await prisma.character.findUnique({ where: { userId: req.userId } });
      let updatedChar = character;
      if (character) {
        updatedChar = await prisma.character.update({
          where: { userId: req.userId },
          data: {
            strength: Math.max(10, character.strength - item.statBonusStr),
            intellect: Math.max(10, character.intellect - item.statBonusInt),
            vitality: Math.max(10, character.vitality - item.statBonusVit),
            wisdom: Math.max(10, character.wisdom - item.statBonusWis),
            agility: Math.max(10, character.agility - item.statBonusAgi),
            charisma: Math.max(10, character.charisma - item.statBonusCha),
          },
        });
      }

      res.json({
        message: 'Unequipped ' + item.name + '.',
        userItem: updatedUserItem,
        character: updatedChar,
      });
      return;
    }

    // Unequip previous item of same category (e.g. only one weapon equipped at a time)
    const existingEquipped = await prisma.userItem.findMany({
      where: {
        userId: req.userId,
        isEquipped: true,
        item: {
          category: item.category,
        },
      },
      include: { item: true },
    });

    const character = await prisma.character.findUnique({ where: { userId: req.userId } });
    if (!character) {
      res.status(404).json({ message: 'Character not found.' });
      return;
    }

    // Calculate stat net delta
    let strDelta = item.statBonusStr;
    let intDelta = item.statBonusInt;
    let vitDelta = item.statBonusVit;
    let wisDelta = item.statBonusWis;
    let agiDelta = item.statBonusAgi;
    let chaDelta = item.statBonusCha;

    for (const prev of existingEquipped) {
      await prisma.userItem.update({
        where: { id: prev.id },
        data: { isEquipped: false },
      });
      strDelta -= prev.item.statBonusStr;
      intDelta -= prev.item.statBonusInt;
      vitDelta -= prev.item.statBonusVit;
      wisDelta -= prev.item.statBonusWis;
      agiDelta -= prev.item.statBonusAgi;
      chaDelta -= prev.item.statBonusCha;
    }

    const updatedUserItem = await prisma.userItem.update({
      where: { id: userItem.id },
      data: { isEquipped: true },
      include: { item: true },
    });

    const updatedChar = await prisma.character.update({
      where: { userId: req.userId },
      data: {
        strength: character.strength + strDelta,
        intellect: character.intellect + intDelta,
        vitality: character.vitality + vitDelta,
        wisdom: character.wisdom + wisDelta,
        agility: character.agility + agiDelta,
        charisma: character.charisma + chaDelta,
      },
    });

    res.json({
      message: 'Equipped ' + item.name + '! Stats enhanced.',
      userItem: updatedUserItem,
      character: updatedChar,
    });
  } catch (error: any) {
    console.error('Equip item error:', error);
    res.status(500).json({ message: 'Failed to equip item.', error: error.message });
  }
};
