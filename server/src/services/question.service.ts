import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');

export interface QuestionResponse {
  questions: string[];
}

/**
 * Mock interview questions for different roles (Fallback).
 */
const MOCK_QUESTIONS: Record<string, string[]> = {
  "Frontend Developer": [
    "Explain React Virtual DOM.",
    "What is the difference between useState and useEffect?",
    "How does REST API work?",
    "What is MongoDB indexing?",
    "Explain JavaScript event loop."
  ],
  "Backend Developer": [
    "Explain the difference between SQL and NoSQL databases.",
    "What are microservices and what are their benefits?",
    "How does JWT authentication work?",
    "Explain the concept of middleware in Express.js.",
    "What is connection pooling and why is it important?"
  ],
  "Fullstack Developer": [
    "Explain the difference between client-side and server-side rendering.",
    "How would you handle state management in a large-scale application?",
    "Describe the process of deploying a full-stack application.",
    "What are the security considerations when building an API?",
    "Explain how you would optimize the performance of a web application."
  ],
  "General": [
    "Tell me about a challenging project you worked on.",
    "How do you stay up-to-date with the latest technologies?",
    "What is your favorite programming language and why?",
    "Describe a time when you had to work in a team to solve a problem.",
    "What are your strengths and weaknesses as a developer?"
  ]
};

/**
 * Service to generate interview questions based on resume text and role.
 * For now, this returns mock questions based on the role.
 * 
 * @param resumeText - The text extracted from the user's resume.
 * @param role - The target role for the interview (optional).
 * @returns An array of interview questions.
 */
export const generateQuestionsService = async (resumeText: string, role?: string): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a technical interviewer.

Generate 5 personalized interview questions based on the candidate's resume.

Candidate Resume:
${resumeText}

Target Role:
${role || 'General'}

Return ONLY JSON:

{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Safely parse JSON from the response
    const cleanText = text.replace(/```json/i, '').replace(/```/g, '').trim();
    const parsed: QuestionResponse = JSON.parse(cleanText);

    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return parsed.questions;
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
  }

  // Fallback behavior
  if (role && MOCK_QUESTIONS[role]) {
    return MOCK_QUESTIONS[role];
  }

  // Default to general questions if no role or role not recognized.
  return MOCK_QUESTIONS["General"];
};
