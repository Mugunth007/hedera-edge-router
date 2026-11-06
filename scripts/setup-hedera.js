const {
  Client,
  AccountId,
  PrivateKey,
  AccountBalanceQuery,
  TopicCreateTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config({ path: ".env.local" });

async function main() {
  const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
  const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;

  if (!accountIdStr || !privateKeyStr) {
    console.error("Missing HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY in .env.local");
    process.exit(1);
  }

  console.log("Connecting to Hedera Testnet with Account:", accountIdStr);

  const accountId = AccountId.fromString(accountIdStr);
  let privateKey;
  try {
    privateKey = PrivateKey.fromStringECDSA(privateKeyStr);
    console.log("Parsed as ECDSA private key");
  } catch (e1) {
    try {
      privateKey = PrivateKey.fromStringED25519(privateKeyStr);
      console.log("Parsed as ED25519 private key");
    } catch (e2) {
      privateKey = PrivateKey.fromString(privateKeyStr);
      console.log("Parsed private key with generic detector");
    }
  }

  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);

  // 1. Check account balance
  const balance = await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);

  console.log(`Hedera Account Balance: ${balance.hbars.toString()}`);

  // 2. Create an HCS topic for the agent telemetry if not exists
  console.log("Creating agent HCS telemetry topic on Hedera Testnet...");
  const tx = await new TopicCreateTransaction()
    .setTopicMemo("Franky Agent Telemetry & HCS-10")
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId;

  console.log(`SUCCESS! Created HCS Topic ID: ${topicId.toString()}`);
  console.log(`View on HashScan: https://hashscan.io/testnet/topic/${topicId.toString()}`);

  // Update .env.local with HCS_TOPIC_ID
  const fs = require("fs");
  let envContent = fs.readFileSync(".env.local", "utf8");
  if (!envContent.includes("HCS_TOPIC_ID=")) {
    envContent += `\nHCS_TOPIC_ID=${topicId.toString()}\n`;
    fs.writeFileSync(".env.local", envContent);
    console.log("Saved HCS_TOPIC_ID to .env.local");
  }

  client.close();
}

main().catch((err) => {
  console.error("Error connecting to Hedera:", err);
  process.exit(1);
});
