"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/AiInvoiceGeneratorModal.tsx
// UPDATED — wired to real API via useAiInvoiceGenerator hook.
// Shows animated loading stages, usage counter, wired example chips.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Zap, AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useAiInvoiceGenerator } from "@/hooks/useInvoiceAI";

interface UsageStats {
  used: number;
  limit: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the parsed invoice JSON when generation succeeds */
  onSuccess: (invoiceData: any) => void;
  usageStats?: UsageStats | null;
  isLimitReached?: boolean;
}

const EXAMPLE_CHIPS = [
  "Website redesign for ABC Company, AED 4,500, Net 15",
  "Software consulting 20hrs @ AED 300/hr for TechCorp",
  "Logo design for StartUp Co, AED 1,200, due in 7 days",
  "Monthly SEO retainer for Nova Labs, AED 2,500, Net 30",
  "Mobile app development, 3 milestones, AED 18,000",
];

const LOADING_STAGES = [
  "Extracting client details",
  "Identifying services",
  "Calculating pricing",
  "Setting payment terms",
  "Building your draft",
];

export default function AiInvoiceGeneratorModal({
  isOpen,
  onClose,
  onSuccess,
  usageStats,
  isLimitReached = false,
}: Props) {
  const [prompt, setPrompt]           = useState("");
  const [stageIndex, setStageIndex]   = useState(0);
  const [inputError, setInputError]   = useState("");
  const stageTimerRef                 = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef                   = useRef<HTMLTextAreaElement>(null);

  const { generate, isGenerating, error: apiError } = useAiInvoiceGenerator();

  // Animate stage pills while generating
  useEffect(() => {
    if (isGenerating) {
      setStageIndex(0);
      stageTimerRef.current = setInterval(() => {
        setStageIndex((p) => Math.min(p + 1, LOADING_STAGES.length - 1));
      }, 900);
    } else {
      if (stageTimerRef.current) clearInterval(stageTimerRef.current);
      setStageIndex(0);
    }
    return () => { if (stageTimerRef.current) clearInterval(stageTimerRef.current); };
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setInputError("Please describe your invoice before generating.");
      return;
    }
    setInputError("");
    const result = await generate(prompt);
    if (result) {
      setPrompt("");
      onSuccess(result);   // Caller navigates to the form with pre-filled data
    }
  };

  const handleChipClick = (chip: string) => {
    setPrompt(chip);
    setInputError("");
    textareaRef.current?.focus();
  };

  const handleClose = () => {
    if (isGenerating) return;
    setPrompt("");
    setInputError("");
    onClose();
  };

  const progressPercent = Math.round(((stageIndex + 1) / LOADING_STAGES.length) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      showCloseButton={!isGenerating}
      closeOnOverlayClick={!isGenerating}
      titleIcon={<Sparkles className="w-5 h-5 text-white" />}
      title="AI Invoice Generator"
    >
      <div className="p-6">
        {/* Header meta row */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Powered by BizMate Intelligence
          </p>
          {usageStats && (
            <div className="text-right">
              <p className="text-xs text-text-muted">Prompts today</p>
              <p className="text-sm font-bold text-text-heading">
                {usageStats.used} / {usageStats.limit === -1 ? "∞" : usageStats.limit}
              </p>
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="bg-status-info-bg border border-status-info-border rounded-xl p-4 mb-5 text-sm text-status-info leading-relaxed">
          Describe your project in plain language — client, services, amounts.
          AI extracts everything and pre-fills the form for your review.
        </div>

        {/* Prompt textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Your prompt
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              disabled={isGenerating || isLimitReached}
              className={[
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-text-secondary bg-bg-base resize-none min-h-[110px] transition-all",
                inputError ? "border-status-error" : "border-border",
                (isGenerating || isLimitReached) ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
              placeholder='e.g. Create invoice for website redesign for ABC Company, AED 4,500 including logo and 3 pages, due in 15 days'
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); setInputError(""); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <kbd className="absolute bottom-3 right-3 px-2 py-1 text-[10px] font-medium text-text-muted bg-bg-base border border-border rounded">
              Enter ↵
            </kbd>
          </div>
          {(inputError || apiError) && (
            <p className="flex items-center gap-1.5 mt-1.5 text-xs text-status-error">
              <AlertCircle className="w-3 h-3" />
              {inputError || apiError}
            </p>
          )}
        </div>

        {/* Example chips */}
        {!isGenerating && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Quick examples — click to fill:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="text-xs bg-surface border border-border text-text-secondary px-3 py-1.5 rounded-full hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading stages — shown only while generating */}
        {isGenerating && (
          <div className="mb-5">
            <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {LOADING_STAGES.map((stage, i) => (
                <span
                  key={stage}
                  className={[
                    "text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300",
                    i < stageIndex  ? "bg-indigo-100 text-indigo-600"
                    : i === stageIndex ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-400",
                  ].join(" ")}
                >
                  {i < stageIndex ? "✓ " : ""}{stage}
                </span>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3 text-center">
              AI will not save or send anything without your approval
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isGenerating}
            className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold text-text-secondary hover:bg-bg-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isLimitReached || !prompt.trim()}
            className={[
              "flex-[2] py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all",
              isLimitReached ? "bg-slate-400 cursor-not-allowed"
              : isGenerating ? "bg-indigo-400 cursor-not-allowed"
              : !prompt.trim() ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200",
            ].join(" ")}
          >
            <Zap className="w-4 h-4" fill="currentColor" />
            {isLimitReached ? "Daily Limit Reached"
            : isGenerating  ? "Generating draft..."
            : "Generate Draft"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
