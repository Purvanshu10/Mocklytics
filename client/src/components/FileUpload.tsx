"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string | null;
}

export function FileUpload({ onFileSelect, selectedFile, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        onFileSelect(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden",
          "flex flex-col items-center justify-center p-12 min-h-[300px]",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_20px_rgba(0,194,255,0.2)]" 
            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20",
          selectedFile && "border-primary/50 bg-primary/5"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Click or drag to upload
              </h3>
              <p className="text-white/50 text-sm max-w-[240px]">
                Support for PDF resumes up to 10MB.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center p-4 w-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 relative">
                <FileText className="w-8 h-8 text-primary" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
              </div>
              <div className="flex flex-col items-center gap-1 mb-6">
                <span className="text-lg font-medium text-white truncate max-w-[300px]">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-white/40">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                className="text-white/40 hover:text-white hover:bg-white/10 gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Change Selection
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-2xl pointer-events-none" />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-red-400 text-sm px-4"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
