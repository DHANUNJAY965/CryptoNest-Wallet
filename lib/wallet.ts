import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { formatEther, JsonRpcProvider, HDNodeWallet, Wallet as EthersWallet } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { mnemonicToSeedSync } from "bip39";
import * as bs58 from "bs58";
import { Wallet, WalletBalance } from "./types";
import { NETWORK_ENDPOINTS, NETWORK_PATHS } from "./constants";

export const generateWallet = (
  network: 'Ethereum' | 'Solana',
  mnemonic: string,
  index: number
): Wallet | null => {
  try {
    const id = `${network.toLowerCase()}-${Date.now()}-${index}`;
    // For Solana,
    if (network === 'Solana') {
      const seed = mnemonicToSeedSync(mnemonic);
      const path = `${NETWORK_PATHS.SOLANA}/${index}'/0'`;
      const { key } = derivePath(path, seed.toString('hex'));
      const keyPair = Keypair.fromSeed(key);
      
      return {
        id,
        publicKey: keyPair.publicKey.toBase58(),
        privateKey: bs58.encode(keyPair.secretKey),
        network,
        name: `Solana Wallet ${index + 1}`,
        index
      };
    } else {
      // For Ethereum,
      const hdNode: HDNodeWallet = EthersWallet.fromPhrase(mnemonic);
      const wallet = hdNode.deriveChild(index);
      
      return {
        id,
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        network,
        name: `Ethereum Wallet ${index + 1}`,
        index
      };
    }
  } catch (error) {
    console.error('Failed to generate wallet:', error);
    return null;
  }
};

export const getWalletBalance = async (
  network: 'Ethereum' | 'Solana',
  address: string
): Promise<WalletBalance> => {
  try {
    //Getting Solana balance
    if (network === 'Solana') {
      const connection = new Connection(NETWORK_ENDPOINTS.SOLANA);
      const balance = await connection.getBalance(new PublicKey(address));
      return {
        balance: balance / LAMPORTS_PER_SOL,
        symbol: 'SOL'
      };
    } else {
      // Getting Ethereum balance
      const provider = new JsonRpcProvider(NETWORK_ENDPOINTS.ETHEREUM);
      const balance = await provider.getBalance(address);
      return {
        balance: parseFloat(formatEther(balance)),
        symbol: 'ETH'
      };
    }
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    return {
      balance: 0,
      symbol: network === 'Solana' ? 'SOL' : 'ETH'
    };
  }
};