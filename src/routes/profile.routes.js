import express from 'express';
import {
  getProfile,
  updateBasicInfo,
  updateProfessionalInfo,
  updateSkills,
} from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getProfile);
router.put('/basic', updateBasicInfo);
router.put('/professional', updateProfessionalInfo);
router.put('/skills', updateSkills);

export default router;
