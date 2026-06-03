"use client";

import React from "react";

const AI_MODULES = [
  { name: "AI Assistant",   used: 1200000, limit: 2000000, color: "#8B5CF6" },
  { name: "Smart Invoicing", used: 480000,  limit: 800000,  color: "var(--accent)" },
  { name: "Auto Reply Hub",  used: 620000,  limit: 1000000, color: "#06B6D4" },
  { name: "Advisory AI",    used: 140000,  limit: 500000,  color: "#10B981" },
];

function UsageBar({ used, limit, color }: { used: number; limit: number; color: string }) {
  const pct = Math.round((used / limit) * 100);
  const warn = pct >= 80;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          {(used / 1000000).toFixed(2)}M / {(limit / 1000000).toFixed(1)}M tokens
        </span>
        <span
          className="text-[10px] font-semibold"
          style={{ color: warn ? "var(--error)" : "var(--text-secondary)" }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: warn ? "var(--error)" : color,
          }}
        />
      </div>
    </div>
  );
}

export default function AIUsagePanel() {
  const totalUsed = AI_MODULES.reduce((s, m) => s + m.used, 0);
  const totalLimit = AI_MODULES.reduce((s, m) => s + m.limit, 0);

  return (
    <div
      className="rounded-xl h-full"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: "#8B5CF6" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            AI Usage
          </h3>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>This month</span>
      </div>

      <div className="px-4 py-4">
        {/* Total ring */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--bg-hover)" strokeWidth="8" />
              <circle
                cx="32" cy="32" r="26" fill="none"
                stroke="#8B5CF6"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - totalUsed / totalLimit)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-bold"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              {Math.round((totalUsed / totalLimit) * 100)}%
            </span>
          </div>
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Tokens Used</p>
            <p className="text-lg font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {(totalUsed / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              of {(totalLimit / 1000000).toFixed(1)}M monthly limit
            </p>
          </div>
        </div>

        {/* Per-module */}
        <div className="space-y-3.5">
          {AI_MODULES.map((m) => (
            <div key={m.name}>
              <div className="flex justify-between mb-1">
                <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{m.name}</p>
              </div>
              <UsageBar used={m.used} limit={m.limit} color={m.color} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <a
          href="/admin/ai-control"
          className="flex items-center justify-center w-full py-2 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: "rgba(139,92,246,0.08)",
            color: "#8B5CF6",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.14)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.08)")}
        >
          Manage AI Limits →
        </a>
      </div>
    </div>
  );
}
