import { Request, Response } from 'express';
import { generateQuestionsService } from '../services/question.service';

/**
 * Interface for the generate questions request body.
 */
interface GenerateQuestionsRequest {
  resumeText: string;
  role?: string;
}

/**
 * Controller to handle generating interview questions.
 * 
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const generateQuestionsController = async (req: Request, res: Response) => {
  const { resumeText, role } = req.body as GenerateQuestionsRequest;

  // Validate resumeText exists
  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required" });
  }

  try {
    // Call service layer to get questions
    const questions = await generateQuestionsService(resumeText, role);

    // Return structured JSON response
    return res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
