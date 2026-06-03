"use client";
import React from "react";
import type { SubscriptionMetrics } from "@/modules/subscriptions/types";

const CARDS = (m: SubscriptionMetrics) => [
  { label:"Monthly Recurring Revenue", value:`$${(m.mrr/1000).toFixed(1)}k`, sub:`+${m.mrrGrowth}% vs last month`, color:"var(--green)",  subColor:"var(--green)",
    icon:<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h16" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/></svg> },
  { label:"Annual Run Rate",    value:`$${(m.arr/1000).toFixed(0)}k`, sub:"Projected ARR", color:"var(--accent)", subColor:"var(--text-muted)",
    icon:<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 16l4.5-6L10 13l3.5-8L18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label:"Active Subscriptions",value:m.activeSubscriptions.toLocaleString(), sub:`+${m.newThisMonth} new this month`, color:"var(--blue)", subColor:"var(--green)",
    icon:<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { label:"Churn Rate", value:`${m.churnRate}%`, sub:`${m.canceledThisMonth} canceled`, color:"var(--red)", subColor:"var(--red)",
    icon:<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 16l12-12M4 4l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { label:"Avg Revenue / User", value:`$${m.arpu.toFixed(0)}`, sub:"Per active subscription", color:"var(--amber)", subColor:"var(--text-muted)",
    icon:<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { label:"Active Trials", value:m.trialingSubscriptions.toString(), sub:"Free trial users", color:"#8B5CF6", subColor:"var(--text-muted)",
    icon:<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
];

export default function SubscriptionStats({ metrics }: { metrics: SubscriptionMetrics }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:20 }}>
      {CARDS(metrics).map(c => (
        <div key={c.label} style={{ background:"var(--bg-surface)", border:"1.5px solid var(--border)",
          borderRadius:"var(--radius-lg)", padding:"14px 16px", boxShadow:"var(--shadow-sm)",
          position:"relative", overflow:"hidden",
          transition:"box-shadow 0.2s, border-color 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--shadow-md)";e.currentTarget.style.borderColor="var(--border-mid)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="var(--shadow-sm)";e.currentTarget.style.borderColor="var(--border)";}}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
            background:`linear-gradient(90deg,${c.color}55,${c.color}cc,${c.color}33)` }}/>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ width:34,height:34,borderRadius:9,background:`${c.color}14`,color:c.color,
              display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${c.color}22` }}>
              {c.icon}
            </div>
          </div>
          <div style={{ fontSize:11,color:"var(--text-muted)",marginBottom:4,fontFamily:"var(--font-body)" }}>{c.label}</div>
          <div style={{ fontSize:22,fontWeight:800,color:"var(--text-primary)",fontFamily:"var(--font-display)",
            letterSpacing:"-0.025em",lineHeight:1.1,marginBottom:4 }}>{c.value}</div>
          <div style={{ fontSize:11,color:c.subColor,fontWeight:500 }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
