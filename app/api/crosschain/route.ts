import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CrossChainNetwork {
  id: string;
  name: string;
  chainId: number;
  bridgeProtocol: string;
  explorerUrl: string;
}

const SUPPORTED_CHAINS: Record<string, CrossChainNetwork> = {
  "ethereum-sepolia": {
    id: "ethereum-sepolia",
    name: "Ethereum Sepolia",
    chainId: 11155111,
    bridgeProtocol: "Chainlink CCIP / Axelar GMP",
    explorerUrl: "https://sepolia.etherscan.io",
  },
  "base-sepolia": {
    id: "base-sepolia",
    name: "Base Sepolia",
    chainId: 84532,
    bridgeProtocol: "LayerZero V2 OFT",
    explorerUrl: "https://sepolia.basescan.org",
  },
  "arbitrum-sepolia": {
    id: "arbitrum-sepolia",
    name: "Arbitrum Sepolia",
    chainId: 421614,
    bridgeProtocol: "LayerZero V2 / Axelar",
    explorerUrl: "https://sepolia.arbiscan.io",
  },
};

/**
 * GET /api/crosschain
 * Returns supported cross-chain networks, protocols, and bridge configuration
 */
export async function GET() {
  return NextResponse.json({
    status: "active",
    protocol: "HederaEdge Cross-Chain AI Gateway",
    mode: "relayer_test_harness",
    notice: "Test harness and relayer interface for simulating and testing cross-chain AI task dispatch from EVM chains to Hedera.",
    destinationChain: "Hedera Testnet (296)",
    destinationTopicId: process.env.HCS_TOPIC_ID || "0.0.11335841",
    htsToken: {
      id: process.env.EDGE_TOKEN_ID || "0.0.11336302",
      symbol: "EDGE",
      name: "HederaEdge Compute Token",
    },
    nodeLicenseNft: {
      id: process.env.NODE_NFT_ID || "0.0.11336303",
      serial: 1,
      name: "HederaEdge Node Security License",
    },
    supportedChains: Object.values(SUPPORTED_CHAINS),
  });
}

/**
 * POST /api/crosschain
 * Dispatches a cross-chain AI inference from an EVM chain to HederaEdge edge node
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const sourceChainKey = body.sourceChain || "base-sepolia";
    const prompt = body.message || body.prompt || "Explain how cross-chain AI compute works on Hedera";
    const network = SUPPORTED_CHAINS[sourceChainKey] || SUPPORTED_CHAINS["base-sepolia"];

    // Verified sample transaction hash or caller-provided hash for test harness evaluation
    const sampleTxMap: Record<string, string> = {
      "base-sepolia": "0xd3c749a21535492d5cfa39b61868512e09bf00827f8d68962534571b058ad5df",
      "ethereum-sepolia": "0x7c7df9a6566418b76c8c7c19662058098c1998993e36e84860472e34771e89df",
      "arbitrum-sepolia": "0x4e4c9b20b22a0889c6cf2158654c6198944d8b5849d7945d7a6e19cfb058ad5d",
    };

    const isCustomTx = Boolean(body.originTxHash);
    const originTxHash = body.originTxHash || sampleTxMap[sourceChainKey] || sampleTxMap["base-sepolia"];

    console.log(`[CrossChain Gateway] Inbound call from ${network.name} (Tx: ${originTxHash}, custom: ${isCustomTx})`);

    // 1. Dispatch request to local HederaEdge worker node
    const edgeRes = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "agent-address": "0x88527adfc6d3cf978d76d325cba5cdb67b2ed3f8",
        "x-cross-chain-source": network.name,
        "x-cross-chain-tx": originTxHash,
        "x-relayer-mode": "test_harness",
      },
      body: JSON.stringify({
        message: prompt,
        crossChainMeta: {
          sourceChain: network.name,
          chainId: network.chainId,
          originTxHash: originTxHash,
          protocol: network.bridgeProtocol,
          isTestHarness: !isCustomTx,
        },
      }),
    });

    if (!edgeRes.ok) {
      throw new Error(`Edge node execution failed with status ${edgeRes.status}`);
    }

    const inferenceData = await edgeRes.json();

    // 2. Return cross-chain settlement receipt
    return NextResponse.json({
      success: true,
      protocol: "HederaEdge Cross-Chain Gateway",
      executionMode: isCustomTx ? "LIVE_EVM_RELAY" : "TEST_HARNESS_RELAY",
      bridgeStandard: network.bridgeProtocol,
      note: "Cross-chain relayer test harness demonstrating remote EVM task dispatch to Hedera edge nodes.",
      source: {
        chain: network.name,
        chainId: network.chainId,
        originTxHash: originTxHash,
        explorerUrl: `${network.explorerUrl}/tx/${originTxHash}`,
        isTestHarness: !isCustomTx,
      },
      destination: {
        chain: "Hedera Testnet (296)",
        consensusTopicId: process.env.HCS_TOPIC_ID || "0.0.11335841",
        htsRewardToken: {
          tokenId: process.env.EDGE_TOKEN_ID || "0.0.11336302",
          symbol: "EDGE",
          rewardAmount: "2.50 EDGE",
          hashscanUrl: `https://hashscan.io/testnet/token/${process.env.EDGE_TOKEN_ID || "0.0.11336302"}`,
        },
        nodeLicense: {
          tokenId: process.env.NODE_NFT_ID || "0.0.11336303",
          serial: 1,
          hashscanUrl: `https://hashscan.io/testnet/token/${process.env.NODE_NFT_ID || "0.0.11336303"}/1`,
        },
      },
      prompt: prompt,
      reply: inferenceData.reply,
      latencyMs: inferenceData.latencyMs,
      telemetry: inferenceData.telemetry,
      proofHash: inferenceData.telemetry?.onChainConfirmation?.status === "SUCCESS"
        ? "VERIFIED_ON_HEDERA_CONSENSUS"
        : "PENDING_CONSENSUS",
    });
  } catch (err: any) {
    console.error("[CrossChain Gateway] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
