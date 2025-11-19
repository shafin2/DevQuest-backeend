import express from 'express';
import { getChatToken, createProjectChannel } from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/token', getChatToken);
router.post('/channel/:projectId', createProjectChannel);

export default router;
