import { Router } from 'express';
import { evaluateAnswerController } from '../controllers/evaluation.controller';

const router = Router();

/**
 * POST /api/evaluate-answer
 * Evaluates an interview answer based on the question and resume text.
 */
router.post('/evaluate-answer', evaluateAnswerController);

export default router;
