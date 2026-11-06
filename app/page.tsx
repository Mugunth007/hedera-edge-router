"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Flame,
  Globe2,
  Radio,
  Server,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const handleLaunchAgent = () => {
    window.open("http://kai.localhost:3000", "_blank");
  };

  const handleOpenDashboard = () => {
    window.open("/dashboard", "_self");
  };

  const handleHashscan = () => {
    window.open("https://hashscan.io/testnet/topic/0.0.11335841", "_blank");
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-slate-100 font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      {/* Aceternity Background Grid with Radial Mask */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-grid-white opacity-25 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Aceternity Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-sky-500/5 to-transparent blur-[140px]" />
      </div>

      {/* Floating Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center justify-between p-3.5 px-6 rounded-2xl border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center font-bold text-white text-sm">
              HE
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              Hedera<span className="text-neutral-400">Edge</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
            <button onClick={handleOpenDashboard} className="hover:text-white transition-colors">
              Node Telemetry
            </button>
            <button onClick={handleLaunchAgent} className="hover:text-white transition-colors">
              Agent Portal
            </button>
            <a
              href="https://hashscan.io/testnet/topic/0.0.11335841"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              HashScan Explorer <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          </div>

          <div>
            <button
              onClick={handleLaunchAgent}
              className="inline-flex h-9 items-center justify-center rounded-xl bg-white px-4 text-xs font-semibold text-black hover:bg-neutral-200 transition-colors shadow-lg"
            >
              Launch Portal
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        {/* Aceternity Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl mb-8 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-neutral-300 tracking-wide">
            Hedera Consensus Service Live
          </span>
          <span className="text-neutral-700">|</span>
          <span className="text-xs text-neutral-400 font-mono">Topic 0.0.11335841</span>
        </div>

        {/* Aceternity Hero Title - Strictly 2 Lines with Animated Gradient */}
        <h1 className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.15] max-w-5xl mx-auto">
          <span className="block whitespace-nowrap">
            Decentralized Edge AI
          </span>
          <span className="block mt-2 whitespace-nowrap bg-clip-text text-transparent bg-[linear-gradient(to_right,#38bdf8,#818cf8,#34d399,#a855f7,#38bdf8)] animate-gradient-x">
            Powered by Hedera
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg sm:text-xl text-neutral-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Zero-data-egress decentralized edge AI gateway on Hedera. Dispatch cross-chain inference from EVM smart contracts, compute locally on secure NPU silicon with zero cloud leakage, and tokenize edge intelligence using HTS $EDGE tokens and HCS-10 consensus proofs.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* Aceternity Shimmer Button */}
          <button
            onClick={handleLaunchAgent}
            className="relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#525252_0%,#ffffff_50%,#525252_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 px-7 text-sm font-semibold text-white backdrop-blur-3xl gap-2 hover:bg-neutral-900 transition-colors">
              <span>Agent Chat Portal</span>
              <ArrowRight className="w-4 h-4 text-neutral-300" />
            </span>
          </button>

          {/* Secondary Glass Button */}
          <button
            onClick={handleOpenDashboard}
            className="h-12 px-7 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/60 hover:border-neutral-700 text-sm font-semibold text-neutral-200 transition-all flex items-center gap-2"
          >
            <span>Node Telemetry</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </button>

          {/* Minimal HashScan Button */}
          <button
            onClick={handleHashscan}
            className="h-12 px-5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>HashScan Ledger</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-16 pt-10 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-5 gap-6 max-w-4xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">Qwen 3</div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">1.7B NPU Silicon</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">HCS-10</div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Consensus Proofs</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">x402</div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">0.05 HBAR Micropay</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">$EDGE</div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">HTS 0.0.11336302</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">Interop</div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">LayerZero / CCIP</div>
          </div>
        </div>

        {/* Aceternity Bento Grid Showcase */}
        <section className="mt-28 text-left space-y-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for speed, privacy, and verifiable trust.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Local Neural Inference */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-neutral-800/80 bg-neutral-950/60 backdrop-blur-xl relative overflow-hidden group hover:border-neutral-700 transition-all shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <Cpu className="w-5 h-5 text-neutral-300" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400">
                  On-Device Compute
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-6 tracking-tight">
                Local LLM Neural Processing
              </h3>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-lg">
                Prompts are processed on edge hardware using Ollama without streaming sensitive user data to centralized cloud silos.
              </p>

              {/* Code Snippet Box */}
              <div className="mt-6 p-4 rounded-2xl bg-black border border-neutral-800/90 font-mono text-xs text-neutral-300 overflow-x-auto">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-neutral-800/80 text-neutral-500">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>edge-agent-worker.log</span>
                </div>
                <div className="text-emerald-400">[HederaEdge Node] Generating response using Ollama (qwen3-1.7b)...</div>
                <div className="text-neutral-400">Inference completed in 3030ms. Signing HCS-10 telemetry...</div>
                <div className="text-sky-400">[Hedera] Confirmed on-chain! Status: SUCCESS</div>
              </div>
            </div>

            {/* Bento 2: Verifiable Consensus */}
            <div className="p-8 rounded-3xl border border-neutral-800/80 bg-neutral-950/60 backdrop-blur-xl relative overflow-hidden group hover:border-neutral-700 transition-all shadow-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mt-6 tracking-tight">
                  HCS-10 Consensus
                </h3>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  Every query generates an immutable timestamp and latency proof anchored to Hedera topic <code className="text-neutral-200">0.0.11335841</code>.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>Proof Status</span>
                <span className="text-emerald-400 font-bold">VERIFIED</span>
              </div>
            </div>

            {/* Bento 3: Cross-Chain Interoperability Gateway */}
            <div className="p-8 rounded-3xl border border-neutral-800/80 bg-neutral-950/60 backdrop-blur-xl relative overflow-hidden group hover:border-neutral-700 transition-all shadow-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <Globe2 className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-white mt-6 tracking-tight">
                  Cross-Chain Gateway
                </h3>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  LayerZero V2 and Chainlink CCIP connectors allow Ethereum, Base, and Arbitrum smart contracts to trigger on-device AI inference on Hedera.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>EVM Bridge</span>
                <span className="text-cyan-400 font-bold">ETH • BASE • ARB</span>
              </div>
            </div>

            {/* Bento 4: HTS Tokenization, x402 & Automated Payouts */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-neutral-800/80 bg-neutral-950/60 backdrop-blur-xl relative overflow-hidden group hover:border-neutral-700 transition-all shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                    HTS Tokenization & x402
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-6 tracking-tight">
                  HTS $EDGE Tokenization, Node NFTs & x402 Protocol
                </h3>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-lg">
                  Native <code className="text-amber-300">$EDGE</code> utility token (0.0.11336302) and Node Security License NFTs (0.0.11336303) incentivize high-uptime silicon. Implements standard HTTP 402 challenges settling at 0.05 HBAR per inference.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleOpenDashboard}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-semibold text-white transition-all flex items-center gap-2"
                >
                  <span>Open Telemetry Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="/api/crosschain"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/40 text-xs font-semibold text-cyan-300 transition-all flex items-center gap-1.5 font-mono"
                >
                  <span>Cross-Chain Spec</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>
                <a
                  href="/api/x402"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-neutral-300 transition-all flex items-center gap-1.5 font-mono"
                >
                  <span>x402 Spec</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-28 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <div>
            HederaEdge — Decentralized Edge AI Network on Hedera Testnet
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://hedera.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Hedera Hashgraph
            </a>
            <span>•</span>
            <a
              href="https://hashscan.io/testnet/topic/0.0.11335841"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              HashScan Topic
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
