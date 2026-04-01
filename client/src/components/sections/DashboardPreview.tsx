"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, BarChart3, CheckCircle2, AlertCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

export function DashboardPreview() {
  return (
    <section id="analytics" className="py-24 relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-full h-[500px] bg-primary/5 blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 text-white"
            >
              Actionable <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Analytics</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/60"
            >
              Get deep insights into your interview performance. We break down your communication style, technical accuracy, and provide targeted tips to help you score higher next time.
            </motion.p>
          </div>
        </div>

        {/* Dashboard Mockup Component */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto rounded-xl border border-white/10 bg-background/50 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Mockup Header bar */}
          <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Score Card */}
            <Card className="col-span-1 border-white/10 bg-white/5 shadow-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Logo className="w-24 h-24" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/60">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">86</span>
                  <span className="text-sm text-white/60">/ 100</span>
                </div>
                <div className="flex items-center text-sm text-green-400 mt-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12% from last interview
                </div>
                
                <div className="mt-8 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">Technical Accuracy</span>
                      <span className="text-white font-medium">92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[92%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">Communication</span>
                      <span className="text-white font-medium">78%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-secondary rounded-full w-[78%]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column details */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-white/10 bg-white/5 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white/60 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-white">Excellent explanation of complex React concepts.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-white">Strong problem-solving framework used.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-white/10 bg-white/5 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white/60 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" /> Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm text-white">Used too many filler words (&quot;um&quot;, &quot;like&quot;) during system design question.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-white/10">
                    <p className="text-sm text-white/80 line-clamp-2">Missed edge cases in algorithmic challenge early on.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Chart Placeholder / Tips */}
              <Card className="col-span-1 md:col-span-2 border-white/10 bg-white/5 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white/60 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-primary" /> Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-32 flex items-end justify-between gap-2">
                  {/* Fake bars for visuals */}
                  {[40, 45, 60, 55, 70, 65, 86].map((h, i) => (
                    <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group transition-all hover:bg-primary/40" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}
