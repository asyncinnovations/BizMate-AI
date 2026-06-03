"use client";
// src/components/quotation/QuotationStatusTimeline.tsx

import React from "react";
import { FileText, Send, Eye, CheckCircle, FileX, Clock, Archive, RefreshCw } from "lucide-react";
import { QuotationStatus, ActivityEntry } from "@/lib/quotationTypes";

interface Props { currentStatus: QuotationStatus; activityLog?: ActivityEntry[]; }

const MAIN_STAGES: { status: QuotationStatus; label: string; icon: React.ReactNode }[] = [
  { status: "draft",     label: "Draft",     icon: <FileText    className="w-3 h-3" /> },
  { status: "sent",      label: "Sent",      icon: <Send        className="w-3 h-3" /> },
  { status: "viewed",    label: "Viewed",    icon: <Eye         className="w-3 h-3" /> },
  { status: "accepted",  label: "Accepted",  icon: <CheckCircle className="w-3 h-3" /> },
  { status: "converted", label: "Converted", icon: <RefreshCw   className="w-3 h-3" /> },
];

const EXIT_BADGES: Partial<Record<QuotationStatus, { label: string; className: string }>> = {
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
  expired:  { label: "Expired",  className: "bg-orange-100 text-orange-700 border-orange-200" },
  archived: { label: "Archived", className: "bg-slate-100 text-slate-500 border-slate-200" },
};

const RANK: Partial<Record<QuotationStatus, number>> = {
  draft: 0, sent: 1, viewed: 2, accepted: 3, converted: 4,
};

export default function QuotationStatusTimeline({ currentStatus, activityLog }: Props) {
  const currentRank = RANK[currentStatus] ?? -1;
  const isExitStatus = !!EXIT_BADGES[currentStatus];

  const ts = (s: QuotationStatus) => {
    if (!activityLog) return null;
    const e = activityLog.find((a) => a.status === s);
    return e ? new Date(e.timestamp).toLocaleDateString("en-AE", { day: "numeric", month: "short" }) : null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Status Timeline</h4>
        {isExitStatus && EXIT_BADGES[currentStatus] && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${EXIT_BADGES[currentStatus]!.className}`}>
            {EXIT_BADGES[currentStatus]!.label}
          </span>
        )}
      </div>
      <div className="flex items-start">
        {MAIN_STAGES.map((stage, i) => {
          const rank    = RANK[stage.status] ?? 0;
          const isDone  = !isExitStatus && rank < currentRank;
          const isActive = !isExitStatus && rank === currentRank;
          const isLast  = i === MAIN_STAGES.length - 1;
          const timestamp = ts(stage.status);
          return (
            <React.Fragment key={stage.status}>
              <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
                <div className={["w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                  isDone   ? "bg-green-500 text-white"
                  : isActive ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                  : isExitStatus && rank <= currentRank ? "bg-green-500 text-white"
                  : "bg-surface border-2 border-border text-text-muted",
                ].join(" ")}>
                  {isDone || (isExitStatus && rank < currentRank) ? <CheckCircle className="w-3.5 h-3.5" /> : stage.icon}
                </div>
                <span className={`text-[9px] font-medium mt-1.5 text-center leading-tight ${
                  isDone ? "text-green-600" : isActive ? "text-indigo-600" : "text-text-muted"
                }`}>{stage.label}</span>
                {timestamp && <span className="text-[8px] text-text-muted mt-0.5">{timestamp}</span>}
              </div>
              {!isLast && (
                <div className="flex-1 flex items-center" style={{ paddingTop: 14 }}>
                  <div className={`h-0.5 w-full rounded-full ${(isDone || (isExitStatus && rank < currentRank)) ? "bg-green-400" : "bg-border"}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
