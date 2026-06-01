"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/create-invoice/AiSuggestionsSidebar.tsx
// REPLACES the old hardcoded setTimeout sidebar in CreateInvoice.tsx.
// Calls GET /invoices/ai-suggestions?user_id=&customer_name= via useAiSuggestions.
// Debounces the API call 600ms after the user stops typing a customer name.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import { Brain, Lightbulb, TrendingUp, Zap, Plus, CheckCircle } from "lucide-react";
import { useAiSuggestions } from "@/hooks/useInvoiceAI";

interface Props {
  userId:       string;
  customerName: string;
  isPro:        boolean;
  /** Called when user clicks a suggestion card — adds it to the items table */
  onApplySuggestion: (name: string, price: number) => void;
  /** Called when user clicks "Use This Text" on the notes suggestion */
  onApplyNotes:      (notes: string) => void;
}

export default function AiSuggestionsSidebar({
  userId,
  customerName,
  isPro,
  onApplySuggestion,
  onApplyNotes,
}: Props) {
  const { data, isLoading, fetch, reset } = useAiSuggestions();
  const [appliedNotes, setAppliedNotes]   = useState(false);

  // Debounce: fetch suggestions 600ms after customer name stops changing
  useEffect(() => {
    if (!isPro || !userId || customerName.trim().length < 3) {
      reset();
      return;
    }
    const timer = setTimeout(() => {
      fetch(userId, customerName);
    }, 600);
    return () => clearTimeout(timer);
  }, [customerName, isPro, userId]);

  const handleApplyNotes = () => {
    if (!data?.professional_notes) return;
    onApplyNotes(data.professional_notes);
    setAppliedNotes(true);
    setTimeout(() => setAppliedNotes(false), 3000);
  };

  // Locked for non-Pro users
  if (!isPro) {
    return (
      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-xl overflow-hidden opacity-70">
          <div className="flex items-center gap-2 p-3.5 bg-slate-50 border-b border-border">
            <Brain className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-semibold text-text-muted">Smart AI Sidebar</span>
            <span className="ml-auto text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
          </div>
          <div className="p-4 text-center">
            <Brain className="w-8 h-8 text-text-muted/30 mx-auto mb-2" />
            <p className="text-xs text-text-muted">
              Upgrade to Pro for contextual suggestions based on client history, payment intelligence, and smart pricing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Waiting for customer name input
  if (!customerName || customerName.trim().length < 3) {
    return (
      <div className="space-y-4">
        <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Smart AI Sidebar</span>
            <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Pro</span>
          </div>
          <div className="p-5 text-center">
            <Brain className="w-8 h-8 text-indigo-200 mx-auto mb-2" />
            <p className="text-xs text-indigo-400">
              Start typing a customer name to get AI-powered suggestions from their invoice history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
            <Brain className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span className="text-sm font-semibold text-indigo-700">Loading AI context...</span>
          </div>
          <div className="p-4 space-y-3 animate-pulse">
            <div className="h-12 bg-indigo-100/60 rounded-lg" />
            <div className="h-12 bg-indigo-100/60 rounded-lg" />
            <div className="h-8 bg-indigo-100/60 rounded-lg w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // No history found for this customer
  if (!data || data.suggestions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Smart AI Sidebar</span>
            <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Pro</span>
          </div>
          <div className="p-5 text-center">
            <p className="text-xs text-indigo-400">
              No previous invoices found for <strong>{customerName}</strong>. Suggestions will appear once you have invoice history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Suggested services */}
      <div className="bg-indigo-50/30 border border-indigo-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
          <Brain className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">Smart Suggestions</span>
          <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Pro</span>
        </div>
        <div className="p-3 space-y-2">
          <p className="text-xs text-indigo-600 flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-3 h-3" />
            Based on {customerName}'s invoice history
          </p>
          {data.suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onApplySuggestion(s.name, s.suggested_price)}
              className="w-full text-left p-3 bg-surface border border-indigo-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-text-heading group-hover:text-indigo-700">{s.name}</div>
                <Plus className="w-3.5 h-3.5 text-text-muted group-hover:text-indigo-600" />
              </div>
              {s.times_used && (
                <div className="text-xs text-text-muted mt-0.5">Used {s.times_used} times</div>
              )}
              <div className="text-xs font-semibold text-indigo-600 mt-1">
                AED {s.suggested_price.toLocaleString()} suggested
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment intelligence */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-3.5 border-b border-border">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-text-heading">Payment Intel</span>
        </div>
        <div className="p-3.5">
          <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 mb-2.5">
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            {data.payment_pattern}
          </div>
          {data.payment_rate !== undefined && (
            <p className="text-xs text-text-muted">
              {data.payment_rate}% on-time payment rate across {data.suggestions.length > 0 ? "recent" : "all"} invoices.
            </p>
          )}
        </div>
      </div>

      {/* AI pricing tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1.5">
          <Zap className="w-3 h-3" /> AI Tip
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">{data.pricing_tip}</p>
      </div>

      {/* Professional notes suggestion */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-3 border-b border-border">
          <span className="text-xs font-semibold text-text-heading">Professional Notes</span>
        </div>
        <div className="p-3">
          <p className="text-xs text-text-secondary leading-relaxed mb-3">{data.professional_notes}</p>
          <button
            onClick={handleApplyNotes}
            className={[
              "w-full py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5",
              appliedNotes
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-surface border-border text-text-secondary hover:bg-bg-base",
            ].join(" ")}
          >
            {appliedNotes
              ? <><CheckCircle className="w-3 h-3" /> Applied to notes</>
              : "Use This Text"}
          </button>
        </div>
      </div>
    </div>
  );
}
