"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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

 


  const handleCreateWallet = async (network: 'Ethereum' | 'Solana') => {
    const mnemonic = localStorage.getItem(STORAGE_KEYS.MNEMONICS);
    if (!mnemonic) {
      toast.error("No mnemonic phrase found");
      return;
    }
  
    const networkWallets = wallets.filter(w => w.network === network);
  
    try {
      const res = await fetch("/api/createwallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network,
          mnemonic,
          index: networkWallets.length,
        }),
      });
  
      if (!res.ok) throw new Error("Wallet generation failed");
  
      const newWallet = await res.json();
  
      if (newWallet) {
        const updatedWallets = [...wallets, newWallet];
        setWallets(updatedWallets);
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updatedWallets));
        toast.success(`New ${network} wallet created!`);
      }
    } catch (err) {
      toast.error("Failed to create wallet");
      console.error(err);
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

  // Custom ETH and SOL icons for better recognizability
  const EthereumIcon = () => (
    <svg width="16" height="16" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className="inline-block">
      <path fill="#fff" d="M127.9611 0.0367744L125.1661 9.5877V285.168L127.9611 288L255.9221 212.3L127.9611 0.0367744Z" />
      <path fill="#fff" d="M127.962 0.0367744L0 212.3L127.962 288V154.158V0.0367744Z" />
      <path fill="#fff" d="M127.9609 312.1866L126.3859 314.1066V413.2966L127.9609 416.9666L255.9999 236.5866L127.9609 312.1866Z" />
      <path fill="#fff" d="M127.962 416.9667V312.1867L0 236.5867L127.962 416.9667Z" />
      <path fill="#fff" d="M127.9611 288.0001L255.9211 212.3001L127.9611 154.1581V288.0001Z" />
      <path fill="#fff" d="M0.041 212.3001L127.962 288.0001V154.1581L0.041 212.3001Z" />
    </svg>
  );

  const SolanaIcon = () => (
    <svg width="16" height="16" viewBox="0 0 397 311" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path fill="#fff" d="M64.6582 237.261L17.1493 284.708C13.2262 288.63 8.11752 290.834 2.7928 290.834C1.24708 290.834 0 290.714 0 290.473C0 288.509 1.84673 286.788 4.3357 286.185L397 286.302L336.404 286.304C331.097 286.304 326.027 284.102 322.106 280.179L231.586 189.584H64.6605V237.261H64.6582ZM64.6582 121.531H231.532L322 30.9362C325.921 27.0153 331.032 24.8105 336.354 24.8105H396.976L4.35918 24.7051C1.8702 24.7051 0 22.9919 0 21.0276C0 20.7842 1.24694 20.6645 2.7928 20.6645C8.11752 20.6645 13.2262 22.8693 17.1493 26.7902L64.6582 74.2369V121.531ZM336.323 148.073H64.6582V162.984H336.323C339.632 162.984 342.301 160.319 342.301 157.011C342.301 155.409 341.671 153.929 340.462 152.838C339.336 151.591 337.86 150.834 336.228 150.834L336.323 148.073Z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top navigation bar with responsive layout */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Top row with title and theme toggle */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">CryptoNest</h1>
            <ThemeToggle />
          </div>
          
          {/* Actions row with responsive wrapping */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-between items-center w-full">
            {/* Left side - wallet actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCreateWallet('Ethereum')}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm md:text-base"
              >
                <EthereumIcon />
                <span className="hidden xs:inline">Create</span> ETH Wallet
              </button>
              <button
                onClick={() => handleCreateWallet('Solana')}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center gap-2 text-sm md:text-base"
              >
                <SolanaIcon />
                <span className="hidden xs:inline">Create</span> SOL Wallet
              </button>
            </div>
            
            {/* Right side - utility actions */}
            <div className="flex flex-wrap gap-2 ml-auto">
              <button
                onClick={() => setShowPhraseModal(true)}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2 text-sm md:text-base"
              >
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Show</span> Phrase
              </button>
              <button
                onClick={handleClearAll}
                className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-2 text-sm md:text-base"
              >
                <Trash className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span> All
              </button>
              <button
                onClick={() => setGridView(!gridView)}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                aria-label={gridView ? "Switch to list view" : "Switch to grid view"}
              >
                {gridView ? <List className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Wallet cards with responsive grid/list layout */}
        {wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-muted-foreground/50 rounded-xl">
            <p className="text-lg mb-4 text-muted-foreground">No wallets created yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first Ethereum or Solana wallet to get started
            </p>
          </div>
        ) : (
          <div className={gridView ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6" : "space-y-4"}>
            {wallets.map((wallet) => (
              <BackgroundGradient
                key={wallet.id}
                network={wallet.network}
                className="cursor-pointer"
                onClick={() => router.push(`/wallets/${wallet.publicKey}`)}
              >
                <div className="p-4 md:p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg md:text-xl font-semibold">{wallet.name}</h3>
                    <span className="px-2 md:px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm flex items-center gap-1">
                      {wallet.network === 'Ethereum' ? <EthereumIcon /> : <SolanaIcon />}
                      {wallet.network}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs md:text-sm text-muted-foreground">Public Key</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(wallet.publicKey);
                          }}
                          className="p-1 hover:bg-secondary rounded-md transition-colors"
                          aria-label="Copy public key"
                        >
                          <Copy className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                      </div>
                      <code className="text-xs md:text-sm break-all bg-secondary p-2 rounded-md block">
                        {wallet.publicKey}
                      </code>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs md:text-sm text-muted-foreground">Private Key</span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePrivateKey(wallet.id);
                            }}
                            className="p-1 hover:bg-secondary rounded-md transition-colors"
                            aria-label={visiblePrivateKeys[wallet.id] ? "Hide private key" : "Show private key"}
                          >
                            {visiblePrivateKeys[wallet.id] ? (
                              <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
                            ) : (
                              <Eye className="h-3 w-3 md:h-4 md:w-4" />
                            )}
                          </button>
                          {visiblePrivateKeys[wallet.id] && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(wallet.privateKey);
                              }}
                              className="p-1 hover:bg-secondary rounded-md transition-colors"
                              aria-label="Copy private key"
                            >
                              <Copy className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <code className="text-xs md:text-sm break-all bg-secondary p-2 rounded-md block">
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
        )}
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


