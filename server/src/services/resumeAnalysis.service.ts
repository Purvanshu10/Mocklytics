import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '');

export interface ResumeAnalysisResponse {
  skills: string[];
  suggestedRoles: string[];
  domains: string[];
}

const CANDIDATE_LABELS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes',
  'Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager',
  'Finance', 'Healthcare', 'E-commerce', 'Education', 'Technology', 'Marketing'
];

export const analyzeResumeService = async (resumeText: string): Promise<ResumeAnalysisResponse> => {
  try {
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: resumeText.substring(0, 1000), // Limiting length to avoid token limits
      parameters: { candidate_labels: CANDIDATE_LABELS, multi_label: true },
    });

    const skills: string[] = [];
    const suggestedRoles: string[] = [];
    const domains: string[] = [];

    const classification = (Array.isArray(result) ? result[0] : result) as unknown as { labels: string[], scores: number[] };

    if (classification && classification.labels && classification.scores) {
      for (let i = 0; i < classification.labels.length; i++) {
        const label = classification.labels[i];
        const score = classification.scores[i];

        if (score > 0.4) { // Confidence threshold
          if (['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes'].includes(label)) {
            skills.push(label);
          } else if (['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager'].includes(label)) {
            suggestedRoles.push(label);
          } else {
            domains.push(label);
          }
        }
      }
    }

    return { skills, suggestedRoles, domains };
  } catch (error) {
    console.error('HuggingFace API Error:', error);
  }

  // Fallback behavior
  return {
    skills: [],
    suggestedRoles: [],
    domains: []
  };
};
