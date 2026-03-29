"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResumePreview } from "@/components/ResumePreview";
import { BrainCircuit, MessageSquare, ShieldCheck, Sparkles, ChevronRight, Loader2, AlertCircle, Mic, MicOff, X } from "lucide-react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

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
        
        // Speak first question
        speakQuestion(data.questions[0]);
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

  const speakQuestion = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error starting camera:", err);
      }
    }

    startCamera();

    // Cleanup function to stop camera and audio when navigating away
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Stop camera tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
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
          
          // Speak next question
          speakQuestion(nextQContent);
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
          
          // Speak next question
          speakQuestion(nextQContent);
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
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Immersive Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0 grayscale-[0.2] brightness-50"
      />
      
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none z-[1]" />

      {/* Session Header */}
      <header className="fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-black/40 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white/90">Mocklytics Interview Session</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-green-500 uppercase tracking-widest leading-none">Active Session</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/40 uppercase tracking-widest leading-none mb-1">Time Remaining</span>
                <span className={`text-sm font-mono font-bold ${timeRemaining < 60 ? "text-red-500 animate-pulse" : "text-primary"}`}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/40 uppercase tracking-widest leading-none mb-1">Progress</span>
                <span className="text-sm font-mono font-bold text-white/90">
                  {questionCount + 1} / {MAX_QUESTIONS}
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10 mx-2" />

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all duration-300 group"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs font-bold uppercase tracking-widest">Exit</span>
          </button>
        </div>
      </header>

      <main className="relative flex-1 z-10 flex flex-col items-center justify-center h-screen px-6">
        <div className="w-full max-w-4xl flex flex-col items-center">
          
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={questionCount}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                className="relative group text-center"
              >
                <div className="max-w-3xl text-xl md:text-3xl font-medium text-white/90 backdrop-blur-xl bg-white/5 px-10 py-8 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] leading-relaxed">
                  {currentQuestion}
                </div>
                
                <AnimatePresence>
                  {isAiSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 flex flex-col items-center gap-2"
                    >
                      <div className="text-sm tracking-[0.4em] text-cyan-400 font-bold animate-pulse uppercase">
                        AI Speaking...
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [8, 16, 8] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-1 bg-cyan-400/60 rounded-full"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interaction Zone */}
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={recording ? stopRecording : startRecording}
              disabled={isSubmitting || isTranscribing || isAiSpeaking}
              className={`group relative w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.4)] transition-all duration-500 ${
                recording 
                ? "bg-red-500 text-white animate-pulse scale-110" 
                : isAiSpeaking
                  ? "bg-white/10 text-white/20 cursor-not-allowed border border-white/5"
                  : "bg-primary text-secondary hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]"
              } ${ (isSubmitting || isTranscribing) ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <AnimatePresence mode="wait">
                {isTranscribing || isSubmitting ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {recording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {recording && (
                <span className="absolute -inset-2 border-2 border-red-500 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
              )}
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={recording ? 'listening' : 'begin'}
              className="mt-6 text-center"
            >
              <div className="text-[10px] tracking-[0.5em] font-bold text-white/50 uppercase">
                {recording ? "Listening..." : "Begin Speaking"}
              </div>
              {!recording && !isAiSpeaking && !isSubmitting && (
                <div className="mt-1 text-[8px] text-white/20 uppercase tracking-widest italic">
                  Capture your response verbally
                </div>
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-full backdrop-blur-xl text-sm flex items-center gap-3 shadow-2xl"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="ml-2 hover:text-white"
                >✕</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
