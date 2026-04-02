"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-1px rounded-3xl overflow-hidden glass"
        >
          {/* Inner border to look like card */}
          <div className="absolute inset-0 border-[2px] border-white/10 rounded-3xl pointer-events-none" />
          
          <div className="bg-background/80 backdrop-blur-xl px-8 py-16 md:py-24 rounded-3xl text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6 border border-primary/30 text-primary shadow-[0_0_30px_rgba(0,194,255,0.3)]">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Your AI Interview Journey Today
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Stop guessing if you are ready. Let Mocklytics give you the confidence to ace your next tech interview.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/upload">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(0,194,255,0.4)] transition-all">
                  Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/40 mt-4">No credit card required. Cancel anytime.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
