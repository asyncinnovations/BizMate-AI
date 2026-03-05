"use client";

import React from "react";
import { BarChart3 } from "lucide-react";

interface License {
  status: "active" | "expired" | "renewal_pending" | "suspended";
  expiry_date: string;
}

const getDaysRemaining = (expiry: string) =>
  Math.floor((new Date(expiry).getTime() - Date.now()) / 86400000);

export default function ComplianceHealthBar({
  licenses,
}: {
  licenses: License[];
}) {
  if (licenses.length === 0) return null;

  // Mutually exclusive buckets — no double counting
  const expired = licenses.filter(
    (l) => l.status === "expired" || l.status === "suspended",
  ).length;
  const pending = licenses.filter((l) => l.status === "renewal_pending").length;
  const expiring = licenses.filter(
    (l) => l.status === "active" && getDaysRemaining(l.expiry_date) <= 30,
  ).length;
  const active = licenses.filter(
    (l) => l.status === "active" && getDaysRemaining(l.expiry_date) > 30,
  ).length;

  // Health score: healthy active = full credit, expiring soon = half credit, expired/pending/suspended = 0
  const pct = Math.round(((active + expiring * 0.5) / licenses.length) * 100);

  return (
    <div className="bg-nav rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-nav-text-muted font-medium uppercase tracking-widest mb-1">
            Compliance Health
          </p>
          <p className="text-3xl font-bold tracking-tight text-nav-text">
            {pct}%
          </p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
          <BarChart3 className="w-7 h-7 text-nav-text" />
        </div>
      </div>
      <div className="flex gap-1 mb-3 h-2">
        {active > 0 && (
          <div
            className="bg-status-success rounded-full"
            style={{ flex: active }}
          />
        )}
        {expiring > 0 && (
          <div
            className="bg-status-warning rounded-full"
            style={{ flex: expiring }}
          />
        )}
        {pending > 0 && (
          <div
            className="bg-status-info rounded-full"
            style={{ flex: pending }}
          />
        )}
        {expired > 0 && (
          <div
            className="bg-status-error rounded-full"
            style={{ flex: expired }}
          />
        )}
      </div>
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs">
        {active > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-success" />
            <span className="text-nav-text-muted">{active} Active</span>
          </span>
        )}
        {expiring > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-warning" />
            <span className="text-nav-text-muted">{expiring} Expiring</span>
          </span>
        )}
        {pending > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-info" />
            <span className="text-nav-text-muted">{pending} Pending</span>
          </span>
        )}
        {expired > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-error" />
            <span className="text-nav-text-muted">{expired} Expired</span>
          </span>
        )}
      </div>
    </div>
  );
}
