import express from 'express';
import { createProfile, deleteProfile, getProfiles, getProfileById, searchProfiles, exportProfiles } from '../controllers/profile.controller.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.post('/profiles',checkRole('admin'), createProfile);
router.get('/profiles/search', checkRole(['admin', 'analyst']), searchProfiles);
router.get('/profiles/export', checkRole(['admin', 'analyst']), exportProfiles);
router.get('/profiles/:id', checkRole(['admin', 'analyst']), getProfileById);
router.get('/profiles', checkRole(['admin', 'analyst']), getProfiles);
router.delete('/profiles/:id', checkRole('admin'), deleteProfile);

export default router;