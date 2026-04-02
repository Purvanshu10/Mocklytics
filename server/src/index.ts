console.log(">>> BACKEND START LOG: Attempting to start server...");

// Polyfill for PDF parsing in Node environment
if (typeof (global as any).DOMMatrix === 'undefined') {
  (global as any).DOMMatrix = class DOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor() {}
  };
}

process.on('uncaughtException', (err: Error) => {
  console.error('!!! UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('!!! UNHANDLED REJECTION:', reason);
});

import { env } from "./config/env";

import express, { Request, Response } from 'express';
import cors from 'cors';
import resumeRouter from './routes/resume.route';
import questionRouter from './routes/question.route';
import evaluationRouter from './routes/evaluation.route';
import transcriptionRouter from './routes/transcription.route';

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: "Backend running" });
});
app.use('/api', resumeRouter);
app.use('/api', questionRouter);
app.use('/api', evaluationRouter);
app.use('/api', transcriptionRouter);

// Start Server
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
