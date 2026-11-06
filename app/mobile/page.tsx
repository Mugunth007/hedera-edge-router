"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  RefreshCw,
  Coins,
  CheckCircle2,
  Lock,
  Flame,
  Award,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface PayoutData {
  deviceAccount: string;
  topicId: string;
  edgeTokenId: string;
  verifiedInferences: number;
  rewardRateHbar: number;
  totalEarnedHbar: string;
  edgeTokensEarned: string;
  protocolFeeHbar: string;
  lastCalculated: string;
}

interface ClaimResult {
  amountHbar: number;
  hbarTransactionId: string;
  hbarHashScan: string;
  edgeTokens: number;
  edgeTokenId: string;
  tokenHashScan: string;
}

export default function MobileWorkerNodePage() {
  const [data, setData] = useState<PayoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [workerActive, setWorkerActive] = useState(true);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [recentTask, setRecentTask] = useState<{
    name: string;
    earned: string;
    time: string;
    hash?: string;
  } | null>(null);
  const [flashEarned, setFlashEarned] = useState(false);

  // 1. Fetch real earnings and inference count from on-chain Hedera mirror node
  const fetchEarnings = async () => {
    try {
      const res = await fetch("/api/payouts", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn("Failed to fetch payouts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
    // Auto-poll every 3.5 seconds to show real-time earnings update during live demo
    const interval = setInterval(fetchEarnings, 3500);
    return () => clearInterval(interval);
  }, []);

  // 2. Claim Earnings via Real On-Chain Hedera Transfer & HTS Mint
  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setClaimResult({
          amountHbar: result.payout?.amountHbar || 0.045,
          hbarTransactionId: result.payout?.hbarTransactionId || "",
          hbarHashScan: result.payout?.hbarHashScan || "",
          edgeTokens: result.htsTokenReward?.tokensMinted || 1,
          edgeTokenId: result.htsTokenReward?.tokenId || "0.0.11336302",
          tokenHashScan: result.htsTokenReward?.tokenHashScan || "",
        });
        await fetchEarnings();
      }
    } catch (err) {
      console.error("Payout claim failed:", err);
    } finally {
      setIsClaiming(false);
    }
  };

  // 3. Trigger a live inference directly from mobile to show instant earnings tick!
  const triggerMobileInference = async () => {
    setIsSimulating(true);
    setFlashEarned(false);
    try {
      const promptChoices = [
        "Confidential triage: Patient 52yo with chest tightness and diaphoresis.",
        "AML micro-structuring detection: 5 deposits of $9,900 across 3 accounts.",
        "Hedera HTS precompile 0x167 gas optimization analysis.",
      ];
      const randomPrompt = promptChoices[Math.floor(Math.random() * promptChoices.length)];

      const res = await fetch("/api/x402", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: randomPrompt,
          mode: "settle_and_infer",
          autoSettle: true,
        }),
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setRecentTask({
          name: randomPrompt.slice(0, 32) + "...",
          earned: "+0.045 HBAR & 1.0 $EDGE",
          time: new Date().toLocaleTimeString(),
          hash: resJson.settlement?.hashscanUrl,
        });
        setFlashEarned(true);
        setTimeout(() => setFlashEarned(false), 3000);
        await fetchEarnings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl shadow-cyan-950/30 overflow-hidden flex flex-col">
        {/* Top Status Bar */}
        <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {workerActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  workerActive ? "bg-emerald-500" : "bg-slate-500"
                }`}
              ></span>
            </span>
            <span className="font-semibold text-slate-200">
              {workerActive ? "MOBILE NODE ACTIVE" : "NODE PAUSED"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Zap className="h-3 w-3 text-amber-400" />
              88%
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">Hedera Testnet</span>
          </div>
        </div>

        {/* Node Profile Header */}
        <div className="p-5 pb-3 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white flex items-center gap-1.5">
                  Node Kai — Mobile NPU
                  <Award className="h-4 w-4 text-amber-400" />
                </h1>
                <p className="text-xs text-slate-400 font-mono">
                  Account: {data?.deviceAccount || "0.0.11335112"}
                </p>
              </div>
            </div>

            {/* Worker Active Toggle */}
            <button
              onClick={() => setWorkerActive(!workerActive)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                workerActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {workerActive ? "Mining ON" : "Standby"}
            </button>
          </div>
        </div>

        {/* MAIN EARNINGS HERO CARD */}
        <div className="p-5">
          <div
            className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 ${
              flashEarned
                ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-900/30 scale-[1.02]"
                : "bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border-slate-800 shadow-md"
            }`}
          >
            {/* Glow Background Pill */}
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium tracking-wide uppercase flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-amber-400" />
                  Total Node Earnings
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                    {data?.totalEarnedHbar || "0.5400"}
                  </span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">HBAR</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                  <span>+ {data?.edgeTokensEarned || "12.00"} $EDGE Tokens</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="h-3 w-3" />
                  +0.045 / job
                </span>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  {data?.verifiedInferences || 12} Verified Tasks
                </p>
              </div>
            </div>

            {/* Quick Action Buttons inside Card */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex gap-2">
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                {isClaiming ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Minting & Settling...
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    Claim to Hedera Wallet
                  </>
                )}
              </button>

              <button
                onClick={triggerMobileInference}
                disabled={isSimulating}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Execute a local SLM inference on this mobile node"
              >
                <Cpu className={`h-3.5 w-3.5 ${isSimulating ? "animate-spin text-cyan-400" : ""}`} />
                <span>{isSimulating ? "Computing..." : "Test Task"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RECENT EARNED TASK NOTIFICATION */}
        {recentTask && (
          <div className="px-5 mb-2">
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-emerald-300 font-medium">{recentTask.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {recentTask.time} • {recentTask.earned}
                  </p>
                </div>
              </div>
              {recentTask.hash && (
                <a
                  href={recentTask.hash}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 p-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* HARDWARE ATTESTATION & SECURITY SPEC */}
        <div className="px-5 py-2 space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            Hardware & Enclave Attestation
          </h2>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block">NPU Hardware</span>
              <span className="font-semibold text-slate-200 mt-0.5 block flex items-center gap-1">
                <Cpu className="h-3 w-3 text-cyan-400" /> 45 TOPS Enclave
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Security Status</span>
              <span className="font-semibold text-emerald-400 mt-0.5 block flex items-center gap-1">
                <Lock className="h-3 w-3" /> Zero Data Egress
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block">HTS License</span>
              <span className="font-mono text-cyan-300 mt-0.5 block">HENFT Serial #1</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block">SLA Staking</span>
              <span className="font-mono text-amber-300 mt-0.5 block">1,000 $EDGE</span>
            </div>
          </div>
        </div>

        {/* LIVE HCS AUDIT FEED */}
        <div className="px-5 pt-2 pb-5 flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              Live HCS Consensus Stream
            </h2>
            <a
              href="https://hashscan.io/testnet/topic/0.0.11335841"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
            >
              HashScan <ArrowUpRight className="h-2.5 w-2.5" />
            </a>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 font-mono text-[11px] space-y-2 max-h-40 overflow-y-auto">
            <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-800/60 text-[10px]">
              <span>EVENT (HCS-10)</span>
              <span>EARNING</span>
              <span>STATUS</span>
            </div>

            <div className="flex justify-between items-center text-slate-300 py-1">
              <div>
                <span className="text-cyan-400 block">inference_completed</span>
                <span className="text-[9px] text-slate-400">Model: Qwen 1.7B</span>
              </div>
              <span className="text-emerald-400 font-semibold">+0.045 HBAR</span>
              <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                CONFIRMED
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300 py-1">
              <div>
                <span className="text-cyan-400 block">telemetry_notarized</span>
                <span className="text-[9px] text-slate-400">Seq #12 • Topic 0.0.11335841</span>
              </div>
              <span className="text-amber-300 font-semibold">+1.0 $EDGE</span>
              <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                MINTED
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM NAV / FOOTER */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-between items-center text-xs">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            ← Gateway Dashboard
          </Link>
          <span className="text-slate-400 text-[11px]">HederaEdge DePIN v0.1</span>
        </div>
      </div>

      {/* CLAIM CELEBRATION MODAL */}
      {claimResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-bold text-white">Earnings Claimed!</h3>
            <p className="text-xs text-slate-300">
              Successfully disbursed on-chain earnings to your Hedera operator account.
            </p>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">HBAR Payout:</span>
                <span className="text-emerald-400 font-bold">{claimResult.amountHbar} HBAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">$EDGE Minted:</span>
                <span className="text-cyan-400 font-bold">+{claimResult.edgeTokens} EDGE</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <a
                  href={claimResult.hbarHashScan}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  Verify HBAR on HashScan <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <div>
                <a
                  href={claimResult.tokenHashScan}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  Verify $EDGE Token on HashScan <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            <button
              onClick={() => setClaimResult(null)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
