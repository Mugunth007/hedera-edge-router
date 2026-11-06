const {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config({ path: ".env.local" });

async function main() {
  const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
  const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;

  if (!accountIdStr || !privateKeyStr) {
    console.error("Missing HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY in .env.local");
    process.exit(1);
  }

  const accountId = AccountId.fromString(accountIdStr);
  const privateKey = PrivateKey.fromStringECDSA(privateKeyStr);

  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);

  console.log("=================================================");
  console.log("Deploying Hedera Token Service (HTS) Assets");
  console.log(`Operator Account: ${accountIdStr}`);
  console.log("=================================================");

  // 1. Deploy Fungible $EDGE Compute Utility Token
  console.log("\n[1/2] Creating Fungible $EDGE Compute Token...");
  const edgeTokenTx = await new TokenCreateTransaction()
    .setTokenName("HederaEdge Compute Token")
    .setTokenSymbol("EDGE")
    .setDecimals(2)
    .setInitialSupply(1000000) // 1,000,000 EDGE initial supply
    .setTreasuryAccountId(accountId)
    .setAdminKey(privateKey)
    .setSupplyKey(privateKey)
    .setTokenMemo("HederaEdge DePIN Compute Utility & Staking Token")
    .execute(client);

  const edgeReceipt = await edgeTokenTx.getReceipt(client);
  const edgeTokenId = edgeReceipt.tokenId.toString();
  console.log(`✅ $EDGE Token Created! Token ID: ${edgeTokenId}`);
  console.log(`   HashScan: https://hashscan.io/testnet/token/${edgeTokenId}`);

  // 2. Deploy Non-Fungible Node Security License (NODE-NFT)
  console.log("\n[2/2] Creating Node Security License NFT Collection...");
  const nftCreateTx = await new TokenCreateTransaction()
    .setTokenName("HederaEdge Node Security License")
    .setTokenSymbol("HENFT")
    .setTokenType(TokenType.NonFungibleUnique)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(10000)
    .setTreasuryAccountId(accountId)
    .setAdminKey(privateKey)
    .setSupplyKey(privateKey)
    .setTokenMemo("Tokenized DePIN Edge Node Hardware & Security License")
    .execute(client);

  const nftReceipt = await nftCreateTx.getReceipt(client);
  const nftTokenId = nftReceipt.tokenId.toString();
  console.log(`✅ Node Security License NFT Collection Created! Token ID: ${nftTokenId}`);
  console.log(`   HashScan: https://hashscan.io/testnet/token/${nftTokenId}`);

  // 3. Mint Serial #1 for Edge Node Kai
  console.log("\n[3/3] Minting Serial #1 for Edge Node Kai (0x88527adfc6...)...");
  const metadata = Buffer.from(
    JSON.stringify({
      node: "kai",
      agentAddress: "0x88527adfc6d3cf978d76d325cba5cdb67b2ed3f8",
      hardwareTier: "Enterprise NPU",
      tops: 45,
      model: "Qwen 3 (1.7B Local)",
      securityLevel: "Zero-Data-Egress",
      status: "Active",
      timestamp: new Date().toISOString(),
    })
  );

  const mintTx = await new TokenMintTransaction()
    .setTokenId(nftReceipt.tokenId)
    .addMetadata(metadata)
    .execute(client);

  const mintReceipt = await mintTx.getReceipt(client);
  const serial = mintReceipt.serials[0].toNumber();
  console.log(`✅ Minted License NFT Serial #${serial}!`);
  console.log(`   HashScan NFT: https://hashscan.io/testnet/token/${nftTokenId}/${serial}`);

  console.log("\n=================================================");
  console.log("HTS Deployment Complete!");
  console.log(`EDGE_TOKEN_ID=${edgeTokenId}`);
  console.log(`NODE_NFT_ID=${nftTokenId}`);
  console.log("=================================================\n");

  client.close();
}

main().catch((err) => {
  console.error("HTS deployment failed:", err);
  process.exit(1);
});
