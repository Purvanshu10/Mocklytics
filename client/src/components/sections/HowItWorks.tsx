"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, MessageSquare, Award } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Resume",
    description: "Start by uploading your current resume. Our AI reads it and extracts your core competencies and experience."
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "The engine customizes interview questions based on your profile and target job role."
  },
  {
    icon: MessageSquare,
    title: "Take Interview",
    description: "Engage in a realistic mock interview. Answer questions vocally or via text chat."
  },
  {
    icon: Award,
    title: "Get Feedback",
    description: "Review detailed feedback, confidence metrics, and suggestions to refine your answers."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 text-white"
          >
            How It <span className="text-secondary">Works</span>
          </motion.h2>
          <p className="text-white/60">Four simple steps to mastery.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-white/10 ml-6 md:ml-0 md:border-l-0 md:flex md:justify-between md:before:absolute md:before:top-12 md:before:left-0 md:before:w-full md:before:h-0.5 md:before:bg-white/10 md:before:-z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative pl-12 md:pl-0 mb-10 md:mb-0 md:w-1/4 md:px-4"
              >
                {/* Step Marker */}
                <div className="absolute left-[-11px] md:left-1/2 md:-translate-x-1/2 top-0 mt-2 md:mt-0 w-6 h-6 rounded-full bg-background border-2 border-secondary flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10" />
                
                {/* Content */}
                <div className="md:mt-16 text-left md:text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/30 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mb-4 md:mx-auto group-hover:scale-110 transition-transform">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Step {index + 1}: {step.title}</h3>
                  <p className="text-sm text-white/60">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
