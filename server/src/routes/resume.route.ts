import { Router } from 'express';
import { uploadResume } from '../controllers/resume.controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/upload-resume', upload.single('resume'), uploadResume);

export default router;
