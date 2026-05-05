// import React from "react";
// import type { SubscriptionStatus, InvoiceStatus } from "@/modules/subscriptions/types";

// type AnyStatus = SubscriptionStatus | InvoiceStatus | "draft" | "archived";

// const STATUS_MAP: Record<
//   AnyStatus,
//   { label: string; color: string; bg: string; border: string; glow?: boolean }
// > = {
//   active:         { label: "Active",         color: "#00c97d", bg: "rgba(0,201,125,0.1)",    border: "rgba(0,201,125,0.22)",    glow: true  },
//   trialing:       { label: "Trialing",       color: "#a855f7", bg: "rgba(168,85,247,0.1)",   border: "rgba(168,85,247,0.22)"               },
//   past_due:       { label: "Past Due",       color: "#ff4560", bg: "rgba(255,69,96,0.12)",   border: "rgba(255,69,96,0.3)",     glow: true  },
//   canceled:       { label: "Canceled",       color: "#7898b8", bg: "rgba(120,152,184,0.1)",  border: "rgba(120,152,184,0.2)"               },
//   paused:         { label: "Paused",         color: "#f5a623", bg: "rgba(245,166,35,0.1)",   border: "rgba(245,166,35,0.22)"               },
//   unpaid:         { label: "Unpaid",         color: "#ff4560", bg: "rgba(255,69,96,0.1)",    border: "rgba(255,69,96,0.25)"                },
//   paid:           { label: "Paid",           color: "#00c97d", bg: "rgba(0,201,125,0.1)",    border: "rgba(0,201,125,0.22)"                },
//   open:           { label: "Open",           color: "#f5a623", bg: "rgba(245,166,35,0.1)",   border: "rgba(245,166,35,0.22)"               },
//   void:           { label: "Void",           color: "#7898b8", bg: "rgba(120,152,184,0.08)", border: "rgba(120,152,184,0.15)"              },
//   uncollectible:  { label: "Uncollectible",  color: "#ff4560", bg: "rgba(255,69,96,0.08)",   border: "rgba(255,69,96,0.2)"                 },
//   draft:          { label: "Draft",          color: "#7898b8", bg: "rgba(120,152,184,0.08)", border: "rgba(120,152,184,0.15)"              },
//   archived:       { label: "Archived",       color: "#3d5478", bg: "rgba(61,84,120,0.1)",    border: "rgba(61,84,120,0.2)"                 },
// };

// interface SubscriptionStatusBadgeProps {
//   status: AnyStatus;
//   size?: "sm" | "md";
// }

// export default function SubscriptionStatusBadge({
//   status,
//   size = "sm",
// }: SubscriptionStatusBadgeProps) {
//   const cfg = STATUS_MAP[status] ?? STATUS_MAP.canceled;

//   return (
//     <span
//       className="inline-flex items-center gap-1.5 font-semibold rounded-full"
//       style={{
//         padding: size === "sm" ? "2px 8px" : "4px 12px",
//         fontSize: size === "sm" ? "10.5px" : "12px",
//         color: cfg.color,
//         background: cfg.bg,
//         border: `1px solid ${cfg.border}`,
//         fontFamily: "var(--font-body)",
//       }}
//     >
//       <span
//         className="rounded-full flex-shrink-0"
//         style={{
//           width: size === "sm" ? "5px" : "6px",
//           height: size === "sm" ? "5px" : "6px",
//           background: cfg.color,
//           boxShadow: cfg.glow ? `0 0 5px ${cfg.color}` : "none",
//         }}
//       />
//       {cfg.label}
//     </span>
//   );
// }