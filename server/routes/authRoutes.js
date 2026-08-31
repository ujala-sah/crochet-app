import { Router } from 'express';
import { login, me, register, resendOtp, verifyOtp } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { emailOnlyRules, loginRules, otpRules, registerRules } from '../utils/validators.js';

const router = Router();

router.post('/register', registerRules, validateRequest, register);
router.post('/verify-otp', otpRules, validateRequest, verifyOtp);
router.post('/resend-otp', emailOnlyRules, validateRequest, resendOtp);
router.post('/login', loginRules, validateRequest, login);
router.get('/me', authenticateUser, me);

export default router;
