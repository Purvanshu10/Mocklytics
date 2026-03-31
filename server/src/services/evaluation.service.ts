import Groq from 'groq-sdk';
import { env } from '../config/env';

const groq = new Groq({ apiKey: env.GROQ_API_KEY || '' });

/**
 * Interface for the answer evaluation response.
 */
export interface EvaluationResponse {
  score: number;
  metrics: {
    technicalDepth: number;
    communicationClarity: number;
    problemSolving: number;
    experienceRelevance: number;
  };
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

/**
 * Service to evaluate an interview answer.
 * 
 * @param question - The interview question.
 * @param answer - The user's answer.
 * @param resumeText - The user's resume text.
 * @returns A structured evaluation response with detailed metrics.
 */
export const evaluateAnswerService = async (
  question: string,
  answer: string,
  resumeText: string
): Promise<EvaluationResponse> => {
  try {
    const prompt = `You are an expert technical interviewer.

Evaluate this candidate's answer based on their resume and the specific question.

Candidate Resume Context:
${resumeText}

Interview Question:
${question}

Candidate Answer:
${answer}

Return ONLY a JSON object with the following structure:
{
  "score": number (0-100),
  "metrics": {
    "technicalDepth": number (0-100),
    "communicationClarity": number (0-100),
    "problemSolving": number (0-100),
    "experienceRelevance": number (0-100)
  },
  "strengths": string[] (max 10),
  "weaknesses": string[] (max 10),
  "improvements": string[] (max 10)
}

*** MANDATORY CONSTRAINTS:
1. Return EXACTLY or FEWER than 10 bullet points per section (strengths, weaknesses, improvements).
2. If there are many insights, prioritize only the most critical, high-impact, or recurring ones.
3. ABSOLUTELY NO MORE THAN 10 items per list.
4. Ensure each point is concise (one sentence max).
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      // @ts-ignore - response_format may not be in older SDK types but usually works
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    const parsed: EvaluationResponse = JSON.parse(responseContent);

    if (parsed && typeof parsed.score === 'number' && parsed.metrics) {
      return parsed;
    }
  } catch (error) {
    console.error('Groq API Error:', error);
  }

  // Fallback behavior on error or parsing failure
  return {
    score: 50,
    metrics: {
      technicalDepth: 50,
      communicationClarity: 50,
      problemSolving: 50,
      experienceRelevance: 50
    },
    strengths: ["Attempted to answer the question"],
    weaknesses: ["Detailed technical evaluation unavailable"],
    improvements: ["Try to provide more concrete examples next time"]
  };
};
