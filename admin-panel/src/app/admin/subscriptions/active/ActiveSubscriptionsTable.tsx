// "use client";

// import React, { useState, useMemo } from "react";
// import Link from "next/link";
// import type { Subscription, SubscriptionStatus, PlanTier } from "@/modules/subscriptions/types";
// import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

// const TIER_COLORS: Record<PlanTier, { bg: string; color: string }> = {
//   starter:    { bg: "rgba(120,152,184,0.1)", color: "#7898b8" },
//   pro:        { bg: "rgba(26,111,255,0.1)",  color: "#6699ff" },
//   enterprise: { bg: "rgba(245,166,35,0.1)",  color: "#f5a623" },
//   custom:     { bg: "rgba(168,85,247,0.1)",  color: "#c084fc" },
// };

// function usageColor(pct: number) {
//   if (pct >= 90) return "#ff4560";
//   if (pct >= 70) return "#f5a623";
//   return "#00c97d";
// }

// function formatDate(s: string) {
//   if (s === "—") return s;
//   return new Date(s).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" });
// }

// interface ActiveSubscriptionsTableProps {
//   subscriptions: Subscription[];
// }

// const PAGE_SIZE = 8;

// export default function ActiveSubscriptionsTable({ subscriptions }: ActiveSubscriptionsTableProps) {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">("all");
//   const [tierFilter, setTierFilter] = useState<PlanTier | "all">("all");
//   const [page, setPage] = useState(1);

//   const filtered = useMemo(() => {
//     return subscriptions.filter((s) => {
//       if (search) {
//         const q = search.toLowerCase();
//         if (!s.businessName.toLowerCase().includes(q) && !s.planName.toLowerCase().includes(q)) return false;
//       }
//       if (statusFilter !== "all" && s.status !== statusFilter) return false;
//       if (tierFilter !== "all" && s.planTier !== tierFilter) return false;
//       return true;
//     });
//   }, [subscriptions, search, statusFilter, tierFilter]);

//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
//   const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const SELECT = {
//     background: "var(--bg-surface)",
//     border: "1px solid var(--border)",
//     color: "var(--text-secondary)",
//     borderRadius: "8px",
//     padding: "7px 10px",
//     fontSize: "12px",
//     fontFamily: "var(--font-body)",
//     outline: "none",
//     cursor: "pointer",
//   } as React.CSSProperties;

//   return (
//     <div>
//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-2.5 mb-4">
//         <div className="relative flex-1 min-w-[200px] max-w-xs">
//           <svg width="13" height="13" viewBox="0 0 20 20" fill="none"
//             className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
//             style={{ color: "var(--text-muted)" }}>
//             <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
//             <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//           </svg>
//           <input
//             type="text"
//             placeholder="Search business or plan…"
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//             className="w-full rounded-lg outline-none"
//             style={{
//               background: "var(--bg-surface)",
//               border: "1px solid var(--border)",
//               color: "var(--text-primary)",
//               padding: "7px 12px 7px 30px",
//               fontSize: "12.5px",
//               fontFamily: "var(--font-body)",
//             }}
//           />
//         </div>
//         <select style={SELECT} value={statusFilter}
//           onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}>
//           <option value="all">All Statuses</option>
//           <option value="active">Active</option>
//           <option value="trialing">Trialing</option>
//           <option value="past_due">Past Due</option>
//           <option value="canceled">Canceled</option>
//           <option value="paused">Paused</option>
//         </select>
//         <select style={SELECT} value={tierFilter}
//           onChange={(e) => { setTierFilter(e.target.value as typeof tierFilter); setPage(1); }}>
//           <option value="all">All Plans</option>
//           <option value="starter">Starter</option>
//           <option value="pro">Pro</option>
//           <option value="enterprise">Enterprise</option>
//           <option value="custom">Custom</option>
//         </select>
//         <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
//           <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{filtered.length}</span> results
//         </span>
//       </div>

//       {/* Table */}
//       <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
//                 {["Business", "Plan", "Status", "Billing", "Amount", "Next Invoice", "AI Usage", ""].map((h) => (
//                   <th key={h} className="px-4 py-3 text-left whitespace-nowrap"
//                     style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-body)" }}>
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {pageData.map((sub) => {
//                 const tc = TIER_COLORS[sub.planTier] ?? TIER_COLORS.starter;
//                 const aiPct = sub.aiCreditsLimit === "unlimited"
//                   ? 0
//                   : Math.round((sub.aiCreditsUsed / (sub.aiCreditsLimit as number)) * 100);
//                 const uc = usageColor(aiPct);

//                 return (
//                   <tr
//                     key={sub.id}
//                     className="border-b transition-colors"
//                     style={{ borderColor: "var(--border)" }}
//                     onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
//                     onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//                   >
//                     <td className="px-4 py-3.5">
//                       <div>
//                         <p className="text-sm font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
//                           {sub.businessName}
//                         </p>
//                         <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub.businessEmail}</p>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
//                         style={{ background: tc.bg, color: tc.color, fontFamily: "var(--font-body)" }}>
//                         {sub.planName}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <div className="flex flex-col gap-1">
//                         <SubscriptionStatusBadge status={sub.status} />
//                         {sub.cancelAtPeriodEnd && (
//                           <span className="text-[9.5px]" style={{ color: "#f5a623" }}>
//                             Cancels {formatDate(sub.currentPeriodEnd)}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <span className="text-xs capitalize" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
//                         {sub.billingCycle}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <span className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
//                         ${sub.amount}
//                         <span className="text-xs font-normal ml-0.5" style={{ color: "var(--text-muted)" }}>/mo</span>
//                       </span>
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <p className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
//                         {formatDate(sub.nextInvoiceDate)}
//                       </p>
//                       {sub.nextInvoiceAmount > 0 && (
//                         <p className="text-[10.5px] mt-0.5" style={{ color: "var(--text-muted)" }}>
//                           ${sub.nextInvoiceAmount}
//                         </p>
//                       )}
//                     </td>
//                     <td className="px-4 py-3.5 min-w-[100px]">
//                       {sub.aiCreditsLimit === "unlimited" ? (
//                         <span className="text-xs" style={{ color: "var(--text-muted)" }}>Unlimited</span>
//                       ) : (
//                         <div>
//                           <div className="flex items-center justify-between mb-1">
//                             <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
//                               {Math.round(sub.aiCreditsUsed / 1000)}k / {Math.round((sub.aiCreditsLimit as number) / 1000)}k
//                             </span>
//                             <span className="text-[10px] font-semibold" style={{ color: uc }}>{aiPct}%</span>
//                           </div>
//                           <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
//                             <div className="h-full rounded-full transition-all"
//                               style={{ width: `${aiPct}%`, background: uc,
//                                 boxShadow: aiPct >= 90 ? `0 0 6px ${uc}` : "none" }} />
//                           </div>
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-4 py-3.5 text-right">
//                       <Link
//                         href={`/businesses/${sub.businessId}`}
//                         className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
//                         style={{
//                           background: "rgba(26,111,255,0.08)",
//                           border: "1px solid rgba(26,111,255,0.18)",
//                           color: "#6699ff",
//                           fontFamily: "var(--font-body)",
//                         }}
//                       >
//                         View →
//                       </Link>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid var(--border)" }}>
//             <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
//               Page {page} of {totalPages}
//             </span>
//             <div className="flex gap-1.5">
//               <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
//                 className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30"
//                 style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
//                 ← Prev
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//                 <button key={p} onClick={() => setPage(p)}
//                   className="w-7 h-7 rounded-lg text-xs"
//                   style={{
//                     background: p === page ? "#1a6fff" : "var(--bg-raised)",
//                     border: `1px solid ${p === page ? "#1a6fff" : "var(--border)"}`,
//                     color: p === page ? "#fff" : "var(--text-secondary)",
//                     fontFamily: "var(--font-body)",
//                   }}>
//                   {p}
//                 </button>
//               ))}
//               <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
//                 className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30"
//                 style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
//                 Next →
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }