// ─────────────────────────────────────────────────────────────────────────────
// src/lib/statusBadge.ts
// UPDATED — full invoice lifecycle status support
// ─────────────────────────────────────────────────────────────────────────────

import { InvoiceStatus } from "./invoiceTypes";

export type { InvoiceStatus };

/** Returns Tailwind classes for the status badge pill */
export function getStatusBadge(status: string): string {
  const base = "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border";

  const map: Record<string, string> = {
    paid:     `${base} bg-green-100 text-green-800 border-green-200`,
    unpaid:   `${base} bg-amber-100 text-amber-800 border-amber-200`,
    draft:    `${base} bg-gray-100 text-gray-600 border-gray-200`,
    saved:    `${base} bg-emerald-100 text-emerald-800 border-emerald-200`,
    sent:     `${base} bg-blue-100 text-blue-800 border-blue-200`,
    viewed:   `${base} bg-purple-100 text-purple-800 border-purple-200`,
    overdue:  `${base} bg-red-100 text-red-800 border-red-200`,
    archived: `${base} bg-slate-100 text-slate-500 border-slate-200`,
  };

  return map[status] ?? `${base} bg-gray-100 text-gray-800 border-gray-200`;
}

/** All valid statuses in lifecycle order */
export const ALL_INVOICE_STATUSES: InvoiceStatus[] = [
  "draft", "saved", "sent", "viewed", "paid", "unpaid", "overdue", "archived",
];
