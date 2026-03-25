"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResumePreview } from "@/components/ResumePreview";
import { BrainCircuit, MessageSquare, ShieldCheck, Sparkles, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function InterviewPage() {
  const router = useRouter();
  
  // State
  const [resumeText, setResumeText] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [suggestedRoles, setSuggestedRoles] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isFetchingNewQuestions, setIsFetchingNewQuestions] = useState<boolean>(false);

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
    
    return { storedText, storedRoles };
  };

  const fetchQuestions = async (text: string, targetRole: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, role: targetRole }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");

      const data: QuestionResponse = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setCurrentAnswer("");
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
      const initialRole = insights.storedRoles[0];
      setSelectedRole(initialRole);
      fetchQuestions(insights.storedText, initialRole);
    };
    init();
  }, [router]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    if (resumeText) {
      setIsFetchingNewQuestions(true);
      fetchQuestions(resumeText, newRole);
    }
  };

  const handleComplete = async (allAnswers: Answer[]) => {
    setIsSubmitting(true);
    try {
      const evaluations = await Promise.all(
        allAnswers.map(async (item) => {
          const response = await fetch("http://localhost:5000/api/evaluate-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: item.question,
              answer: item.answer,
              resumeText: resumeText,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to evaluate answer");
          }

          return response.json();
        })
      );

      sessionStorage.setItem("evaluations", JSON.stringify(evaluations));
      router.push("/report");
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Unable to generate your report. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    const newAnswer: Answer = {
      question: questions[currentQuestionIndex],
      answer: currentAnswer,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed last question
      handleComplete(updatedAnswers);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />
      
      <Navbar />

      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mock Interview</h1>
              <p className="text-white/50 text-sm">Dashboard / {isLoading ? "Preparing" : `Question ${currentQuestionIndex + 1} of ${questions.length}`}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Resume Insights Card */}
              {skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 pointer-events-none">
                    <BrainCircuit className="w-16 h-16 text-primary opacity-5 transform group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Resume Insights</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-2">Detected Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-white/80">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-2">Domains</span>
                      <div className="flex flex-wrap gap-2">
                        {domains.length > 0 ? domains.map((domain, i) => (
                          <span key={i} className="px-2 py-1 bg-primary/10 border border-primary/20 text-primary rounded-md text-xs">
                            {domain}
                          </span>
                        )) : <span className="text-sm text-white/30 italic">No specific domains detected</span>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-1">Target Role</span>
                      <p className="text-sm text-white/80">Tailoring interview for this role</p>
                    </div>
                    <select
                      value={selectedRole}
                      onChange={handleRoleChange}
                      disabled={isLoading || isFetchingNewQuestions}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer min-w-[200px]"
                      style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                    >
                      {!suggestedRoles.includes(selectedRole) && <option value={selectedRole}>{selectedRole}</option>}
                      {[...new Set([...suggestedRoles, "Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer"])].map((roleOpt, i) => (
                        <option key={i} value={roleOpt}>{roleOpt}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass rounded-3xl p-8 border border-white/10 min-h-[400px] flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                      <BrainCircuit className="w-8 h-8 text-primary shadow-glow" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Resume</h2>
                    <p className="text-white/50 max-w-sm mb-8">
                      Our AI is preparing interview questions based on your experience. This will take just a few moments.
                    </p>
                    <div className="w-full max-w-xs h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="h-full bg-primary shadow-glow"
                      />
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-3xl p-8 border border-red-500/20 min-h-[400px] flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-white/50 max-w-sm mb-8">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : isSubmitting ? (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-3xl p-8 border border-white/10 min-h-[400px] flex flex-col items-center justify-center text-center"
                  >
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
                    <p className="text-white/50 max-w-sm">Generating your performance report...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-3xl p-8 border border-white/10 min-h-[400px] flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                        Question {currentQuestionIndex + 1}
                      </span>
                      <span className="text-white/30 text-xs">
                        {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                      </span>
                    </div>

                    {currentQuestionIndex === 0 && (
                      <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200/80 text-sm flex gap-3 items-start">
                        <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p>This interview is tailored for a <strong className="text-white">{selectedRole}</strong> role based on your resume.</p>
                      </div>
                    )}
                    
                    <h2 className="text-2xl font-bold text-white mb-8 leading-tight">
                      {questions[currentQuestionIndex]}
                    </h2>

                    <div className="flex-1">
                      <textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                      />
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleNext}
                        disabled={!currentAnswer.trim()}
                        className={`group relative flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                          currentAnswer.trim()
                            ? "bg-primary text-secondary hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] active:scale-95"
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                      >
                        {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${currentAnswer.trim() ? "group-hover:translate-x-1" : ""}`} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="glass rounded-3xl p-8 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Extracted Summary
                </h3>
                <div className="bg-transparent rounded-2xl">
                  {resumeText ? (
                    <ResumePreview resumeText={resumeText} />
                  ) : (
                    <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 min-h-[100px]">
                      <p className="text-white/30 italic text-sm">No resume text found. Have you uploaded your resume yet?</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="glass rounded-3xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Interview Setup</h3>
                <div className="space-y-4">
                  {[
                    "Experience Review",
                    "Technical Skills Analysis",
                    "Soft Skills Evaluation",
                    "Role-specific Logic"
                  ].map((step, i) => {
                    const isCompleted = isLoading ? false : currentQuestionIndex >= i + 1;
                    const isActive = isLoading ? false : currentQuestionIndex === i;
                    
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-colors ${
                          isCompleted ? "bg-primary border-primary text-secondary" : 
                          isActive ? "border-primary text-primary animate-pulse" : 
                          "border-white/10 text-white/30"
                        }`}>
                          {isCompleted ? "✓" : i + 1}
                        </div>
                        <span className={`text-sm transition-colors ${
                          isCompleted || isActive ? "text-white" : "text-white/30"
                        }`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass rounded-3xl p-6 border border-white/10 bg-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-white text-sm">Privacy Guaranteed</h4>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  Your resume data is processed securely and is only used to generate your interview experience.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
