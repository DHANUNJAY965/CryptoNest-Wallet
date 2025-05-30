import { NextRequest, NextResponse } from 'next/server';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { JsonRpcProvider, formatEther } from "ethers";
import { NETWORK_ENDPOINTS } from "../../../lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { network, address } = await req.json();

    if (!network || !address) {
      return NextResponse.json({ error: 'Missing network or address' }, { status: 400 });
    }

    if (network === 'Solana') {
      const connection = new Connection(NETWORK_ENDPOINTS.SOLANA);
      const balance = await connection.getBalance(new PublicKey(address));
      return NextResponse.json({
        balance: balance / LAMPORTS_PER_SOL,
        symbol: 'SOL'
      });
    } else if (network === 'Ethereum') {
      const provider = new JsonRpcProvider(NETWORK_ENDPOINTS.ETHEREUM);
      const balance = await provider.getBalance(address);
      return NextResponse.json({
        balance: parseFloat(formatEther(balance)),
        symbol: 'ETH'
      });
    } else {
      return NextResponse.json({ error: 'Unsupported network' }, { status: 400 });
    }
  } catch (err) {
    console.error('Error fetching balance:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
