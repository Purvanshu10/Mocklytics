import { Router } from 'express';
import { transcribeController } from '../controllers/transcription.controller';

const router = Router();

/**
 * POST /api/transcribe
 * Endpoint to handle audio transcription using whisper-large-v3.
 */
router.post('/transcribe', transcribeController);

export default router;
