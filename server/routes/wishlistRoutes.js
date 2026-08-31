import { Router } from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  removeWishlistByProduct,
} from '../controllers/wishlistController.js';
import { authenticateUser, forbidAdminShopper } from '../middleware/auth.js';

const router = Router();
router.use(authenticateUser, forbidAdminShopper);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/product/:productId', removeWishlistByProduct);
router.delete('/:id', removeFromWishlist);

export default router;
