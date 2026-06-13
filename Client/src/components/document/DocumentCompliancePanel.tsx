"use client";
// src/components/document/DocumentCompliancePanel.tsx
// Shown on the document preview page for Pro/Enterprise users.
// Calls POST /documents/compliance-check/:uuid via useDocumentCompliance hook.

import React, { useEffect } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { useDocumentCompliance } from "@/hooks/useDocumentAI";
import { ComplianceNote }        from "@/lib/documentTypes";

interface Props {
  documentUuid: string;
  isPro:        boolean;
  /** Optional pre-loaded score from the document record */
  initialScore?: number | null;
  initialNotes?: ComplianceNote[];
}

export default function DocumentCompliancePanel({
  documentUuid, isPro: isProProp, initialScore, initialNotes,
}: Props) {
  // FIX 2: capability-based check — survives plan renames
  const { isPlanCapable } = useSubscriptionGuard();
  const isPro = isPlanCapable("documents") || isProProp === true;
  const { check, isChecking, result } = useDocumentCompliance();

  // If the document already has a compliance score, show it immediately.
  // Otherwise trigger a fresh check when the panel mounts (Pro only).
  useEffect(() => {
    if (!isPro || !documentUuid) return;
    if (!initialScore) check(documentUuid);
  }, [documentUuid, isPro]);

  const score = result?.compliance_score ?? initialScore;
  const notes = result?.compliance_notes ?? initialNotes ?? [];

  const scoreColor =
    !score       ? "text-text-muted"
    : score >= 90 ? "text-green-600"
    : score >= 75 ? "text-amber-600"
    : "text-red-600";

  const scoreBg =
    !score       ? "bg-surface"
    : score >= 90 ? "bg-green-50 border-green-200"
    : score >= 75 ? "bg-amber-50 border-amber-200"
    : "bg-red-50 border-red-200";

  const noteIcon = (type: string) => {
    if (type === "ok")      return <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />;
    if (type === "warning") return <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />;
    return <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />;
  };

  const noteBg = (type: string) => {
    if (type === "ok")      return "bg-green-50 text-green-700";
    if (type === "warning") return "bg-amber-50 text-amber-700";
    return "bg-red-50 text-red-700";
  };

  // Non-Pro: upgrade nudge
  if (!isPro) {
    return (
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-indigo-700">AI Compliance Check</span>
          <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
        </div>
        <div className="p-5 text-center">
          <ShieldCheck className="w-8 h-8 text-text-muted/30 mx-auto mb-2" />
          <p className="text-sm text-text-secondary mb-3">
            Upgrade to Pro to get an AI compliance score and missing-clause alerts on every document.
          </p>
          <a href="/dashboard/pricing" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            Upgrade to Pro <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (isChecking) {
    return (
      <div className="bg-surface border border-indigo-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
          <span className="text-sm font-semibold text-indigo-700">Running compliance check…</span>
        </div>
        <div className="p-4 space-y-2 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n}>
              <div className="h-3 bg-slate-200 rounded w-3/4 mb-1" />
              <div className="h-2.5 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-indigo-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border-b border-indigo-100">
        <ShieldCheck className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-semibold text-indigo-700">AI Compliance Check</span>
        <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Score */}
        {score != null && (
          <div className={`flex items-center justify-between border rounded-xl p-3 ${scoreBg}`}>
            <span className="text-xs font-semibold text-text-heading">Compliance Score</span>
            <span className={`text-lg font-bold ${scoreColor}`}>{score}%</span>
          </div>
        )}

        {/* Notes */}
        {notes.length > 0 && (
          <div className="space-y-2">
            {notes.map((note, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-2.5 rounded-lg text-xs leading-relaxed ${noteBg(note.type)}`}
              >
                {noteIcon(note.type)}
                <span>{note.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Re-run button */}
        {!isChecking && (
          <button
            onClick={() => check(documentUuid)}
            className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3 h-3" />
            Re-run Check
          </button>
        )}
      </div>
    </div>
  );
}
