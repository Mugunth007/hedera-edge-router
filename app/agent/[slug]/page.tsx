"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Cpu, ArrowUpRight, Send, Terminal, Activity, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant" | "system";
  text: string;
  latency?: number;
  hashscanUrl?: string;
  attestation?: any;
}

export default function AgentPortalPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "kai";
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      text: `Connected to HederaEdge Node [${slug.toUpperCase()}]. Zero-cloud-data-egress active. Small Language Model (Qwen 1.7B) executing on local device NPU.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [telemetryCount, setTelemetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Send directly to the agent route or x402 gateway
      const res = await fetch("/api/x402", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          mode: "settle_and_infer",
          autoSettle: true,
        }),
      });

      const data = await res.json();
      const elapsed = Date.now() - startTime;

      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.reply || "Inference completed on local device NPU.",
            latency: data.latencyMs || elapsed,
            hashscanUrl: data.settlement?.hashscanUrl,
            attestation: data.hardwareAttestation,
          },
        ]);
        setTelemetryCount((prev) => prev + 1);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: `Agent notice: ${data.message || data.error || "Edge node response error"}`,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: `Gateway communication error: ${err.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white flex items-center gap-2">
              HederaEdge Node: <span className="font-mono text-cyan-400">{slug.toUpperCase()}</span>
            </h1>
            <p className="text-xs text-slate-400">Model: Qwen 1.7B Local NPU • Topic: 0.0.11335841</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-full text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero Data Egress Active</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-full transition-all"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Dashboard</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === "user"
                ? "items-end"
                : msg.role === "system"
                ? "items-center"
                : "items-start"
            }`}
          >
            {msg.role === "system" ? (
              <div className="bg-slate-900/80 border border-slate-800 text-slate-400 text-xs px-4 py-2 rounded-xl text-center max-w-xl">
                {msg.text}
              </div>
            ) : (
              <div
                className={`max-w-2xl rounded-2xl px-5 py-3.5 text-sm ${
                  msg.role === "user"
                    ? "bg-cyan-600 text-white rounded-br-xs shadow-lg shadow-cyan-950/40"
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs"
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                {/* Metadata & On-Chain Proof */}
                {msg.latency && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Cpu className="h-3 w-3" />
                      {msg.latency} ms
                    </span>
                    {msg.attestation && (
                      <span className="flex items-center gap-1 text-cyan-400 font-mono">
                        <CheckCircle2 className="h-3 w-3" />
                        TEE Attested ({msg.attestation.weightsCommitment.slice(0, 10)}...)
                      </span>
                    )}
                    {msg.hashscanUrl && (
                      <a
                        href={msg.hashscanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-mono ml-auto"
                      >
                        HashScan Proof <ArrowUpRight className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl w-fit">
            <span className="animate-spin h-3.5 w-3.5 border-2 border-cyan-400 border-t-transparent rounded-full" />
            Local edge NPU computing inference & logging sequence to Hedera...
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/80 p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${slug.toUpperCase()} on local edge node... (0.05 HBAR per inference)`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-cyan-950/40"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </footer>
    </div>
  );
}
