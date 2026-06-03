"use client";

import React from "react";

const ACTIVITY = [
  { id: 1, action: "New user registered",      actor: "Hassan Al-Rashid",    meta: "via Google OAuth",          time: "5m ago",  type: "user" },
  { id: 2, action: "Subscription upgraded",    actor: "Bright Futures LLC",  meta: "Starter → Pro",             time: "22m ago", type: "billing" },
  { id: 3, action: "Invoice generated",        actor: "Al Noor Trading",     meta: "INV-2024-0041 · $2,400",    time: "44m ago", type: "invoice" },
  { id: 4, action: "AI usage limit adjusted",  actor: "Admin",               meta: "+50k credits for #2041",    time: "1h ago",  type: "ai" },
  { id: 5, action: "Document template added",  actor: "Admin",               meta: "UAE Trade License v2",      time: "2h ago",  type: "doc" },
  { id: 6, action: "Business suspended",       actor: "Admin",               meta: "Compliance violation",      time: "3h ago",  type: "alert" },
];

const TYPE_COLORS: Record<string, string> = {
  user:    "#3B82F6",
  billing: "#10B981",
  invoice: "#E8690A",
  ai:      "#8B5CF6",
  doc:     "#06B6D4",
  alert:   "#EF4444",
};

export default function RecentActivity() {
  return (
    <div
      className="rounded-xl h-full"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          Recent Activity
        </h3>
        <a href="/admin/users" className="text-xs font-medium" style={{ color: "var(--accent)" }}>
          View all →
        </a>
      </div>

      <div>
        {ACTIVITY.map((a, i) => (
          <div
            key={a.id}
            className="flex items-start gap-3 px-4 py-2.5 relative cursor-pointer transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Timeline line */}
            {i < ACTIVITY.length - 1 && (
              <div
                className="absolute left-[22px] top-7 w-px"
                style={{ height: "calc(100% - 4px)", background: "var(--border)" }}
              />
            )}
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 mt-1 relative z-10"
              style={{ background: TYPE_COLORS[a.type] ?? "#94A3B8", border: "2px solid var(--bg-surface)" }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{a.action}</p>
              <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                <span className="font-medium">{a.actor}</span> · {a.meta}
              </p>
            </div>
            <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
