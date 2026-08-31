import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  searchProducts,
  updateProduct,
} from '../controllers/productController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { idParam, productRules, searchRules } from '../utils/validators.js';

const router = Router();

router.get('/', listProducts);
router.get('/search', searchRules, validateRequest, searchProducts);
router.get('/:id', idParam, validateRequest, getProduct);
router.post('/', authenticateUser, requireAdmin, productRules, validateRequest, createProduct);
router.put('/:id', authenticateUser, requireAdmin, idParam, productRules, validateRequest, updateProduct);
router.delete('/:id', authenticateUser, requireAdmin, idParam, validateRequest, deleteProduct);

export default router;
