import { Router } from 'express';
import { getShopItems, buyItem, equipItem } from '../controllers/shopController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/items', getShopItems);
router.post('/buy', buyItem);
router.post('/equip', equipItem);

export default router;
