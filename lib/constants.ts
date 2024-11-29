export const NETWORK_ENDPOINTS = {
  ETHEREUM: "https://eth-sepolia.g.alchemy.com/v2/demo",
  SOLANA: "https://api.devnet.solana.com"
} as const;

export const STORAGE_KEYS = {
  MNEMONICS: "mnemonics",
  WALLETS: "wallets"
} as const;

export const NETWORK_PATHS = {
  ETHEREUM: "m/44'/60'/0'/0",
  SOLANA: "m/44'/501'"
} as const;