import { Groq } from 'groq-sdk';
import { env } from '../config/env';
import fs from 'fs';

const groq = new Groq({ apiKey: env.GROQ_API_KEY || '' });

/**
 * Service to transcribe audio using Groq's whisper-large-v3 model.
 * 
 * @param filePath - Path to the audio file to transcribe.
 * @returns The transcribed text.
 */
export const transcribeAudio = async (filePath: string): Promise<string> => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      response_format: "json",
    });

    return transcription.text;
  } catch (error) {
    console.error('Transcription Error:', error);
    throw new Error('Failed to transcribe audio');
  } finally {
    // Delete the temporary file after processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
