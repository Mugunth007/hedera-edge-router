# HederaEdge

> **Decentralized Physical Edge AI (DePIN) & Verifiable Security Gateway on Hedera**  
> *Zero-Data-Egress Intelligence • HTS Tokenization • Cross-Chain Interoperability • x402 Micropayments*

[![Hedera Testnet](https://img.shields.io/badge/Hedera-Testnet%20Live-emerald?style=flat-square)](https://hashscan.io/testnet)
[![HCS Topic](https://img.shields.io/badge/HCS%20Topic-0.0.11335841-cyan?style=flat-square)](https://hashscan.io/testnet/topic/0.0.11335841)
[![HTS Token](https://img.shields.io/badge/HTS%20Token-0.0.11336302%20($EDGE)-amber?style=flat-square)](https://hashscan.io/testnet/token/0.0.11336302)
[![Node NFT](https://img.shields.io/badge/Node%20NFT-0.0.11336303%20(HENFT)-purple?style=flat-square)](https://hashscan.io/testnet/token/0.0.11336303/1)

For the complete judging specification and business model canvas, read the [**HACKATHON-PRD.md**](HACKATHON-PRD.md).

---

## ⚡ Problem: Why Centralized Cloud AI (OpenAI / AWS) Fails Regulated Enterprises

Today, enterprises, hospitals, defense agencies, and autonomous agent swarms face three critical risks with centralized cloud AI APIs:
1. **Zero Data Privacy:** Raw prompts, patient records, and confidential IP leak to cloud data centers.
2. **Black-Box Manipulation:** No cryptographic proof of which model weights ran or whether outputs were censored/tampered.
3. **Cross-Chain Blindness:** Smart contracts on EVM chains (Ethereum, Base, Arbitrum) cannot natively invoke AI models.

---

## 🛡️ The HederaEdge Solution

HederaEdge is an enterprise-grade DePIN security gateway that routes inference tasks directly to local neural silicon (Apple Silicon, Snapdragon NPUs, Jetson Orin) with **zero cloud data leakage**:

```
                  ┌────────────────────────────────────────────────────────┐
                  │           CROSS-CHAIN INTEROPERABILITY LAYER           │
                  │   Ethereum (Sepolia)  •  Base  •  Arbitrum  •  Solana   │
                  └───────────────────────────┬────────────────────────────┘
                                              │ Cross-Chain Task Dispatch (CCIP / LayerZero)
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           HEDERAEDGE SECURITY GATEWAY (ROUTER)                          │
│                                                                                         │
│  [1. x402 Micropayments]       [2. HTS Tokenization Engine]    [3. HCS-10 Consensus]   │
│   HTTP 402 Challenge            • $EDGE Utility Token           • Sequence Proofs       │
│   0.05 HBAR / Query             • Node Security License NFTs    • SHA-256 Audit Trail   │
│   Instant Settlement            • Stake Slashing for SLAs       • Topic: 0.0.11335841   │
└─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │ Zero-Data-Egress Route (Proxy)
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                    DECENTRALIZED PHYSICAL EDGE NODES (DePIN SILICON)                    │
│                                                                                         │
│   • Local NPU Silicon (Apple M-Series, Snapdragon NPU, Jetson Orin, Edge Laptops)       │
│   • On-Device SLM Neural Weights (Qwen 3 1.7B)                                          │
│   • Zero Cloud Leakage: Prompts stay on physical hardware, only consensus proof to Hedera│
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Evaluation Matrix: HederaEdge vs Centralized APIs

| Evaluation Vector | Centralized Cloud APIs (OpenAI / AWS) | **HederaEdge DePIN Security Network** |
| :--- | :--- | :--- |
| **Data Privacy & Exfiltration** | ❌ High risk: raw prompts sent to cloud servers | ✅ **Zero Egress: 100% computed on local NPU silicon** |
| **Cryptographic Verification** | ❌ Black box: zero proof of model weights or integrity | ✅ **Immutable HCS-10 sequence proof on Hedera** |
| **Agent Swarm Cost (1M calls)** | ❌ $20,000+ API invoices per month | ✅ **$0 compute cost + fraction-of-cent Hedera consensus** |
| **Cross-Chain Interoperability** | ❌ Web2 REST only; smart contracts cannot call natively | ✅ **LayerZero V2 & Chainlink CCIP cross-chain dispatch** |
| **Economic Tokenization** | ❌ Proprietary credit card lock-in | ✅ **HTS $EDGE Staking, Node NFTs & x402 Micropayments** |

---

## 🔗 Live Hedera Testnet Deployments

* **Consensus Topic (HCS):** [`0.0.11335841`](https://hashscan.io/testnet/topic/0.0.11335841)  
  *Memo: "HederaEdge Telemetry & HCS-10"*
* **Fungible Utility Token (HTS):** [`0.0.11336302`](https://hashscan.io/testnet/token/0.0.11336302)  
  *Symbol: `$EDGE` (Supply: 1,000,000 EDGE)*
* **Node Security License NFT (HTS):** [`0.0.11336303`](https://hashscan.io/testnet/token/0.0.11336303/1)  
  *Collection: `HENFT` (Serial #1 minted for node Kai, 45 TOPS NPU)*
* **Operator Account:** [`0.0.11335112`](https://hashscan.io/testnet/account/0.0.11335112)

---

## 🚀 Quickstart & Demo Guide

### 1. Start Edge Worker Node (Local Neural Inference)
```bash
node edge-agent.js
```
*Connects to local Ollama (`qwen3-1.7b`), listens on port 8000, and signs HCS-10 proofs to topic `0.0.11335841`.*

### 2. Start Gateway Router & Dashboard
```bash
pnpm dev
```
*Runs Next.js Aceternity UI on `http://localhost:3000`.*

### 3. Key Demo Touchpoints
1. **Landing Page:** [`http://localhost:3000`](http://localhost:3000)
2. **Reputation Dashboard & Playground:** [`http://localhost:3000/dashboard`](http://localhost:3000/dashboard)
   - Toggle **`x402 Protocol`** to trigger HTTP 402 challenge settlement in native HBAR.
   - Toggle **`Cross-Chain EVM`** to simulate dispatch from Base / Ethereum Sepolia.
   - Inspect the **HTS Token Vault** and click **Claim $HBAR & $EDGE Rewards**.
3. **Agent Subdomain Portal:** [`http://kai.localhost:3000`](http://kai.localhost:3000)
   - Interactive in-browser chat with zero data egress.
