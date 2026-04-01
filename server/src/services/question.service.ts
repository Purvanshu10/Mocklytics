import Groq from 'groq-sdk';
import { env } from '../config/env';

const groq = new Groq({ apiKey: env.GROQ_API_KEY || '' });

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
Q1: Greeting candidate by his name and then Introductory question asking candidate to introduce themselves and describe technical strengths.
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
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: getPrompt(0) }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.4,
      // @ts-ignore - response_format may not be in older SDK types but usually works on Groq
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    let parsed: { questions: string[] } = JSON.parse(responseContent);

    // Initial validation
    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length !== 10) {
      console.warn("Groq returned invalid questions. Retrying with stricter instructions...");
      const retryCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: getPrompt(1) }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        // @ts-ignore
        response_format: { type: "json_object" }
      });
      const retryContent = retryCompletion.choices[0]?.message?.content || '{}';
      parsed = JSON.parse(retryContent);
    }

    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length === 10) {
      return parsed.questions;
    } else {
      throw new Error("Invalid question generation output from Groq after retry");
    }
  } catch (error) {
    console.error('Groq API Error:', error);
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
