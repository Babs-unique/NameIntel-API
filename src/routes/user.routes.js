import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getCurrentUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/users/me', authenticate, getCurrentUser);

export default router;
