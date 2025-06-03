import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { NETWORK_ENDPOINTS } from "../../../lib/constants";
export async function POST(req: Request) {
  try {
    const { network, address } = await req.json();
    if (!network || !address) {
      return NextResponse.json({ error: "Network and address are required" }, { status: 400 });
    }

    if (network.toLowerCase() === "solana") {
      const connection = new Connection(NETWORK_ENDPOINTS.SOLANA, "confirmed");
      const pubKey = new PublicKey(address);

      const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 10 });

      const transactions = await Promise.all(
        signatures.map(async (signatureInfo) => {
          try {
            const txn = await connection.getTransaction(signatureInfo.signature, {
              commitment: "confirmed",
              maxSupportedTransactionVersion: 0,
            });
            return txn;
          } catch (err) {
            console.error("Error fetching transaction", err);
            return null;
          }
        })
      );

      return NextResponse.json({
        network: "solana",
        address,
        transactions: transactions.filter(Boolean),
      });
    }

    if (network.toLowerCase() === "ethereum") {
      const alchemyUrl = `${NETWORK_ENDPOINTS.ETHEREUM}`;

      const response = await fetch(alchemyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "0x0",
              toAddress: address,
              category: ["external", "internal", "erc20", "erc721", "erc1155"],
              maxCount: "0xa",
              withMetadata: true,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.error) {
        return NextResponse.json({ error: data.error.message }, { status: 500 });
      }

      return NextResponse.json({
        network: "ethereum",
        address,
        transactions: data.result.transfers,
      });
    }

    return NextResponse.json({ error: "Unsupported network" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching transactions", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}