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
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary transition-colors"
        >
          <IconX size={20} />
        </button>

        <p className="text-center text-muted-foreground mb-6">
          Write down these 12 words in order and keep them safe. You'll need them to recover your wallets.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {words.map((word, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
            >
              <span className="text-muted-foreground">{index + 1}.</span>
              <span className="font-mono">{word}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00ff87] to-[#60efff] text-black font-semibold hover:opacity-90 transition-opacity"
          >
            <IconCopy size={20} />
            Copy & Continue
          </button>
        </div>
      </div>
    </div>
  );
};