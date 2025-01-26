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
      <main className="min-h-screen bg-background p-8">
        <ThemeToggle />
        <h1 className="text-4xl font-bold text-center mb-8">
          Save Your Recovery Phrase
        </h1>
        <PhraseDisplay 
          phrase={phrase} 
          onContinue={handlePhraseContinue} 
          onClose={() => setShowPhraseDisplay(false)}
        />
      </main>
    );
  }

  if (showPhraseInput) {
    return (
      <main className="min-h-screen bg-background p-8">
        <ThemeToggle />
        <h1 className="text-4xl font-bold text-center mb-8">
          Enter Recovery Phrase
        </h1>
        <PhraseInput 
          onSubmit={handlePhraseSubmit}
          onClose={() => setShowPhraseInput(false)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <ThemeToggle />
      <SparklesPreview />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-24">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Wallet className="w-5 h-5" />
          <p className="text-lg text-muted-foreground">
            Your secure multi-chain wallet manager
          </p>
          <Coins className="w-14 h-5" />
        </div>
      </div>
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row gap-4 w-[90%] max-w-md">
        <button
          onClick={handleGeneratePhrase}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#00ff87] to-[#60efff] text-black font-semibold hover:opacity-90 transition-opacity"
        >
          Generate Phrase
        </button>
        <button
          onClick={handleConnectExisting}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
        >
          Connect with Existing Phrase
        </button>
      </div>
    </main>
  );
}