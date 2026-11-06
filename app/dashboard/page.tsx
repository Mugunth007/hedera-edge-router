"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  Cpu,
  ExternalLink,
  Flame,
  Globe,
  Radio,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Wallet,
  Zap,
} from "lucide-react";

interface TelemetryEvent {
  sequenceNumber: number;
  consensusTimestamp: string;
  date: string;
  runningHash: string;
  payer: string;
  agentAddress: string;
  latencyMs: number;
  requestPath: string;
  hashscanUrl: string;
}

interface TelemetryData {
  topicId: string;
  nodeAccount: string;
  totalInferences: number;
  averageLatencyMs: number;
  earnedHbar: string;
  uptime: string;
  recentEvents: TelemetryEvent[];
}

export default function DashboardPage() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutResult, setPayoutResult] = useState<any | null>(null);

  // Playground state
  const [testPrompt, setTestPrompt] = useState("");
  const [testing, setTesting] = useState(false);
  const [testReply, setTestReply] = useState<any | null>(null);
  const [gatewayMode, setGatewayMode] = useState<"x402" | "crosschain" | "direct">("x402");
  const [sourceChain, setSourceChain] = useState<"base-sepolia" | "ethereum-sepolia" | "arbitrum-sepolia">("base-sepolia");

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/telemetry");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPayout = async () => {
    try {
      setPayoutLoading(true);
      setPayoutResult(null);
      const res = await fetch("/api/payouts", { method: "POST" });
      const json = await res.json();
      setPayoutResult(json);
      fetchTelemetry();
    } catch (err) {
      console.error("Payout failed:", err);
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleRunTestInference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim() || testing) return;

    try {
      setTesting(true);
      setTestReply(null);
      
      let res;
      if (gatewayMode === "crosschain") {
        // Execute via Cross-Chain Interoperability Gateway
        res = await fetch("/api/crosschain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceChain,
            message: testPrompt,
          }),
        });
      } else if (gatewayMode === "x402") {
        // Execute via Hedera x402 Micropayment Protocol
        res = await fetch("/api/x402", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: testPrompt,
            mode: "settle_and_infer",
          }),
        });
      } else {
        // Direct route via subdomain router
        res = await fetch("/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Host: "kai.localhost:3000",
          },
          body: JSON.stringify({ message: testPrompt }),
        });
      }

      const json = await res.json();
      setTestReply(json);
      setTestPrompt("");
      fetchTelemetry();
    } catch (err: any) {
      setTestReply({ error: err.message });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Vibrant Background Spotlights & Gradient Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-grid-white opacity-20 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Multi-Color Ambient Glow Beams */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-transparent blur-[130px]" />
        <div className="absolute top-10 right-1/4 w-[500px] h-[300px] bg-gradient-to-bl from-cyan-500/20 via-emerald-500/10 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Floating Top Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 px-6 rounded-2xl border border-white/[0.1] bg-neutral-950/80 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-all bg-white/[0.05] border border-white/[0.1] px-3.5 py-2 rounded-xl hover:bg-white/[0.1] hover:border-white/[0.2]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="h-4 w-px bg-white/[0.1]" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                Hedera Testnet
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Topic {data?.topicId || "0.0.11335841"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Link
              href="/mobile"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-300 transition-all shadow-md shadow-emerald-950/40"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Mobile Node Miner
            </Link>
            <button
              onClick={fetchTelemetry}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-xs font-semibold text-neutral-200 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
              Sync Ledger
            </button>
            <a
              href={`https://hashscan.io/testnet/topic/${data?.topicId || "0.0.11335841"}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02]"
            >
              HashScan Topic <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* 2-Line Animated Vibrant Hero Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-300 tracking-wider uppercase backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Live On-Chain Reputation
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12]">
            <span className="block">Node Telemetry &</span>
            <span className="block mt-1 bg-clip-text text-transparent bg-[linear-gradient(to_right,#38bdf8,#818cf8,#c084fc,#34d399,#fbbf24,#38bdf8)] animate-gradient-x">
              Live Reputation Ledger
            </span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-normal leading-relaxed pt-1">
            Real-time consensus telemetry anchored to Hedera topic <code className="text-cyan-300 font-mono bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded text-xs">{data?.topicId || "0.0.11335841"}</code> with verified memo <span className="text-emerald-400 font-semibold">"HederaEdge Telemetry & HCS-10"</span>.
          </p>
        </div>

        {/* =========================================================================
            TIER 1: ASYMMETRIC BENTO GRID (Hero Feature Playground + $HBAR Vault)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bento Item 1 (Spans 2 columns): Live Interactive Playground */}
          <div className="lg:col-span-2 relative p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-neutral-950/90 to-purple-950/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.12)] space-y-5 overflow-hidden">
            {/* Top Accent Light Beam */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Live Edge Inference Playground
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Dispatch prompts to the local worker node, watch Qwen 3 infer, and inspect the Hedera proof.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-xl">
                Qwen 3 (1.7B)
              </span>
            </div>

            {/* Gateway Execution Mode Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-white/[0.08] mt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGatewayMode("x402")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    gatewayMode === "x402"
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20"
                      : "bg-white/[0.04] border-white/[0.08] text-neutral-400 hover:text-white"
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>x402 Protocol</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${gatewayMode === "x402" ? "bg-amber-400 text-black" : "bg-neutral-800 text-neutral-400"}`}>
                    0.05 HBAR
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setGatewayMode("crosschain")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    gatewayMode === "crosschain"
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/20"
                      : "bg-white/[0.04] border-white/[0.08] text-neutral-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cross-Chain Relayer</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${gatewayMode === "crosschain" ? "bg-cyan-400 text-black" : "bg-neutral-800 text-neutral-400"}`}>
                    TEST HARNESS
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setGatewayMode("direct")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    gatewayMode === "direct"
                      ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-md shadow-purple-500/20"
                      : "bg-white/[0.04] border-white/[0.08] text-neutral-400 hover:text-white"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Direct Node</span>
                </button>
              </div>

              {gatewayMode === "crosschain" && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-400 text-[11px]">EVM Source:</span>
                  <select
                    value={sourceChain}
                    onChange={(e: any) => setSourceChain(e.target.value)}
                    className="bg-neutral-900 border border-cyan-500/40 text-cyan-300 text-xs rounded-xl px-2.5 py-1 focus:outline-none"
                  >
                    <option value="base-sepolia">Base Sepolia (84532)</option>
                    <option value="ethereum-sepolia">Ethereum Sepolia (11155111)</option>
                    <option value="arbitrum-sepolia">Arbitrum Sepolia (421614)</option>
                  </select>
                </div>
              )}
            </div>

            <form onSubmit={handleRunTestInference} className="flex flex-col sm:flex-row gap-3 pt-1">
              <input
                type="text"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder={
                  gatewayMode === "crosschain"
                    ? "Dispatch cross-chain query from EVM to Hedera edge node..."
                    : gatewayMode === "x402"
                    ? "Ask your edge agent (settles 0.05 HBAR via x402 on Hedera)..."
                    : "Ask your edge agent (e.g. Why is decentralized inference faster?)..."
                }
                className="flex-1 bg-black/60 border border-white/[0.15] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-sans shadow-inner"
              />
              <button
                type="submit"
                disabled={testing || !testPrompt.trim()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-40 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {testing
                  ? "Routing & Inferring..."
                  : gatewayMode === "crosschain"
                  ? "Dispatch Cross-Chain"
                  : gatewayMode === "x402"
                  ? "Pay 0.05 HBAR & Infer"
                  : "Dispatch Prompt"}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Test Reply Display Window */}
            {testReply && (
              <div className="p-4 rounded-2xl bg-black/80 border border-indigo-500/30 font-mono text-xs space-y-2.5 animate-fadeIn shadow-xl">
                <div className="flex justify-between items-center text-neutral-400 pb-2 border-b border-white/[0.08]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Status: <strong className="text-emerald-400">{testReply.success || testReply.status === 200 ? "SUCCESS" : "ERROR"}</strong>
                  </span>
                  <span>Latency: <strong className="text-cyan-400">{testReply.latencyMs || 0} ms</strong></span>
                </div>
                
                {/* Cross-Chain Execution Receipt */}
                {testReply.source && (
                  <div className="text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 p-2.5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        Cross-Chain Task Relayed: {testReply.source.chain}
                      </span>
                      <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold">
                        {testReply.bridgeStandard}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300 text-[10px]">
                      <span className="font-mono truncate max-w-[280px]">
                        Origin EVM Tx: {testReply.source.originTxHash}
                      </span>
                      <a
                        href={testReply.source.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-white underline font-semibold flex items-center gap-1 ml-2"
                      >
                        EVM Explorer <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {testReply.destination?.htsRewardToken && (
                      <div className="pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-amber-300">
                        <span>HTS Token Reward: <strong>{testReply.destination.htsRewardToken.rewardAmount}</strong></span>
                        <a
                          href={testReply.destination.htsRewardToken.hashscanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:text-white underline font-semibold flex items-center gap-1"
                        >
                          Token 0.0.11336302 <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* x402 Micropayment Receipt */}
                {testReply.x402Settlement && (
                  <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        x402 Micropayment Settled ({testReply.x402Settlement.amount})
                      </span>
                      <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold">SETTLED ON HEDERA</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300 text-[10px] pt-1">
                      <span className="font-mono truncate max-w-[280px]">Tx ID: {testReply.x402Settlement.transactionId}</span>
                      <a
                        href={testReply.x402Settlement.hashscanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-white underline font-semibold flex items-center gap-1 ml-2"
                      >
                        HashScan Tx <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                <div className="text-neutral-100 font-sans text-sm pt-1 leading-relaxed">
                  {testReply.reply || testReply.error}
                </div>
                
                {testReply.telemetry?.onChainConfirmation && (
                  <div className="text-[11px] text-neutral-400 pt-2 flex items-center gap-2 border-t border-white/[0.06]">
                    <span>Topic: <code className="text-cyan-300">{testReply.telemetry.onChainConfirmation.topicId}</code></span>
                    <span>|</span>
                    <a
                      href={testReply.telemetry.onChainConfirmation.hashscanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:text-white underline flex items-center gap-1 font-semibold"
                    >
                      HCS Telemetry Proof on HashScan <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bento Item 2 (Spans 1 column): Vibrant Golden $HBAR & HTS Token Vault */}
          <div className="relative p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-neutral-950/90 to-amber-950/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col justify-between overflow-hidden">
            {/* Top Amber Light Beam */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/30">
                    <Coins className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      HTS Token Vault
                    </h4>
                    <span className="text-[11px] text-neutral-400">Hedera Token Service</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono">
                    $HBAR
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono">
                    $EDGE
                  </span>
                </div>
              </div>

              {/* HBAR & EDGE Balances */}
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-4xl font-black text-white font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400">
                    {data?.earnedHbar ?? "0.200"}
                    <span className="text-sm font-bold text-amber-300 ml-1.5">HBAR</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Consensus inference payout accrual
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium">HTS $EDGE Token:</span>
                    <a
                      href="https://hashscan.io/testnet/token/0.0.11336302"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-300 hover:text-white font-mono font-bold flex items-center gap-1 underline"
                    >
                      0.0.11336302 <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium">Node Security NFT:</span>
                    <a
                      href="https://hashscan.io/testnet/token/0.0.11336303/1"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-300 hover:text-white font-mono font-bold flex items-center gap-1 underline"
                    >
                      HENFT #1 (45 TOPS) <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.06]">
                    <span className="text-neutral-400 font-medium">SLA Security Stake:</span>
                    <span className="text-emerald-400 font-mono font-bold">10,000 $EDGE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vibrant Shimmer Payout Button */}
            <button
              onClick={handleClaimPayout}
              disabled={payoutLoading}
              className="mt-6 w-full relative inline-flex h-12 overflow-hidden rounded-2xl p-[1px] focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-amber-500/20"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#fbbf24_0%,#f59e0b_50%,#34d399_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-neutral-950 px-5 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-3xl hover:bg-neutral-900 transition-colors gap-2">
                <Wallet className="w-4 h-4 text-amber-400" />
                {payoutLoading ? "Executing on Hedera..." : "Claim $HBAR & $EDGE Rewards"}
              </span>
            </button>
          </div>
        </div>

        {/* Payout Result Notification */}
        {payoutResult && (
          <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fadeIn shadow-xl shadow-emerald-500/10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <strong className="text-sm text-white font-semibold">Hedera Payout Confirmed!</strong>
                <p className="text-xs text-neutral-300 font-mono mt-0.5">
                  Tx ID: {payoutResult.transactionId}
                </p>
              </div>
            </div>
            <a
              href={payoutResult.hashscanUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-400 hover:text-white underline flex items-center gap-1 font-mono"
            >
              Inspect on HashScan <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* =========================================================================
            TIER 2: 3 VIBRANT THEMED METRIC CARDS (Violet, Sky Blue, Emerald)
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metric 1: Verified Inferences (Vibrant Violet / Purple) */}
          <div className="relative p-6 sm:p-7 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-neutral-950/80 to-neutral-950 backdrop-blur-xl overflow-hidden group hover:border-purple-500/60 transition-all shadow-xl shadow-purple-950/20">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Verified Inferences
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="text-5xl font-black mt-6 text-white font-mono tracking-tight">
              {data?.totalInferences ?? "--"}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-purple-300/80 font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Cryptographic Consensus Proofs
            </div>
          </div>

          {/* Metric 2: Average Latency (Vibrant Electric Sky / Cyan) */}
          <div className="relative p-6 sm:p-7 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-neutral-950/80 to-neutral-950 backdrop-blur-xl overflow-hidden group hover:border-cyan-500/60 transition-all shadow-xl shadow-cyan-950/20">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Avg Response Time
              </span>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="text-5xl font-black mt-6 text-white font-mono tracking-tight">
              {data?.averageLatencyMs ?? "--"}
              <span className="text-lg font-normal text-cyan-400/70 ml-1">ms</span>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-cyan-300/80 font-mono">
              <Flame className="w-3.5 h-3.5 text-cyan-400" /> Measured at Local Node
            </div>
          </div>

          {/* Metric 3: Node Availability (Vibrant Emerald / Mint) */}
          <div className="relative p-6 sm:p-7 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-neutral-950/80 to-neutral-950 backdrop-blur-xl overflow-hidden group hover:border-emerald-500/60 transition-all shadow-xl shadow-emerald-950/20">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Node Availability
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-5xl font-black mt-6 text-emerald-400 font-mono tracking-tight">
              {data?.uptime ?? "99.98%"}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-emerald-300/80 font-mono truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Host: {data?.nodeAccount}
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 3: LEDGER EXPLORER + NODE IDENTITY (2-Column Split)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: macOS Terminal Consensus Ledger (Spans 2 columns) */}
          <div className="lg:col-span-2 rounded-3xl border border-white/[0.1] bg-neutral-950/80 backdrop-blur-2xl overflow-hidden shadow-2xl">
            {/* Terminal Window Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block shadow-sm shadow-red-500/50" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block shadow-sm shadow-yellow-500/50" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm shadow-emerald-500/50" />
                </div>
                <span className="text-xs text-neutral-400 font-mono pl-2">
                  hedera-consensus-ledger.log
                </span>
              </div>
              <div className="text-xs text-neutral-400 font-mono">
                {data?.recentEvents?.length || 0} On-Chain Proofs
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 text-neutral-400 text-[11px] uppercase tracking-wider font-semibold border-b border-white/[0.06]">
                  <tr>
                    <th className="py-4 px-6">Seq #</th>
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">Latency</th>
                    <th className="py-4 px-6">Agent Identity</th>
                    <th className="py-4 px-6">Running Hash</th>
                    <th className="py-4 px-6 text-right">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono text-xs">
                  {data?.recentEvents && data.recentEvents.length > 0 ? (
                    data.recentEvents.map((evt) => (
                      <tr key={evt.sequenceNumber} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-4 px-6 text-cyan-400 font-bold">
                          #{evt.sequenceNumber}
                        </td>
                        <td className="py-4 px-6 text-neutral-300 font-sans">{evt.date}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-semibold">
                            {evt.latencyMs} ms
                          </span>
                        </td>
                        <td className="py-4 px-6 text-neutral-400">
                          {evt.agentAddress.substring(0, 10)}...{evt.agentAddress.substring(evt.agentAddress.length - 6)}
                        </td>
                        <td className="py-4 px-6 text-neutral-500 max-w-xs truncate">
                          {evt.runningHash}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <a
                            href={`https://hashscan.io/testnet/topic/${data.topicId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-cyan-400 hover:text-white transition-colors gap-1 font-semibold"
                          >
                            Verify <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-500 font-sans">
                        {loading ? "Streaming proofs from Hedera mirror node..." : "No consensus events recorded yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Node Operator Cryptographic Parameters (Spans 1 column) */}
          <div className="rounded-3xl border border-white/[0.1] bg-neutral-950/80 backdrop-blur-2xl p-6 sm:p-7 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Node Parameters
                  </h4>
                  <span className="text-[11px] text-neutral-400">Cryptographic Identity</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Operator Account</div>
                  <div className="text-cyan-300 font-semibold">{data?.nodeAccount || "0.0.11335112"}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Consensus Topic ID</div>
                  <div className="text-emerald-400 font-semibold">{data?.topicId || "0.0.11335841"}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Active Neural Model</div>
                  <div className="text-purple-300 font-semibold">Qwen 3 (1.7B Local Node)</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Consensus Standard</div>
                  <div className="text-amber-300 font-semibold">Hedera HCS-10 Telemetry</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-amber-500/20 bg-amber-950/20 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Payment Protocol</div>
                  <div className="text-amber-200 font-semibold flex items-center justify-between">
                    <span>x402 on Hedera (0.05 HBAR)</span>
                    <a
                      href="/api/x402"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-amber-400 underline font-mono"
                    >
                      Spec JSON ↗
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-cyan-500/20 bg-cyan-950/20 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">HTS Tokenization</div>
                  <div className="text-cyan-200 font-semibold flex items-center justify-between">
                    <span>$EDGE: 0.0.11336302</span>
                    <a
                      href="https://hashscan.io/testnet/token/0.0.11336302"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-cyan-400 underline font-mono"
                    >
                      Token ↗
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-purple-500/20 bg-purple-950/20 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Node Security NFT</div>
                  <div className="text-purple-200 font-semibold flex items-center justify-between">
                    <span>HENFT #1 (45 TOPS)</span>
                    <a
                      href="https://hashscan.io/testnet/token/0.0.11336303/1"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-purple-400 underline font-mono"
                    >
                      NFT ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <a
                href={`https://hashscan.io/testnet/account/${data?.nodeAccount || "0.0.11335112"}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-xs font-semibold text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <span>Inspect Account on HashScan</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 4: ENTERPRISE ZERO-EGRESS SECURITY & BENCHMARK MATRIX
        ========================================================================= */}
        <div className="rounded-3xl border border-white/[0.1] bg-neutral-950/80 backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400 tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" /> Security & Compliance Architecture
              </div>
              <h3 className="text-2xl font-black text-white mt-2 tracking-tight">
                Why HederaEdge Defeats Centralized Web2 Subscriptions
              </h3>
              <p className="text-xs text-neutral-400 max-w-2xl mt-1">
                Zero data egress keeps confidential IP and healthcare data within local silicon. Hedera Consensus anchors tamper-proof audit trails for enterprise regulatory compliance.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-bold">
                HIPAA / GDPR Ready
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 font-bold">
                Zero Cloud Leak
              </span>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-black/50 text-neutral-400 text-[11px] uppercase tracking-wider font-semibold border-b border-white/[0.08]">
                <tr>
                  <th className="py-3.5 px-5">Evaluation Vector</th>
                  <th className="py-3.5 px-5 text-neutral-400">Centralized Cloud APIs (OpenAI / AWS)</th>
                  <th className="py-3.5 px-5 text-emerald-400 font-bold">HederaEdge DePIN Security Network</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-5 font-bold text-white">Data Privacy & Exfiltration</td>
                  <td className="py-3.5 px-5 text-red-400 font-medium">❌ High risk: raw prompts sent to cloud servers</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">✅ Zero Egress: 100% computed on local NPU silicon</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-5 font-bold text-white">Cryptographic Verification</td>
                  <td className="py-3.5 px-5 text-neutral-400 font-medium">❌ Black box: zero proof of model weights or integrity</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">✅ Immutable HCS-10 sequence proof on Hedera</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-5 font-bold text-white">Agent Swarm Economics (1M calls)</td>
                  <td className="py-3.5 px-5 text-red-400 font-medium">❌ $20,000+ API invoices per month</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">✅ $0 compute cost + fraction-of-cent Hedera consensus</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-5 font-bold text-white">Cross-Chain Interoperability</td>
                  <td className="py-3.5 px-5 text-neutral-400 font-medium">❌ Web2 REST only; smart contracts cannot call natively</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">✅ LayerZero V2 & Chainlink CCIP cross-chain dispatch</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-5 font-bold text-white">Economic Tokenization</td>
                  <td className="py-3.5 px-5 text-neutral-400 font-medium">❌ Proprietary credit card lock-in</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">✅ HTS $EDGE Staking, Node NFTs & x402 Micropayments</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
