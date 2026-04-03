Mocklytics — AI Mock Interview Platform 🎙️🤖
Mocklytics is an AI‑powered mock interview platform that simulates real technical interviews using resume‑aware question generation, voice interaction, and structured performance evaluation.

It helps students and developers practice interviews realistically and receive actionable feedback instantly.

🚀 Live Demo
🔗 https://mocklytics-client.vercel.app/

✨ Features
📄 Resume‑aware interview question generation

🎙️ Voice‑based answer interaction

🧠 AI evaluation of responses

📊 Structured technical performance reports

⏱️ Real interview‑style timed sessions (10 minutes)

📈 Strengths, weaknesses, and improvement roadmap

🎯 Recruiter‑style verdict scoring

🌐 Fully deployed production web app

🧠 How It Works
Mocklytics simulates a real interview workflow:

Upload your resume

AI analyzes skills and projects

Personalized technical questions are generated

Speak your answers naturally

AI evaluates responses in real time

Receive a structured performance report

🏗️ Tech Stack
Frontend
React / Next.js

Tailwind CSS

Glassmorphism UI design

Responsive layout

Backend / AI Pipeline
Groq API

Whisper (speech‑to‑text)

LLaMA‑3.1‑8B (evaluation + question generation)

Resume parsing pipeline

Session lifecycle controller

Deployment
Vercel (frontend hosting)

Production‑ready API integration

📊 Report Generation Includes
Each interview session produces:

Final performance rating

Technical depth score

Communication clarity score

Problem‑solving evaluation

Experience relevance analysis

Key strengths

Critical gaps

Actionable next steps

🎯 Why Mocklytics?
Unlike traditional mock interview tools:

✅ Resume‑personalized questions
✅ Voice interaction instead of typing
✅ AI‑generated structured feedback
✅ Real interview timing simulation
✅ Recruiter‑style evaluation reports

Mocklytics behaves like a real AI interviewer, not just a question generator.

📸 Screenshots (Recommended Section)
You can add:

Landing page
Interview interface
Voice interaction screen
Final report dashboard
Example:

![Landing Page](./screenshots/landing.png)
![Interview Screen](./screenshots/interview.png)
![Report Dashboard](./screenshots/report.png)
⚙️ Local Setup
Clone the repository:

git clone https://github.com/Purvanshu10/mocklytics-client.git
cd mocklytics-client
Install dependencies:

npm install
Run development server:

npm run dev
Open:

http://localhost:3000
🔐 Environment Variables
Create a .env.local file:

GROQ_API_KEY=your_api_key_here
📁 Project Structure (Example)
/components
/pages
/app
/services
/utils
/public
🚧 Current Limitations
Direct Google Drive mobile uploads depend on browser provider behavior

Session history tracking not yet implemented

Authentication system not included (planned future upgrade)

🔮 Future Improvements
Interview history dashboard

Progress tracking across sessions

Role‑specific interview modes

Company‑style interview simulation

Leaderboard / analytics insights

👨‍💻 Author
Purvanshu Jindal

GitHub: https://github.com/Purvanshu10

LinkedIn: https://www.linkedin.com/in/purvanshu-jindal-2127a32b2/

X (Twitter): https://x.com/Purvanshu_10

⭐ If You Like This Project
Consider starring the repo to support development!
