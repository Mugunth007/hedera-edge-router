# HederaEdge — Hackathon Pitch & Video Demonstration Script
**Target Duration:** 2 minutes 45 seconds (ideal for ETHGlobal 3-minute hard ceiling)  
**Track / Bounties:** Hedera AI Agent Track, Hedera Token Service (HTS) Tokenization, Hedera Consensus Service (HCS)

---

## 🎬 Section 1: The Problem & The Solution (0:00 - 0:35)

### Visual on Screen:
*Open on the HederaEdge Homepage (`http://localhost:3000`)*. Show the high-tech terminal header, live testnet badges, and the comparison graphic between Centralized Cloud APIs vs. HederaEdge DePIN.

### Spoken Narration:
> *"Hello judges! As autonomous AI agents take over enterprise workflows, developers face two critical roadblocks: **centralized data privacy violations** and **the lack of trustless, cross-chain machine-to-machine payments**.*
>
> *If an enterprise agent sends proprietary financial or healthcare data to OpenAI, that data egresses outside the perimeter, violating GDPR and HIPAA. And smart contracts on Ethereum, Base, or Arbitrum have no native way to trigger zero-knowledge or private AI inference without centralized oracles.*
>
> *Introducing **HederaEdge**: The first Enterprise Zero-Data-Egress DePIN AI Gateway and Cross-Chain Hub powered by Hedera. With HederaEdge, inference runs locally on dedicated NPU edge nodes, every prompt is cryptographically notarized on Hedera Consensus Service, and queries are settled trustlessly via the x402 micropayment protocol and Hedera Token Service."*

---

## 🎬 Section 2: Architecture & Live Network State (0:35 - 1:05)

### Visual on Screen:
*Navigate to the Operator Dashboard (`http://localhost:3000/dashboard`)*.
- Hover over the top metric cards showing:
  - Account: `0.0.11335112`
  - Fungible Token: `$EDGE` (`0.0.11336302`)
  - Hardware Security NFT: `HENFT #1` (`0.0.11336303`)
  - Topic: `0.0.11335841`

### Spoken Narration:
> *"Let’s look at the live architecture on Hedera Testnet. HederaEdge integrates four native Hedera services:*
>
> *First, **Hedera Token Service (HTS)**: We tokenize edge compute using our native utility token, **$EDGE** (ID: `0.0.11336302`), with a 1,000,000 supply for node staking and SLA bonding. Every node operator must hold an HTS **HENFT Hardware Security License** (ID: `0.0.11336303`). Here you see Serial #1 minted for Node Kai with verified IPFS hardware attestations.*
>
> *Second, **Hedera Consensus Service (HCS)**: Every single inference emits an immutable audit trail on Topic `0.0.11335841`, providing consensus timestamps and cryptographic sequence numbers without exposing private prompt payloads."*

---

## 🎬 Section 3: Live x402 Micropayment Inference (1:05 - 1:45)

### Visual on Screen:
*On the Dashboard, select the **x402 Protocol (0.05 HBAR)** tab.*
1. Type a test prompt in the input box: `"Evaluate the security posture of an edge device running local SLM inference under zero-cloud-egress constraints."`
2. Click **"Execute via x402 Protocol"**.
3. Point out the live sequence animation:
   - `HTTP 402 Payment Required` challenge received with `X-402-PayTo: 0.0.11335112` and `0.05 HBAR`.
   - Automatic Hedera `TransferTransaction` signed & submitted.
   - 200 OK received with local edge model stream (Qwen 1.7B on device NPU).
   - Consensus proof updated with real Hedera Transaction ID and HCS sequence number!

### Spoken Narration:
> *"Now let's see the x402 HTTP micropayment in action. An external agent sends an inference request. Our gateway immediately responds with standard `HTTP 402 Payment Required`, specifying the price of 0.05 HBAR.*
>
> *The client submits the signed Hedera transfer. Instantly, our edge worker verifies the transaction, triggers the local NPU model, streams the response with zero cloud data egress, and submits the consensus record to HCS.*
>
> *Notice: Total transaction cost? A fraction of a cent. Execution latency? Under 500 milliseconds. And zero bytes of private data touched any cloud provider."*

---

## 🎬 Section 4: Cross-Chain Interoperability & Relayer (1:45 - 2:15)

### Visual on Screen:
*Switch to the **Cross-Chain Relayer** tab.*
1. Select source chain: **Ethereum Sepolia** (show Base Sepolia and Arbitrum Sepolia in dropdown).
2. Show the pre-populated verified contract interaction and origin transaction hash (`0xd3c749a2...`).
3. Click **"Dispatch Cross-Chain Request"**.
4. Show the verified Hedera HCS proof generated with cross-chain telemetry binding.

### Spoken Narration:
> *"Next is Interoperability. How does a smart contract on Ethereum or Base trigger local edge AI on Hedera?*
>
> *Our Cross-Chain Relayer listens to inbound bridge calls across Ethereum Sepolia, Base, and Arbitrum. When an on-chain event fires, the relayer converts the cross-chain intent, verifies collateral against the node's staked `$EDGE` token balance, and dispatches the job to the optimal edge node.*
>
> *The completion proof is committed to Hedera Consensus Service, giving the EVM smart contract an auditable, timestamped proof of inference."*

---

## 🎬 Section 5: HashScan Verification & Conclusion (2:15 - 2:45)

### Visual on Screen:
*Open HashScan Testnet (`https://hashscan.io/testnet`)*:
- Show Topic `0.0.11335841` with recent multi-node telemetry.
- Show Token `0.0.11336302` ($EDGE) and NFT `0.0.11336303` (HENFT).
- Show Smart Contract `0.0.11337652` (`NodeSLARegistry`).
- Bring up the Automated Test Runner in terminal (`npm test`) showing `38 ASSERTIONS PASSED ACROSS 10 SUITES, 0 FAILED`.

### Spoken Narration:
> *"Everything we’ve shown you is 100% live on Hedera Testnet. You can verify our HCS topic, our fungible token, our node NFT, and our NodeSLARegistry smart contract right now on HashScan. Our automated test suite covers 10 comprehensive test suites with 38 verified assertions and zero failures.*
>
> *HederaEdge solves the enterprise AI dilemma: true zero-data-egress security, hardware TEE attestation, micropayment scalability via x402, and trustless interoperability across chains.*
>
> *Thank you, and we welcome your questions!"*

---

## 📋 Recording Checklist for Presenter
- [ ] Ensure local edge agent is running: `node edge-agent.js` (port 8000)
- [ ] Ensure Next.js dev server is running: `pnpm dev` (port 3000)
- [ ] Ensure Ollama is running with model `qwen3-1.7b`
- [ ] Have HashScan tabs pre-opened:
  - Topic: `https://hashscan.io/testnet/topic/0.0.11335841`
  - Token: `https://hashscan.io/testnet/token/0.0.11336302`
  - NFT: `https://hashscan.io/testnet/token/0.0.11336303`
  - Smart Contract: `https://hashscan.io/testnet/contract/0.0.11337652`
- [ ] Clean terminal ready to execute `npm test`
