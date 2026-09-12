import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import prisma from './utils/prisma';

import authRoutes from './routes/authRoutes';
import questRoutes from './routes/questRoutes';
import shopRoutes from './routes/shopRoutes';
import bossRoutes from './routes/bossRoutes';
import characterRoutes from './routes/characterRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Route Registrations
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/boss', bossRoutes);
app.use('/api/character', characterRoutes);

// Health Check Endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    // Quick DB query to prove live database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'HEALTHY',
      database: 'PostgreSQL Connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'UNHEALTHY',
      database: 'PostgreSQL Disconnected',
      error: err.message,
    });
  }
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint lost in the Nether realm.' });
});

// Central Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled realm exception:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An arcane internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`⚡ Life RPG Server awakened and listening on http://127.0.0.1:${PORT}`);
});
