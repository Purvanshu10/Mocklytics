import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

/**
 * Interface for the answer evaluation response.
 */
export interface EvaluationResponse {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

/**
 * Service to evaluate an interview answer.
 * For now, this uses mock logic based on answer length.
 * 
 * @param question - The interview question.
 * @param answer - The user's answer.
 * @param resumeText - The user's resume text.
 * @returns A structured evaluation response.
 */
export const evaluateAnswerService = async (
  question: string,
  answer: string,
  resumeText: string
): Promise<EvaluationResponse> => {
  try {
    const prompt = `You are an expert technical interviewer.

Evaluate this candidate answer.

Candidate Resume:
${resumeText}

Interview Question:
${question}

Candidate Answer:
${answer}

Return ONLY JSON:

{
  "score": number,
  "strengths": [],
  "weaknesses": [],
  "improvements": []
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      temperature: 0.1,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    const cleanText = responseContent.replace(/```json/i, '').replace(/```/g, '').trim();
    
    const parsed: EvaluationResponse = JSON.parse(cleanText);

    if (parsed && typeof parsed.score === 'number') {
      return parsed;
    }
  } catch (error) {
    console.error('Groq API Error:', error);
  }

  // Fallback behavior on error or parsing failure
  return {
    score: 5,
    strengths: ["Attempted to answer the question"],
    weaknesses: ["Unable to provide detailed technical evaluation at this time"],
    improvements: ["Try to elaborate more on technical details and examples"]
  };
};
