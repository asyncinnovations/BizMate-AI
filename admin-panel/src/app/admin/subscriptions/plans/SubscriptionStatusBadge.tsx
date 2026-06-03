"use client";

import React from "react";
import type { SubscriptionStatus, PlanStatus, InvoiceStatus } from "@/modules/subscriptions/types";

type AnyStatus = SubscriptionStatus | PlanStatus | InvoiceStatus;

const STATUS_MAP: Record<string, { bg: string; color: string; label?: string }> = {
  active:         { bg: "rgba(16,185,129,0.10)",  color: "#10B981" },
  trialing:       { bg: "rgba(59,130,246,0.10)",  color: "#3B82F6", label: "Trial" },
  past_due:       { bg: "rgba(245,158,11,0.10)",  color: "#F59E0B", label: "Past Due" },
  canceled:       { bg: "rgba(239,68,68,0.10)",   color: "#EF4444" },
  paused:         { bg: "rgba(148,163,184,0.12)", color: "#94A3B8" },
  unpaid:         { bg: "rgba(239,68,68,0.10)",   color: "#EF4444" },
  draft:          { bg: "rgba(148,163,184,0.12)", color: "#94A3B8" },
  archived:       { bg: "rgba(148,163,184,0.12)", color: "#94A3B8" },
  paid:           { bg: "rgba(16,185,129,0.10)",  color: "#10B981" },
  open:           { bg: "rgba(245,158,11,0.10)",  color: "#F59E0B" },
  void:           { bg: "rgba(148,163,184,0.12)", color: "#94A3B8" },
  uncollectible:  { bg: "rgba(239,68,68,0.10)",   color: "#EF4444" },
};

export default function SubscriptionStatusBadge({ status }: { status: AnyStatus }) {
  const s = STATUS_MAP[status] ?? { bg: "rgba(148,163,184,0.12)", color: "#94A3B8" };
  const label = s.label ?? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
      {label}
    </span>
  );
}
