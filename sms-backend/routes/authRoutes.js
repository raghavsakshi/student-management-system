import express from 'express';
import { registerUser, loginUser, forgotPassword } from '../controllers/authController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);

export default router;
