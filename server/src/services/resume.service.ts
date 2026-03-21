import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

export async function extractResumeText(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  const parser = new PDFParse({ data });
  const result = await parser.getText();
  return result.text;
}
