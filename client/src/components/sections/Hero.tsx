"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles, Bot, User, Mic } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column - Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 text-center lg:text-left z-10 lg:col-span-7 xl:col-span-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary w-fit mx-auto lg:mx-0">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Mocklytics AI Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Practice Real <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI Interviews</span> <br className="hidden lg:block"/>
            Before the Real One.
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto lg:mx-0">
            Get resume-based questions, speak your answers, and receive structured technical feedback instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start">
            <Link href="/upload">
              <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all">
                Start Interview <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-primary/40 hover:bg-primary/5 bg-white/5 glass">
                <FileText className="mr-2 w-5 h-5" /> Upload Resume
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Column - Illustration/Avatar Concept */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:h-[600px] w-full flex items-center justify-center lg:justify-start xl:justify-center z-10 hidden md:flex lg:col-span-5 xl:col-span-5 xl:col-start-7"
        >
          {/* Mock Interview Interface Preview */}
          <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl flex flex-col overflow-hidden border border-white/10 glass bg-black/40 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Interviewer</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Active
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-white/50 bg-white/10 px-2 py-1 rounded">
                04:12
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative">
              {/* Background Logo for branding */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Logo className="w-32 h-32" />
              </div>

              {/* AI Message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex gap-3 max-w-[85%]"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center border border-primary/30 mt-1">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm p-3 text-sm text-white/90 shadow-sm backdrop-blur-sm">
                  Purvanshu, can you describe a time when you had to optimize a slow-performing application? What was your approach?
                </div>
              </motion.div>

              {/* User Message / Transcript */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="flex gap-3 max-w-[85%] self-end"
              >
                <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm p-3 text-sm text-white backdrop-blur-md shadow-sm">
                  <span className="text-white/90">Sure. In my previous role, we had a dashboard that took over 10 seconds to load... </span>
                  <span className="text-white/40 animate-pulse">I started by profiling the database queries...</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center border border-secondary/30 mt-1">
                  <User className="w-3 h-3 text-secondary" />
                </div>
              </motion.div>
            </div>

            {/* Bottom Controls / Mic Indicator */}
            <div className="p-4 border-t border-white/10 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center relative">
              {/* Soundwave animation */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-end gap-1 h-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["20%", "100%", "20%"] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    className="w-1 bg-primary/80 rounded-full"
                    style={{ height: "20%" }}
                  />
                ))}
              </div>

              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,194,255,0.4)] relative z-10">
                <Mic className="w-6 h-6 text-primary-foreground" />
                <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20"></div>
              </div>
            </div>
          </div>


        </motion.div>
      </div>
    </section>
  );
}
