"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/InvoiceFilterPanel.tsx
// NEW — advanced filter drawer shown when user clicks the Filter button.
// Supports multi-select status, date range, and amount range.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Filter, X, RotateCcw, Check } from "lucide-react";
import { InvoiceStatus, ALL_INVOICE_STATUSES } from "@/lib/statusBadge";

export interface InvoiceFilters {
  statuses:  InvoiceStatus[];
  dateFrom:  string;
  dateTo:    string;
  amountMin: string;
  amountMax: string;
}

export const DEFAULT_FILTERS: InvoiceFilters = {
  statuses: [], dateFrom: "", dateTo: "", amountMin: "", amountMax: "",
};

interface Props {
  isOpen:        boolean;
  onClose:       () => void;
  filters:       InvoiceFilters;
  onChange:      (f: InvoiceFilters) => void;
  onReset:       () => void;
  onApply:       () => void;
  totalMatching: number;
}

// Colours for status chips
const STATUS_IDLE: Record<string, string> = {
  paid:     "bg-green-100 text-green-800 border-green-300",
  unpaid:   "bg-amber-100 text-amber-800 border-amber-300",
  overdue:  "bg-red-100 text-red-800 border-red-300",
  sent:     "bg-blue-100 text-blue-800 border-blue-300",
  viewed:   "bg-purple-100 text-purple-800 border-purple-300",
  draft:    "bg-slate-100 text-slate-600 border-slate-300",
  saved:    "bg-emerald-100 text-emerald-700 border-emerald-300",
  archived: "bg-slate-100 text-slate-400 border-slate-200",
};

const STATUS_ACTIVE: Record<string, string> = {
  paid:     "bg-green-600 text-white border-green-600",
  unpaid:   "bg-amber-500 text-white border-amber-500",
  overdue:  "bg-red-600 text-white border-red-600",
  sent:     "bg-blue-600 text-white border-blue-600",
  viewed:   "bg-purple-600 text-white border-purple-600",
  draft:    "bg-slate-700 text-white border-slate-700",
  saved:    "bg-emerald-600 text-white border-emerald-600",
  archived: "bg-slate-500 text-white border-slate-500",
};

export default function InvoiceFilterPanel({
  isOpen, onClose, filters, onChange, onReset, onApply, totalMatching,
}: Props) {
  if (!isOpen) return null;

  const toggle = (s: InvoiceStatus) => {
    const exists = filters.statuses.includes(s);
    onChange({
      ...filters,
      statuses: exists ? filters.statuses.filter((x) => x !== s) : [...filters.statuses, s],
    });
  };

  const hasActive =
    filters.statuses.length > 0 || filters.dateFrom || filters.dateTo ||
    filters.amountMin || filters.amountMax;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-full mt-2 z-40 w-80 bg-surface border border-border rounded-2xl shadow-raised overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-base">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <span className="font-semibold text-sm text-text-heading">Filter Invoices</span>
            {hasActive && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {filters.statuses.length + (filters.dateFrom || filters.dateTo ? 1 : 0) + (filters.amountMin || filters.amountMax ? 1 : 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActive && (
              <button onClick={onReset} className="flex items-center gap-1 text-xs text-status-error font-medium">
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
            <button onClick={onClose}><X className="w-4 h-4 text-text-muted" /></button>
          </div>
        </div>

        <div className="p-4 space-y-5">
          {/* Status multi-select */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Status</p>
            <div className="flex flex-wrap gap-2">
              {ALL_INVOICE_STATUSES.map((s) => {
                const active = filters.statuses.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggle(s)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium capitalize transition-all ${active ? STATUS_ACTIVE[s] : STATUS_IDLE[s]}`}
                  >
                    {active && <Check className="w-2.5 h-2.5" />}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date range */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Invoice Date Range</p>
            <div className="grid grid-cols-2 gap-2">
              {[["From", "dateFrom"], ["To", "dateTo"]].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs text-text-muted block mb-1">{label}</label>
                  <input
                    type="date"
                    value={filters[key as keyof InvoiceFilters] as string}
                    onChange={(e) => onChange({ ...filters, [key]: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-xs text-text-secondary bg-bg-base focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Amount range */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Amount Range (AED)</p>
            <div className="grid grid-cols-2 gap-2">
              {[["Min", "amountMin", "0"], ["Max", "amountMax", "Any"]].map(([label, key, ph]) => (
                <div key={key}>
                  <label className="text-xs text-text-muted block mb-1">{label}</label>
                  <input
                    type="number"
                    placeholder={ph}
                    value={filters[key as keyof InvoiceFilters] as string}
                    onChange={(e) => onChange({ ...filters, [key]: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-xs text-text-secondary bg-bg-base focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex gap-3">
          <button onClick={onReset} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-base">
            Reset
          </button>
          <button
            onClick={() => { onApply(); onClose(); }}
            className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold"
          >
            Apply Filters
            {totalMatching > 0 && (
              <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{totalMatching}</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
