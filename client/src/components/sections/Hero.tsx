"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles, BrainCircuit } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}/>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 text-center lg:text-left z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary w-fit mx-auto lg:mx-0">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Mocklytics AI Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Mock Interviews. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Real Insights.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto lg:mx-0">
            AI-powered interview platform that analyzes your resume and helps you improve with personalized feedback and predictive scoring.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start">
            <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all">
              Start Interview <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-primary/40 hover:bg-primary/5 bg-white/5 glass">
              <FileText className="mr-2 w-5 h-5" /> Upload Resume
            </Button>
          </div>
        </motion.div>

        {/* Right Column - Illustration/Avatar Concept */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:h-[600px] flex items-center justify-center z-10 hidden md:flex"
        >
          {/* Abstract Cyberpunk AI representation */}
          <div className="relative w-full max-w-md aspect-square rounded-full flex items-center justify-center border border-white/10 glass">
            {/* Inner rings */}
            <div className="absolute inset-4 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-secondary/30 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 blur-xl" />
            
            {/* Center Core */}
            <div className="w-32 h-32 rounded-full bg-background border border-primary/50 flex items-center justify-center shadow-[0_0_50px_rgba(0,194,255,0.5)] z-20">
              <BrainCircuit className="w-16 h-16 text-primary animate-pulse" />
            </div>

            {/* Orbiting data points */}
            <div className="absolute top-0 w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(0,194,255,1)] filter blur-[1px]" />
            <div className="absolute bottom-0 w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(6,182,212,1)] filter blur-[1px]" />
            <div className="absolute right-0 w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(56,189,248,1)] filter blur-[1px]" />
          </div>

          {/* Floating UI cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -left-10 glass p-4 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
              <span className="text-green-500 font-bold text-sm">94%</span>
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium">Culture Fit</p>
              <p className="text-sm text-white font-semibold">Excellent</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 -right-5 glass p-4 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium">Confidence</p>
              <p className="text-sm text-white font-semibold">Improving</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
