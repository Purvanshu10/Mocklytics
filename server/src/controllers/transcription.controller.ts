import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { transcribeAudio } from '../services/transcription.service';

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('audio');

/**
 * Controller to handle audio transcription requests.
 * Uses multer middleware to parse the audio file from the request.
 */
export const transcribeController = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer Error:', err);
      return res.status(400).json({ error: 'Failed to upload audio' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Reject files that are too small (likely empty or silent)
    if (req.file.size < 500) {
      console.warn(`Rejecting small audio file: ${req.file.size} bytes`);
      
      // Clean up the invalid file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({ error: 'Audio file is too small or empty. Please speak longer.' });
    }

    try {
      const filePath = req.file.path;
      const transcript = await transcribeAudio(filePath);
      
      res.json({ text: transcript });
    } catch (error) {
      console.error('Transcription Controller Error:', error);
      res.status(500).json({ error: 'Failed to transcribe audio' });
    }
  });
};
