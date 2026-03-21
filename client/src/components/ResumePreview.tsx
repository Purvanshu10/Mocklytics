"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Eye, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ResumePreviewProps {
  resumeText: string;
  maxLength?: number;
}

export function ResumePreview({ resumeText, maxLength = 500 }: ResumePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = resumeText.length > maxLength;
  const displayText = isExpanded ? resumeText : resumeText.slice(0, maxLength);

  return (
    <div className="w-full space-y-4">
      <div className="relative group">
        <motion.div
          animate={{ height: isExpanded ? "auto" : "200px" }}
          className={cn(
            "relative w-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 transition-colors group-hover:border-white/10",
            !isExpanded && "max-h-[200px]"
          )}
        >
          <div className="p-6">
            <pre className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {displayText}
              {!isExpanded && shouldTruncate && "..."}
            </pre>
          </div>

          {/* Bottom fade effect when collapsed */}
          <AnimatePresence>
            {!isExpanded && shouldTruncate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Icon for decoration */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <FileText className="w-12 h-12 text-primary" />
        </div>
      </div>

      {shouldTruncate && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="group/btn gap-2 text-white/40 hover:text-primary hover:bg-primary/10 transition-all rounded-xl px-6"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                <span>Show More</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
