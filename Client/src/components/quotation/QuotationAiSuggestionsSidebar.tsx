"use client";
// src/components/quotation/QuotationAiSuggestionsSidebar.tsx

import React, { useEffect } from "react";
import { Brain, Lightbulb, AlertTriangle, Clock, TrendingUp, Lock } from "lucide-react";
import { useQuotationSuggestions } from "@/hooks/useQuotationAI";

interface Props { userId: string; isPro: boolean; }

const PRIORITY_STYLES = {
  high:   "bg-red-50 border-red-200 text-red-700",
  medium: "bg-amber-50 border-amber-200 text-amber-700",
  low:    "bg-blue-50 border-blue-200 text-blue-700",
};

const PRIORITY_ICON = {
  high:   <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />,
  medium: <Clock         className="w-3 h-3 flex-shrink-0 mt-0.5" />,
  low:    <Lightbulb     className="w-3 h-3 flex-shrink-0 mt-0.5" />,
};

export default function QuotationAiSuggestionsSidebar({ userId, isPro }: Props) {
  const { suggestions, isLoading, fetch } = useQuotationSuggestions();

  useEffect(() => { if (isPro && userId) fetch(userId); }, [userId, isPro]);

  if (!isPro) return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden opacity-70">
      <div className="flex items-center gap-2 p-3.5 bg-slate-50 border-b border-border">
        <Brain className="w-4 h-4 text-text-muted" />
        <span className="text-sm font-semibold text-text-muted">AI Suggestions</span>
        <span className="ml-auto text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
      </div>
      <div className="p-4 text-center">
        <Lock className="w-7 h-7 text-text-muted/30 mx-auto mb-2" />
        <p className="text-xs text-text-muted">Upgrade to Pro for AI-powered follow-up suggestions and expiry alerts.</p>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
        <Brain className="w-4 h-4 text-indigo-600 animate-pulse" />
        <span className="text-sm font-semibold text-indigo-700">Loading suggestions…</span>
      </div>
      <div className="p-4 space-y-2 animate-pulse">
        <div className="h-10 bg-indigo-100/60 rounded-lg" />
        <div className="h-10 bg-indigo-100/60 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="bg-indigo-50/30 border border-indigo-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
        <Brain className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-semibold text-indigo-700">AI Suggestions</span>
        <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Pro</span>
      </div>
      <div className="p-3 space-y-2">
        {suggestions.length === 0 ? (
          <p className="text-xs text-indigo-400 text-center py-3">Send your first quotation to unlock AI suggestions.</p>
        ) : (
          suggestions.slice(0, 4).map((s, i) => (
            <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs leading-relaxed ${PRIORITY_STYLES[s.priority]}`}>
              {PRIORITY_ICON[s.priority]}
              <div>
                {s.quotation_number && <span className="font-semibold mr-1">{s.quotation_number}</span>}
                {s.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
