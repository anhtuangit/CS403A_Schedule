import express from 'express';
import { googleSignIn, getCurrentUser, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/google', googleSignIn);
router.post('/logout', logout);

router.get('/me', authenticate, getCurrentUser);

export default router;

