"use client";

import React, { useState, useMemo } from "react";
import type { Invoice, InvoiceStatus } from "@/modules/subscriptions/types";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" });
}

interface BillingHistoryTableProps {
  invoices: Invoice[];
}

const PAGE_SIZE = 8;

export default function BillingHistoryTable({ invoices }: BillingHistoryTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !inv.businessName.toLowerCase().includes(q) &&
          !inv.invoiceNumber.toLowerCase().includes(q) &&
          !inv.planName.toLowerCase().includes(q)
        ) return false;
      }
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      return true;
    });
  }, [invoices, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);
  const openAmount = invoices
    .filter((i) => i.status === "open")
    .reduce((s, i) => s + i.amount, 0);

  const SELECT: React.CSSProperties = {
    background: "var(--bg-surface)", border: "1px solid var(--border)",
    color: "var(--text-secondary)", borderRadius: "8px",
    padding: "7px 10px", fontSize: "12px",
    fontFamily: "var(--font-body)", outline: "none", cursor: "pointer",
  };

  return (
    <div>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Collected", value: `$${totalRevenue.toLocaleString()}`, color: "#00c97d", sub: "Paid invoices" },
          { label: "Outstanding",     value: `$${openAmount.toLocaleString()}`,   color: "#f5a623", sub: "Open invoices" },
          { label: "Total Invoices",  value: invoices.length,                     color: "var(--accent)", sub: "All time" },
        ].map(({ label, value, color, sub }) => (
          <div
            key={label}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <div>
              <p className="text-[10.5px]" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="text-xl font-bold mt-0.5" style={{ fontFamily: "var(--font-display)", color }}>{value}</p>
              <p className="text-[10.5px] mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}>
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search invoice # or business…"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg outline-none"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)",
              color: "var(--text-primary)", padding: "7px 12px 7px 30px",
              fontSize: "12.5px", fontFamily: "var(--font-body)" }} />
        </div>
        <select style={SELECT} value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}>
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="open">Open</option>
          <option value="void">Void</option>
          <option value="uncollectible">Uncollectible</option>
          <option value="draft">Draft</option>
        </select>
        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{filtered.length}</span> invoices
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                {["Invoice #", "Business", "Plan", "Status", "Amount", "Issued", "Due / Paid", "Method", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap"
                    style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-body)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((inv) => (
                <tr key={inv.id} className="border-b transition-colors"
                  style={{ borderColor: "var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  {/* Invoice # */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono font-medium" style={{ color: "#6699ff" }}>
                      {inv.invoiceNumber}
                    </span>
                  </td>
                  {/* Business */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
                      {inv.businessName}
                    </span>
                  </td>
                  {/* Plan */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                      {inv.planName}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <SubscriptionStatusBadge status={inv.status} />
                  </td>
                  {/* Amount */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                      ${inv.amount.toLocaleString()}
                    </span>
                  </td>
                  {/* Issued */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                      {formatDate(inv.createdAt)}
                    </span>
                  </td>
                  {/* Due/Paid */}
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                        {inv.paidAt ? formatDate(inv.paidAt) : formatDate(inv.dueDate)}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {inv.paidAt ? "Paid" : "Due"}
                      </p>
                    </div>
                  </td>
                  {/* Method */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                      {inv.paymentMethod ?? "—"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all"
                        style={{
                          background: "rgba(26,111,255,0.08)",
                          border: "1px solid rgba(26,111,255,0.18)",
                          color: "#6699ff",
                          fontFamily: "var(--font-body)",
                        }}
                        title="Download PDF"
                      >
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                          <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Page {page} of {totalPages} · {filtered.length} invoices
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30"
                style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-7 h-7 rounded-lg text-xs"
                  style={{
                    background: p === page ? "var(--accent)" : "var(--bg-raised)",
                    border: `1px solid ${p === page ? "var(--accent)" : "var(--border)"}`,
                    color: p === page ? "#fff" : "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30"
                style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}