import { Request, Response } from 'express';
import { evaluateAnswerService } from '../services/evaluation.service';

/**
 * Interface for the evaluate answer request body.
 */
interface EvaluateAnswerRequest {
  question: string;
  answer: string;
  resumeText: string;
}

/**
 * Controller to handle evaluating an interview answer.
 * 
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const evaluateAnswerController = async (req: Request, res: Response) => {
  const { question, answer, resumeText } = req.body as EvaluateAnswerRequest;

  // Validate required fields
  if (!question || !answer || !resumeText) {
    return res.status(400).json({ error: "Question, answer, and resumeText are required" });
  }

  try {
    // Call service layer to get evaluation
    const evaluation = await evaluateAnswerService(question, answer, resumeText);

    // Return structured evaluation response
    return res.json(evaluation);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
