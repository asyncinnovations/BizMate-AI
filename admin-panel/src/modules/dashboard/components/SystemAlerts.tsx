"use client";

import React from "react";

const ALERTS = [
  { id: 1, level: "critical", title: "AI credit limit near",   desc: "Business #2041 at 92% usage",          time: "2m ago" },
  { id: 2, level: "warning",  title: "Failed doc generation",  desc: "Timeout × 3 for template ID #094",     time: "18m ago" },
  { id: 3, level: "info",     title: "New support ticket",     desc: "Invoice sync error reported",          time: "34m ago" },
  { id: 4, level: "warning",  title: "Subscription past due",  desc: "BizCo LLC — 3 days overdue",           time: "1h ago" },
  { id: 5, level: "info",     title: "New business registered", desc: "Al Rahma Trading LLC onboarded",      time: "2h ago" },
];

const LEVEL_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  critical: { bg: "var(--error-dim)",  color: "var(--error)",   dot: "var(--error)" },
  warning:  { bg: "var(--amber-dim)",  color: "var(--amber)",   dot: "var(--amber)" },
  info:     { bg: "var(--blue-dim)",   color: "var(--blue)",    dot: "var(--blue)" },
};

export default function SystemAlerts() {
  return (
    <div
      className="rounded-xl h-full"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--error)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            System Alerts
          </h3>
        </div>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: "var(--error-dim)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {ALERTS.filter((a) => a.level === "critical" || a.level === "warning").length} active
        </span>
      </div>

      <div className="divide-y" style={{ "--tw-divide-color": "var(--border)" } as React.CSSProperties}>
        {ALERTS.map((a) => {
          const s = LEVEL_STYLES[a.level];
          return (
            <div
              key={a.id}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: s.dot }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{a.title}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>{a.desc}</p>
              </div>
              <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }}>{a.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
