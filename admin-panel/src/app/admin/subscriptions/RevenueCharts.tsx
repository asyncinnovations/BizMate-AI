"use client";

import React, { useState } from "react";
import { REVENUE_TREND, MOCK_PLANS } from "@/modules/subscriptions/data";

function formatK(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

function MRRTrendChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxMrr = Math.max(...REVENUE_TREND.map((d) => d.mrr));

  const W = 540, H = 160, PAD = { top: 16, bottom: 30, left: 8, right: 8 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const pts = REVENUE_TREND.map((d, i) => ({
    x: PAD.left + (i / (REVENUE_TREND.length - 1)) * chartW,
    y: PAD.top + chartH - (d.mrr / maxMrr) * chartH,
    data: d, i,
  }));

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const fillPoly = [
    ...pts.map((p) => `${p.x},${p.y}`),
    `${pts[pts.length - 1].x},${H - PAD.bottom}`,
    `${pts[0].x},${H - PAD.bottom}`,
  ].join(" ");

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>MRR Trend</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Last 7 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
          {[
            { label: "MRR",        color: "var(--accent)" },
            { label: "New MRR",    color: "var(--green)" },
            { label: "Churned",    color: "var(--error)" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
          <defs>
            <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={fillPoly} fill="url(#mrrFill)" />
          <polyline points={polyline} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {pts.map((p) => (
            <g key={p.i} onMouseEnter={() => setHovered(p.i)} onMouseLeave={() => setHovered(null)}>
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" style={{ cursor: "pointer" }} />
              <circle cx={p.x} cy={p.y} r={hovered === p.i ? 5 : 3.5} fill="var(--accent)" stroke="var(--bg-surface)" strokeWidth="2" style={{ transition: "r 0.15s" }} />
              {hovered === p.i && (
                <g>
                  <rect x={Math.min(p.x - 48, W - 104)} y={p.y - 46} width={100} height={38} rx="6"
                    fill="var(--bg-panel)" stroke="var(--border)" strokeWidth="1"
                    style={{ filter: "drop-shadow(0 2px 8px rgba(15,23,42,0.12))" }} />
                  <text x={Math.min(p.x, W - 54) + 2} y={p.y - 32} textAnchor="middle" fontSize="9.5" fill="var(--text-muted)" fontFamily="var(--font-body)">{p.data.month}</text>
                  <text x={Math.min(p.x, W - 54) + 2} y={p.y - 17} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)" fontFamily="var(--font-body)">{formatK(p.data.mrr)}</text>
                </g>
              )}
            </g>
          ))}

          {pts.map((p) => (
            <text key={p.i} x={p.x} y={H - 4} textAnchor="middle" fontSize="9.5" fill="var(--text-muted)" fontFamily="var(--font-body)">{p.data.month}</text>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { label: "Net New MRR",  value: formatK(REVENUE_TREND[REVENUE_TREND.length - 1].newMrr),     color: "var(--green)" },
          { label: "Churned MRR", value: formatK(REVENUE_TREND[REVENUE_TREND.length - 1].churnedMrr),  color: "var(--error)" },
          { label: "Net MRR",     value: formatK(REVENUE_TREND[REVENUE_TREND.length - 1].netMrr),      color: "var(--accent)" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            <p className="text-base font-bold mt-0.5" style={{ color: s.color, fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanBreakdown() {
  const plans = MOCK_PLANS.filter((p) => p.status === "active");
  const totalSubs = plans.reduce((s, p) => s + p.subscriberCount, 0);

  const TIER_COLORS: Record<string, string> = {
    starter:    "#64748B",
    pro:        "#3B82F6",
    enterprise: "var(--accent)",
    custom:     "#8B5CF6",
  };

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Plan Breakdown</h3>
      <div className="space-y-3">
        {plans.map((p) => {
          const pct = Math.round((p.subscriberCount / totalSubs) * 100);
          const c   = TIER_COLORS[p.tier] ?? "#94A3B8";
          return (
            <div key={p.id}>
              <div className="flex justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{p.name}</span>
                  {p.isPopular && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
                      Popular
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{p.subscriberCount}</span>
                  <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>({pct}%)</span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c, transition: "width 0.6s ease" }} />
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                ${p.monthlyPrice}/mo · MRR ${(p.mrr / 1000).toFixed(0)}k
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RevenueCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2"><MRRTrendChart /></div>
      <div><PlanBreakdown /></div>
    </div>
  );
}
