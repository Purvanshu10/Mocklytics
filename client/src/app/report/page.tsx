"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  RefreshCcw, 
  ArrowLeft,
  ChevronRight,
  BarChart3,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

interface Evaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export default function ReportPage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [aggregatedFeedback, setAggregatedFeedback] = useState<{
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  }>({
    strengths: [],
    weaknesses: [],
    improvements: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedEvaluations = sessionStorage.getItem("evaluations");
    if (!storedEvaluations) {
      router.push("/upload");
      return;
    }

    try {
      const parsed: Evaluation[] = JSON.parse(storedEvaluations);
      setEvaluations(parsed);

      // Compute overall score
      const totalScore = parsed.reduce((sum, item) => sum + item.score, 0);
      const avgScore = totalScore / parsed.length;
      setOverallScore(Number(avgScore.toFixed(1)));

      // Aggregate feedback and remove duplicates
      const strengths = Array.from(new Set(parsed.flatMap(item => item.strengths)));
      const weaknesses = Array.from(new Set(parsed.flatMap(item => item.weaknesses)));
      const improvements = Array.from(new Set(parsed.flatMap(item => item.improvements)));

      setAggregatedFeedback({
        strengths,
        weaknesses,
        improvements
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing evaluations:", error);
      router.push("/upload");
    }
  }, [router]);

  const handleRestart = () => {
    sessionStorage.removeItem("resumeText");
    sessionStorage.removeItem("questions");
    sessionStorage.removeItem("answers");
    sessionStorage.removeItem("evaluations");
    router.push("/upload");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-white/50 animate-pulse">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />
      
      <Navbar />

      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">Interview Performance</span>
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Interview Report</h1>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-semibold active:scale-95 group"
            >
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              New Interview
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Overall Score & Summary */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-[32px] p-10 border border-white/10 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Award className="w-32 h-32 text-primary" />
                </div>
                
                <h3 className="text-white/50 font-medium mb-6">Overall Score</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-7xl font-bold text-white tracking-tighter shadow-glow-sm">{overallScore}</span>
                  <span className="text-2xl text-white/30 font-medium">/ 10</span>
                </div>

                <div className="space-y-4">
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${overallScore * 10}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-primary shadow-glow"
                    />
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Based on {evaluations.length} evaluation metrics assessed during your session.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-[32px] p-8 border border-white/10 bg-primary/5"
              >
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-xs text-white/30 mb-1">Questions</div>
                    <div className="text-xl font-bold text-white">{evaluations.length}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-xs text-white/30 mb-1">Status</div>
                    <div className="text-xl font-bold text-green-400">Pass</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Detailed Feedback */}
            <div className="lg:col-span-2 space-y-8">
              {/* Strengths */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-[32px] p-8 border border-white/10"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  Key Strengths
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aggregatedFeedback.strengths.map((strength, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                      <p className="text-sm text-white/70 leading-relaxed">{strength}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Weaknesses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-[32px] p-8 border border-white/10"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  Areas for Improvement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aggregatedFeedback.weaknesses.map((weakness, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                      <p className="text-sm text-white/70 leading-relaxed">{weakness}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actionable Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-[32px] p-8 border border-white/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Lightbulb className="w-24 h-24 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  Next Steps
                </h3>
                <div className="space-y-3 relative z-10">
                  {aggregatedFeedback.improvements.map((improvement, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/5 transition-colors cursor-default">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-sm text-white/70">{improvement}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
