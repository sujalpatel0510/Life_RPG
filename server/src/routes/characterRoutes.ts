import { Router } from 'express';
import { getCharacter, updateCharacter } from '../controllers/characterController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getCharacter);
router.put('/', updateCharacter);

export default router;
