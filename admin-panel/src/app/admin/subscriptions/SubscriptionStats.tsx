// "use client";

// import React from "react";
// import type { SubscriptionMetrics } from "@/modules/subscriptions/types";

// interface MetricCardProps {
//   label: string;
//   value: string;
//   sub: string;
//   subColor?: string;
//   color: string;
//   icon: React.ReactNode;
// }

// function MetricCard({ label, value, sub, subColor, color, icon }: MetricCardProps) {
//   return (
//     <div
//       className="rounded-xl p-4 flex items-start gap-3 relative overflow-hidden"
//       style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
//     >
//       <div
//         className="absolute top-0 left-0 right-0 h-px"
//         style={{ background: `linear-gradient(90deg,transparent,${color}55,transparent)` }}
//       />
//       <div
//         className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none"
//         style={{ background: `radial-gradient(circle,${color}0d 0%,transparent 70%)` }}
//       />
//       <div
//         className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
//         style={{ background: `${color}18`, color, border: `1px solid ${color}28` }}
//       >
//         {icon}
//       </div>
//       <div className="min-w-0">
//         <p className="text-[10.5px]" style={{ color: "var(--text-muted)" }}>{label}</p>
//         <p
//           className="text-xl font-bold mt-0.5 truncate"
//           style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
//         >
//           {value}
//         </p>
//         <p className="text-[10.5px] mt-0.5" style={{ color: subColor ?? color }}>{sub}</p>
//       </div>
//     </div>
//   );
// }

// export default function SubscriptionStats({ metrics }: { metrics: SubscriptionMetrics }) {
//   return (
//     <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
//       <MetricCard
//         label="Monthly Recurring Revenue"
//         value={`$${(metrics.mrr / 1000).toFixed(1)}k`}
//         sub={`+${metrics.mrrGrowth}% vs last month`}
//         color="#00c97d"
//         icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h16" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>}
//       />
//       <MetricCard
//         label="Annual Run Rate"
//         value={`$${(metrics.arr / 1000).toFixed(0)}k`}
//         sub="Projected ARR"
//         color="#1a6fff"
//         icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M2 16l4.5-6L10 13l3.5-8L18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
//       />
//       <MetricCard
//         label="Active Subscriptions"
//         value={metrics.activeSubscriptions.toLocaleString()}
//         sub={`+${metrics.newThisMonth} new this month`}
//         color="#00c8e8"
//         icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
//       />
//       <MetricCard
//         label="Churn Rate"
//         value={`${metrics.churnRate}%`}
//         sub={`${metrics.canceledThisMonth} canceled this month`}
//         subColor="#ff6b80"
//         color="#ff4560"
//         icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M4 16l12-12M4 4l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
//       />
//       <MetricCard
//         label="Avg Revenue Per User"
//         value={`$${metrics.arpu.toFixed(0)}`}
//         sub="Per active subscription"
//         color="#f5a623"
//         icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 9l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
//       />
//       <MetricCard
//         label="Trialing"
//         value={metrics.trialingSubscriptions.toString()}
//         sub="Active free trials"
//         color="#a855f7"
//         icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
//       />
//     </div>
//   );
// }