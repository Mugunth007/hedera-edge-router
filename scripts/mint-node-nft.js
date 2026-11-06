const {
  Client,
  AccountId,
  PrivateKey,
  TokenMintTransaction,
  TokenId,
} = require("@hashgraph/sdk");
require("dotenv").config({ path: ".env.local" });

async function main() {
  const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const privateKey = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);
  const nftTokenId = TokenId.fromString("0.0.11336303");

  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);

  console.log(`Minting Serial #1 for NFT ${nftTokenId.toString()}...`);
  // Hedera max metadata is 100 bytes
  const compactMeta = Buffer.from("ipfs://bafkreihederaedgenodekaienterprisenpu45tops");

  const mintTx = await new TokenMintTransaction()
    .setTokenId(nftTokenId)
    .addMetadata(compactMeta)
    .execute(client);

  const mintReceipt = await mintTx.getReceipt(client);
  const serial = mintReceipt.serials[0].toNumber();
  console.log(`✅ Minted License NFT Serial #${serial}!`);
  console.log(`   HashScan: https://hashscan.io/testnet/token/${nftTokenId}/${serial}`);

  client.close();
}

main().catch(console.error);
