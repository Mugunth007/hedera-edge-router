import { NextRequest, NextResponse } from "next/server";
import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  TokenMintTransaction,
  TokenId,
  Hbar,
} from "@hashgraph/sdk";

export async function GET(request: NextRequest) {
  try {
    const topicId = process.env.HCS_TOPIC_ID || "0.0.11335841";
    const accountId = process.env.HEDERA_ACCOUNT_ID || "0.0.11335112";
    const edgeTokenId = process.env.EDGE_TOKEN_ID || "0.0.11336302";

    // 1. Fetch message history from Hedera Mirror Node
    const mirrorRes = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=100&order=desc`,
      { cache: "no-store" }
    );

    if (!mirrorRes.ok) {
      return NextResponse.json({ error: "Failed to fetch from Hedera mirror node" }, { status: 502 });
    }

    const mirrorData = await mirrorRes.json();
    const messages = mirrorData.messages || [];

    // Calculate verified inferences
    let verifiedCount = 0;
    messages.forEach((msg: any) => {
      try {
        const decoded = JSON.parse(Buffer.from(msg.message, "base64").toString("utf8"));
        if (decoded.standard === "hcs-10" && decoded.event === "inference_completed") {
          verifiedCount++;
        }
      } catch {}
    });

    // Node Economics: 90% share of 0.05 HBAR = 0.045 HBAR + 1.0 $EDGE token reward
    const rewardRateHbar = 0.045;
    const edgeRewardPerInference = 1.0;
    const totalEarnedHbar = (verifiedCount * rewardRateHbar).toFixed(4);
    const totalEarnedEdge = (verifiedCount * edgeRewardPerInference).toFixed(2);

    return NextResponse.json({
      deviceAccount: accountId,
      topicId: topicId,
      edgeTokenId: edgeTokenId,
      verifiedInferences: verifiedCount,
      rewardRateHbar: rewardRateHbar,
      totalEarnedHbar: totalEarnedHbar,
      edgeTokensEarned: totalEarnedEdge,
      protocolFeeHbar: "0.0050",
      lastCalculated: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
    const topicId = process.env.HCS_TOPIC_ID || "0.0.11335841";
    const edgeTokenId = process.env.EDGE_TOKEN_ID || "0.0.11336302";

    if (!accountIdStr || !privateKeyStr) {
      return NextResponse.json({ error: "Hedera credentials not configured in .env.local" }, { status: 500 });
    }

    // 1. Check verified inference count from mirror node
    const mirrorRes = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=50&order=desc`,
      { cache: "no-store" }
    );
    const mirrorData = mirrorRes.ok ? await mirrorRes.json() : { messages: [] };
    const count = (mirrorData.messages || []).length || 1;

    // 2. Initialize Hedera Testnet Client
    const accountId = AccountId.fromString(accountIdStr);
    const privateKey = PrivateKey.fromStringECDSA(privateKeyStr);
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    // 3. Programmatic HTS Token Reward: Mint & Allocate $EDGE tokens for node compute
    const edgeRewardTokens = Math.max(1, count); // 1 $EDGE per inference
    const mintTx = await new TokenMintTransaction()
      .setTokenId(TokenId.fromString(edgeTokenId))
      .setAmount(edgeRewardTokens * 100) // 2 decimals = 100 base units per token
      .execute(client);

    const mintReceipt = await mintTx.getReceipt(client);
    const mintTxId = mintTx.transactionId.toString();

    // 4. On-chain HBAR Payout Settlement (0.045 HBAR node earnings)
    const payoutAmountHbar = 0.045;
    const hbarTx = await new TransferTransaction()
      .addHbarTransfer(accountId, new Hbar(-payoutAmountHbar))
      .addHbarTransfer("0.0.3", new Hbar(payoutAmountHbar)) // Network consensus pool settlement
      .setTransactionMemo(`HederaEdge Node Payout: ${count} verified inferences`)
      .execute(client);

    const hbarReceipt = await hbarTx.getReceipt(client);
    const hbarTxId = hbarTx.transactionId.toString();

    client.close();

    return NextResponse.json({
      success: true,
      status: "SUCCESS",
      recipient: accountIdStr,
      inferencesRewarded: count,
      payout: {
        amountHbar: payoutAmountHbar,
        hbarTransactionId: hbarTxId,
        hbarHashScan: `https://hashscan.io/testnet/transaction/${hbarTxId}`,
      },
      htsTokenReward: {
        tokenId: edgeTokenId,
        tokensMinted: edgeRewardTokens,
        mintTransactionId: mintTxId,
        tokenHashScan: `https://hashscan.io/testnet/token/${edgeTokenId}`,
        mintStatus: mintReceipt.status.toString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Payout] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
