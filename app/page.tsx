"use client";

import { SparklesPreview } from "@/components/ui/sparkles";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import { PhraseDisplay } from "@/components/ui/phrase-display";
import { PhraseInput } from "@/components/ui/phrase-input";
import { STORAGE_KEYS } from "@/lib/constants";
import { Wallet, Coins } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [showPhraseDisplay, setShowPhraseDisplay] = useState(false);
  const [showPhraseInput, setShowPhraseInput] = useState(false);
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    const storedMnemonic = localStorage.getItem(STORAGE_KEYS.MNEMONICS);
    if (storedMnemonic) {
      router.push("/wallets");
    }
  }, [router]);

  const handleGeneratePhrase = () => {
    const mnemonic = generateMnemonic();
    setPhrase(mnemonic);
    setShowPhraseDisplay(true);
  };

  const handlePhraseContinue = () => {
    localStorage.setItem(STORAGE_KEYS.MNEMONICS, phrase);
    router.push("/wallets");
  };

  const handleConnectExisting = () => {
    setShowPhraseInput(true);
  };

  const handlePhraseSubmit = (submittedPhrase: string) => {
    try {
      if (!submittedPhrase.split(" ").every(word => word.length > 0)) {
        throw new Error("Invalid phrase");
      }
      localStorage.setItem(STORAGE_KEYS.MNEMONICS, submittedPhrase);
      router.push("/wallets");
    } catch (error) {
      toast.error("Invalid recovery phrase");
    }
  };

  if (showPhraseDisplay) {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <ThemeToggle  />
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 pt-10 sm:pt-0">
            Save Your Recovery Phrase
          </h1>
          <PhraseDisplay 
            phrase={phrase} 
            onContinue={handlePhraseContinue} 
            onClose={() => setShowPhraseDisplay(false)}
          />
        </div>
      </main>
    );
  }

  if (showPhraseInput) {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <ThemeToggle  />
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 pt-10 sm:pt-0">
            Enter Recovery Phrase
          </h1>
          <PhraseInput 
            onSubmit={handlePhraseSubmit}
            onClose={() => setShowPhraseInput(false)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative">
      <ThemeToggle  />
      <SparklesPreview />
      <div className="fixed bottom-10 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row gap-3 sm:gap-4 w-[90%] max-w-md z-20">
        <button
          onClick={handleGeneratePhrase}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#00ff87] to-[#60efff] text-black font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
        >
          Generate Phrase
        </button>
        <button
          onClick={handleConnectExisting}
          className="w-full px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors text-sm sm:text-base"
        >
          Connect with Existing Phrase
        </button>
      </div>
    </main>
  );
}