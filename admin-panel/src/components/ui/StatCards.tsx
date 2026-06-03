"use client";
import React from "react";

export interface StatCardItem {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
  color: string;
  icon?: React.ReactNode;
  trend?: number;
  sparkData?: number[];
}

function Spark({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const W = 72, H = 28;
  const pts = data.map((v,i) => ({
    x: (i/(data.length-1))*W,
    y: H - ((v-min)/range)*(H-4) - 2,
  }));
  const line = pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" style={{ flexShrink:0 }}>
      <path d={`${line} L${W},${H} L0,${H} Z`} fill={color} opacity="0.10"/>
      <path d={line} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function StatCards({ items, cols = 4 }: { items: StatCardItem[]; cols?: 2|3|4 }) {
  const gridCols = { 2:"repeat(2,1fr)", 3:"repeat(3,1fr)", 4:"repeat(4,1fr)" }[cols];

  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit, minmax(180px, 1fr))`, gap:12, marginBottom:20 }}>
      {items.map((s) => (
        <div key={s.label} className="stat-card card-hover">
          <div className="stat-card-accent" style={{ background:`linear-gradient(90deg, ${s.color}88, ${s.color}dd, ${s.color}44)` }}/>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10, gap:8 }}>
            {s.icon
              ? <div style={{ width:34, height:34, borderRadius:9, background:`${s.color}14`,
                  color:s.color, border:`1.5px solid ${s.color}22`,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {s.icon}
                </div>
              : <div/>
            }
            {s.sparkData && <Spark data={s.sparkData} color={s.color}/>}
          </div>
          <div style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"var(--font-body)", marginBottom:4 }}>{s.label}</div>
          <div style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", fontFamily:"var(--font-display)",
            letterSpacing:"-0.02em", lineHeight:1.1, marginBottom: s.sub?4:0 }}>
            {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
          </div>
          {s.sub && (
            <div style={{ fontSize:11, color:s.subColor??s.color, fontWeight:500, fontFamily:"var(--font-body)" }}>
              {s.sub}
            </div>
          )}
          {s.trend !== undefined && (
            <div style={{ display:"inline-flex", alignItems:"center", gap:3, marginTop:4,
              fontSize:11, fontWeight:600, padding:"1px 6px", borderRadius:100,
              background: s.trend>=0?"var(--green-dim)":"var(--red-dim)",
              color: s.trend>=0?"var(--green)":"var(--red)" }}>
              {s.trend>=0?"↑":"↓"} {Math.abs(s.trend)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
