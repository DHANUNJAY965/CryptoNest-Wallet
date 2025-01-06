"use client";

import { Eye, EyeOff, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PhraseModalProps {
  phrase: string;
  onClose: () => void;
}

export function PhraseModal({ phrase, onClose }: PhraseModalProps) {
  const [showPhrase, setShowPhrase] = useState(false);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-lg w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recovery Phrase</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Keep this phrase safe. It's the only way to recover your wallets.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPhrase(!showPhrase)}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {showPhrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {showPhrase && (
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm font-mono break-all">
              {showPhrase ? phrase : "••••••••••••••••••••••••••••••••"}
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}