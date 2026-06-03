"use client";

import React, { useState } from "react";

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const DATA = [
  { month: "Oct", mrr: 38200, new: 4200, churned: 1800 },
  { month: "Nov", mrr: 41500, new: 5100, churned: 1800 },
  { month: "Dec", mrr: 43800, new: 3800, churned: 1500 },
  { month: "Jan", mrr: 46200, new: 4900, churned: 2500 },
  { month: "Feb", mrr: 48100, new: 3400, churned: 1500 },
  { month: "Mar", mrr: 50900, new: 5200, churned: 2400 },
  { month: "Apr", mrr: 52300, new: 4600, churned: 3200 },
];

export default function RevenueChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(...DATA.map((d) => d.mrr));

  const W = 540, H = 160, PAD = { top: 12, bottom: 28, left: 8, right: 8 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const pts = DATA.map((d, i) => ({
    x: PAD.left + (i / (DATA.length - 1)) * cW,
    y: PAD.top + cH - (d.mrr / maxVal) * cH,
    data: d, i,
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const fillPath = `${line} L${pts[pts.length - 1].x},${H - PAD.bottom} L${pts[0].x},${H - PAD.bottom} Z`;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            Revenue Overview
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Monthly Recurring Revenue · last 7 months</p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: "MRR", color: "var(--accent)" },
            { label: "New MRR", color: "var(--green)" },
            { label: "Churned", color: "var(--error)" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-hidden" style={{ minHeight: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
          <defs>
            <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fill */}
          <path d={fillPath} fill="url(#mrrGrad)" />
          {/* Line */}
          <path d={line} stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {pts.map((p) => (
            <g key={p.i} onMouseEnter={() => setHovered(p.i)} onMouseLeave={() => setHovered(null)}>
              <circle cx={p.x} cy={p.y} r="10" fill="transparent" style={{ cursor: "pointer" }} />
              <circle
                cx={p.x} cy={p.y}
                r={hovered === p.i ? 4.5 : 3}
                fill="var(--accent)"
                stroke="var(--bg-surface)"
                strokeWidth="2"
                style={{ transition: "r 0.15s" }}
              />
              {hovered === p.i && (
                <g>
                  <rect
                    x={Math.min(p.x - 44, W - 96)} y={p.y - 44} width={92} height={36}
                    rx="6" fill="var(--bg-panel)" stroke="var(--border)" strokeWidth="1"
                    style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}
                  />
                  <text x={Math.min(p.x, W - 52)} y={p.y - 30} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontFamily="var(--font-body)">
                    {p.data.month}
                  </text>
                  <text x={Math.min(p.x, W - 52)} y={p.y - 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-primary)" fontFamily="var(--font-body)">
                    ${(p.data.mrr / 1000).toFixed(1)}k
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {pts.map((p) => (
            <text key={p.i} x={p.x} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontFamily="var(--font-body)">
              {p.data.month}
            </text>
          ))}
        </svg>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { label: "Current MRR", value: "$52.3k", change: "+2.8%", color: "var(--accent)" },
          { label: "New MRR",     value: "$4.6k",  change: "+4.5%", color: "var(--green)" },
          { label: "Churn MRR",   value: "$3.2k",  change: "+4.3%", color: "var(--error)" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            <p className="text-base font-bold mt-0.5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {s.value}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: s.color }}>{s.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
