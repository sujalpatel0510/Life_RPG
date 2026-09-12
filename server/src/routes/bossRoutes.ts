import { Router } from 'express';
import { getActiveBoss, resurrectBoss } from '../controllers/bossController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getActiveBoss);
router.post('/resurrect', authenticateToken, resurrectBoss);

export default router;
