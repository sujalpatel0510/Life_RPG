import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { HeroClass } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_rpg_hero_jwt_key_tech_zephyr_2026';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, heroClass, characterName } = req.body;

    if (!email || !username || !password) {
      res.status(400).json({ message: 'Email, username, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    // Check existing
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: existingUser.email === email ? 'Email already registered.' : 'Username already taken.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initial class stat bonuses
    const selectedClass: HeroClass = (heroClass as HeroClass) || HeroClass.WARRIOR;
    let str = 10, intl = 10, vit = 10, wis = 10, agi = 10, cha = 10;

    if (selectedClass === HeroClass.WARRIOR) {
      str += 5;
      vit += 2;
    } else if (selectedClass === HeroClass.MAGE) {
      intl += 5;
      wis += 2;
    } else if (selectedClass === HeroClass.ROGUE) {
      agi += 5;
      intl += 2;
    } else if (selectedClass === HeroClass.PALADIN) {
      vit += 4;
      cha += 3;
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        character: {
          create: {
            name: characterName || username,
            heroClass: selectedClass,
            title: 'Novice Adventurer',
            level: 1,
            currentXp: 0,
            nextLevelXp: 100,
            gold: 75,
            gems: 10,
            hp: 100,
            maxHp: 100,
            strength: str,
            intellect: intl,
            vitality: vit,
            wisdom: wis,
            agility: agi,
            charisma: cha,
            streakDays: 1,
          },
        },
      },
      include: {
        character: true,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'Hero created successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        character: user.character,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering hero account.', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      res.status(400).json({ message: 'Credentials and password required.' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
      include: {
        character: true,
        inventory: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials. Hero not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid password. Access denied.' });
      return;
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Welcome back, Adventurer!',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        character: user.character,
        inventory: user.inventory,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login.', error: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        character: true,
        inventory: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'Hero not found.' });
      return;
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile.', error: error.message });
  }
};
