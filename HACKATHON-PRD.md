# HederaEdge — Hackathon Product Requirements Document (PRD)

> **Decentralized Physical Edge AI (DePIN) & Verifiable Security Gateway on Hedera**  
> **ETHGlobal Mumbai — Hedera Bounties**

---

## 1. Problem Statement

### The Critical Flaws of Centralized Cloud AI (Why Web2 Subscriptions Fail)
Today, enterprises, hospitals, banks, and autonomous agent swarms rely on centralized cloud AI providers (OpenAI ChatGPT, Anthropic, AWS Bedrock). This architecture introduces three fatal enterprise vulnerabilities:

1. **Severe Data Exfiltration & Compliance Breach:**  
   Regulated enterprises (HIPAA healthcare records, GDPR biometric identifiers, defense intelligence, proprietary trading algorithms) are legally prohibited from streaming raw prompt data across the internet to centralized cloud silos.
2. **Black-Box Model Manipulation & MITM Attacks:**  
   Cloud AI APIs are opaque black boxes. Users have zero cryptographic proof regarding which model weights executed, whether outputs were quietly censored, or whether responses were tampered with in transit.
3. **Cross-Chain Compute Blindness:**  
   Smart contracts on Ethereum, Base, or Arbitrum have zero native AI execution capabilities. Centralized oracle bridges to Web2 APIs introduce massive single points of failure and private key exploitation risks.

### Why Web3 & Hedera?
Web2 subscriptions ($20/month credit card fees) cannot provide **Zero-Data-Egress enforcement**, cannot provide **SHA-256 cryptographic proof of inference**, cannot settle **sub-cent machine micropayments**, and cannot tokenize **distributed hardware SLAs**. 

Hedera provides the ideal foundation:
* **Hedera Consensus Service (HCS):** Fair timestamping, sub-second consensus finality, and immutable sequence logs for HCS-10 AI telemetry.
* **Hedera Token Service (HTS):** Native fungible compute tokens (`$EDGE`) and Node Security License NFTs without custom smart contract overhead.
* **x402 Protocol:** HTTP 402 native payment negotiation for autonomous machine-to-machine inference settlement.

---

## 2. Solution Overview

**HederaEdge** is a decentralized physical infrastructure (DePIN) security gateway that turns local neural silicon (Apple Silicon, Snapdragon NPUs, Jetson Orin, edge laptops) into verifiable AI worker nodes.

* **Zero-Data-Egress Compute:** Prompts are processed locally on edge hardware using on-device Small Language Models (Qwen 3 1.7B). Raw prompt data never leaves the local hardware perimeter.
* **HCS-10 Cryptographic Consensus:** Each inference generates a SHA-256 state proof and latency benchmark permanently committed to Hedera Consensus Topic `0.0.11335841`.
* **HTS Tokenization & SLA Staking:** Edge nodes must stake native `$EDGE` tokens (Token ID: `0.0.11336302`) to guarantee hardware uptime and are minted on-chain Node Security License NFTs (Token ID: `0.0.11336303`).
* **Cross-Chain EVM Interoperability:** LayerZero V2 and Chainlink CCIP compatible endpoints allow contracts on Ethereum, Base, and Arbitrum to dispatch inference tasks cross-chain to HederaEdge.
* **x402 HTTP Micropayments:** APIs and autonomous agents settle pay-per-call fees in native HBAR (0.05 HBAR/call) using standard HTTP 402 challenge negotiation.

---

## 3. Hedera Integration Architecture

### Hedera Native Services Used

| Service | Identifier | Purpose & Justification |
| :--- | :--- | :--- |
| **Hedera Consensus Service (HCS)** | **Topic: `0.0.11335841`**<br/>Memo: *"HederaEdge Telemetry & HCS-10"* | Logs cryptographic proof of inference (PoI), SHA-256 running hashes, response latency, and node identity for immutable auditing. |
| **Hedera Token Service (HTS - Fungible)** | **Token ID: `0.0.11336302`**<br/>Symbol: **`$EDGE`** | Native DePIN compute token used for node operator rewards, inference billing, and SLA security staking. |
| **Hedera Token Service (HTS - NFT)** | **Token ID: `0.0.11336303`**<br/>Collection: **`HENFT`** (Serial #1) | Tokenized Node Hardware & Security License encoding hardware tier (45 TOPS NPU), memory, and verified zero-egress status. |
| **Hedera Smart Contract Service (HSCS)** | **Contract ID: `0.0.11337652`**<br/>Contract: `NodeSLARegistry` | On-chain SLA staking, node reputation registry, and automated collateral slashing for rogue nodes. |
| **Hedera Crypto Transfers** | **Account: `0.0.11335112`** | Automated native $HBAR reward payouts and x402 settlement using `TransferTransaction`. |

### Cross-Chain Interoperability Architecture

```
[ Ethereum / Base / Arbitrum Smart Contract ]
                    │
                    ▼ (Cross-Chain Dispatch: LayerZero / CCIP)
         [ HederaEdge Gateway Router ]
        ┌───────────┴───────────┐
        ▼                       ▼
 [ x402 HTTP Settlement ]  [ HTS $EDGE Staking & SLA ]
  0.05 HBAR / Query         Token: 0.0.11336302
        │                       │
        └───────────┬───────────┘
                    ▼
     [ Local Physical Edge Node ]
      • Secure NPU Silicon (Qwen 3 1.7B)
      • Zero-Data-Egress Perimeter
      • Local Compute Cost = $0.00
                    │
                    ▼
 [ Hedera Consensus Service Topic 0.0.11335841 ]
  • HCS-10 Immutable Audit Sequence
  • SHA-256 State Running Hash
```

---

## 4. Benchmark & Validation: HederaEdge vs Centralized APIs

| Evaluation Vector | Centralized Cloud APIs (OpenAI / AWS) | **HederaEdge DePIN Network** |
| :--- | :--- | :--- |
| **Data Privacy & Exfiltration** | ❌ High risk: raw data streams to cloud servers | ✅ **Zero Data Egress (100% on-device NPU)** |
| **Cryptographic Verification** | ❌ Black box: zero proof of model weights or integrity | ✅ **Immutable HCS-10 sequence proof on Hedera** |
| **Agent Swarm Cost (1M calls)** | ❌ $20,000+ API invoices per month | ✅ **$0 compute cost + fraction-of-cent Hedera consensus** |
| **Cross-Chain Interoperability** | ❌ Web2 REST only; EVM contracts cannot invoke | ✅ **LayerZero V2 & Chainlink CCIP cross-chain dispatch** |
| **Economic Tokenization** | ❌ Proprietary monthly credit card lock-in | ✅ **HTS `$EDGE` Staking, Node NFTs & x402 Micropayments** |

---

## 5. Hedera Network Impact & Success Metrics

1. **Accelerated HCS Transactions Per Second (TPS):**  
   Every inference query generates an HCS-10 telemetry message on topic `0.0.11335841`. High-frequency agent swarms generate hundreds of transactions per minute on Hedera.
2. **Drives Hedera Account Creation:**  
   Every physical edge node (smartphones, IoT gateways, laptops) automatically registers a Hedera account ID to receive automated $HBAR and $EDGE token rewards.
3. **HTS Token Ecosystem Growth:**  
   $EDGE token utility drives native token associations, staking pools, and secondary DEX liquidity on platforms like SaucerSwap.

---

## 6. Lean Business Model Canvas

* **Problem:** Cloud AI costs $0.02/call, leaks sensitive data, and lacks cryptographic proof.
* **Customer Segments:** Healthcare systems, financial institutions, Web3 DAOs, autonomous multi-agent systems.
* **Unique Value Proposition:** Zero-data-egress on-device AI with on-chain Hedera consensus proofs and sub-cent x402 settlement.
* **Revenue Streams:** 
  * 0.05 HBAR / inference protocol routing fee via x402.
  * Node License NFT minting fees.
  * Enterprise SLA verification subscriptions.
* **Cost Structure:** $0 compute infrastructure (costs distributed to edge node operators), negligible Hedera network transaction fees ($0.0001).

---

## 7. Live Demo Verification Checklist for Judges

1. **Landing Page:** Open `http://localhost:3000` — Inspect Aceternity UI, live metrics, and DePIN architecture.
2. **Node Telemetry & Reputation Dashboard:** Open `http://localhost:3000/dashboard`:
   - Inspect live HCS Consensus proofs streamed from Hedera Mirror Node.
   - Test the **x402 Micropayment Protocol** (0.05 HBAR settled on-chain with live HashScan link).
   - Test the **Cross-Chain EVM Gateway** (simulating Base/Ethereum Sepolia dispatch to Hedera).
   - Inspect the **HTS `$EDGE` Token (0.0.11336302)** and **Node License NFT (0.0.11336303 #1)**.
   - Click **Claim $HBAR Rewards** to trigger an on-chain Hedera `TransferTransaction`.
3. **Subdomain Edge Agent Portal:** Open `http://kai.localhost:3000` to interact directly with the edge agent with zero cloud data leaks.
