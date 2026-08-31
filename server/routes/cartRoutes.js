import { Router } from 'express';
import { addToCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { authenticateUser, forbidAdminShopper } from '../middleware/auth.js';

const router = Router();
router.use(authenticateUser, forbidAdminShopper);
router.get('/', getCart);
router.post('/', addToCart);
router.patch('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

export default router;
