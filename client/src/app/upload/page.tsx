"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ANALYSIS_STATUSES = [
  "Reviewing your profile…",
  "Screening your technical background…",
  "Evaluating your experience level…",
  "Shortlisting focus areas for discussion…"
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const router = useRouter();

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % ANALYSIS_STATUSES.length);
      }, 1500);
    } else {
      setStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/upload-resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed. Please ensure the file is a valid PDF resume and try again.");
      }

      const data = await response.json();

      // Store the extracted text and insights for the interview page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("resumeText", data.resumeText || "");
        sessionStorage.setItem("skills", JSON.stringify(data.skills || []));
        sessionStorage.setItem("suggestedRoles", JSON.stringify(data.suggestedRoles || []));
        sessionStorage.setItem("domains", JSON.stringify(data.domains || []));
      }

      // Briefly wait to show success animation before redirecting
      setTimeout(() => {
        router.push("/interview");
      }, 500);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-primary/30">
      {/* Global Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />

      {/* Subtle Gradient Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <Navbar minimal />

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Logo className="w-8 h-8" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 mb-4 tracking-tight">
              Upload Your Resume
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              Our AI will analyze your experience and skills to create a personalized mock interview experience just for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden group/card"
          >
            <div className="absolute top-0 right-0 p-4 pointer-events-none">
              <Sparkles className="w-5 h-5 text-primary opacity-20 group-hover/card:opacity-100 transition-opacity duration-700" />
            </div>

            <FileUpload
              onFileSelect={(f) => {
                setFile(f);
                setError(null);
              }}
              selectedFile={file}
              error={error}
            />

            <div className="mt-12 flex flex-col items-center">
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                size="lg"
                className={cn(
                  "w-full max-w-xs h-14 rounded-xl text-lg font-semibold transition-all duration-300 relative overflow-hidden group/btn",
                  file && !isUploading
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,194,255,0.4)] hover:shadow-[0_0_30px_rgba(0,194,255,0.6)] hover:scale-[1.02]"
                    : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                )}
              >
                {isUploading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div className="relative h-6 flex items-center overflow-hidden min-w-[300px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={statusIndex}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute left-2 text-sm md:text-base whitespace-nowrap"
                        >
                          {ANALYSIS_STATUSES[statusIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Upload & Analyze</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
              <p className="mt-4 text-xs text-white/30 flex items-center gap-1.5 uppercase tracking-widest font-medium">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                AI-Powered Analysis Secure & Private
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { title: "Skill Extraction", desc: "Identify key hard & soft skills" },
              { title: "Smart Tailoring", desc: "Questions adapted to your role" },
              { title: "ATS Check", desc: "Instant resume strength feedback" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="font-semibold text-white/80">{item.title}</h4>
                <p className="text-sm text-white/40">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
