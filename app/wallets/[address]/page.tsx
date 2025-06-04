"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Send, 
  Download, 
  RefreshCw, 
  Wallet as WalletIcon,
  Copy,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Wallet, WalletBalance } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { toast } from "sonner";

// Custom ETH and SOL icons
const EthereumIcon = () => (
  <svg width="24" height="24" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className="inline-block">
    <path fill="currentColor" d="M127.9611 0.0367744L125.1661 9.5877V285.168L127.9611 288L255.9221 212.3L127.9611 0.0367744Z" />
    <path fill="currentColor" d="M127.962 0.0367744L0 212.3L127.962 288V154.158V0.0367744Z" />
    <path fill="currentColor" d="M127.9609 312.1866L126.3859 314.1066V413.2966L127.9609 416.9666L255.9999 236.5866L127.9609 312.1866Z" />
    <path fill="currentColor" d="M127.962 416.9667V312.1867L0 236.5867L127.962 416.9667Z" />
    <path fill="currentColor" d="M127.9611 288.0001L255.9211 212.3001L127.9611 154.1581V288.0001Z" />
    <path fill="currentColor" d="M0.041 212.3001L127.962 288.0001V154.1581L0.041 212.3001Z" />
  </svg>
);

const SolanaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 397 311" xmlns="http://www.w3.org/2000/svg" className="inline-block">
    <path fill="currentColor" d="M64.6582 237.261L17.1493 284.708C13.2262 288.63 8.11752 290.834 2.7928 290.834C1.24708 290.834 0 290.714 0 290.473C0 288.509 1.84673 286.788 4.3357 286.185L397 286.302L336.404 286.304C331.097 286.304 326.027 284.102 322.106 280.179L231.586 189.584H64.6605V237.261H64.6582ZM64.6582 121.531H231.532L322 30.9362C325.921 27.0153 331.032 24.8105 336.354 24.8105H396.976L4.35918 24.7051C1.8702 24.7051 0 22.9919 0 21.0276C0 20.7842 1.24694 20.6645 2.7928 20.6645C8.11752 20.6645 13.2262 22.8693 17.1493 26.7902L64.6582 74.2369V121.531ZM336.323 148.073H64.6582V162.984H336.323C339.632 162.984 342.301 160.319 342.301 157.011C342.301 157.011 342.301 155.409 341.092 153.929C339.966 152.682 338.49 151.925 336.858 151.925L336.323 148.073Z" />
  </svg>
);

export default function WalletPage({ params }: { params: { address: string } }) {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTxns, setLoadingTxns] = useState(false);

  useEffect(() => {
    const storedWallets = localStorage.getItem(STORAGE_KEYS.WALLETS);
    if (storedWallets) {
      const wallets: Wallet[] = JSON.parse(storedWallets);
      const currentWallet = wallets.find(w => w.publicKey === params.address);
      if (currentWallet) {
        setWallet(currentWallet);
        loadBalance(currentWallet);
        loadTransactions(currentWallet);
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
      // console.log("Fetching balance for:", response);
      const data = await response.json();
      // console.log("The balance response:", data);
      // console.log("The balance data:", data.balance);
      setBalance(data);
    } catch (error) {
      toast.error("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (wallet: Wallet) => {
    try {
      setLoadingTxns(true);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network: wallet.network,
          address: wallet.publicKey,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      
      if (wallet.network.toLowerCase() === 'ethereum') {
        setTransactions(data.transactions || []);
      } else if (wallet.network.toLowerCase() === 'solana') {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      toast.error("Failed to load transactions");
      console.error(error);
    } finally {
      setLoadingTxns(false);
    }
  };

  const handleAction = (action: 'send' | 'receive' | 'swap') => {
    toast.info(`${action.charAt(0).toUpperCase() + action.slice(1)} feature will be available in the next update. Explore other features for now.`);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };


  const getCurrencyIcon = () => {
    const networkLower = wallet?.network.toLowerCase();
    if (networkLower === 'ethereum') {
      return <EthereumIcon />;
    } else if (networkLower === 'solana') {
      return <SolanaIcon />;
    } else {
      return <WalletIcon className="w-6 h-6" />;
    }
  };

 
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get button color based on network
  const getButtonColor = () => {
    const networkLower = wallet?.network.toLowerCase();
    if (networkLower === 'ethereum') {
      return "bg-blue-500 hover:bg-blue-600";
    } else if (networkLower === 'solana') {
      return "bg-purple-500 hover:bg-purple-600";
    } else {
      return "bg-primary hover:bg-primary/90";
    }
  };

  // Get badge color based on network
  const getBadgeColor = () => {
    const networkLower = wallet?.network.toLowerCase();
    if (networkLower === 'ethereum') {
      return "bg-blue-500/20 text-blue-300";
    } else if (networkLower === 'solana') {
      return "bg-purple-500/20 text-purple-300";
    } else {
      return "bg-secondary text-secondary-foreground";
    }
  };

  if (!wallet || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading wallet details...</p>
      </div>
    );
  }

  const renderTransactionList = () => {
    if (loadingTxns) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      );
    }
    
    if (!transactions || transactions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <WalletIcon className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-base mb-1">No transactions yet</p>
          <p className="text-sm">Your transaction history will appear here</p>
        </div>
      );
    }

    if (wallet.network.toLowerCase() === 'ethereum') {
      return (
        <div className="divide-y divide-border">
          {transactions.map((tx: any, index: number) => (
            <div key={index} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {tx.from === wallet.publicKey.toLowerCase() ? 'Sent' : 'Received'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tx.from === wallet.publicKey.toLowerCase() 
                      ? `To: ${truncateAddress(tx.to)}`
                      : `From: ${truncateAddress(tx.from)}`
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(tx.metadata.blockTimestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${tx.from === wallet.publicKey.toLowerCase() ? 'text-red-500' : 'text-green-500'}`}>
                    {tx.from === wallet.publicKey.toLowerCase() ? '-' : '+'}{Number(tx.value).toFixed(6)} {tx.asset}
                  </div>
                  <a 
                    href={`https://etherscan.io/tx/${tx.hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center justify-end gap-1 mt-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (wallet.network.toLowerCase() === 'solana') {
      return (
        <div className="divide-y divide-border">
          {transactions.map((tx: any, index: number) => (
            <div key={index} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    Transaction
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-xs">
                    {tx.transaction.signatures[0]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(tx.blockTime * 1000).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {tx.meta.fee / 1000000000} SOL fee
                  </div>
                  <a 
                    href={`https://explorer.solana.com/tx/${tx.transaction.signatures[0]}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center justify-end gap-1 mt-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

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
        <div className="bg-card rounded-xl shadow-lg mb-6 overflow-hidden">
          {/* Wallet header */}
          <div className="p-4 sm:p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold">{wallet.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 w-fit ${getBadgeColor()}`}>
                    {getCurrencyIcon()}
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

        
          <div className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => handleAction('send')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white transition-opacity ${getButtonColor()}`}
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
              <button
                onClick={() => handleAction('receive')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white transition-opacity ${getButtonColor()}`}
              >
                <Download className="w-5 h-5" />
                <span>Receive</span>
              </button>
              <button
                onClick={() => handleAction('swap')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white transition-opacity ${getButtonColor()}`}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Swap</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-card rounded-xl shadow-lg mb-6">
          <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <button
              onClick={() => loadTransactions(wallet)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Refresh transactions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 sm:p-6">
            {renderTransactionList()}
          </div>
        </div>
      </div>
    </div>
  );
}