"use client";

import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changePeriod?: string;
  accentColor: string;
  icon: React.ReactNode;
  sparkData: number[];
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80, H = 32;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const fill = `${line} L${W},${H} L0,${H} Z`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <path d={fill} fill={color} opacity="0.10" />
      <path d={line} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KPICard({ title, value, change, changePeriod = "vs last month", accentColor, icon, sparkData }: KPICardProps) {
  const positive = change >= 0;

  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${accentColor}55, ${accentColor}cc, ${accentColor}33)` }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}25` }}
        >
          {icon}
        </div>
        <Sparkline data={sparkData} color={accentColor} />
      </div>

      <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
        {title}
      </p>
      <p
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      <div className="flex items-center gap-1.5">
        <span
          className="flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full"
          style={{
            background: positive ? "var(--green-dim)" : "var(--error-dim)",
            color: positive ? "var(--green)" : "var(--error)",
          }}
        >
          {positive ? "↑" : "↓"} {Math.abs(change)}%
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{changePeriod}</span>
      </div>
    </div>
  );
}
