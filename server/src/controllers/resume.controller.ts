import { Request, Response } from 'express';
import { extractResumeText } from '../services/resume.service';
import { analyzeResumeService } from '../services/resumeAnalysis.service';
import fs from 'fs';
import path from 'path';
import https from 'https';

const downloadFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        if (response.statusCode === 403 || response.statusCode === 401) {
          reject(new Error("FILE_INACCESSIBLE"));
        } else {
          reject(new Error(`Failed to download file: ${response.statusCode}`));
        }
        return;
      }

      const contentType = response.headers['content-type'];
      if (contentType && !contentType.includes('application/pdf') && !url.includes('id=')) {
         // Some Google Drive direct links might not return application/pdf in first hop
      }

      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

export const uploadResume = async (req: Request, res: Response) => {
  let filePath: string | null = null;
  let isTempFile = false;

  try {
    const { resumeUrl } = req.body;

    if (req.file) {
      filePath = req.file.path;
    } else if (resumeUrl) {
      // Detect Google Drive Link
      const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
      const match = resumeUrl.match(driveRegex);

      if (match && match[1]) {
        const fileId = match[1];
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        
        const tempDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }

        const fileName = `drive_${Date.now()}_${fileId}.pdf`;
        filePath = path.join(tempDir, fileName);
        isTempFile = true;

        try {
          await downloadFile(downloadUrl, filePath);
        } catch (error: any) {
          if (error.message === 'FILE_INACCESSIBLE') {
            return res.status(400).json({ 
              error: 'Google Drive file is not publicly accessible. Please set access to "Anyone with the link -> Viewer" and try again.' 
            });
          }
          throw error;
        }
      } else if (resumeUrl.startsWith('http')) {
        // Generic URL (optional, but keep it simple for now as requested for Google Drive)
        return res.status(400).json({ error: 'Currently only direct Google Drive preview links are supported.' });
      } else {
        return res.status(400).json({ error: 'Invalid URL format' });
      }
    }

    if (!filePath) {
      return res.status(400).json({ error: 'No file uploaded or URL provided' });
    }

    const resumeText = await extractResumeText(filePath);
    
    // Safety check: if text is empty, it might not be a valid PDF or is an image-based PDF
    if (!resumeText || resumeText.trim().length === 0) {
      if (isTempFile) fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Could not extract text from the provided resume. Please ensure it is a valid PDF.' });
    }

    const analysis = await analyzeResumeService(resumeText);
    
    // Cleanup temp file if it was a download
    if (isTempFile && filePath) {
      fs.unlinkSync(filePath);
    }

    res.json({
      resumeText,
      skills: analysis.skills,
      suggestedRoles: analysis.suggestedRoles,
      domains: analysis.domains
    });

  } catch (error) {
    console.error('Resume process error:', error);
    if (isTempFile && filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({ error: 'Failed to process resume' });
  }
};
