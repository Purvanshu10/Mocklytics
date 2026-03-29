import { Request, Response } from 'express';
import { generateQuestion } from '../services/question.service';

/**
 * Interface for the generate questions request body.
 */
interface GenerateQuestionsRequest {
  resumeText: string;
}

/**
 * Controller to handle generating interview questions.
 * 
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const generateQuestionsController = async (req: Request, res: Response) => {
  const { resumeText } = req.body as GenerateQuestionsRequest;

  // Debug logging
  console.log("Resume received length:", resumeText?.length);

  // Validate resumeText exists
  if (!resumeText || resumeText.length === 0) {
    return res.status(400).json({ error: "resumeText missing in request body" });
  }

  try {
    // Call service layer to get 10 questions at once
    const questions = await generateQuestion({ resumeText });

    // Return structured JSON response
    return res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
