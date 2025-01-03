"use client";

import React, { useState } from "react";
import { IconX } from "@tabler/icons-react";

interface PhraseInputProps {
  onSubmit: (phrase: string) => void;
  onClose: () => void;
}

export const PhraseInput: React.FC<PhraseInputProps> = ({ onSubmit, onClose }) => {
  const [words, setWords] = useState<string[]>(Array(12).fill(""));

  const handleInputChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(words.join(" "));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-8 relative">
        <p className="text-center text-muted-foreground mb-6">
          Enter your 12-word recovery phrase to access your wallets.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {words.map((word, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-muted-foreground">{index + 1}.</span>
              <input
                type="text"
                value={word}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full p-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00ff87] to-[#60efff] text-black font-semibold hover:opacity-90 transition-opacity"
          >
            Connect Wallets
          </button>
        </div>
      </div>
    </form>
  );
};