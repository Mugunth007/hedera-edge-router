/**
 * HederaEdge Automated Integration Test Suite
 * Validates all API endpoints, Hedera connections, and edge inference flows.
 */

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const EDGE_URL = "http://localhost:8000";

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log("==================================================");
  console.log("HederaEdge Automated Test Suite");
  console.log(`Target: ${BASE_URL} & ${EDGE_URL}`);
  console.log("==================================================\n");

  // TEST 1: Edge Agent Health Check
  try {
    console.log("[1/6] Testing Edge Node Health Endpoint...");
    const res = await fetch(`${EDGE_URL}/health`);
    assert(res.ok, "Edge node responds with 200 OK");
    const json = await res.json();
    assert(json.status === "online", "Edge node status is 'online'");
    assert(Boolean(json.topicId), `Topic ID registered: ${json.topicId}`);
  } catch (e) {
    assert(false, `Edge node health check failed: ${e.message}`);
  }

  // TEST 2: x402 Protocol Specification
  try {
    console.log("\n[2/6] Testing x402 Specification (GET /api/x402)...");
    const res = await fetch(`${BASE_URL}/api/x402`);
    assert(res.ok, "GET /api/x402 responds with 200 OK");
    const json = await res.json();
    assert(json.protocol === "x402", "Protocol is x402");
    assert(json.standard === "@x402/hedera", "Standard is @x402/hedera");
    assert(json.network === "hedera:testnet", "Network is hedera:testnet");
  } catch (e) {
    assert(false, `x402 spec check failed: ${e.message}`);
  }

  // TEST 3: HTTP 402 Payment Required Challenge
  try {
    console.log("\n[3/6] Testing HTTP 402 Challenge Flow (POST /api/x402)...");
    const res = await fetch(`${BASE_URL}/api/x402`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "challenge" }),
    });
    assert(res.status === 402, "Responds with exact HTTP 402 Payment Required status");
    assert(res.headers.get("x-402-network") === "hedera:testnet", "Header X-402-Network is present");
    assert(Boolean(res.headers.get("x-402-amount")), "Header X-402-Amount is present");
    const json = await res.json();
    assert(json.status === 402, "JSON body contains status: 402");
    assert(Boolean(json.paymentRequirements), "JSON body contains paymentRequirements");
  } catch (e) {
    assert(false, `HTTP 402 challenge test failed: ${e.message}`);
  }

  // TEST 4: Cross-Chain Gateway Specification
  try {
    console.log("\n[4/6] Testing Cross-Chain Relayer Spec (GET /api/crosschain)...");
    const res = await fetch(`${BASE_URL}/api/crosschain`);
    assert(res.ok, "GET /api/crosschain responds with 200 OK");
    const json = await res.json();
    assert(json.destinationChain.includes("Hedera"), "Destination chain is Hedera");
    assert(Boolean(json.htsToken?.id), `HTS $EDGE Token ID registered: ${json.htsToken?.id}`);
    assert(Boolean(json.nodeLicenseNft?.id), `Node License NFT registered: ${json.nodeLicenseNft?.id}`);
    assert(Array.isArray(json.supportedChains) && json.supportedChains.length >= 3, "Supports >= 3 EVM chains");
  } catch (e) {
    assert(false, `Cross-chain spec test failed: ${e.message}`);
  }

  // TEST 5: Telemetry API & Mirror Node Sync
  try {
    console.log("\n[5/6] Testing Telemetry Endpoint (GET /api/telemetry)...");
    const res = await fetch(`${BASE_URL}/api/telemetry`);
    assert(res.ok, "GET /api/telemetry responds with 200 OK");
    const json = await res.json();
    assert(Boolean(json.topicId), `Reporting on topic: ${json.topicId}`);
    assert(typeof json.totalInferences === "number", `Total inferences count is a number (${json.totalInferences})`);
  } catch (e) {
    assert(false, `Telemetry test failed: ${e.message}`);
  }

  // TEST 6: Payouts API
  try {
    console.log("\n[6/6] Testing Payouts Calculation (GET /api/payouts)...");
    const res = await fetch(`${BASE_URL}/api/payouts`);
    assert(res.ok, "GET /api/payouts responds with 200 OK");
    const json = await res.json();
    assert(Boolean(json.deviceAccount), `Device account: ${json.deviceAccount}`);
    assert(Boolean(json.totalEarnedHbar), `Total earned calculated: ${json.totalEarnedHbar} HBAR`);
  } catch (e) {
    assert(false, `Payouts test failed: ${e.message}`);
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});
