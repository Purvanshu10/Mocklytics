if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment variables");
}

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error("Missing HUGGINGFACE_API_KEY in environment variables");
}

export const env = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  PORT: process.env.PORT || 5000,
};
