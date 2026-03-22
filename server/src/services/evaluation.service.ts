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
  // In the future, this will involve AI integration (OpenAI/Gemini/Groq).
  // For now, we use dummy logic based on answer length.

  const length = answer.trim().length;

  if (length < 40) {
    return {
      score: 4,
      strengths: ["Concise response"],
      weaknesses: ["Insufficient technical depth", "Lacks specific examples"],
      improvements: ["Provide more detailed explanations", "Include real-world examples from your experience"]
    };
  } else if (length >= 40 && length <= 120) {
    return {
      score: 6,
      strengths: ["Clear explanation of concept", "Used correct terminology"],
      weaknesses: ["Missing real-world example", "Could be more comprehensive"],
      improvements: ["Explain with a practical use-case", "Elaborate more on the underlying mechanics"]
    };
  } else {
    return {
      score: 8,
      strengths: ["Detailed explanation", "Comprehensive coverage of the topic", "Shows good understanding"],
      weaknesses: ["Could be more structured", "May contain redundant information"],
      improvements: ["Organize your answer into logical steps", "Focus on the most impactful points first"]
    };
  }
};
