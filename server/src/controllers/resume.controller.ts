import { Request, Response } from 'express';
import { extractResumeText } from '../services/resume.service';
import { analyzeResumeService } from '../services/resumeAnalysis.service';

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const resumeText = await extractResumeText(req.file.path);
    
    const analysis = await analyzeResumeService(resumeText);
    
    res.json({
      resumeText,
      skills: analysis.skills,
      suggestedRoles: analysis.suggestedRoles,
      domains: analysis.domains
    });
  } catch (error) {
    console.error('Resume process error:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
};
