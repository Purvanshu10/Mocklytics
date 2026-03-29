"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResumePreview } from "@/components/ResumePreview";
import { BrainCircuit, MessageSquare, ShieldCheck, Sparkles, ChevronRight, Loader2, AlertCircle, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useCallback } from "react";

interface QuestionResponse {
  questions: string[];
}

interface Answer {
  question: string;
  answer: string;
}

interface ResumeInsights {
  skills: string[];
  suggestedRoles: string[];
  domains: string[];
}

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

export default function InterviewPage() {
  const router = useRouter();

  const MAX_DURATION = 10 * 60 * 1000;
  const MAX_QUESTIONS = 10;

  // State
  const [questionCount, setQuestionCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(600);

  const [resumeText, setResumeText] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [suggestedRoles, setSuggestedRoles] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isFetchingNewQuestions, setIsFetchingNewQuestions] = useState<boolean>(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [recording, setRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const loadInsights = () => {
    if (typeof window === "undefined") return null;
    const storedText = sessionStorage.getItem("resumeText");
    if (!storedText) {
      router.push("/upload");
      return null;
    }

    // Parse insights with fallbacks
    let storedSkills: string[] = [];
    let storedRoles: string[] = ["Software Developer"];
    let storedDomains: string[] = [];

    try {
      const parsedSkills = JSON.parse(sessionStorage.getItem("skills") || "[]");
      if (Array.isArray(parsedSkills) && parsedSkills.length > 0) storedSkills = parsedSkills;

      const parsedRoles = JSON.parse(sessionStorage.getItem("suggestedRoles") || "[]");
      if (Array.isArray(parsedRoles) && parsedRoles.length > 0) storedRoles = parsedRoles;

      const parsedDomains = JSON.parse(sessionStorage.getItem("domains") || "[]");
      if (Array.isArray(parsedDomains) && parsedDomains.length > 0) storedDomains = parsedDomains;
    } catch {
      // Ignore parse errors, use fallbacks
    }

    setResumeText(storedText);
    setSkills(storedSkills);
    setSuggestedRoles(storedRoles);
    setDomains(storedDomains);

    return { storedText };
  };

  const fetchQuestions = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");

      const data: QuestionResponse = await response.json();
      
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentQuestion(data.questions[0]);
        setHistory([{ role: "assistant", text: data.questions[0] }]);
      } else {
        throw new Error("No questions generated");
      }
      
      setCurrentAnswer("");
      // Only set startTime once when the questions load
      setStartTime(prev => prev || Date.now());
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Unable to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
      setIsFetchingNewQuestions(false);
    }
  };

  useEffect(() => {
    const init = () => {
      const insights = loadInsights();
      if (!insights) return;
      fetchQuestions(insights.storedText);
    };
    init();
  }, [router]);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 600 - Math.floor(elapsed / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        endInterview();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  function endInterview() {
    router.push("/report");
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    // Note: With batch generation, changing role might require re-fetching all questions
    // For now, we follow the batch structure where questions are generated once
    if (resumeText) {
      setIsFetchingNewQuestions(true);
      fetchQuestions(resumeText);
    }
  };

  const handleNext = async () => {
    if (!currentAnswer.trim() || !currentQuestion) return;

    setIsSubmitting(true);
    try {
      // 1. Evaluate answer
      const response = await fetch("http://localhost:5000/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          answer: currentAnswer,
          resumeText: resumeText,
        }),
      });

      if (!response.ok) throw new Error("Failed to evaluate answer");

      const evaluation = await response.json();

      // Store evaluation in sessionStorage
      const existingEvals = JSON.parse(sessionStorage.getItem("evaluations") || "[]");
      existingEvals.push(evaluation);
      sessionStorage.setItem("evaluations", JSON.stringify(existingEvals));

      // 2. Increment question count
      const nextIndex = questionCount + 1;

      // Update history with user answer
      setHistory(prev => [
        ...prev,
        { role: "user", text: currentAnswer }
      ]);
      
      // 3. Stop if limit reached or no more questions
      if (nextIndex >= MAX_QUESTIONS || nextIndex >= questions.length) {
        endInterview();
      } else {
        // 4. Use next question from local store
        const nextQContent = questions[nextIndex];
        
        // Brief delay before showing next question for UX
        setTimeout(() => {
          setHistory(prev => [
            ...prev,
            { role: "assistant", text: nextQContent }
          ]);
          setQuestionCount(nextIndex);
          setCurrentQuestion(nextQContent);
          setCurrentAnswer("");
        }, 1000);
      }
    } catch (err) {
      console.error("Error evaluating answer:", err);
      setError("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access denied or not available");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("http://localhost:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription failed");

      const data = await response.json();
      const transcript = data.text;

      if (transcript && transcript.trim()) {
        setCurrentAnswer(transcript);
        // Automatically trigger evaluation for voice input
        await handleVoiceSubmit(transcript);
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setError("Failed to transcribe audio. Please try typing your answer.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleVoiceSubmit = async (transcript: string) => {
    if (!currentQuestion) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          answer: transcript,
          resumeText: resumeText,
        }),
      });

      if (!response.ok) throw new Error("Failed to evaluate answer");

      const evaluation = await response.json();
      const existingEvals = JSON.parse(sessionStorage.getItem("evaluations") || "[]");
      existingEvals.push(evaluation);
      sessionStorage.setItem("evaluations", JSON.stringify(existingEvals));

      const nextIndex = questionCount + 1;
      setHistory(prev => [...prev, { role: "user", text: transcript }]);

      if (nextIndex >= MAX_QUESTIONS || nextIndex >= questions.length) {
        endInterview();
      } else {
        const nextQContent = questions[nextIndex];
        setTimeout(() => {
          setHistory(prev => [...prev, { role: "assistant", text: nextQContent }]);
          setQuestionCount(nextIndex);
          setCurrentQuestion(nextQContent);
          setCurrentAnswer("");
        }, 1000);
      }
    } catch (err) {
      console.error("Error evaluating voice answer:", err);
      setError("Failed to process spoken answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />

      <Navbar />

      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-160px)]">
          {/* Header Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 border border-white/10 mb-6 flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <BrainCircuit className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Mock Interview Session</h2>
                <p className="text-white/40 text-xs uppercase tracking-widest font-medium">Active Session</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-1">Time Remaining</p>
                <p className="text-primary font-mono font-bold">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                </p>
              </div>
              <div className="text-right border-l border-white/10 pl-8">
                <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-1">Progress</p>
                <p className="text-white font-bold">
                  {questionCount + 1} <span className="text-white/30 text-xs font-normal">/ 10</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
            {/* Main Chat Area */}
            <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden h-full">
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-hide scroll-smooth"
              >
                <AnimatePresence>
                  {history.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-xl ${
                        msg.role === "user" 
                        ? "bg-primary text-secondary rounded-tr-none font-medium" 
                        : "glass border border-white/10 text-white/90 rounded-tl-none"
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isSubmitting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="glass border border-white/10 rounded-2xl rounded-tl-none px-6 py-4">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl p-4 border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-4">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && currentAnswer.trim() && !isSubmitting) {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder="Type your answer here..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none scrollbar-hide"
                    disabled={isSubmitting || isLoading}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest pl-2">
                       Press Enter to Send / Shift+Enter for new line
                    </p>
                    <button
                      onClick={handleNext}
                      disabled={!currentAnswer.trim() || isSubmitting || isLoading || recording}
                      className={`group relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                        currentAnswer.trim() && !isSubmitting && !recording
                          ? "bg-primary text-secondary hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] active:scale-95"
                          : "bg-white/5 text-white/20 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting || isTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          {questionCount + 1 < MAX_QUESTIONS ? "Send Answer" : "Finish Interview"}
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Voice Control Floating Button */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={recording ? stopRecording : startRecording}
                      disabled={isSubmitting || isTranscribing}
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                        recording 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-primary text-secondary"
                      } ${ (isSubmitting || isTranscribing) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {recording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      {recording && (
                        <span className="absolute -top-2 -right-2 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                        </span>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 hidden lg:flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
              {/* Resume Insights Card */}
              {skills.length > 0 && (
                <div className="glass rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                   <div className="absolute -top-4 -right-4 pointer-events-none">
                    <BrainCircuit className="w-16 h-16 text-primary opacity-5 transform group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Resume Context
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Key Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 8).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/70">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Role</span>
                      <div className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                        <p className="text-xs text-primary font-medium truncate">{selectedRole || suggestedRoles[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="glass rounded-2xl p-5 border border-white/10">
                <h3 className="text-sm font-bold text-white mb-4">Stages</h3>
                <div className="space-y-3">
                  {[
                    "Experience Review",
                    "Technical Depth",
                    "Problem Solving",
                    "System Thinking"
                  ].map((step, i) => {
                    const stageIndex = Math.floor(questionCount / 2.5);
                    const isCompleted = stageIndex > i;
                    const isActive = stageIndex === i;

                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] transition-colors ${
                          isCompleted ? "bg-primary border-primary text-secondary" :
                          isActive ? "border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" :
                          "border-white/10 text-white/30"
                        }`}>
                          {isCompleted ? "✓" : i + 1}
                        </div>
                        <span className={`text-[11px] font-medium transition-colors ${
                          isCompleted || isActive ? "text-white" : "text-white/30"
                        }`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

               <div className="glass rounded-2xl p-5 border border-white/10 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-white text-[10px] uppercase tracking-widest">Privacy</h4>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Session data is encrypted and deleted after report generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
