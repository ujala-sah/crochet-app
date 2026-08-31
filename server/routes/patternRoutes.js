import { Router } from 'express';
import {
  createPattern,
  deletePattern,
  getPattern,
  listPatterns,
  searchPatterns,
  updatePattern,
} from '../controllers/patternController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { idParam, patternRules, searchRules } from '../utils/validators.js';

const router = Router();

router.get('/', listPatterns);
router.get('/search', searchRules, validateRequest, searchPatterns);
router.get('/:id', idParam, validateRequest, getPattern);
router.post('/', authenticateUser, requireAdmin, patternRules, validateRequest, createPattern);
router.put('/:id', authenticateUser, requireAdmin, idParam, patternRules, validateRequest, updatePattern);
router.delete('/:id', authenticateUser, requireAdmin, idParam, validateRequest, deletePattern);

export default router;
