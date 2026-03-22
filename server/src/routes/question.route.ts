import { Router } from 'express';
import { generateQuestionsController } from '../controllers/question.controller';

const router = Router();

/**
 * POST /api/generate-questions
 * Generates interview questions based on resume text and role.
 */
router.post('/generate-questions', generateQuestionsController);

export default router;
