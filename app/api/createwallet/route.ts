import { NextRequest, NextResponse } from 'next/server';
import { Keypair, PublicKey } from "@solana/web3.js";
import { Wallet as EthersWallet, HDNodeWallet } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { mnemonicToSeedSync } from "bip39";
import * as bs58 from "bs58";
import {  NETWORK_PATHS } from "../../../lib/constants";


export async function POST(req: NextRequest) {
  try {
    const { network, mnemonic, index } = await req.json();

    if (!network || !mnemonic || typeof index !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = `${network.toLowerCase()}-${Date.now()}-${index}`;

    if (network === 'Solana') {
      const seed = mnemonicToSeedSync(mnemonic);
      const path = `${NETWORK_PATHS.SOLANA}/${index}'/0'`;
      const { key } = derivePath(path, seed.toString('hex'));
      const keyPair = Keypair.fromSeed(key);

      return NextResponse.json({
        id,
        publicKey: keyPair.publicKey.toBase58(),
        privateKey: bs58.encode(keyPair.secretKey),
        network,
        name: `Solana Wallet ${index + 1}`,
        index
      });
    } else if (network === 'Ethereum') {
      const hdNode: HDNodeWallet = EthersWallet.fromPhrase(mnemonic);
      const wallet = hdNode.deriveChild(index);

      return NextResponse.json({
        id,
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        network,
        name: `Ethereum Wallet ${index + 1}`,
        index
      });
    } else {
      return NextResponse.json({ error: 'Unsupported network' }, { status: 400 });
    }
  } catch (err) {
    console.error('Error generating wallet:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}