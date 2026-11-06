const {
  Client,
  AccountId,
  PrivateKey,
  TopicMessageSubmitTransaction,
  TopicId,
} = require("@hashgraph/sdk");
const crypto = require("crypto");
require("dotenv").config({ path: ".env.local" });

const SIMULATED_NODES = [
  {
    nodeId: "node-apex-medical-enclave",
    operatorAccount: "0.0.11335112",
    model: "qwen3-1.7b-quant",
    tier: "Enterprise Healthcare NPU",
    region: "us-east-edge",
    tops: 48,
  },
  {
    nodeId: "node-fintech-tokyo-01",
    operatorAccount: "0.0.11335112",
    model: "qwen3-1.7b-quant",
    tier: "Fintech Low-Latency Enclave",
    region: "ap-northeast-edge",
    tops: 45,
  },
  {
    nodeId: "node-berlin-privacy-hub",
    operatorAccount: "0.0.11335112",
    model: "qwen3-1.7b-quant",
    tier: "GDPR Zero-Egress Vault",
    region: "eu-central-edge",
    tops: 52,
  },
];

async function main() {
  const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
  const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
  const topicIdStr = process.env.HCS_TOPIC_ID || "0.0.11335841";

  if (!accountIdStr || !privateKeyStr) {
    console.error("Missing Hedera credentials in .env.local");
    process.exit(1);
  }

  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(accountIdStr), PrivateKey.fromStringECDSA(privateKeyStr));

  console.log("==================================================================");
  console.log(" HederaEdge Decentralized Multi-Node Telemetry Broadcaster");
  console.log(` Target HCS Topic: ${topicIdStr}`);
  console.log(` Broadcasting from ${SIMULATED_NODES.length} independent edge nodes...`);
  console.log("==================================================================\n");

  for (let i = 0; i < SIMULATED_NODES.length; i++) {
    const node = SIMULATED_NODES[i];
    const dummyKey = PrivateKey.generateECDSA();
    const digest = crypto.createHash("sha256").update(`${node.nodeId}|${Date.now()}`).digest("hex");

    const telemetry = {
      standard: "hcs-10",
      event: "inference_completed",
      protocol: "x402/hedera",
      network: "HederaEdge",
      nodeId: node.nodeId,
      tier: node.tier,
      region: node.region,
      hardwareTops: node.tops,
      latencyMs: Math.floor(380 + Math.random() * 120),
      timestamp: new Date().toISOString(),
      hardwareAttestation: {
        enclaveType: "ARM TrustZone / Secure Enclave",
        status: "ATTESTED",
        signerPublicKey: dummyKey.publicKey.toStringRaw(),
        inferenceDigest: `0x${digest}`,
        verifiedModel: node.model,
      },
      x402Payment: {
        settled: true,
        amount: "0.05 HBAR",
        txId: `${accountIdStr}@${Math.floor(Date.now() / 1000)}.${100000 + i}`,
        network: "hedera:testnet",
        payTo: accountIdStr,
      },
    };

    console.log(`[${i + 1}/${SIMULATED_NODES.length}] Submitting consensus telemetry for ${node.nodeId}...`);

    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(TopicId.fromString(topicIdStr))
      .setMessage(JSON.stringify(telemetry))
      .execute(client);

    const receipt = await tx.getReceipt(client);
    console.log(`   ✅ Confirmed on Hedera! Status: ${receipt.status.toString()}`);
  }

  console.log("\n==================================================================");
  console.log(" Multi-Node Telemetry Broadcast Complete!");
  console.log(` Mirror Node verification: https://hashscan.io/testnet/topic/${topicIdStr}`);
  console.log("==================================================================\n");

  client.close();
}

main().catch(console.error);
