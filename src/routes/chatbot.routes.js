import express from 'express';
import { getChatResponse, generateProgressSummary, generateTaskSuggestion } from '../controllers/chatbot.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/message', authenticate, getChatResponse);
router.post('/progress-summary', authenticate, generateProgressSummary);
router.post('/task-suggestion', authenticate, generateTaskSuggestion);

export default router;
