"use client";
// src/components/document/DocumentStatusTimeline.tsx
// Visual timeline for the 6-step document lifecycle.
// Driven by activity_log returned by GET /documents/single/:uuid

import React from "react";
import {
  FileText, Sparkles, Eye, CheckCircle, Stamp, Archive, AlertTriangle,
} from "lucide-react";
import { DocumentStatus, ActivityEntry } from "@/lib/documentTypes";

interface Props {
  currentStatus: DocumentStatus;
  activityLog?:  ActivityEntry[];
}

const STAGES: { status: DocumentStatus; label: string; icon: React.ReactNode }[] = [
  { status: "draft",        label: "Draft",        icon: <FileText    className="w-3 h-3" /> },
  { status: "ai_generated", label: "AI Generated", icon: <Sparkles    className="w-3 h-3" /> },
  { status: "under_review", label: "Under Review", icon: <Eye         className="w-3 h-3" /> },
  { status: "approved",     label: "Approved",     icon: <CheckCircle className="w-3 h-3" /> },
  { status: "finalised",    label: "Finalised",    icon: <Stamp       className="w-3 h-3" /> },
  { status: "archived",     label: "Archived",     icon: <Archive     className="w-3 h-3" /> },
];

const RANK: Partial<Record<DocumentStatus, number>> = {
  draft: 0, ai_generated: 1, under_review: 2, approved: 3, finalised: 4, archived: 5,
};

export default function DocumentStatusTimeline({ currentStatus, activityLog }: Props) {
  const currentRank = RANK[currentStatus] ?? 0;

  const getTimestamp = (status: DocumentStatus) => {
    if (!activityLog) return null;
    const entry = activityLog.find((a) => a.status === status);
    return entry
      ? new Date(entry.timestamp).toLocaleDateString("en-AE", { day: "numeric", month: "short" })
      : null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
        Document Status
      </h4>
      <div className="flex items-start">
        {STAGES.map((stage, i) => {
          const rank     = RANK[stage.status] ?? 0;
          const isDone   = rank < currentRank;
          const isActive = rank === currentRank;
          const isLast   = i === STAGES.length - 1;
          const ts       = getTimestamp(stage.status);

          return (
            <React.Fragment key={stage.status}>
              <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
                <div
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                    isDone   ? "bg-green-500 text-white"
                    : isActive ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                    : "bg-surface border-2 border-border text-text-muted",
                  ].join(" ")}
                >
                  {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : stage.icon}
                </div>
                <span className={`text-[9px] font-medium mt-1.5 text-center leading-tight ${
                  isDone ? "text-green-600" : isActive ? "text-indigo-600" : "text-text-muted"
                }`}>
                  {stage.label}
                </span>
                {ts && <span className="text-[8px] text-text-muted mt-0.5">{ts}</span>}
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
    </div>
  );
}
