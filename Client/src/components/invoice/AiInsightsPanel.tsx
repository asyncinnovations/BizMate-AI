"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/AiInsightsPanel.tsx
// NEW — shown on the invoice preview page for Pro/Enterprise users.
// Calls GET /invoices/ai-insights/:invoiceId via useAiInsights hook.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Bell, Clock, ChevronRight } from "lucide-react";
import { useAiInsights } from "@/hooks/useInvoiceAI";
import axiosInstance from "@/utils/axiosInstance";

interface Props {
  invoiceId:    string;
  customerName: string;
  isPro:        boolean;
}

export default function AiInsightsPanel({ invoiceId, customerName, isPro }: Props) {
  const { insights, isLoading, error, fetch } = useAiInsights();
  const [reminderScheduled, setReminderScheduled] = useState(false);
  const [scheduling, setScheduling]               = useState(false);

  useEffect(() => {
    if (isPro && invoiceId) fetch(invoiceId);
  }, [invoiceId, isPro]);

  const handleScheduleReminder = async () => {
    if (!insights?.reminder_date) return;
    setScheduling(true);
    try {
      await axiosInstance.post("/invoice-schedules/create", {
        invoice_id:      invoiceId,
        recipient_email: "",          // Filled server-side from invoice record
        type:            "one_time",
        scheduled_at:    insights.reminder_date,
      });
      setReminderScheduled(true);
    } catch {
      // Non-fatal
    } finally {
      setScheduling(false);
    }
  };

  const riskColor = !insights ? "" : insights.late_payment_risk_percent < 30 ? "bg-green-500" : insights.late_payment_risk_percent < 60 ? "bg-amber-500" : "bg-red-500";
  const riskLabel = !insights ? "" : insights.late_payment_risk_percent < 30 ? "Low" : insights.late_payment_risk_percent < 60 ? "Medium" : "High";
  const riskText  = !insights ? "" : insights.late_payment_risk_percent < 30 ? "text-green-700" : insights.late_payment_risk_percent < 60 ? "text-amber-700" : "text-red-700";

  // Non-Pro users see an upgrade prompt
  if (!isPro) {
    return (
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-4 bg-indigo-50 border-b border-indigo-100">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-indigo-700">AI Insights</span>
          <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
        </div>
        <div className="p-5 text-center">
          <TrendingUp className="w-8 h-8 text-text-muted/40 mx-auto mb-2" />
          <p className="text-sm text-text-secondary mb-3">
            Upgrade to Pro to see payment predictions, risk scoring, and smart action suggestions per invoice.
          </p>
          <a href="/dashboard/pricing" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            Upgrade to Pro <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-surface border border-indigo-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-4 bg-indigo-50 border-b border-indigo-100">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span className="text-sm font-semibold text-indigo-700">AI Insights</span>
          <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Pro</span>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-2/3 mb-1.5" />
              <div className="h-2.5 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !insights) return null;

  return (
    <div className="bg-surface border border-indigo-200 rounded-xl overflow-hidden bg-indigo-50/20">
      <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border-b border-indigo-100">
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-semibold text-indigo-700">AI Insights</span>
        <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Payment prediction */}
        <div className="bg-surface border border-border rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-text-heading">Payment prediction</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {insights.client_payment_pattern} Expected in{" "}
            <strong className="text-green-700">~{insights.payment_prediction_days} days</strong>.
          </p>
        </div>

        {/* Late payment risk */}
        <div className="bg-surface border border-border rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-text-heading">Late payment risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${riskColor}`}
                style={{ width: `${insights.late_payment_risk_percent}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${riskText}`}>
              {riskLabel} ({insights.late_payment_risk_percent}%)
            </span>
          </div>
        </div>

        {/* Suggested action */}
        <div className="bg-surface border border-border rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-text-heading">Suggested action</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            {insights.suggested_action}
          </p>
          {reminderScheduled ? (
            <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
              <Bell className="w-3 h-3" /> Reminder scheduled ✓
            </div>
          ) : (
            <button
              onClick={handleScheduleReminder}
              disabled={scheduling}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <Bell className="w-3 h-3" />
              {scheduling ? "Scheduling..." : "Schedule Reminder"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
