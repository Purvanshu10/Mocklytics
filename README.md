# Mocklytics

An AI-powered mock interview platform that analyzes resumes and conducts personalized interviews with real-time feedback.

## Project Structure

This repository is built as a full-stack mono-repo:

- `/client` - Next.js App Router frontend (React, Tailwind CSS v4, Framer Motion)
- `/server` - Node.js + Express API backend (TypeScript)

## How to Run Locally

### 1. Start the API Server

Open a terminal and navigate to the server folder:

```bash
cd server
npm install
npm run dev
```

The Express API will run on `http://localhost:5000` with hot-reloading.
Test Route: `GET http://localhost:5000/api/test` returns `{ "message": "Backend running" }`.

### 2. Start the Frontend Application

Open a second terminal window and navigate to the client folder:

```bash
cd client
npm install
npm run dev
```

The React frontend will be served at `http://localhost:3000`.

## Features
- **Frontend Design**: Sleek, modern SaaS aesthetic entirely re-styled into an Electric Blue & Cyan scheme against a deep navy/glassmorphic background.
- **Modular Frontend Architecture**: Reusable UI components powered by Shadcn and animated using Framer Motion.
- **Backend Architecture**: Scalable Express server configured with strictly typed TypeScript routing, models, and controllers.
- CORS enabled by default across both services.
