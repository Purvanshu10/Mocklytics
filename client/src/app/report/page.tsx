"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  RefreshCcw, 
  BarChart3,
  ChevronUp,
  ChevronDown,
  BrainCircuit,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

interface Evaluation {
  score: number;
  metrics?: {
    technicalDepth: number;
    communicationClarity: number;
    problemSolving: number;
    experienceRelevance: number;
  };
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}



const MetricCard = ({ title, value, delay = 0 }: { title: string, value: number, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between h-36"
  >
    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">{title}</h3>
    <div className="text-3xl font-black text-white mb-4 tracking-tight">{value}%</div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
        className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
      />
    </div>
  </motion.div>
);

const FeedbackList = ({ title, items, icon: Icon, colorClass, delay = 0, initialItems = 3 }: { title: string, items: string[], icon: any, colorClass: string, delay?: number, initialItems?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedItems = isExpanded ? items : items.slice(0, initialItems);

  return (
    <motion.div
      initial={{ opacity: 0, x: delay % 2 === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex flex-col h-full min-h-0"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/70">{title}</h3>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {displayedItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + (i * 0.1) }}
            className="glass rounded-2xl p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <p className="text-sm text-white/80 leading-relaxed">{item}</p>
          </motion.div>
        ))}
        {items.length > initialItems && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 rounded-2xl border border-dashed border-white/10 text-[10px] uppercase font-bold text-white/40 hover:bg-white/5 hover:text-white/60 transition-all flex items-center justify-center gap-2"
          >
            {isExpanded ? <>Show Less <ChevronUp className="w-3 h-3" /></> : <>Show More ({items.length - initialItems}) <ChevronDown className="w-3 h-3" /></>}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default function ReportPage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [metrics, setMetrics] = useState({
    technicalDepth: 0,
    communicationClarity: 0,
    problemSolving: 0,
    experienceRelevance: 0
  });
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

      const totalScore = parsed.reduce((sum, item) => sum + item.score, 0);
      let avgScore = Math.round(totalScore / parsed.length);
      if (avgScore <= 10 && avgScore > 0) avgScore = avgScore * 10;
      setOverallScore(avgScore);

      const avgMetrics = parsed.reduce((acc, item) => {
        if (item.metrics) {
          acc.technicalDepth += item.metrics.technicalDepth || 0;
          acc.communicationClarity += item.metrics.communicationClarity || 0;
          acc.problemSolving += item.metrics.problemSolving || 0;
          acc.experienceRelevance += item.metrics.experienceRelevance || 0;
        } else {
          const base = item.score <= 10 ? item.score * 10 : item.score;
          acc.technicalDepth += base;
          acc.communicationClarity += Math.max(0, base - 5);
          acc.problemSolving += Math.max(0, base - 10);
          acc.experienceRelevance += Math.max(0, base - 3);
        }
        return acc;
      }, { technicalDepth: 0, communicationClarity: 0, problemSolving: 0, experienceRelevance: 0 });

      const count = parsed.length;
      setMetrics({
        technicalDepth: Math.round(avgMetrics.technicalDepth / count),
        communicationClarity: Math.round(avgMetrics.communicationClarity / count),
        problemSolving: Math.round(avgMetrics.problemSolving / count),
        experienceRelevance: Math.round(avgMetrics.experienceRelevance / count),
      });

      setAggregatedFeedback({
        strengths: Array.from(new Set(parsed.flatMap(item => item.strengths))).slice(0, 10),
        weaknesses: Array.from(new Set(parsed.flatMap(item => item.weaknesses))).slice(0, 10),
        improvements: Array.from(new Set(parsed.flatMap(item => item.improvements))).slice(0, 10)
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing evaluations:", error);
      router.push("/upload");
    }
  }, [router]);

  const handleRestart = () => {
    ["resumeText", "questions", "answers", "evaluations"].forEach(k => sessionStorage.removeItem(k));
    router.push("/upload");
  };

  const getRecommendation = (score: number) => {
    if (score >= 80) return { label: "STRONG HIRE", class: "bg-green-500/20 text-green-400 border-green-500/30" };
    if (score >= 65) return { label: "HIRE", class: "bg-green-500/10 text-green-500 border-green-500/20" };
    if (score >= 50) return { label: "BORDERLINE", class: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" };
    return { label: "NEEDS IMPROVEMENT", class: "bg-red-500/10 text-red-500 border-red-500/20" };
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-white/50 animate-pulse font-medium">Finalizing Technical Verdict...</p>
        </div>
      </div>
    );
  }

  const recommendation = getRecommendation(overallScore);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#050505] text-foreground overflow-hidden">
      {/* Dedicated Session Header */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => router.push("/")}>
              <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-all">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <span className="font-black text-xl tracking-tighter text-white">Mocklytics</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Interview Report</span>
          </div>
          
          <button
            onClick={handleRestart}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Interview Session
          </button>
        </div>
      </nav>

      {/* Background Decor - Extremely Minimal */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none -z-10" />
      
      <main className="flex-1 pt-24 pb-4 px-12 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-12 pb-12">
          
          {/* SECTION 1: Technical Verdict Header */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-6xl font-black text-white tracking-tighter mb-4">Technical Verdict</h1>
              <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[11px] font-black tracking-widest ${recommendation.class}`}>
                LEVEL: {recommendation.label}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-right"
            >
              <div className="text-[72px] font-black text-white leading-none tracking-tighter shadow-glow">{overallScore}</div>
              <div className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mt-2">Final Rating</div>
            </motion.div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* SECTION 2: Metric Score Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Technical Depth" value={metrics.technicalDepth} delay={0.1} />
            <MetricCard title="Communication Clarity" value={metrics.communicationClarity} delay={0.2} />
            <MetricCard title="Problem Solving" value={metrics.problemSolving} delay={0.3} />
            <MetricCard title="Experience Relevance" value={metrics.experienceRelevance} delay={0.4} />
          </div>

          {/* SECTION 3: Strengths vs Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[400px]">
            <FeedbackList 
              title="Technical Strengths" 
              items={aggregatedFeedback.strengths} 
              icon={CheckCircle2} 
              colorClass="text-green-500" 
              delay={0.5}
            />
            <FeedbackList 
              title="Critical Gaps" 
              items={aggregatedFeedback.weaknesses} 
              icon={AlertCircle} 
              colorClass="text-yellow-500" 
              delay={0.6}
            />
          </div>

          {/* SECTION 4: Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-[40px] p-10 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Lightbulb className="w-24 h-24 text-primary" />
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Recommended Next Steps</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aggregatedFeedback.improvements.map((improvement, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all">
                  <div className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
                  <p className="text-sm text-white/70 leading-relaxed">{improvement}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-center pt-8 text-white/10 text-[10px] font-medium uppercase tracking-[0.5em]">
             End of Technical Assessment
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .glass {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .shadow-glow {
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
