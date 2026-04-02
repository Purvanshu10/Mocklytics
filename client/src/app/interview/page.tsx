"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResumePreview } from "@/components/ResumePreview";
import { MessageSquare, ShieldCheck, Sparkles, ChevronRight, Loader2, AlertCircle, Mic, MicOff, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useCallback } from "react";

interface QuestionResponse {
  questions: string[];
}

const ANALYSIS_STATUSES = [
  "Reviewing your profile…",
  "Screening your technical background…",
  "Evaluating your experience level…",
  "Shortlisting focus areas for discussion…"
];

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
  const [statusIndex, setStatusIndex] = useState(0);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [recording, setRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const recordingStartTimeRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [history, isAiSpeaking]);

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://mocklytics-l170.onrender.com";
      const response = await fetch(`${apiUrl}/api/generate-questions`, {
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % ANALYSIS_STATUSES.length);
      }, 1500);
    } else {
      setStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        videoStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error starting camera:", err);
      }
    }

    startCamera();

    // Cleanup function to stop only the video stream
    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
        videoStreamRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Guard to ensure initialization only runs once, especially in React Strict Mode
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const init = () => {
      const insights = loadInsights();
      if (!insights) return;
      fetchQuestions(insights.storedText);
    };
    init();
  }, []); // Run only on mount

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
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    // Stop audio tracks
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://mocklytics-l170.onrender.com";
      const response = await fetch(`${apiUrl}/api/evaluate-answer`, {
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audioStreamRef.current = stream;
      
      // Explicitly check if stream is active and not muted
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack || !audioTrack.enabled || audioTrack.readyState !== "live") {
        throw new Error("Microphone stream is not active");
      }

      const options = { mimeType: 'audio/webm' };
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (audioBlob.size < 500) {
          console.warn("Recording too short, ignoring transcription.");
          setError("Please speak a bit longer for a better response.");
          setIsTranscribing(false);
          return;
        }

        await handleTranscription(audioBlob);
        
        // Stop ONLY the audio tracks
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach(track => track.stop());
          audioStreamRef.current = null;
        }
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
      const duration = Date.now() - (recordingStartTimeRef.current || 0);
      
      // Ensure minimum 500ms recording
      if (duration < 500) {
        setTimeout(() => {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
          }
        }, 500 - duration);
      } else {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://mocklytics-l170.onrender.com";
      const response = await fetch(`${apiUrl}/api/transcribe`, {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://mocklytics-l170.onrender.com";
      const response = await fetch(`${apiUrl}/api/evaluate-answer`, {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
        {/* Cinematic Background */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-lg w-full px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12 relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-xl">
              <Logo className="w-14 h-14 animate-pulse" />
            </div>
            {/* Pulsing rings */}
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute -inset-4 border border-primary/20 rounded-full"
            />
          </motion.div>

          <h2 className="text-2xl font-bold mb-4 tracking-tight">Preparing Your Interview</h2>
          
          <div className="relative h-8 flex items-center justify-center w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={statusIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute flex items-center gap-3 text-white/50 text-base font-medium whitespace-nowrap"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {ANALYSIS_STATUSES[statusIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 8, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary shadow-[0_0_15px_rgba(0,194,255,0.8)]"
            />
          </div>
          <p className="mt-4 text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
            Mocklytics AI Engine V3.1
          </p>
        </div>
      </div>
    );
  }

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
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 to-transparent h-24 pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Logo className="w-6 h-6" />
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

      <main className="relative flex-1 z-10 h-screen flex flex-col pt-36 pb-40 overflow-hidden">
        {/* Chat Overlay Container - Rebuilt for maximum visibility and transcript flow */}
        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide flex justify-center w-full">
          <div 
            ref={chatContainerRef}
            className="max-w-7xl w-full flex flex-col gap-8 pb-12 pt-4 min-h-full"
          >
            {/* Spacer to push content to bottom when few messages exist */}
            <div className="flex-1" />
            <AnimatePresence initial={false}>
              {history.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`flex flex-col w-full ${msg.role === "assistant" ? "items-start" : "items-end"}`}
                >
                  <div 
                    className={`max-w-[80%] px-8 py-5 rounded-[2rem] shadow-2xl backdrop-blur-2xl border font-medium leading-relaxed
                      ${msg.role === "assistant" 
                        ? "bg-white/10 border-white/20 text-white self-start text-base md:text-lg lg:text-xl" 
                        : "bg-cyan-500/20 border-cyan-400/30 text-white self-end text-base md:text-lg"
                      }`}
                  >
                    {msg.text}
                  </div>
                  
                  {/* AI Speaking Indicator specifically under the last assistant message */}
                  {msg.role === "assistant" && idx === history.findLastIndex(m => m.role === "assistant") && isAiSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 ml-4 flex flex-col items-start gap-2"
                    >
                      <div className="text-[11px] tracking-[0.3em] font-black text-cyan-400 animate-pulse uppercase">
                        AI Speaking...
                      </div>
                      <div className="flex gap-1.5 items-end h-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 16, 4] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                            className="w-1 bg-cyan-400/50 rounded-full"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Interaction Zone - Fixed near bottom */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={recording ? stopRecording : startRecording}
            disabled={isSubmitting || isTranscribing || isAiSpeaking}
            className={`group relative w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-500 ${
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
              <span className="absolute -inset-3 border-4 border-red-500/30 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
            )}
          </motion.button>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={recording ? 'listening' : 'begin'}
            className="mt-6 text-center"
          >
            <div className="text-[10px] tracking-[0.6em] font-black text-white/40 uppercase">
              {recording ? "LISTENING..." : "BEGIN SPEAKING"}
            </div>
            {!recording && !isAiSpeaking && !isSubmitting && (
              <div className="mt-2 text-[9px] text-white/20 uppercase tracking-[0.2em] font-medium animate-pulse">
                Click to provide your response
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
      </main>
      <Footer />
    </div>
  );
}
