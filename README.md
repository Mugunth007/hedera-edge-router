# HederaEdge

> **Decentralized Physical Edge AI (DePIN) & Verifiable Security Gateway on Hedera**  
> *Zero-Data-Egress Intelligence • HTS Tokenization • HSCS SLA Staking • x402 Micropayments*

[![Vercel Live](https://img.shields.io/badge/Vercel-Live%20Production-black?style=flat-square&logo=vercel)](https://franky-agent-router-main.vercel.app)
[![Pitch Deck](https://img.shields.io/badge/Interactive%20Deck-Aceternity%20UI-cyan?style=flat-square)](https://franky-agent-router-main.vercel.app/deck)
[![Video Screening Room](https://img.shields.io/badge/Demo%20Screening-4%20Min%20Master-purple?style=flat-square)](https://franky-agent-router-main.vercel.app/video)
[![Hedera Testnet](https://img.shields.io/badge/Hedera-Testnet%20Live-emerald?style=flat-square)](https://hashscan.io/testnet)
[![HCS Topic](https://img.shields.io/badge/HCS%20Topic-0.0.11335841-cyan?style=flat-square)](https://hashscan.io/testnet/topic/0.0.11335841)
[![HTS Token](https://img.shields.io/badge/HTS%20Token-0.0.11336302%20($EDGE)-amber?style=flat-square)](https://hashscan.io/testnet/token/0.0.11336302)
[![Node NFT](https://img.shields.io/badge/Node%20NFT-0.0.11336303%20(HENFT)-purple?style=flat-square)](https://hashscan.io/testnet/token/0.0.11336303/1)
[![HSCS Contract](https://img.shields.io/badge/HSCS%20Contract-0.0.11337652-blue?style=flat-square)](https://hashscan.io/testnet/contract/0.0.11337652)
[![Automated Tests](https://img.shields.io/badge/Tests-38%20Passed%20%2F%2010%20Suites-brightgreen?style=flat-square)](scripts/run-tests.js)

### 🌐 Live Production Links
* **Live Vercel Application:** [https://franky-agent-router-main.vercel.app](https://franky-agent-router-main.vercel.app)
* **Interactive Pitch Deck (60fps Aceternity UI):** [https://franky-agent-router-main.vercel.app/deck](https://franky-agent-router-main.vercel.app/deck)
* **4-Minute Demo Screening Room:** [https://franky-agent-router-main.vercel.app/video](https://franky-agent-router-main.vercel.app/video)
* **Live Technical Demo Simulator:** [https://franky-agent-router-main.vercel.app/demo](https://franky-agent-router-main.vercel.app/demo)
* **Operator Telemetry Dashboard:** [https://franky-agent-router-main.vercel.app/dashboard](https://franky-agent-router-main.vercel.app/dashboard)
* **GitHub Repository:** [https://github.com/Mugunth007/hedera-edge-router](https://github.com/Mugunth007/hedera-edge-router)

For the complete judging specification and business model canvas, read the [**HACKATHON-PRD.md**](HACKATHON-PRD.md). For recorded demonstration timing and talking points, read [**4-MINUTE-DEMO-RUNBOOK.md**](4-MINUTE-DEMO-RUNBOOK.md).

---

## ⚡ Problem: Why Centralized Cloud AI (OpenAI / AWS) Fails Regulated Enterprises

Today, enterprises, hospitals, defense agencies, and autonomous agent swarms face critical roadblocks with centralized cloud AI APIs:
1. **Data Exfiltration:** Raw prompts, patient records, and confidential IP leak outside corporate perimeters (violating EU GDPR Art. 44 & HIPAA § 164.312).
2. **Black-Box Opacity:** Zero cryptographic proof of model weights, execution authenticity, or censorship.
3. **Machine Micropayment Incompatibility:** Agent swarms executing millions of micro-tasks cannot negotiate $20/month credit-card SaaS plans.
4. **Cross-Chain Blindness:** Smart contracts on EVM chains cannot natively trigger verifiable AI without centralized oracle risk.

---

## 🛡️ The HederaEdge Solution

HederaEdge is an enterprise DePIN security gateway that routes AI inference tasks directly to local neural silicon (Apple Silicon, Snapdragon NPUs, Jetson Orin) with **zero cloud data leakage**:

```
                  ┌────────────────────────────────────────────────────────┐
                  │           CROSS-CHAIN INTEROPERABILITY LAYER           │
                  │   Ethereum (Sepolia)  •  Base  •  Arbitrum  •  Solana   │
                  └───────────────────────────┬────────────────────────────┘
                                              │ Verified Relayer Test Harness
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           HEDERAEDGE SECURITY GATEWAY (ROUTER)                          │
│                                                                                         │
│  [1. x402 Micropayments]       [2. HTS Tokenization Engine]    [3. HCS-10 Consensus]   │
│   HTTP 402 Challenge            • $EDGE Utility Token           • Sequence Proofs       │
│   0.05 HBAR / Query             • Node Security License NFTs    • SHA-256 Audit Trail   │
│   Mirror Node Verified          • HSCS SLA Staking (0.0.11337652• Topic: 0.0.11335841   │
└─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │ Zero-Data-Egress Route (Proxy)
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                    DECENTRALIZED PHYSICAL EDGE NODES (DePIN SILICON)                    │
│                                                                                         │
│   • Local NPU Silicon (Apple M-Series, Snapdragon NPU, Jetson Orin, Edge Laptops)       │
│   • On-Device SLM Neural Weights (Qwen 3 1.7B)                                          │
│   • Cryptographic Hardware Attestation (ARM TrustZone / Apple Secure Enclave Signature)  │
│   • Zero Cloud Leakage: Prompts stay on physical hardware, only consensus proof to Hedera│
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Evaluation Matrix: HederaEdge vs Centralized APIs

| Evaluation Vector | Centralized Cloud APIs (OpenAI / AWS) | **HederaEdge DePIN Security Network** |
| :--- | :--- | :--- |
| **Data Privacy & Exfiltration** | ❌ High risk: raw prompts sent to cloud servers | ✅ **Zero Egress: 100% computed on local NPU silicon** |
| **Cryptographic Verification** | ❌ Black box: zero proof of model weights or integrity | ✅ **Immutable HCS-10 sequence proof + TEE attestation** |
| **Agent Swarm Cost (1M calls)** | ❌ $20,000+ API invoices per month | ✅ **$0 compute cost + fraction-of-cent Hedera consensus** |
| **Cross-Chain Interoperability** | ❌ Web2 REST only; smart contracts cannot call natively | ✅ **Verified Relayer Architecture Blueprint for EVM chains** |
| **Economic Tokenization** | ❌ Proprietary credit card lock-in | ✅ **HTS $EDGE Staking, HSCS SLA Contract & x402 Micropayments** |

---

## 🔗 Live Hedera Testnet Deployments (100% Verified)

* **Consensus Topic (HCS):** [`0.0.11335841`](https://hashscan.io/testnet/topic/0.0.11335841)  
  *Memo: "HederaEdge Telemetry & HCS-10"*
* **Fungible Utility Token (HTS):** [`0.0.11336302`](https://hashscan.io/testnet/token/0.0.11336302)  
  *Symbol: `$EDGE` (Supply: 1,000,100 EDGE)*
* **Node Security License NFT (HTS):** [`0.0.11336303`](https://hashscan.io/testnet/token/0.0.11336303/1)  
  *Collection: `HENFT` (Serial #1 minted for node Kai with IPFS hardware attestation)*
* **Hedera Smart Contract Service (HSCS):** [`0.0.11337652`](https://hashscan.io/testnet/contract/0.0.11337652)  
  *Contract: `NodeSLARegistry` (On-chain staking, slashing, and node reputation)*
* **Operator Account:** [`0.0.11335112`](https://hashscan.io/testnet/account/0.0.11335112)

---

## 📈 Empirical Hardware Benchmark Results

Generated via `node scripts/benchmark-suite.js` running 10 enterprise prompts across HIPAA, Fintech, and Smart Contract Security against local Ollama (`qwen3-1.7b`):

* **Average Execution Latency:** 2,069 ms
* **Average Throughput:** 34.9 tokens / second
* **Cloud Data Egress:** **0 Bytes** (100% On-Device Confidentiality)
* **Dataset Audit File:** [`benchmark-results.json`](benchmark-results.json)

---

## 🚀 Quickstart & Demo Guide

### 1. Initialize Decentralized Node Keypair (CLI)
```bash
node edge-agent.js --init-node
```
*Generates a fresh ECDSA keypair, EVM address, and saves node identity locally.*

### 2. Start Edge Worker Node (Local Neural Inference)
```bash
node edge-agent.js
```
*Listens on port 8000, verifies incoming x402 payments via Hedera Mirror Node, generates TEE hardware attestations, and logs HCS-10 telemetry to topic `0.0.11335841`.*

### 3. Start Gateway Router & Dashboard
```bash
pnpm dev
```
*Runs Next.js Aceternity UI on `http://localhost:3000`.*

### 4. Run Automated Protocol Test Suite
```bash
npm test
```
*Executes 10 comprehensive test suites (38 assertions) verifying x402 challenge/response, mirror node verification, HTS payouts, and HSCS contract state.*

---

## 🛡️ Judge Q&A Defense Sheet

When judges audit this repository, here are our exact answers to key technical questions:

1. **Judge:** *"How do you prevent a malicious edge node from returning hallucinated responses and pocketing HBAR?"*  
   **Answer:** *"In our protocol, every inference produces a cryptographic hardware attestation signing the model weights digest (`qwen3-1.7b-gguf-v1`) and inference payload using the node's private key. The HCS-10 sequence number is committed to Topic `0.0.11335841`, and node operators must stake `$EDGE` tokens in the on-chain `NodeSLARegistry` smart contract (`0.0.11337652`). Rogue nodes that fail audit checks are programmatically slashed."*

2. **Judge:** *"Is the Cross-Chain endpoint connected to live production bridge contracts?"*  
   **Answer:** *"The cross-chain endpoint is operating as an Architecture Blueprint & Relayer Test Harness with verified Sepolia/Base transaction data. Our focus for this hackathon was perfecting the native Hedera settlement layer—deploying the HCS topic, HTS fungible token, HTS license NFT, and HSCS staking contract."*

3. **Judge:** *"Why use x402 micropayments instead of traditional wallet popups?"*  
   **Answer:** *"Autonomous AI agent swarms executing 1,000 queries per hour cannot click browser wallet extensions. The x402 HTTP standard enables programmatic machine-to-machine negotiation, immediate HTTP 402 challenge, and sub-second settlement directly over Hedera."*
