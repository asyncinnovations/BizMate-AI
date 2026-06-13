"use client";
// src/components/document/DocumentAiSuggestionsSidebar.tsx
// NEW — Pro sidebar shown on the dashboard and document form.
// Calls GET /documents/ai-suggestions/:user_id via useDocumentSuggestions.

import React, { useEffect } from "react";
import { Brain, Lightbulb, ArrowRight, Lock } from "lucide-react";
import { useDocumentSuggestions } from "@/hooks/useDocumentAI";
import { useRouter }              from "next/navigation";

interface Props {
  userId:    string;
  /** @deprecated — pass nothing; the component now reads capabilities internally */
  isPro?:    boolean;
  /** When user clicks a suggestion — navigates to new document flow */
  onSelect?: (documentType: string) => void;
}

export default function DocumentAiSuggestionsSidebar({ userId, isPro: isProProp, onSelect }: Props) {
  // FIX 2: derive from capabilities, not plan name string.
  // Falls back to prop for backward compat.
  const { isPlanCapable } = useSubscriptionGuard();
  const isPro = isPlanCapable("documents") || isProProp === true;
  const router = useRouter();
  const { suggestions, isLoading, fetch } = useDocumentSuggestions();

  useEffect(() => {
    if (isPro && userId) fetch(userId);
  }, [userId, isPro]);

  const handleSelect = (documentType: string) => {
    if (onSelect) { onSelect(documentType); return; }
    // Default: navigate to create-custom-template with AI prompt
    const prompt = encodeURIComponent(
      `Create a professional ${documentType} for a UAE business`
    );
    router.push(`/dashboard/documents/create-custom-template?prompt=${prompt}`);
  };

  // Non-Pro: locked state
  if (!isPro) {
    return (
      <div className="bg-surface border border-border rounded-xl overflow-hidden opacity-70">
        <div className="flex items-center gap-2 p-3.5 bg-slate-50 border-b border-border">
          <Brain className="w-4 h-4 text-text-muted" />
          <span className="text-sm font-semibold text-text-muted">AI Suggestions</span>
          <span className="ml-auto text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
        </div>
        <div className="p-4 text-center">
          <Lock className="w-7 h-7 text-text-muted/30 mx-auto mb-2" />
          <p className="text-xs text-text-muted">
            Upgrade to Pro to get AI-powered document suggestions based on your activity.
          </p>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
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
  }

  return (
    <div className="bg-indigo-50/30 border border-indigo-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3.5 bg-indigo-50 border-b border-indigo-100">
        <Brain className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-semibold text-indigo-700">AI Suggestions</span>
        <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Pro</span>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-xs text-indigo-600 flex items-center gap-1.5 mb-2">
          <Lightbulb className="w-3 h-3" />
          Based on your recent document activity
        </p>
        {suggestions.length === 0 ? (
          <p className="text-xs text-indigo-400 text-center py-3">
            Create your first document to unlock AI recommendations.
          </p>
        ) : (
          suggestions.slice(0, 4).map((s, i) => (
            <button
              key={i}
              onClick={() => handleSelect(s.document_type)}
              className="w-full text-left p-3 bg-surface border border-indigo-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-text-heading group-hover:text-indigo-700">
                  {s.document_type}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-indigo-600" />
              </div>
              {s.reason && (
                <div className="text-xs text-text-muted mt-0.5 leading-relaxed">{s.reason}</div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
