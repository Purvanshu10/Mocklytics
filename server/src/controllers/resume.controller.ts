import { Request, Response } from 'express';
import { extractResumeText } from '../services/resume.service';

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const resumeText = await extractResumeText(req.file.path);
    res.json({ resumeText });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process resume' });
  }
};
