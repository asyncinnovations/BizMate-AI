"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/InvoiceStatusTimeline.tsx
// NEW — visual timeline driven by the activity_log returned by GET /invoices/single/:id
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { FileText, Send, Eye, CheckCircle, AlertTriangle, Archive, Clock } from "lucide-react";
import { InvoiceStatus, ActivityEntry } from "@/lib/invoiceTypes";

interface Props {
  currentStatus: InvoiceStatus;
  activityLog?:  ActivityEntry[];
}

const STAGES: { status: InvoiceStatus; label: string; icon: React.ReactNode }[] = [
  { status: "draft",    label: "Draft",    icon: <FileText    className="w-3 h-3" /> },
  { status: "sent",     label: "Sent",     icon: <Send        className="w-3 h-3" /> },
  { status: "viewed",   label: "Viewed",   icon: <Eye         className="w-3 h-3" /> },
  { status: "paid",     label: "Paid",     icon: <CheckCircle className="w-3 h-3" /> },
  { status: "archived", label: "Archived", icon: <Archive     className="w-3 h-3" /> },
];

const STAGE_RANK: Partial<Record<InvoiceStatus, number>> = {
  draft: 0, saved: 0, sent: 1, viewed: 2, paid: 3, archived: 4,
};

export default function InvoiceStatusTimeline({ currentStatus, activityLog }: Props) {
  const isOverdue = currentStatus === "overdue";
  const isUnpaid  = currentStatus === "unpaid";
  const currentRank = STAGE_RANK[currentStatus] ?? (isOverdue ? 2 : 0);

  const getTimestamp = (status: InvoiceStatus) => {
    if (!activityLog) return null;
    const entry = activityLog.find((a) => a.status === status);
    return entry
      ? new Date(entry.timestamp).toLocaleDateString("en-AE", { day: "numeric", month: "short" })
      : null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
        Status Timeline
      </h4>

      {isOverdue && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-xs text-red-700">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          This invoice is overdue. Consider sending a payment reminder.
        </div>
      )}

      <div className="flex items-start">
        {STAGES.map((stage, i) => {
          const rank    = STAGE_RANK[stage.status] ?? 0;
          const isDone  = rank < currentRank;
          const isActive = rank === currentRank;
          const isLast  = i === STAGES.length - 1;
          const ts      = getTimestamp(stage.status);

          return (
            <React.Fragment key={stage.status}>
              <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
                <div
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                    isDone   ? "bg-green-500 text-white"
                    : isActive ? (isOverdue ? "bg-red-500 text-white ring-4 ring-red-100" : "bg-indigo-600 text-white ring-4 ring-indigo-100")
                    : "bg-surface border-2 border-border text-text-muted",
                  ].join(" ")}
                >
                  {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : isActive && isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : stage.icon}
                </div>
                <span className={`text-[10px] font-medium mt-1.5 text-center leading-tight ${isDone ? "text-green-600" : isActive ? (isOverdue ? "text-red-600" : "text-indigo-600") : "text-text-muted"}`}>
                  {stage.label}
                </span>
                {ts && <span className="text-[9px] text-text-muted mt-0.5">{ts}</span>}
              </div>
              {!isLast && (
                <div className="flex-1 flex items-center" style={{ paddingTop: 14 }}>
                  <div className={`h-0.5 w-full rounded-full ${rank < currentRank ? "bg-green-400" : "bg-border"}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {isUnpaid && (
        <div className="flex items-center gap-2 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          Awaiting payment from customer.
        </div>
      )}
    </div>
  );
}
