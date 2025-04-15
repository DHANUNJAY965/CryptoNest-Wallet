export const NETWORK_ENDPOINTS = {
  // ETHEREUM: "https://eth-sepolia.g.alchemy.com/v2/demo",
  ETHEREUM: "https://eth-mainnet.g.alchemy.com/v2/AkXSZiztwKp55SZWaBjvujq0qBuMM6bz",
  // SOLANA: "https://api.mainnet-beta.solana.com"
  SOLANA: "https://solana-mainnet.g.alchemy.com/v2/AkXSZiztwKp55SZWaBjvujq0qBuMM6bz"
} as const;

export const STORAGE_KEYS = {
  MNEMONICS: "mnemonics",
  WALLETS: "wallets"
} as const;

export const NETWORK_PATHS = {
  ETHEREUM: "m/44'/60'/0'/0",
  SOLANA: "m/44'/501'"
} as const;