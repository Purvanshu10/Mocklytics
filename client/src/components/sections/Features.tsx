"use client";

import { motion } from "framer-motion";
import { FileSearch, Mic, LineChart, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileSearch,
    title: "Resume Analysis",
    description: "Our AI completely parses your resume to tailor interview questions specifically to your experience and skills.",
    color: "text-blue-400"
  },
  {
    icon: Mic,
    title: "Dynamic Mock Interviews",
    description: "Engage in voice-to-voice or text-based mock interviews with our AI that acts like a real recruiter.",
    color: "text-primary"
  },
  {
    icon: Target,
    title: "Real-time Feedback",
    description: "Get instant, actionable feedback on your answers covering technical accuracy, clarity, and tone.",
    color: "text-secondary"
  },
  {
    icon: LineChart,
    title: "Performance Analytics",
    description: "Track your progress over time with detailed graphs, scoring metrics, and personalized improvement areas.",
    color: "text-green-400"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 text-white"
          >
            Supercharge Your <span className="text-primary">Interview Skills</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60"
          >
            Mocklytics gives you the unfair advantage. Everything you need to practice, perfect, and perform well in your next interview.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-background/40 backdrop-blur-sm border-white/5 hover:border-primary/50 transition-colors duration-300 overflow-hidden group h-full">
                <CardContent className="p-6 relative">
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="mb-6 relative">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 relative z-10">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed relative z-10">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
