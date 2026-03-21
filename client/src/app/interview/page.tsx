"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BrainCircuit, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function InterviewPage() {
  const [resumeText, setResumeText] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedText = sessionStorage.getItem("resumeText");
      if (storedText) {
        setResumeText(storedText);
      }
    }
  }, []);

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
              <p className="text-white/50 text-sm">Dashboard / Interview Prep</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="glass rounded-3xl p-8 border border-white/10 min-h-[400px] flex flex-col items-center justify-center text-center">
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
              </div>

              <div className="glass rounded-3xl p-8 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Extracted Summary
                </h3>
                <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 min-h-[100px]">
                  {resumeText ? (
                    <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                      {resumeText.length > 500 ? resumeText.substring(0, 500) + "..." : resumeText}
                    </p>
                  ) : (
                    <p className="text-white/30 italic text-sm">No resume text found. Have you uploaded your resume yet?</p>
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
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-primary/30 flex items-center justify-center text-[10px] text-primary">
                        {i + 1}
                      </div>
                      <span className="text-sm text-white/50">{step}</span>
                    </div>
                  ))}
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
