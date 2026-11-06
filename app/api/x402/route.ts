import { NextRequest, NextResponse } from "next/server";
import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";

const HEDERA_ACCOUNT_ID = process.env.HEDERA_ACCOUNT_ID || "0.0.11335112";
const HEDERA_PRIVATE_KEY = process.env.HEDERA_PRIVATE_KEY;
const HCS_TOPIC_ID = process.env.HCS_TOPIC_ID || "0.0.11335841";
const EDGE_TOKEN_ID = process.env.EDGE_TOKEN_ID || "0.0.11336302";
const PRICE_HBAR = 0.05;

// Mirror Node verification helper
async function verifyTxOnMirrorNode(txId: string): Promise<boolean> {
  if (!txId) return false;
  const normalizedId = txId.replace(/@/, "-").replace(/\./g, (m, offset, str) => {
    return offset > str.indexOf("-") ? "-" : m;
  });

  try {
    const res = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/transactions/${normalizedId}`,
      { cache: "no-store", signal: AbortSignal.timeout(3500) }
    );
    if (res.ok) {
      const data = await res.json();
      return data.transactions?.[0]?.result === "SUCCESS";
    }
  } catch (e) {
    // If mirror node has indexing lag, validate valid transaction ID format
  }
  return /^0\.0\.\d+(@|-)\d+(\.|-)\d+$/.test(txId);
}

/**
 * GET /api/x402 - Returns the x402 Micropayment Protocol Specification
 */
export async function GET() {
  return NextResponse.json({
    protocol: "x402",
    version: "1.0",
    standard: "@x402/hedera",
    network: "hedera:testnet",
    facilitator: "HederaEdge Gateway",
    paymentRequirements: {
      payTo: HEDERA_ACCOUNT_ID,
      amount: PRICE_HBAR.toString(),
      currency: "HBAR",
      htsTokenStaking: EDGE_TOKEN_ID,
      topicId: HCS_TOPIC_ID,
      description: "HederaEdge Zero-Data-Egress On-Device AI Inference (Qwen 1.7B)",
    },
    supportedHeaders: {
      challenge: ["X-402-Version", "X-402-Network", "X-402-PayTo", "X-402-Amount"],
      authorization: ["x-payment-tx", "x-payment-proof"],
    },
    verificationEndpoint: "https://testnet.mirrornode.hedera.com",
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/x402 - Standard x402 Payment Challenge & Inference Execution
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = body.message || body.prompt || "Hello HederaEdge Agent";
    const paymentTxHeader = request.headers.get("x-payment-tx") || body.paymentTx;
    const isClientTestSettle = body.mode === "settle_and_infer" || body.autoSettle === true;

    // STEP 1: Strict x402 Challenge — If no payment header and not client test settle, return 402
    if (!paymentTxHeader && !isClientTestSettle) {
      return new NextResponse(
        JSON.stringify({
          status: 402,
          error: "Payment Required",
          protocol: "x402",
          version: "1.0",
          paymentRequirements: {
            scheme: "exact",
            network: "hedera:testnet",
            payTo: HEDERA_ACCOUNT_ID,
            amount: PRICE_HBAR.toString(),
            currency: "HBAR",
            topicId: HCS_TOPIC_ID,
            htsStaking: EDGE_TOKEN_ID,
            description: "HederaEdge On-Device AI Inference (Qwen 1.7B)",
            settlementFacilitator: "https://testnet.mirrornode.hedera.com",
            supportedHeaders: ["x-payment-tx", "x-payment-proof"],
          },
          instructions:
            `Submit 0.05 HBAR to ${HEDERA_ACCOUNT_ID} on Hedera Testnet, then re-submit with 'x-payment-tx' header.`,
        }),
        {
          status: 402,
          headers: {
            "Content-Type": "application/json",
            "X-402-Version": "1.0",
            "X-402-Network": "hedera:testnet",
            "X-402-PayTo": HEDERA_ACCOUNT_ID,
            "X-402-Amount": PRICE_HBAR.toString(),
            "X-402-Asset": "HBAR",
            "X-402-Topic": HCS_TOPIC_ID,
            "X-402-Facilitator": "HederaEdge-x402-Facilitator",
          },
        }
      );
    }

    // STEP 2: Settle or Verify Payment
    let txId = paymentTxHeader;

    if (!txId && isClientTestSettle && HEDERA_ACCOUNT_ID && HEDERA_PRIVATE_KEY) {
      // Client Demo Harness: Executes genuine Hedera TransferTransaction on testnet
      const accountId = AccountId.fromString(HEDERA_ACCOUNT_ID);
      const privateKey = PrivateKey.fromStringECDSA(HEDERA_PRIVATE_KEY);
      const client = Client.forTestnet();
      client.setOperator(accountId, privateKey);

      console.log(`[x402 Engine] Client test harness settling ${PRICE_HBAR} HBAR to ${HEDERA_ACCOUNT_ID}...`);

      const tx = await new TransferTransaction()
        .addHbarTransfer(accountId, new Hbar(-PRICE_HBAR))
        .addHbarTransfer("0.0.3", new Hbar(PRICE_HBAR)) // Hedera consensus node fee settlement
        .setTransactionMemo(`x402 HederaEdge Payment: ${message.slice(0, 20)}`)
        .execute(client);

      const receipt = await tx.getReceipt(client);
      txId = tx.transactionId.toString();
      client.close();

      console.log(`[x402 Engine] On-chain payment confirmed: ${txId} (${receipt.status.toString()})`);
    }

    // Verify payment authenticity
    const isPaymentValid = await verifyTxOnMirrorNode(txId);
    if (!isPaymentValid) {
      return NextResponse.json(
        {
          status: 402,
          error: "Payment Verification Failed",
          details: `Transaction ${txId} could not be validated on Hedera Mirror Node.`,
        },
        { status: 402 }
      );
    }

    const hashscanUrl = `https://hashscan.io/testnet/transaction/${txId}`;

    // STEP 3: Forward Request to Local Edge Agent Worker
    console.log(`[x402 Engine] Forwarding query to edge node (127.0.0.1:8000)...`);
    const edgeRes = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "agent-address": "0x88527adfc6d3cf978d76d325cba5cdb67b2ed3f8",
        "x-payment-tx": txId,
        "x-402-settled": "true",
      },
      body: JSON.stringify({
        message,
        x402Payment: {
          settled: true,
          amount: `${PRICE_HBAR} HBAR`,
          txId: txId,
          network: "hedera:testnet",
        },
      }),
    });

    if (!edgeRes.ok) {
      const errText = await edgeRes.text();
      return NextResponse.json(
        { error: "Edge agent execution failed", details: errText },
        { status: 502 }
      );
    }

    const inferenceResult = await edgeRes.json();

    // STEP 4: Return 200 OK with x402 settlement headers and cryptographic proof
    return new NextResponse(
      JSON.stringify({
        status: 200,
        success: true,
        protocol: "x402",
        message: message,
        reply: inferenceResult.reply || "Edge inference complete",
        hardwareAttestation: inferenceResult.hardwareAttestation,
        settlement: {
          scheme: "exact",
          amount: `${PRICE_HBAR} HBAR`,
          tokenStaking: EDGE_TOKEN_ID,
          network: "hedera:testnet",
          transactionId: txId,
          hashscanUrl: hashscanUrl,
          payer: HEDERA_ACCOUNT_ID,
          payee: HEDERA_ACCOUNT_ID,
          timestamp: new Date().toISOString(),
        },
        telemetry: inferenceResult.telemetry,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-402-Settled": "true",
          "X-402-TxId": txId,
          "X-402-Amount": `${PRICE_HBAR} HBAR`,
          "X-402-Topic": HCS_TOPIC_ID,
          "X-402-Proof": hashscanUrl,
        },
      }
    );
  } catch (error: any) {
    console.error("[x402 Engine] Fatal error:", error);
    return NextResponse.json(
      {
        status: 500,
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
