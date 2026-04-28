
import express from 'express';
import { createProfile, deleteProfile, getProfiles, getProfileById, searchProfiles, exportProfiles } from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.js';
import checkAPIVersion  from '../middleware/versionMiddleware.js';
import  checkRole from '../middleware/checkRole.js';
const router = express.Router();
router.post(
    '/profiles',
    checkAPIVersion,          
    authenticate,               
    checkRole('admin'),      
    createProfile
);
router.get(
    '/profiles/search',
    checkAPIVersion,                     
    authenticate,                        
    checkRole(['admin', 'analyst']),    
    searchProfiles
);

router.get(
    '/profiles/export',
    checkAPIVersion,                   
    authenticate,                         
    checkRole(['admin', 'analyst']),
    exportProfiles
);

router.get(
    '/profiles/:id',
    checkAPIVersion,                    
    authenticate,                         
    checkRole(['admin', 'analyst']), 
    getProfileById
);

router.get(
    '/profiles',
    checkAPIVersion,        
    authenticate,                
    checkRole(['admin', 'analyst']),   
    getProfiles
);
router.delete(
    '/profiles/:id',
    checkAPIVersion,           
    authenticate,              
    checkRole('admin'),     
    deleteProfile
);

export default router;