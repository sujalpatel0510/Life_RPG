import { PrismaClient, ItemCategory, ItemRarity } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Planting seeds into the Life RPG realm...');

  // Seed Shop Items
  const items = [
    {
      name: 'Iron Longsword',
      description: 'A reliable blade forged by village blacksmiths. Adds physical damage and strength.',
      category: ItemCategory.WEAPON,
      rarity: ItemRarity.COMMON,
      priceGold: 80,
      priceGems: 0,
      statBonusStr: 4,
      damageBonus: 10,
      icon: 'sword',
    },
    {
      name: 'Archmage Spellblade',
      description: 'Humming with arcane energy. Sharpens intellectual focus and critical study habits.',
      category: ItemCategory.WEAPON,
      rarity: ItemRarity.RARE,
      priceGold: 220,
      priceGems: 2,
      statBonusInt: 8,
      damageBonus: 18,
      icon: 'wand',
    },
    {
      name: 'Shadowstep Dagger',
      description: 'Silent and lethal. Boosts speed, agility, and time-block discipline.',
      category: ItemCategory.WEAPON,
      rarity: ItemRarity.RARE,
      priceGold: 200,
      priceGems: 1,
      statBonusAgi: 8,
      damageBonus: 16,
      icon: 'zap',
    },
    {
      name: 'Plate of the Iron Vanguard',
      description: 'Heavy armor tempered against fatigue. Bolsters endurance and vitality.',
      category: ItemCategory.ARMOR,
      rarity: ItemRarity.RARE,
      priceGold: 240,
      priceGems: 2,
      statBonusVit: 8,
      statBonusStr: 3,
      icon: 'shield',
    },
    {
      name: 'Robes of Deep Meditation',
      description: 'Woven with celestial silk that calms the mind during reading and reflection.',
      category: ItemCategory.ARMOR,
      rarity: ItemRarity.UNCOMMON,
      priceGold: 150,
      priceGems: 0,
      statBonusWis: 6,
      icon: 'sparkles',
    },
    {
      name: 'Dragonscale Fortress Cuirass',
      description: 'Legendary dragon scales that reflect distractions and grant unmatched resilience.',
      category: ItemCategory.ARMOR,
      rarity: ItemRarity.EPIC,
      priceGold: 500,
      priceGems: 8,
      statBonusVit: 14,
      statBonusStr: 8,
      damageBonus: 12,
      icon: 'shield',
    },
    {
      name: 'Elixir of Hyper-Focus',
      description: 'A sparkling blue tincture that supercharges mental clarity for deep work.',
      category: ItemCategory.POTION,
      rarity: ItemRarity.COMMON,
      priceGold: 45,
      priceGems: 0,
      statBonusInt: 3,
      icon: 'flask',
    },
    {
      name: 'Phoenix Streak Feather',
      description: 'A warm ember feather that radiates undying motivation across all consecutive days.',
      category: ItemCategory.RELIC,
      rarity: ItemRarity.EPIC,
      priceGold: 350,
      priceGems: 5,
      statBonusAgi: 5,
      statBonusVit: 5,
      damageBonus: 15,
      icon: 'flame',
    },
    {
      name: 'Crown of Sovereign Presence',
      description: 'Gilded with royal gems. Imparts supreme charisma and social confidence.',
      category: ItemCategory.RELIC,
      rarity: ItemRarity.LEGENDARY,
      priceGold: 800,
      priceGems: 15,
      statBonusCha: 16,
      damageBonus: 20,
      icon: 'crown',
    },
  ];

  for (const item of items) {
    await prisma.shopItem.upsert({
      where: { name: item.name },
      update: item,
      create: item,
    });
  }

  // Seed World Boss
  const existingBoss = await prisma.boss.findFirst({
    where: { name: 'Ignis, the Procrastination Wyrm' },
  });

  if (!existingBoss) {
    await prisma.boss.create({
      data: {
        name: 'Ignis, the Procrastination Wyrm',
        title: 'Devourer of Hours',
        description: 'A colossal shadow drake feeding on delayed deadlines and abandoned resolutions. Strike it down with daily quest completion!',
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

  // Seed Evaluator Demo Hero
  const demoEmail = 'hero@zephyr.com';
  let demoUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!demoUser) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('zephyr123', salt);

    demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        username: 'AegisKnight',
        passwordHash,
        character: {
          create: {
            name: 'Sir Valerius',
            heroClass: 'WARRIOR',
            title: 'Guardian of the Realm',
            level: 2,
            currentXp: 140,
            nextLevelXp: 282,
            gold: 180,
            gems: 15,
            hp: 110,
            maxHp: 110,
            strength: 16,
            intellect: 14,
            vitality: 15,
            wisdom: 12,
            agility: 13,
            charisma: 12,
            streakDays: 3,
          },
        },
      },
    });

    // Seed Starter Quests for Demo User
    await prisma.quest.createMany({
      data: [
        {
          userId: demoUser.id,
          title: 'Deep Work: Implement LeetCode Tree Algorithms',
          description: 'Focus sprint for 45 minutes on binary tree traversal and dynamic programming.',
          category: 'INTELLECT',
          difficulty: 'HARD',
          questType: 'TODO',
          xpReward: 150,
          goldReward: 60,
          gemReward: 2,
        },
        {
          userId: demoUser.id,
          title: 'Morning 5km Jog & Core Workout',
          description: 'High intensity cardio to prime physical endurance.',
          category: 'STRENGTH',
          difficulty: 'MEDIUM',
          questType: 'DAILY',
          xpReward: 75,
          goldReward: 30,
          gemReward: 1,
        },
        {
          userId: demoUser.id,
          title: 'Optimal Recovery: Drink 2.5L Water',
          description: 'Hydration checkpoints across morning, afternoon, and evening.',
          category: 'VITALITY',
          difficulty: 'EASY',
          questType: 'HABIT',
          xpReward: 40,
          goldReward: 15,
          gemReward: 0,
          streakCount: 3,
        },
        {
          userId: demoUser.id,
          title: '30 Minutes of Mindful Reading',
          description: 'Read 25 pages of Designing Data-Intensive Applications.',
          category: 'WISDOM',
          difficulty: 'MEDIUM',
          questType: 'DAILY',
          xpReward: 75,
          goldReward: 30,
          gemReward: 1,
        },
      ],
    });

    // Give Demo User an Iron Longsword
    const sword = await prisma.shopItem.findUnique({
      where: { name: 'Iron Longsword' },
    });
    if (sword) {
      await prisma.userItem.create({
        data: {
          userId: demoUser.id,
          itemId: sword.id,
          isEquipped: true,
        },
      });
    }
  }

  console.log('✨ Life RPG database seeded successfully with Armoury, Boss Raids & Demo Hero!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
