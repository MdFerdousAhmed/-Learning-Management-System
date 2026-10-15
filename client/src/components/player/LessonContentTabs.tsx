"use client";

import React, { useState } from "react";
import {
  FileText,
  FileCode,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Terminal as TerminalIcon,
  MessageSquare,
  HelpCircle,
  BookOpen,
  ExternalLink,
} from "lucide-react";

interface LessonContentTabsProps {
  lessonContent?: string;
  lessonResources?: string[];
  courseId?: string;
  lessonTitle?: string;
}

const KAFKA_CODE = `import { Kafka, CompressionTypes } from "kafkajs";

// Initialize telemetry client bound to production broker cluster
const kafka = new Kafka({
  clientId: "distributed-pipeline-v1",
  brokers: [
    "broker-01.auspify.net:9092",
    "broker-02.auspify.net:9092",
    "broker-03.auspify.net:9092"
  ],
  retry: { initialRetryTime: 100, retries: 8 }
});

const producer = kafka.producer({
  allowAutoTopicCreation: false,
  idempotent: true,          // Guarantees single-delivery
  maxInFlightRequests: 1
});

await producer.connect();

// Sync batch — strict ISR quorum (acks=all, min.insync.replicas=2)
await producer.send({
  topic: "core.financial.ledger",
  compression: CompressionTypes.GZIP,
  acks: -1,       // Equivalent to 'ALL' in broker protocol
  timeout: 30000,
  messages: [{
    key: "TX_839021",
    value: JSON.stringify({ amount: 14500, currency: "USD" })
  }]
});`;

export default function LessonContentTabs({
  lessonContent,
  lessonResources = [],
  courseId,
  lessonTitle,
}: LessonContentTabsProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "terminal" | "discussion" | "resources"
  >("overview");
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const [checkpointRevealed, setCheckpointRevealed] = useState<boolean>(false);
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "$ kafka-topics --bootstrap-server localhost:9092 --list",
    "core.financial.ledger",
    "telemetry.stream.events",
    "user.activity.log",
    "$ ",
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(KAFKA_CODE);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleTerminalSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    let output = "";
    if (cmd.includes("kafka-topics") && cmd.includes("--list")) {
      output = "core.financial.ledger\ntelemetry.stream.events\nuser.activity.log";
    } else if (cmd.includes("--describe")) {
      output =
        "Topic: core.financial.ledger\n  Partition 0: Leader: 1, Replicas: 1,2,3, Isr: 1,2\n  Partition 1: Leader: 2, Replicas: 2,3,1, Isr: 2,3";
    } else if (cmd.includes("help") || cmd === "?") {
      output = "Commands: kafka-topics --list | --describe | --create\nkafka-console-producer | kafka-console-consumer";
    } else {
      output = `bash: ${cmd}: command not found (try 'kafka-topics --list')`;
    }
    setTerminalHistory((prev) => [...prev.slice(0, -1), `$ ${cmd}`, output, "$ "]);
    setTerminalInput("");
  };

  const tabBtnClass = (tab: string) =>
    `flex items-center gap-2 px-4 py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
      activeSubTab === tab
        ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
        : "border-transparent text-slate-400 hover:text-slate-200"
    }`;

  return (
    <div className="flex flex-col gap-6">
      {/* TAB HEADER */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button onClick={() => setActiveSubTab("overview")} className={tabBtnClass("overview")}>
          <FileText className="h-4 w-4" />
          Overview
        </button>
        <button onClick={() => setActiveSubTab("terminal")} className={tabBtnClass("terminal")}>
          <TerminalIcon className="h-4 w-4" />
          Live Terminal
        </button>
        <button onClick={() => setActiveSubTab("resources")} className={tabBtnClass("resources")}>
          <Download className="h-4 w-4" />
          Resources
          {lessonResources.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/30 text-indigo-300">
              {lessonResources.length}
            </span>
          )}
        </button>
        <button onClick={() => setActiveSubTab("discussion")} className={tabBtnClass("discussion")}>
          <MessageSquare className="h-4 w-4" />
          Discussion
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Lesson content from DB */}
          {lessonContent && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                Lesson Overview
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{lessonContent}</p>
            </div>
          )}

          {/* Performance Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Producer Throughput", value: "1.2M msg/s", delta: "+8%", color: "emerald" },
              { label: "P99 Latency", value: "3.2ms", delta: "-14%", color: "indigo" },
              { label: "Replication Lag", value: "18ms", delta: "+2ms", color: "amber" },
              { label: "ISR Pool Size", value: "2 / 3", delta: "healthy", color: "violet" },
            ].map(({ label, value, delta, color }) => (
              <div
                key={label}
                className={`p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-${color}-500/30 transition`}
              >
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mb-1">
                  {label}
                </div>
                <div className="text-xl font-bold text-white">{value}</div>
                <div className={`text-[11px] font-semibold mt-1 text-${color}-400`}>{delta}</div>
              </div>
            ))}
          </div>

          {/* Code Snippet */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileCode className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-bold text-white">Producer Configuration — TypeScript</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30">
                  kafkajs v2
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              >
                {codeCopied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed text-slate-200 font-mono">
              <code>{KAFKA_CODE}</code>
            </pre>
          </div>

          {/* Quick Checkpoint */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-300">Comprehension Checkpoint</h4>
            </div>
            <p className="text-sm text-slate-300">
              If a Kafka broker with the partition leader crashes, which replica takes over leadership?
            </p>
            {!checkpointRevealed ? (
              <button
                onClick={() => setCheckpointRevealed(true)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
              >
                Reveal Answer
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  The broker controller promotes the first In-Sync Replica (ISR) from the ISR pool — specifically the replica with the highest fetch offset — as the new partition leader through a controller epoch bump.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIVE TERMINAL TAB */}
      {activeSubTab === "terminal" && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs text-slate-400 font-mono ml-2">
              kafka-broker-01 — bash — Auspify Terminal
            </span>
          </div>
          <div className="p-4 font-mono text-xs text-emerald-300 leading-relaxed min-h-[220px] max-h-72 overflow-y-auto space-y-1">
            {terminalHistory.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-emerald-300" : "text-slate-300"}>
                {line}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 flex items-center px-4 py-2 gap-2">
            <span className="font-mono text-emerald-400 text-xs">$</span>
            <input
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalSubmit}
              placeholder="kafka-topics --bootstrap-server localhost:9092 --list"
              className="flex-1 bg-transparent font-mono text-xs text-white outline-none placeholder-slate-600"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* RESOURCES TAB */}
      {activeSubTab === "resources" && (
        <div className="space-y-3">
          {lessonResources.length > 0 ? (
            lessonResources.map((resource, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-sm text-slate-200 font-medium">{resource}</span>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500 transition cursor-pointer group-hover:border-indigo-500/50">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </button>
              </div>
            ))
          ) : (
            // Fallback default resources
            [
              "Kafka Broker Topology Cheatsheet (PDF)",
              "Confluent Producer Benchmarking Guide",
              "Interactive Partition Quorum Visualizer",
              "Auspify Distributed Systems Architecture Reference",
            ].map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-sm text-slate-200 font-medium">{r}</span>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* DISCUSSION TAB */}
      {activeSubTab === "discussion" && (
        <div className="space-y-4">
          {[
            {
              user: "Alex J.",
              time: "2 hours ago",
              text: "The high-watermark animation at 09:30 is incredibly clear. Finally understood why acks=-1 is critical for financial ledgers!",
              likes: 14,
            },
            {
              user: "Maria K.",
              time: "5 hours ago",
              text: "Question: does KRaft mode change how ISR election works compared to ZooKeeper-based clusters?",
              likes: 8,
            },
            {
              user: "Dr. Elena R.",
              time: "3 hours ago",
              text: "Great question Maria! KRaft eliminates ZooKeeper's network round-trip from the election path, reducing controller failover from ~30s to under 1s. See Module 4.2 for the deep dive.",
              likes: 22,
              isInstructor: true,
            },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    c.isInstructor
                      ? "bg-gradient-to-tr from-indigo-500 to-pink-500 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {c.user.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white">{c.user}</span>
                {c.isInstructor && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    INSTRUCTOR
                  </span>
                )}
                <span className="ml-auto text-[11px] text-slate-500">{c.time}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{c.text}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>👍</span>
                <span>{c.likes} likes</span>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 border-dashed text-center text-xs text-slate-500">
            Sign in to join the discussion
          </div>
        </div>
      )}
    </div>
  );
}
