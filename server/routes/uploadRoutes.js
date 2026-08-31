import { Router } from 'express';
import { saveUpload, uploadImage } from '../controllers/uploadController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.post('/', authenticateUser, requireAdmin, uploadImage, saveUpload);
export default router;
