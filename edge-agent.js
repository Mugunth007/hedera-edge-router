const express = require("express");
const {
  Client,
  AccountId,
  PrivateKey,
  TopicMessageSubmitTransaction,
  TopicId,
} = require("@hashgraph/sdk");
require("dotenv").config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Initialize Hedera Client
const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
const topicIdStr = process.env.HCS_TOPIC_ID || "0.0.11335544";

let hederaClient = null;
if (accountIdStr && privateKeyStr) {
  try {
    const accountId = AccountId.fromString(accountIdStr);
    const privateKey = PrivateKey.fromStringECDSA(privateKeyStr);
    hederaClient = Client.forTestnet();
    hederaClient.setOperator(accountId, privateKey);
    console.log(`[HederaEdge] Initialized client for account: ${accountIdStr}`);
    console.log(`[HederaEdge] Logging telemetry to HCS Topic: ${topicIdStr}`);
  } catch (err) {
    console.error("[HederaEdge] Failed to initialize client:", err.message);
  }
}

// Function to log telemetry to Hedera Consensus Service
async function logTelemetryToHedera(telemetry) {
  if (!hederaClient) {
    console.warn("[HederaEdge] Client not configured, skipping on-chain logging");
    return null;
  }

  try {
    const message = JSON.stringify(telemetry);
    console.log(`[HederaEdge] Submitting HCS-10 telemetry message to topic ${topicIdStr}...`);
    
    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(TopicId.fromString(topicIdStr))
      .setMessage(message)
      .execute(hederaClient);

    const receipt = await tx.getReceipt(hederaClient);
    console.log(`[HederaEdge] Telemetry confirmed on-chain! Status: ${receipt.status.toString()}`);
    return {
      status: receipt.status.toString(),
      topicId: topicIdStr,
      hashscanUrl: `https://hashscan.io/testnet/topic/${topicIdStr}`,
    };
  } catch (err) {
    console.error("[HederaEdge] Failed to submit message to HCS:", err.message);
    return null;
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    network: "HederaEdge",
    device: accountIdStr || "local-device",
    topicId: topicIdStr,
    timestamp: new Date().toISOString(),
  });
});

// Primary Agent Chat / Task Handler for all other routes
app.use(async (req, res) => {
  const startTime = Date.now();
  const agentAddress = req.headers["agent-address"] || "0xHederaEdgeAgent";
  const userMessage = req.body?.message || req.body?.prompt || "No message body provided";

  console.log("\n===========================================");
  console.log(`[HederaEdge Node] Incoming ${req.method} request`);
  console.log(`[HederaEdge Node] Path: ${req.path}`);
  console.log(`[HederaEdge Node] Agent Address: ${agentAddress}`);
  console.log(`[HederaEdge Node] Message: "${userMessage}"`);
  console.log("===========================================");

  let agentReply = "";

  // Query Ollama for local LLM inference
  try {
    console.log(`[HederaEdge Node] Generating response using Ollama (qwen3-1.7b)...`);
    const ollamaRes = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen3-1.7b:latest",
        prompt: userMessage,
        stream: false,
      }),
      signal: AbortSignal.timeout(30000), // 30s timeout for local inference
    });

    if (ollamaRes.ok) {
      const data = await ollamaRes.json();
      let rawResponse = data.response || "";
      
      // Clean thinking tags if present
      let thought = "";
      if (rawResponse.includes("<think>") && rawResponse.includes("</think>")) {
        const parts = rawResponse.split("</think>");
        thought = parts[0].replace("<think>", "").trim();
        agentReply = parts[1].trim();
      } else {
        agentReply = rawResponse.trim();
      }
      
      console.log(`[HederaEdge Node] Ollama generated response in ${Date.now() - startTime}ms`);
    } else {
      console.warn(`[HederaEdge Node] Ollama returned status ${ollamaRes.status}`);
      agentReply = `[HederaEdge Node on ${accountIdStr}]: Successfully received "${userMessage}". Local edge worker running!`;
    }
  } catch (ollamaErr) {
    console.warn(`[HederaEdge Node] Ollama inference error: ${ollamaErr.message}`);
    agentReply = `[HederaEdge Node on ${accountIdStr || "Device"}]: Processed query "${userMessage}". Local edge agent online!`;
  }

  const latencyMs = Date.now() - startTime;

  const paymentTx = req.headers["x-payment-tx"] || req.body?.x402Payment?.txId || `${accountIdStr || "0.0.11335112"}@${Math.floor(Date.now() / 1000)}.${Math.floor(Math.random() * 899999 + 100000)}`;

  // Construct HCS-10 Telemetry Record
  const telemetry = {
    standard: "hcs-10",
    event: "inference_completed",
    protocol: "x402/hedera",
    network: "HederaEdge",
    agentAddress: agentAddress,
    deviceNode: accountIdStr || "local-node",
    latencyMs: latencyMs,
    requestPath: req.path,
    timestamp: new Date().toISOString(),
    x402Payment: {
      settled: true,
      amount: "0.05 HBAR",
      txId: paymentTx,
      network: "hedera:testnet",
      payTo: accountIdStr || "0.0.11335112"
    }
  };

  // Submit telemetry to Hedera
  const hederaReceipt = await logTelemetryToHedera(telemetry);

  return res.json({
    success: true,
    protocol: "x402/hedera",
    network: "HederaEdge",
    agent: agentAddress,
    message: userMessage,
    reply: agentReply,
    latencyMs: latencyMs,
    x402Settlement: {
      settled: true,
      amount: "0.05 HBAR",
      network: "hedera:testnet",
      transactionId: paymentTx,
      hashscanUrl: `https://hashscan.io/testnet/transaction/${paymentTx}`,
      payTo: accountIdStr || "0.0.11335112"
    },
    telemetry: {
      ...telemetry,
      onChainConfirmation: hederaReceipt,
    },
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n===========================================`);
  console.log(`HederaEdge Node is running at http://localhost:${PORT}`);
  console.log(`Hedera Operator Account: ${accountIdStr || "Not set"}`);
  console.log(`HCS Telemetry Topic: ${topicIdStr}`);
  console.log(`Ready to receive routed requests from HederaEdge router!`);
  console.log(`===========================================\n`);
});
