
import express from 'express';
import {
    initiateGitHubAuth,
    handleGitHubCallback,
    refreshAccessToken,
    logoutUser,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/github', initiateGitHubAuth);
router.get('/github/callback', handleGitHubCallback);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

export default router;