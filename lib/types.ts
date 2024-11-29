export interface Wallet {
  id: string;
  publicKey: string;
  privateKey: string;
  network: 'Ethereum' | 'Solana';
  name: string;
  index: number;
}

export interface WalletBalance {
  balance: number;
  symbol: string;
}