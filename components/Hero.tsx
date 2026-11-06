"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cpu, Radio, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export default function Hero() {
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
    <div className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 z-10">
      <div className="max-w-2xl">
        {/* Aceternity Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.15] bg-white/[0.03] backdrop-blur-xl mb-6 shadow-2xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]"></span>
          </span>
          <span className="text-xs font-medium text-neutral-300 tracking-wide">
            HEDERA TESTNET LIVE
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-xs text-neutral-400 font-mono">Topic 0.0.11335841</span>
        </motion.div>

        {/* Aceternity Bold Hero Title with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Decentralized Edge AI on{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FF88] via-[#038fa8] to-blue-500">
              Hedera.
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-neutral-400 text-lg sm:text-xl font-normal mt-6 leading-relaxed max-w-xl"
        >
          Repurpose idle smartphones and edge devices into decentralized AI nodes. Run local LLM inference, log verifiable proofs on Hedera Consensus, and earn <span className="text-white font-medium">$HBAR</span>.
        </motion.p>

        {/* Aceternity Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          {/* Shimmer Button: Agent Portal */}
          <button
            onClick={handleLaunchAgent}
            className="relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FF88_0%,#038fa8_50%,#00FF88_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 px-6 py-1 text-sm font-semibold text-white backdrop-blur-3xl gap-2 hover:bg-neutral-900 transition-colors">
              <span>Agent Portal</span>
              <ArrowRight className="w-4 h-4 text-[#00FF88]" />
            </span>
          </button>

          {/* Secondary Glassmorphism Button: Node Telemetry */}
          <button
            onClick={handleOpenDashboard}
            className="h-12 px-6 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.2] backdrop-blur-xl text-sm font-semibold text-neutral-200 transition-all flex items-center gap-2"
          >
            <span>Node Telemetry</span>
            <Zap className="w-4 h-4 text-[#f3d535]" />
          </button>

          {/* Minimal Button: HashScan */}
          <button
            onClick={handleHashscan}
            className="h-12 px-5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>HashScan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-6 max-w-lg"
        >
          <div>
            <div className="text-xl font-bold text-white font-mono">Qwen 3 (1.7B)</div>
            <div className="text-xs text-neutral-400 mt-0.5">Local LLM Engine</div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#00FF88] font-mono">HCS-10</div>
            <div className="text-xs text-neutral-400 mt-0.5">Signed Consensus</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-mono">$HBAR</div>
            <div className="text-xs text-neutral-400 mt-0.5">Automated Rewards</div>
          </div>
        </motion.div>

        {/* Backed by Hedera */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex items-center gap-3 opacity-75"
        >
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
            Built on
          </span>
          <div
            onClick={() => window.open("https://hedera.com", "_blank")}
            className="cursor-pointer hover:opacity-100 transition-opacity"
          >
            <Image
              src="/hedera.png"
              alt="Hedera"
              width={110}
              height={20}
              className="rounded-lg border border-neutral-800"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
