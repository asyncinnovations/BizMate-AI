"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/InvoiceCreationMethodModal.tsx
// NEW — triggered when user clicks "New Invoice" on the dashboard.
// Shows 5 creation methods. Recurring & Scheduled are gated behind Pro plan.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Sparkles, FilePlus, Copy, RefreshCw, Clock, Lock, Zap } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useSubscription } from "@/context/SubscriptionContext";
import { CreationMethod } from "@/lib/invoiceTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: CreationMethod) => void;
}

interface MethodCard {
  id: CreationMethod;
  icon: React.ReactNode;
  label: string;
  description: string;
  recommended?: boolean;
  requiredPlan?: "Growth" | "Pro";
  iconBg: string;
  iconColor: string;
}

const METHODS: MethodCard[] = [
  {
    id: "ai",
    label: "AI Generator",
    description: "Describe in plain text — AI builds the full draft",
    icon: <Sparkles className="w-5 h-5" />,
    recommended: true,
    requiredPlan: "Growth",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: "manual",
    label: "Manual",
    description: "Fill in all fields yourself from scratch",
    icon: <FilePlus className="w-5 h-5" />,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    id: "duplicate",
    label: "Duplicate",
    description: "Clone an existing invoice and edit it",
    icon: <Copy className="w-5 h-5" />,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    id: "recurring",
    label: "Recurring",
    description: "Auto-send on a billing cycle you define",
    icon: <RefreshCw className="w-5 h-5" />,
    requiredPlan: "Pro",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    id: "scheduled",
    label: "Scheduled",
    description: "Set a future send date for this invoice",
    icon: <Clock className="w-5 h-5" />,
    requiredPlan: "Pro",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
];

// Map plan name to a numeric rank for comparison
const PLAN_RANK: Record<string, number> = { Starter: 0, Growth: 1, Startup: 1, Pro: 2, Enterprise: 3 };
const REQ_RANK:  Record<string, number> = { Growth: 1, Pro: 2 };

export default function InvoiceCreationMethodModal({ isOpen, onClose, onSelect }: Props) {
  const { currentPlan } = useSubscription();
  const userRank = PLAN_RANK[currentPlan?.name ?? "Starter"] ?? 0;

  const isLocked = (m: MethodCard) =>
    !!m.requiredPlan && userRank < REQ_RANK[m.requiredPlan];

  const handleSelect = (m: MethodCard) => {
    if (isLocked(m)) return;
    onClose();
    onSelect(m.id);
  };

  const anyLocked = METHODS.some(isLocked);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton
      closeOnOverlayClick
      titleIcon={<FilePlus className="w-5 h-5 text-white" />}
      title="Create New Invoice"
    >
      <div className="p-6">
        <p className="text-text-secondary text-sm mb-6">
          Choose how you want to get started. AI Generator is recommended — it pre-fills everything in seconds.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          {METHODS.map((m) => {
            const locked = isLocked(m);
            return (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                disabled={locked}
                className={[
                  "relative text-left rounded-xl border-2 p-4 transition-all duration-200",
                  locked
                    ? "border-border opacity-55 cursor-not-allowed"
                    : m.recommended
                    ? "border-indigo-400 hover:border-indigo-500 hover:shadow-lg bg-indigo-50/40"
                    : "border-border hover:border-border-strong hover:shadow-md",
                ].join(" ")}
              >
                {m.recommended && !locked && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-semibold px-3 py-0.5 rounded-full whitespace-nowrap">
                    Recommended
                  </div>
                )}
                {locked && m.requiredPlan && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <Lock className="w-2.5 h-2.5" />
                    {m.requiredPlan}
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${locked ? "bg-slate-100" : m.iconBg}`}>
                  <span className={locked ? "text-slate-400" : m.iconColor}>{m.icon}</span>
                </div>
                <div className={`font-semibold text-sm mb-1 ${locked ? "text-text-muted" : m.recommended ? "text-indigo-700" : "text-text-heading"}`}>
                  {m.label}
                </div>
                <div className="text-xs text-text-secondary leading-relaxed">{m.description}</div>
              </button>
            );
          })}
        </div>

        {anyLocked && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-border rounded-xl text-sm text-text-secondary">
            <Zap className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>Recurring &amp; Scheduled require <strong className="text-text-heading">Pro plan.</strong></span>
            <button
              onClick={() => { onClose(); window.location.href = "/dashboard/pricing"; }}
              className="ml-auto text-indigo-600 font-semibold hover:text-indigo-700 text-xs whitespace-nowrap"
            >
              Upgrade →
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
