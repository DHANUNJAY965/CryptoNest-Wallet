"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Send, 
  Download, 
  RefreshCw, 
  Copy,
  Loader2
} from "lucide-react";
import { Wallet, WalletBalance } from "@/lib/types";
import { getWalletBalance } from "@/lib/wallet";
import { STORAGE_KEYS } from "@/lib/constants";
import { toast } from "sonner";

// Custom ETH and SOL icons to match the icons in WalletsPage
const EthereumIcon = () => (
  <svg width="16" height="16" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className="inline-block">
    <path fill="currentColor" d="M127.9611 0.0367744L125.1661 9.5877V285.168L127.9611 288L255.9221 212.3L127.9611 0.0367744Z" />
    <path fill="currentColor" d="M127.962 0.0367744L0 212.3L127.962 288V154.158V0.0367744Z" />
    <path fill="currentColor" d="M127.9609 312.1866L126.3859 314.1066V413.2966L127.9609 416.9666L255.9999 236.5866L127.9609 312.1866Z" />
    <path fill="currentColor" d="M127.962 416.9667V312.1867L0 236.5867L127.962 416.9667Z" />
    <path fill="currentColor" d="M127.9611 288.0001L255.9211 212.3001L127.9611 154.1581V288.0001Z" />
    <path fill="currentColor" d="M0.041 212.3001L127.962 288.0001V154.1581L0.041 212.3001Z" />
  </svg>
);

const SolanaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 397 311" xmlns="http://www.w3.org/2000/svg" className="inline-block">
    <path fill="currentColor" d="M64.6582 237.261L17.1493 284.708C13.2262 288.63 8.11752 290.834 2.7928 290.834C1.24708 290.834 0 290.714 0 290.473C0 288.509 1.84673 286.788 4.3357 286.185L397 286.302L336.404 286.304C331.097 286.304 326.027 284.102 322.106 280.179L231.586 189.584H64.6605V237.261H64.6582ZM64.6582 121.531H231.532L322 30.9362C325.921 27.0153 331.032 24.8105 336.354 24.8105H396.976L4.35918 24.7051C1.8702 24.7051 0 22.9919 0 21.0276C0 20.7842 1.24694 20.6645 2.7928 20.6645C8.11752 20.6645 13.2262 22.8693 17.1493 26.7902L64.6582 74.2369V121.531ZM336.323 148.073H64.6582V162.984H336.323C339.632 162.984 342.301 160.319 342.301 157.011C342.301 157.011 342.301 155.409 341.092 153.929C339.966 152.682 338.49 151.925 336.858 151.925L336.323 148.073Z" />
  </svg>
);

export default function WalletPage({ params }: { params: { address: string } }) {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedWallets = localStorage.getItem(STORAGE_KEYS.WALLETS);
    if (storedWallets) {
      const wallets: Wallet[] = JSON.parse(storedWallets);
      const currentWallet = wallets.find(w => w.publicKey === params.address);
      if (currentWallet) {
        setWallet(currentWallet);
        loadBalance(currentWallet);
      } else {
        router.push('/wallets');
      }
    } else {
      router.push('/wallets');
    }
  }, [params.address, router]);


  const loadBalance = async (wallet: Wallet) => {
    try {
      setLoading(true);
      const response = await fetch("/api/getwalletbalance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network: wallet.network,
          address: wallet.publicKey,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance");
      }
  
      const walletBalance = await response.json();
      setBalance(walletBalance);
    } catch (error) {
      toast.error("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };
  

  const handleAction = (action: 'send' | 'receive' | 'swap') => {
    toast.info(`${action.charAt(0).toUpperCase() + action.slice(1)} feature will be available in the next update. Explore other features for now.`);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  if (!wallet || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading wallet details...</p>
      </div>
    );
  }

  // Get chain-specific styling
  const getChainStyling = () => {
    const networkLower = wallet.network.toLowerCase();
    if (networkLower === 'ethereum') {
      return {
        icon: <EthereumIcon />,
        badge: "bg-blue-500/20 text-blue-300",
        button: "bg-blue-500 hover:bg-blue-600"
      };
    } else {
      // Solana
      return {
        icon: <SolanaIcon />,
        badge: "bg-purple-500/20 text-purple-300",
        button: "bg-purple-500 hover:bg-purple-600"
      };
    }
  };

  const chainStyle = getChainStyling();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/wallets")}
          className="flex items-center gap-2 mb-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wallets</span>
        </button>

        {/* Wallet details card */}
        <div className="bg-card rounded-xl shadow-lg overflow-hidden">
          {/* Wallet header */}
          <div className="p-4 sm:p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <h1 className="text-2xl font-bold">{wallet.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 w-fit ${chainStyle.badge}`}>
                {chainStyle.icon}
                <span>{wallet.network}</span>
              </span>
            </div>
            <div className="flex items-center mt-2 gap-2">
              <div className="text-xs text-muted-foreground max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg truncate">
                {wallet.publicKey}
              </div>
              <button
                onClick={() => copyToClipboard(wallet.publicKey)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Copy public key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Balance section */}
          <div className="p-4 sm:p-6">
            <div className="bg-muted/30 rounded-lg p-4 sm:p-6">
              <div className="mb-1 text-sm text-muted-foreground">Balance</div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {balance ? (
                    `${balance.balance.toFixed(6)} ${balance.symbol}`
                  ) : (
                    "Loading..."
                  )}
                </h2>
                <button
                  onClick={() => loadBalance(wallet)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Refresh balance"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => handleAction('send')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white transition-opacity ${chainStyle.button}`}
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
              <button
                onClick={() => handleAction('receive')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white transition-opacity ${chainStyle.button}`}
              >
                <Download className="w-5 h-5" />
                <span>Receive</span>
              </button>
              <button
                onClick={() => handleAction('swap')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white transition-opacity ${chainStyle.button}`}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Swap</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
