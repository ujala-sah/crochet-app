import { Router } from 'express';
import { checkout, listAllOrders, listMyOrders } from '../controllers/orderController.js';
import { authenticateUser, forbidAdminShopper, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.get('/me', authenticateUser, forbidAdminShopper, listMyOrders);
router.post('/', authenticateUser, forbidAdminShopper, checkout);
router.get('/', authenticateUser, requireAdmin, listAllOrders);

export default router;
