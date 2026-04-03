# Mocklytics

**AI-Powered Mock Technical Interview Platform**

---

<p align="center">
	<img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white" alt="Next.js" />
	<img src="https://img.shields.io/badge/Groq-FF6F00?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkY2RjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=" alt="Groq" />
	<img src="https://img.shields.io/badge/Whisper-v3-4B8DF8?logo=github" alt="Whisper v3" />
	<img src="https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
	<a href="https://mocklytics-client.vercel.app/" target="_blank">
		<img src="https://img.shields.io/badge/Live Demo-Click Here-4B8DF8?style=for-the-badge" alt="Live Demo" />
	</a>
</p>

<p align="center"><b>Context-aware interviewing · Real-time voice interaction · Automated evaluation</b></p>

---

## Overview

Mocklytics is a next-generation AI platform designed to simulate real recruiter-style technical interviews. By leveraging your resume, advanced voice interaction, and state-of-the-art AI evaluation, Mocklytics delivers a realistic, high-impact mock interview experience. The platform empowers candidates to practice, receive actionable feedback, and accelerate their technical interview readiness with structured, data-driven insights.

---

## Core Capabilities

- **Resume-Aware Interviews:** Dynamically generates technical questions tailored to your resume and experience.
- **Voice-Based Interaction:** Conducts interviews using real-time speech-to-text for natural, conversational flow.
- **Automated AI Evaluation:** Assesses responses for technical depth, clarity, and relevance using LLaMA 3.1 8B Instant.
- **Structured Technical Reports:** Delivers detailed feedback, scoring, and improvement roadmaps after each session.
- **Timed Interview Simulation:** 10-minute recruiter-style sessions to build real-world interview stamina.

---

## System Workflow

<p align="center">
<b>Upload Resume</b><br>
↓<br>
<b>Skill Extraction</b><br>
↓<br>
<b>Question Generation</b><br>
↓<br>
<b>Voice Response Capture</b><br>
↓<br>
<b>AI Evaluation</b><br>
↓<br>
<b>Technical Report</b>
</p>

---

## Tech Stack

**Frontend**

- Next.js
- React
- TailwindCSS

**AI Infrastructure**

- Groq API
- LLaMA 3.1 8B Instant (evaluation & question generation)
- Whisper v3 (speech-to-text)

**Deployment**

- Vercel

---

## Report Intelligence

Each interview session generates a comprehensive technical report, including:

- **Technical Depth**: Assesses the complexity and accuracy of responses
- **Communication Clarity**: Evaluates articulation and explanation skills
- **Problem Solving**: Measures analytical and solution-oriented thinking
- **Experience Relevance**: Scores alignment with resume and job requirements
- **Strength Detection**: Highlights technical strengths and standout areas
- **Gap Identification**: Pinpoints weaknesses and improvement opportunities

---

## Why Mocklytics Exists

Traditional mock interview tools rely on static question banks and generic feedback, failing to replicate the dynamic, resume-driven nature of real interviews. Mocklytics bridges this gap by:

- Generating context-aware questions based on your actual experience
- Enabling natural voice-based interaction
- Providing AI-driven, structured evaluation and actionable insights
- Simulating real recruiter scoring and time constraints

---

## Local Development Setup

1. **Clone the repository:**
	 ```bash
	 git clone https://github.com/Purvanshu10/Mocklytics.git
	 cd Mocklytics
	 ```
2. **Install dependencies:**
	 ```bash
	 cd client && npm install
	 cd ../server && npm install
	 ```
3. **Configure environment variables** (see below)
4. **Run the development servers:**
	 ```bash
	 # In one terminal
	 cd client && npm run dev
	 # In another terminal
	 cd ../server && npm run dev
	 ```

---

## Environment Variables

Create a `.env` file in both `client/` and `server/` directories as needed. Example variables:

**client/.env**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**server/.env**
```
GROQ_API_KEY=your-groq-api-key
LLAMA_MODEL=llama-3.1-8b-instant
WHISPER_API_KEY=your-whisper-api-key
```

---

## Roadmap

- Session history tracking
- Analytics dashboard
- Company-style interview simulation
- Adaptive questioning and feedback

---

## Author

- **GitHub:** [Purvanshu10](https://github.com/Purvanshu10)
- **LinkedIn:** [Purvanshu Jindal](https://www.linkedin.com/in/purvanshu-jindal-2127a32b2/)
- **X:** [@Purvanshu_10](https://x.com/Purvanshu_10)
- **Modular Frontend Architecture**: Reusable UI components powered by Shadcn and animated using Framer Motion.
- **Backend Architecture**: Scalable Express server configured with strictly typed TypeScript routing, models, and controllers.
- CORS enabled by default across both services.
