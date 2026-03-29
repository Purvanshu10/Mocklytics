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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
