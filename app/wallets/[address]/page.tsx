"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { Wallet, WalletBalance } from "@/lib/types";
import { getWalletBalance } from "@/lib/wallet";
import { STORAGE_KEYS } from "@/lib/constants";
import { toast } from "sonner";

export default function WalletPage({ params }: { params: { address: string } }) {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);

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
    const walletBalance = await getWalletBalance(wallet.network, wallet.publicKey);
    setBalance(walletBalance);
  };

  const handleAction = (action: 'send' | 'receive' | 'swap') => {
    toast.info("This feature will be available in the next update. Explore other features for now.");
  };

  if (!wallet || !balance) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <button
        onClick={() => router.push("/wallets")}
        className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
      >
        <IconArrowLeft size={20} />
        Back to Wallets
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6">{wallet.name}</h1>
          
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">Balance</p>
            <p className="text-4xl font-bold">
              {balance.balance.toFixed(6)} {balance.symbol}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleAction('send')}
              className="p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Send
            </button>
            <button
              onClick={() => handleAction('receive')}
              className="p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Receive
            </button>
            <button
              onClick={() => handleAction('swap')}
              className="p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}