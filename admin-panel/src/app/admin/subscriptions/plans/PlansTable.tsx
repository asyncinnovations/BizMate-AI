// "use client";

// import React, { useState } from "react";
// import type { Plan } from "@/modules/subscriptions/types";
// import SubscriptionStatusBadge from "./SubscriptionStatusBadge";
// import PlanFormModal from "./PlanFormModal";
// import ConfirmModal from "@/components/ui/ConfirmModal";

// const TIER_COLORS: Record<string, string> = {
//   starter: "#7898b8",
//   pro: "#1a6fff",
//   enterprise: "#f5a623",
//   custom: "#a855f7",
// };

// interface PlansTableProps {
//   plans: Plan[];
// }

// export default function PlansTable({ plans: initialPlans }: PlansTableProps) {
//   const [plans, setPlans] = useState(initialPlans);
//   const [editTarget, setEditTarget] = useState<Plan | null | undefined>(undefined);
//   const [archiveTarget, setArchiveTarget] = useState<Plan | null>(null);

//   function handleSave(data: Partial<Plan>) {
//     if (editTarget) {
//       setPlans((ps) => ps.map((p) => (p.id === editTarget.id ? { ...p, ...data } : p)));
//     } else {
//       const newPlan: Plan = {
//         id: `plan_${Date.now()}`,
//         name: data.name ?? "New Plan",
//         tier: data.tier ?? "pro",
//         status: "draft",
//         monthlyPrice: data.monthlyPrice ?? 0,
//         annualPrice: data.annualPrice ?? 0,
//         currency: "USD",
//         description: data.description ?? "",
//         features: [],
//         limits: data.limits ?? { users: 5, aiCredits: 25000, documents: 20, businesses: 1, storage: "5 GB" },
//         subscriberCount: 0,
//         mrr: 0,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         trialDays: data.trialDays ?? 14,
//       };
//       setPlans((ps) => [newPlan, ...ps]);
//     }
//     setEditTarget(undefined);
//   }

//   function handleArchive(plan: Plan) {
//     setPlans((ps) =>
//       ps.map((p) => (p.id === plan.id ? { ...p, status: "archived" } : p))
//     );
//     setArchiveTarget(null);
//   }

//   function toggleStatus(plan: Plan) {
//     setPlans((ps) =>
//       ps.map((p) =>
//         p.id === plan.id
//           ? { ...p, status: p.status === "active" ? "draft" : "active" }
//           : p
//       )
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
//             Subscription Plans
//           </h2>
//           <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
//             {plans.filter((p) => p.status === "active").length} active · {plans.filter((p) => p.status === "archived").length} archived
//           </p>
//         </div>
//         <button
//           onClick={() => setEditTarget(null)}
//           className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
//           style={{
//             background: "linear-gradient(135deg,#1a6fff,#0f52cc)",
//             color: "#fff",
//             fontFamily: "var(--font-body)",
//             boxShadow: "0 4px 16px rgba(26,111,255,0.25)",
//           }}
//         >
//           <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
//             <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//           </svg>
//           New Plan
//         </button>
//       </div>

//       {/* Plan cards grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
//         {plans.map((plan) => {
//           const tierColor = TIER_COLORS[plan.tier] ?? "#7898b8";
//           const isArchived = plan.status === "archived";

//           return (
//             <div
//               key={plan.id}
//               className="rounded-2xl overflow-hidden relative"
//               style={{
//                 background: "var(--bg-surface)",
//                 border: `1px solid ${plan.isPopular ? "rgba(26,111,255,0.3)" : "var(--border)"}`,
//                 opacity: isArchived ? 0.6 : 1,
//               }}
//             >
//               {/* Popular badge */}
//               {plan.isPopular && !isArchived && (
//                 <div
//                   className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
//                   style={{
//                     background: "linear-gradient(135deg,#1a6fff,#00c8e8)",
//                     color: "#fff",
//                     fontFamily: "var(--font-body)",
//                   }}
//                 >
//                   MOST POPULAR
//                 </div>
//               )}

//               {/* Top accent */}
//               <div className="h-1" style={{ background: `linear-gradient(90deg,${tierColor},${tierColor}88)` }} />

//               <div className="p-5">
//                 {/* Plan header */}
//                 <div className="flex items-start gap-3 mb-4">
//                   <div
//                     className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
//                     style={{ background: `${tierColor}18`, color: tierColor, border: `1px solid ${tierColor}28` }}
//                   >
//                     <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//                       <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
//                       <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
//                       <circle cx="10" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
//                     </svg>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
//                         {plan.name}
//                       </h3>
//                       <SubscriptionStatusBadge status={plan.status} />
//                     </div>
//                     <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--text-muted)" }}>
//                       {plan.description}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Pricing */}
//                 <div
//                   className="rounded-xl px-4 py-3 mb-4"
//                   style={{ background: "var(--bg-raised)", border: "1px solid var(--border)" }}
//                 >
//                   <div className="flex items-baseline gap-1 mb-1">
//                     <span
//                       className="text-2xl font-bold"
//                       style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
//                     >
//                       ${plan.monthlyPrice}
//                     </span>
//                     <span className="text-xs" style={{ color: "var(--text-muted)" }}>/mo</span>
//                     <span className="ml-auto text-xs" style={{ color: tierColor }}>
//                       ${plan.annualPrice}/mo annual
//                     </span>
//                   </div>
//                   <p className="text-[10.5px]" style={{ color: "var(--text-muted)" }}>
//                     {plan.trialDays > 0 ? `${plan.trialDays}-day free trial` : "No trial"}
//                   </p>
//                 </div>

//                 {/* Stats row */}
//                 <div className="grid grid-cols-3 gap-2 mb-4">
//                   {[
//                     { label: "Subscribers", value: plan.subscriberCount.toLocaleString() },
//                     { label: "MRR",         value: `$${(plan.mrr / 1000).toFixed(1)}k` },
//                     { label: "Users/plan",  value: plan.limits.users === "unlimited" ? "∞" : String(plan.limits.users) },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="text-center">
//                       <div
//                         className="text-base font-bold"
//                         style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
//                       >
//                         {value}
//                       </div>
//                       <div className="text-[9.5px] mt-0.5" style={{ color: "var(--text-muted)" }}>
//                         {label}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Limits */}
//                 <div className="space-y-1.5 mb-4">
//                   {[
//                     { label: "AI Credits", value: plan.limits.aiCredits === "unlimited" ? "Unlimited" : `${(plan.limits.aiCredits as number / 1000).toFixed(0)}k/mo` },
//                     { label: "Documents",  value: plan.limits.documents === "unlimited" ? "Unlimited" : String(plan.limits.documents) },
//                     { label: "Storage",    value: plan.limits.storage },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="flex items-center justify-between">
//                       <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
//                       <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{value}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
//                   <button
//                     onClick={() => setEditTarget(plan)}
//                     className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
//                     style={{
//                       background: "rgba(26,111,255,0.08)",
//                       border: "1px solid rgba(26,111,255,0.2)",
//                       color: "#6699ff",
//                       fontFamily: "var(--font-body)",
//                     }}
//                   >
//                     <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
//                       <path d="M14 3l3 3-9 9-4 1 1-4 9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
//                     </svg>
//                     Edit
//                   </button>

//                   {!isArchived && (
//                     <button
//                       onClick={() => toggleStatus(plan)}
//                       className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
//                       style={{
//                         background: plan.status === "active"
//                           ? "rgba(245,166,35,0.08)"
//                           : "rgba(0,201,125,0.08)",
//                         border: `1px solid ${plan.status === "active" ? "rgba(245,166,35,0.2)" : "rgba(0,201,125,0.2)"}`,
//                         color: plan.status === "active" ? "#f5a623" : "#00c97d",
//                         fontFamily: "var(--font-body)",
//                       }}
//                     >
//                       {plan.status === "active" ? "Unpublish" : "Publish"}
//                     </button>
//                   )}

//                   {!isArchived && (
//                     <button
//                       onClick={() => setArchiveTarget(plan)}
//                       className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
//                       style={{
//                         background: "rgba(255,69,96,0.06)",
//                         border: "1px solid rgba(255,69,96,0.18)",
//                         color: "#ff6b80",
//                       }}
//                       title="Archive plan"
//                     >
//                       <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
//                         <path d="M3 6h14M5 6V16a1 1 0 001 1h8a1 1 0 001-1V6M8 6V4h4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Modals */}
//       <PlanFormModal
//         open={editTarget !== undefined}
//         plan={editTarget}
//         onClose={() => setEditTarget(undefined)}
//         onSave={handleSave}
//       />

//       <ConfirmModal
//         open={!!archiveTarget}
//         title={`Archive "${archiveTarget?.name}"?`}
//         message="This plan will no longer be available for new subscriptions. Existing subscribers will not be affected."
//         confirmLabel="Archive Plan"
//         variant="warning"
//         onConfirm={() => archiveTarget && handleArchive(archiveTarget)}
//         onCancel={() => setArchiveTarget(null)}
//       />
//     </>
//   );
// }