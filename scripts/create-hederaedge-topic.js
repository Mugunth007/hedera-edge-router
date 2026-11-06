const {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config({ path: ".env.local" });

async function createNewHederaEdgeTopic() {
  const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const privateKey = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);

  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);

  console.log("Creating new topic with official HederaEdge memo...");

  const tx = await new TopicCreateTransaction()
    .setTopicMemo("HederaEdge Telemetry & HCS-10")
    .setAdminKey(privateKey.publicKey) // Set admin key so it can be updated in future if needed!
    .setSubmitKey(privateKey.publicKey)
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const newTopicId = receipt.topicId.toString();

  console.log("SUCCESS! Created new HederaEdge topic ID:", newTopicId);
  console.log(`View on HashScan: https://hashscan.io/testnet/topic/${newTopicId}`);

  // Update .env.local
  const fs = require("fs");
  let env = fs.readFileSync(".env.local", "utf8");
  env = env.replace(/HCS_TOPIC_ID=.*/g, `HCS_TOPIC_ID=${newTopicId}`);
  fs.writeFileSync(".env.local", env);
  console.log("Updated .env.local with new HCS_TOPIC_ID =", newTopicId);

  client.close();
  return newTopicId;
}

createNewHederaEdgeTopic().catch(console.error);
