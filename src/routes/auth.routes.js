
import express from 'express';
import {
    initiateGitHubAuth,
    handleGitHubCallback,
    refreshAccessToken,
    logoutUser,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/github', initiateGitHubAuth);
router.get('/github/callback', handleGitHubCallback);
router.post('/refresh', refreshAccessToken);
router.all('/refresh', (req, res) => res.status(405).json({ success: false, message: 'Method Not Allowed' }));
router.post('/logout', logoutUser);
router.all('/logout', (req, res) => res.status(405).json({ success: false, message: 'Method Not Allowed' }));

export default router;