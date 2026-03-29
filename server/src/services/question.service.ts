import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');

/**
 * Service to generate exactly 10 structured interview questions in one request.
 * 
 * @param params - Object containing resumeText.
 * @returns An array of 10 interview questions.
 */
export const generateQuestion = async ({
  resumeText
}: {
  resumeText: string
}): Promise<string[]> => {
  const candidateName = resumeText.split("\n")[0] || "Candidate";

  const getPrompt = (retryCount = 0) => `
You are a technical interviewer.

You MUST generate interview questions ONLY from the candidate resume below.

CANDIDATE NAME:
${candidateName}

CANDIDATE RESUME:
"""
${resumeText}
"""

STRICT RULES:
1. Use ONLY information from this resume.
2. DO NOT invent candidate names.
3. DO NOT say "Alice" or other placeholders.
4. Reference projects, internships, or skills from the resume explicitly.
5. Questions must be personalized to this candidate's background.
6. Return exactly 10 questions.
${retryCount > 0 ? "7. REGENERATION ATTEMPT: Your previous attempt was too generic or failed validation. Be extra specific now." : ""}

QUESTION STRUCTURE:
Q1: Introductory question asking candidate to introduce themselves and describe technical strengths.
Q2–Q4: Questions about implementation details of specific projects or internships listed in the resume.
Q5–Q6: Questions testing internal workings of technologies or skills mentioned in the resume.
Q7–Q8: Questions about optimization, scaling, or architecture tradeoffs for their projects.
Q9: A scenario-based question about handling performance or edge cases.
Q10: A beginner-friendly system design question related to the candidate's background.

Return ONLY JSON:
{
  "questions": [
    "Question 1 content",
    "Question 2 content",
    ...
  ]
}
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let result = await model.generateContent(getPrompt(0));
    let text = result.response.text();
    let cleanText = text.replace(/```json/i, '').replace(/```/g, '').trim();
    let parsed: { questions: string[] } = JSON.parse(cleanText);

    // Initial validation
    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length !== 10) {
      console.warn("Gemini returned invalid questions. Retrying with stricter instructions...");
      result = await model.generateContent(getPrompt(1));
      text = result.response.text();
      cleanText = text.replace(/```json/i, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanText);
    }

    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length === 10) {
      return parsed.questions;
    } else {
      throw new Error("Invalid question generation output from Gemini after retry");
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
  }

  // Fallback behavior: provide a generic set of 10 questions
  return [
    `Hi ${candidateName}, please introduce yourself and highlight your key technical strengths.`,
    "Can you walk me through the most technically challenging project on your resume?",
    "How did you choose the specific technology stack for your main project?",
    "Describe a difficult bug you encountered and how you resolved it.",
    "How do you ensure your code is maintainable and scalable?",
    "Explain the internal workings of a primary language or framework you use.",
    "If you had to rebuild your most recent project, what changes would you make to the architecture?",
    "How do you approach performance optimization in your development process?",
    "Tell me about a time you had to learn a new technology quickly to solve a problem.",
    "If you were to design a simple version of a service related to your background, how would you start?"
  ];
};
