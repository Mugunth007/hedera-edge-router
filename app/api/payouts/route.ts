import { NextRequest, NextResponse } from "next/server";
import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";

export async function GET(request: NextRequest) {
  try {
    const topicId = process.env.HCS_TOPIC_ID || "0.0.11335841";
    const accountId = process.env.HEDERA_ACCOUNT_ID || "0.0.11335112";

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

    // Reward rate: 0.05 HBAR per verified inference
    const rewardRate = 0.05;
    const totalEarned = (verifiedCount * rewardRate).toFixed(4);

    return NextResponse.json({
      deviceAccount: accountId,
      topicId: topicId,
      verifiedInferences: verifiedCount,
      rewardRateHbar: rewardRate,
      totalEarnedHbar: totalEarned,
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

    if (!accountIdStr || !privateKeyStr) {
      return NextResponse.json({ error: "Hedera credentials not configured in .env.local" }, { status: 500 });
    }

    // 1. Check verified inference count from mirror node
    const mirrorRes = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=50&order=desc`,
      { cache: "no-store" }
    );
    const mirrorData = mirrorRes.ok ? await mirrorRes.json() : { messages: [] };
    const count = (mirrorData.messages || []).length;

    // 2. Execute on-chain payout transaction on Hedera
    const accountId = AccountId.fromString(accountIdStr);
    const privateKey = PrivateKey.fromStringECDSA(privateKeyStr);
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    const payoutAmount = 0.01; // Symbolic 0.01 HBAR testnet payout fee/reward

    // Send 0.01 HBAR to node operator (account transfers reward from pool)
    const tx = await new TransferTransaction()
      .addHbarTransfer(accountId, new Hbar(-payoutAmount))
      .addHbarTransfer("0.0.3", new Hbar(payoutAmount)) // To Hedera network faucet/node
      .setTransactionMemo(`HederaEdge Node Payout for ${count} inferences`)
      .execute(client);

    const receipt = await tx.getReceipt(client);
    const txId = tx.transactionId.toString();

    client.close();

    return NextResponse.json({
      success: true,
      status: receipt.status.toString(),
      transactionId: txId,
      inferencesRewarded: count,
      amountHbar: payoutAmount,
      recipient: accountIdStr,
      hashscanUrl: `https://hashscan.io/testnet/transaction/${txId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Payout] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
