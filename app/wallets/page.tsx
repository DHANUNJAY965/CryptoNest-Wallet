"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateWallet } from "@/lib/wallet";
import { Wallet } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { STORAGE_KEYS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Copy, Eye, EyeOff, Grid2X2, List, Trash, Key } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { PhraseModal } from "@/components/ui/phrase-modal";

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<Record<string, boolean>>({});
  const [gridView, setGridView] = useState<boolean>(true);
  const [showPhraseModal, setShowPhraseModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedMnemonic = localStorage.getItem(STORAGE_KEYS.MNEMONICS);
    const storedWallets = localStorage.getItem(STORAGE_KEYS.WALLETS);

    if (!storedMnemonic) {
      router.push("/");
      return;
    }

    if (storedWallets) {
      const parsedWallets = JSON.parse(storedWallets);
      setWallets(parsedWallets);
      setVisiblePrivateKeys(
        parsedWallets.reduce((acc: Record<string, boolean>, wallet: Wallet) => {
          acc[wallet.id] = false;
          return acc;
        }, {})
      );
    }
  }, [router]);

  const handleCreateWallet = (network: 'Ethereum' | 'Solana') => {
    const mnemonic = localStorage.getItem(STORAGE_KEYS.MNEMONICS);
    if (!mnemonic) {
      toast.error("No mnemonic phrase found");
      return;
    }

    const networkWallets = wallets.filter(w => w.network === network);
    const newWallet = generateWallet(network, mnemonic, networkWallets.length);

    if (newWallet) {
      const updatedWallets = [...wallets, newWallet];
      setWallets(updatedWallets);
      localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updatedWallets));
      toast.success(`New ${network} wallet created!`);
    }
  };

  const handleClearAll = () => {
    toast.warning(
      "Are you sure you want to clear all wallets?",
      {
        action: {
          label: "Yes, clear all",
          onClick: () => {
            localStorage.removeItem(STORAGE_KEYS.WALLETS);
            localStorage.removeItem(STORAGE_KEYS.MNEMONICS);
            setWallets([]);
            setVisiblePrivateKeys({});
            toast.success("All wallets cleared");
            router.push("/");
          },
        },
      }
    );
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const togglePrivateKey = (id: string) => {
    setVisiblePrivateKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gradient">CryptoNest</h1>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={() => setShowPhraseModal(true)}
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Show Phrase
            </button>
            <button
              onClick={() => handleCreateWallet('Ethereum')}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Create ETH Wallet
            </button>
            <button
              onClick={() => handleCreateWallet('Solana')}
              className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              Create SOL Wallet
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              Clear All
            </button>
            <button
              onClick={() => setGridView(!gridView)}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {gridView ? <List className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className={gridView ? "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" : "space-y-4"}>
          {wallets.map((wallet) => (
            <BackgroundGradient
              key={wallet.id}
              network={wallet.network}
              className="cursor-pointer"
              onClick={() => router.push(`/wallets/${wallet.publicKey}`)}
            >
              <div className="p-4 md:p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{wallet.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                    {wallet.network}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Public Key</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(wallet.publicKey);
                        }}
                        className="p-1 hover:bg-secondary rounded-md transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <code className="text-sm break-all bg-secondary p-2 rounded-md block">
                      {wallet.publicKey}
                    </code>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Private Key</span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePrivateKey(wallet.id);
                          }}
                          className="p-1 hover:bg-secondary rounded-md transition-colors"
                        >
                          {visiblePrivateKeys[wallet.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        {visiblePrivateKeys[wallet.id] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(wallet.privateKey);
                            }}
                            className="p-1 hover:bg-secondary rounded-md transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <code className="text-sm break-all bg-secondary p-2 rounded-md block">
                      {visiblePrivateKeys[wallet.id]
                        ? wallet.privateKey
                        : "••••••••••••••••••••••••••••••••"}
                    </code>
                  </div>
                </div>
              </div>
            </BackgroundGradient>
          ))}
        </div>
      </div>

      {showPhraseModal && (
        <PhraseModal
          phrase={localStorage.getItem(STORAGE_KEYS.MNEMONICS) || ""}
          onClose={() => setShowPhraseModal(false)}
        />
      )}
    </div>
  );
}