// "use client";

// import React, { useState } from "react";
// import { REVENUE_TREND, MOCK_PLANS } from "@/modules/subscriptions/data";

// function formatK(n: number) {
//   return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
// }

// // ─── MRR Trend Chart ─────────────────────────────────────────────────
// function MRRTrendChart() {
//   const [hovered, setHovered] = useState<number | null>(null);
//   const maxMrr = Math.max(...REVENUE_TREND.map((d) => d.mrr));

//   const W = 540;
//   const H = 160;
//   const PAD = { top: 16, bottom: 30, left: 8, right: 8 };
//   const chartW = W - PAD.left - PAD.right;
//   const chartH = H - PAD.top - PAD.bottom;

//   const pts = REVENUE_TREND.map((d, i) => ({
//     x: PAD.left + (i / (REVENUE_TREND.length - 1)) * chartW,
//     y: PAD.top + chartH - (d.mrr / maxMrr) * chartH,
//     data: d,
//     i,
//   }));

//   const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
//   const fillPoly = [
//     ...pts.map((p) => `${p.x},${p.y}`),
//     `${pts[pts.length - 1].x},${H - PAD.bottom}`,
//     `${pts[0].x},${H - PAD.bottom}`,
//   ].join(" ");

//   return (
//     <div
//       className="rounded-2xl p-5"
//       style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
//             MRR Trend
//           </h3>
//           <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
//             Last 7 months
//           </p>
//         </div>
//         <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
//           <span className="flex items-center gap-1.5">
//             <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#00c97d" }} />
//             MRR
//           </span>
//           <span className="flex items-center gap-1.5">
//             <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#1a6fff" }} />
//             New MRR
//           </span>
//         </div>
//       </div>

//       <svg
//         width="100%"
//         viewBox={`0 0 ${W} ${H + 4}`}
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         style={{ minWidth: "280px", overflow: "visible" }}
//       >
//         <defs>
//           <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor="#00c97d" stopOpacity="0.22" />
//             <stop offset="100%" stopColor="#00c97d" stopOpacity="0" />
//           </linearGradient>
//         </defs>

//         {/* Grid lines */}
//         {[0.25, 0.5, 0.75, 1].map((pct) => {
//           const y = PAD.top + chartH - pct * chartH;
//           return (
//             <g key={pct}>
//               <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
//                 stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 6" />
//               <text x={W - PAD.right} y={y - 3} textAnchor="end"
//                 fill="rgba(120,152,184,0.5)" fontSize="9" fontFamily="Outfit,sans-serif">
//                 {formatK(maxMrr * pct)}
//               </text>
//             </g>
//           );
//         })}

//         {/* Area fill */}
//         <polygon points={fillPoly} fill="url(#mrrGrad)" />

//         {/* Line */}
//         <polyline
//           points={polyline}
//           stroke="#00c97d"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           fill="none"
//         />

//         {/* New MRR bars at bottom */}
//         {pts.map((p) => {
//           const barH = (p.data.newMrr / maxMrr) * chartH * 0.3;
//           return (
//             <rect
//               key={p.i}
//               x={p.x - 8}
//               y={H - PAD.bottom - barH}
//               width={16}
//               height={barH}
//               rx="2"
//               fill="#1a6fff"
//               opacity="0.5"
//             />
//           );
//         })}

//         {/* Dots + hover */}
//         {pts.map((p) => (
//           <g
//             key={p.i}
//             onMouseEnter={() => setHovered(p.i)}
//             onMouseLeave={() => setHovered(null)}
//             style={{ cursor: "pointer" }}
//           >
//             <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
//             <circle cx={p.x} cy={p.y} r={hovered === p.i ? 5 : 3.5}
//               fill={hovered === p.i ? "#00c97d" : "#070d1b"}
//               stroke="#00c97d"
//               strokeWidth={hovered === p.i ? 2.5 : 1.5}
//             />
//             {hovered === p.i && (
//               <g>
//                 <rect x={p.x - 42} y={p.y - 48} width={84} height={40} rx="6"
//                   fill="#111d30" stroke="rgba(0,201,125,0.35)" strokeWidth="1" />
//                 <text x={p.x} y={p.y - 31} textAnchor="middle"
//                   fill="#eef4ff" fontSize="10" fontWeight="600" fontFamily="Outfit,sans-serif">
//                   {formatK(p.data.mrr)}
//                 </text>
//                 <text x={p.x} y={p.y - 16} textAnchor="middle"
//                   fill="#7898b8" fontSize="9" fontFamily="Outfit,sans-serif">
//                   +{formatK(p.data.newMrr)} new
//                 </text>
//               </g>
//             )}
//             {/* Month label */}
//             <text x={p.x} y={H + 2} textAnchor="middle"
//               fill={hovered === p.i ? "#eef4ff" : "rgba(120,152,184,0.65)"}
//               fontSize="10" fontFamily="Outfit,sans-serif">
//               {p.data.month}
//             </text>
//           </g>
//         ))}

//         <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom}
//           stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
//       </svg>
//     </div>
//   );
// }

// // ─── Plan Distribution ─────────────────────────────────────────────────
// function PlanDistribution() {
//   const plans = MOCK_PLANS.filter((p) => p.status === "active");
//   const totalMrr = plans.reduce((s, p) => s + p.mrr, 0);
//   const colors: Record<string, string> = {
//     starter: "#7898b8",
//     pro: "#1a6fff",
//     enterprise: "#f5a623",
//     custom: "#a855f7",
//   };

//   return (
//     <div
//       className="rounded-2xl p-5"
//       style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
//     >
//       <h3
//         className="text-sm font-semibold mb-4"
//         style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
//       >
//         Revenue by Plan
//       </h3>

//       {/* Stacked bar */}
//       <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
//         {plans.map((p) => (
//           <div
//             key={p.id}
//             className="rounded-full transition-all"
//             style={{
//               width: `${(p.mrr / totalMrr) * 100}%`,
//               background: colors[p.tier] ?? "#7898b8",
//             }}
//             title={`${p.name}: ${((p.mrr / totalMrr) * 100).toFixed(1)}%`}
//           />
//         ))}
//       </div>

//       {/* Legend rows */}
//       <div className="space-y-3">
//         {plans.map((p) => {
//           const pct = ((p.mrr / totalMrr) * 100).toFixed(1);
//           const color = colors[p.tier] ?? "#7898b8";
//           return (
//             <div key={p.id} className="flex items-center gap-2.5">
//               <span
//                 className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
//                 style={{ background: color }}
//               />
//               <span className="text-xs flex-1 truncate" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
//                 {p.name}
//               </span>
//               <span className="text-xs font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
//                 ${p.mrr.toLocaleString()}
//               </span>
//               <span
//                 className="text-[10px] px-1.5 py-0.5 rounded font-medium w-10 text-right"
//                 style={{ color, background: `${color}15`, fontFamily: "var(--font-body)" }}
//               >
//                 {pct}%
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* Total */}
//       <div
//         className="flex items-center justify-between mt-4 pt-4"
//         style={{ borderTop: "1px solid var(--border)" }}
//       >
//         <span className="text-xs" style={{ color: "var(--text-muted)" }}>Total MRR</span>
//         <span
//           className="text-base font-bold"
//           style={{ fontFamily: "var(--font-display)", color: "#00c97d" }}
//         >
//           ${totalMrr.toLocaleString()}
//         </span>
//       </div>
//     </div>
//   );
// }

// export default function RevenueCharts() {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
//       <div className="lg:col-span-2">
//         <MRRTrendChart />
//       </div>
//       <div>
//         <PlanDistribution />
//       </div>
//     </div>
//   );
// }