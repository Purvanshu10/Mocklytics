import fs from 'fs/promises';
// @ts-ignore - handling multiple possible versions of the library
import * as pdfImport from 'pdf-parse';

export async function extractResumeText(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  
  // Detect if the import is the function (v1.x) or the module object (v2.x)
  const pdf: any = (pdfImport as any).default || pdfImport;

  if (typeof pdf === 'function') {
    // Standard pdf-parse v1.1.1 logic
    const result = await pdf(dataBuffer);
    return result.text || "";
  } else if (pdf.PDFParse) {
    // Modern fork logic (what was previously installed)
    const parser = new pdf.PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text || "";
  }
  
  throw new Error("Could not initialize PDF parser - version mismatch");
}
