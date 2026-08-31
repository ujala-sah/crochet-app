import { Router } from 'express';
import { getStats, listUsers } from '../controllers/userController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser, requireAdmin);
router.get('/stats', getStats);
router.get('/', listUsers);

export default router;
