const {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config({ path: ".env.local" });

async function main() {
  console.log("Starting client test...");
  const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const privateKey = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);
  console.log("Account:", accountId.toString());

  // Check public key derived from private key
  const publicKey = privateKey.publicKey;
  console.log("Derived Public Key:", publicKey.toStringRaw());

  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);
  client.setRequestTimeout(10000); // 10s timeout

  console.log("Creating topic on testnet...");
  const tx = await new TopicCreateTransaction()
    .setTopicMemo("Franky Agent Telemetry")
    .execute(client);

  console.log("Getting receipt...");
  const receipt = await tx.getReceipt(client);
  console.log("Created topic ID:", receipt.topicId.toString());
  client.close();
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
