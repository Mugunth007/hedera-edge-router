const fs = require("fs");
const path = require("path");
const solc = require("solc");
const {
  Client,
  AccountId,
  PrivateKey,
  ContractCreateFlow,
  Hbar,
} = require("@hashgraph/sdk");
require("dotenv").config({ path: ".env.local" });

async function main() {
  const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
  const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;

  if (!accountIdStr || !privateKeyStr) {
    console.error("Missing Hedera credentials in .env.local");
    process.exit(1);
  }

  console.log("==================================================================");
  console.log(" Compiling & Deploying NodeSLARegistry to Hedera Smart Contract Service (HSCS)");
  console.log(` Operator Account: ${accountIdStr}`);
  console.log("==================================================================\n");

  // 1. Compile Solidity contract
  const contractPath = path.join(__dirname, "..", "contracts", "NodeSLARegistry.sol");
  const sourceCode = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "NodeSLARegistry.sol": { content: sourceCode },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  console.log("[1/3] Compiling NodeSLARegistry.sol with solc...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const fatal = output.errors.filter((e) => e.severity === "error");
    if (fatal.length > 0) {
      console.error("Compilation errors:", fatal);
      process.exit(1);
    }
  }

  const contractFile = output.contracts["NodeSLARegistry.sol"]["NodeSLARegistry"];
  const bytecode = contractFile.evm.bytecode.object;
  const abi = contractFile.abi;

  console.log(`✅ Compilation successful! Bytecode length: ${bytecode.length / 2} bytes`);

  // Save compiled artifact
  const buildDir = path.join(__dirname, "..", "build");
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);
  fs.writeFileSync(
    path.join(buildDir, "NodeSLARegistry.json"),
    JSON.stringify({ abi, bytecode }, null, 2)
  );

  // 2. Deploy to Hedera Testnet via ContractCreateFlow
  console.log("\n[2/3] Deploying smart contract to Hedera Smart Contract Service...");
  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(accountIdStr), PrivateKey.fromStringECDSA(privateKeyStr));

  const contractCreateTx = new ContractCreateFlow()
    .setBytecode(bytecode)
    .setGas(1500000);

  const txResponse = await contractCreateTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const newContractId = receipt.contractId.toString();

  console.log("\n[3/3] Deployment Confirmed!");
  console.log(`✅ NodeSLARegistry Contract ID: ${newContractId}`);
  console.log(`   HashScan: https://hashscan.io/testnet/contract/${newContractId}`);

  // Append CONTRACT_ID to .env.local
  const envPath = path.join(__dirname, "..", ".env.local");
  let envContent = fs.readFileSync(envPath, "utf8");
  if (!envContent.includes("SLA_CONTRACT_ID")) {
    fs.appendFileSync(envPath, `\nSLA_CONTRACT_ID=${newContractId}\n`);
    console.log(`✅ Appended SLA_CONTRACT_ID=${newContractId} to .env.local`);
  }

  client.close();
  console.log("\n==================================================================");
}

main().catch(console.error);
