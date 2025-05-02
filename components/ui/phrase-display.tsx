"use client";

import React from "react";
import { IconCopy, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

interface PhraseDisplayProps {
  phrase: string;
  onContinue: () => void;
  onClose: () => void;
}

export const PhraseDisplay: React.FC<PhraseDisplayProps> = ({ phrase, onContinue, onClose }) => {
  const words = phrase.split(" ");

  const handleCopy = () => {
    navigator.clipboard.writeText(phrase);
    toast.success("Recovery phrase copied!");
    onContinue();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <IconX size={18} className="sm:w-5 sm:h-5" />
        </button>

        <p className="text-center text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 mt-2 px-2">
          Write down these 12 words in order and keep them safe. You'll need them to recover your wallets.
        </p>

        {/* For larger screens (sm and up) - 3 columns */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {words.map((word, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 sm:p-3 bg-secondary rounded-lg"
            >
              <span className="text-sm sm:text-base text-muted-foreground">{index + 1}.</span>
              <span className="font-mono text-sm sm:text-base break-all">{word}</span>
            </div>
          ))}
        </div>

        {/* For mobile screens (xs) - 2 columns */}
        <div className="grid grid-cols-2 sm:hidden gap-2 mb-6">
          {words.map((word, index) => (
            <div
              key={index}
              className="flex items-center gap-1 p-2 bg-secondary rounded-lg"
            >
              <span className="text-xs text-muted-foreground">{index + 1}.</span>
              <span className="font-mono text-xs break-all">{word}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-[#00ff87] to-[#60efff] text-black text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity"
          >
            <IconCopy size={16} className="sm:w-5 sm:h-5" />
            Copy & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
