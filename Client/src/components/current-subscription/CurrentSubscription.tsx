"use client";

import React, { useState } from "react";
import { CreditCard, Check, Loader2 } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import type { SubscriptionFeatures } from "@/context/SubscriptionContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import EmptyState from "../empty-state/EmptyState";
import Button from "../ui/Button";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE DISPLAY CONFIG
// ─────────────────────────────────────────────────────────────────────────────
type FeatureType = "boolean" | "limit";
interface FeatureConfig {
  label: string;
  type: FeatureType;
}

const FEATURE_ORDER: (keyof SubscriptionFeatures)[] = [
  "invoice_limit_per_month",
  "ai_messages_per_month",
  "whatsapp_ai",
  "instagram_auto_reply",
  "custom_ai_training",
  "priority_ai_compute",
  "document_templates",
  "document_generator",
  "pdf_export",
  "dashboard_access",
  "notifications",
  "analytics",
  "vat_reminder",
  "vat_auto_calculation",
  "smart_reminders",
  "payroll_reminders",
  "expense_tracking",
  "payment_integrations",
  "team_members",
  "employee_contract_generator",
  "integration_access",
  "api_access",
  "email_support",
  "priority_support",
  "dedicated_support",
];

const FEATURE_CONFIG: Record<keyof SubscriptionFeatures, FeatureConfig> = {
  invoice_limit_per_month: { label: "Invoices per Month", type: "limit" },
  ai_messages_per_month: { label: "AI Chats / Questions", type: "limit" },
  whatsapp_ai: { label: "WhatsApp Automation", type: "boolean" },
  instagram_auto_reply: { label: "Instagram Auto Reply", type: "boolean" },
  custom_ai_training: { label: "Custom AI Training", type: "boolean" },
  priority_ai_compute: { label: "Priority AI Compute", type: "boolean" },
  document_templates: { label: "Document Templates", type: "limit" },
  document_generator: { label: "Document Generator", type: "boolean" },
  pdf_export: { label: "PDF Export", type: "boolean" },
  dashboard_access: { label: "Dashboard Access", type: "boolean" },
  notifications: { label: "Email Notifications", type: "boolean" },
  analytics: { label: "Analytics Dashboard", type: "boolean" },
  vat_reminder: { label: "VAT Reminder", type: "boolean" },
  vat_auto_calculation: { label: "VAT Auto Calculation", type: "boolean" },
  smart_reminders: { label: "Smart Reminders", type: "boolean" },
  payroll_reminders: { label: "Payroll Reminders", type: "boolean" },
  expense_tracking: { label: "Expense Tracking", type: "boolean" },
  payment_integrations: { label: "Payment Integrations", type: "boolean" },
  team_members: { label: "Team Members", type: "limit" },
  employee_contract_generator: { label: "Employee Contracts", type: "boolean" },
  integration_access: { label: "Integrations", type: "boolean" },
  api_access: { label: "API Access", type: "boolean" },
  email_support: { label: "Email Support", type: "boolean" },
  priority_support: { label: "Priority Support", type: "boolean" },
  dedicated_support: { label: "Dedicated Support", type: "boolean" },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatLimit(value: number | string): string {
  if (value === -1 || value === "-1") return "Unlimited";
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    if (lower === "unlimited" || lower === "∞") return "Unlimited";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value.toLocaleString();
}

function isVisible(
  value: SubscriptionFeatures[keyof SubscriptionFeatures],
): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "boolean") return value === true;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const v = value.trim();
    return v !== "" && v !== "0";
  }
  return false;
}

function getRemainingDays(endDate: string): number {
  const diff = Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return diff > 0 ? diff : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CurrentSubscription: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const userId = user?.user?.user_id;

  // ── All subscription data from context — no API calls needed here ─────────
  const { subscription, currentPlan, isLoading, refresh } = useSubscription();

  const [cancelLoading, setCancelLoading] = useState(false);

  // ── Cancel ────────────────────────────────────────────────────────────────
  const handleCancelSubscription = async () => {
    if (!userId) return;
    setCancelLoading(true);
    try {
      await axiosInstance.post(`/subscription_plan/cancel_user/${userId}`);
      toast.success("Subscription cancelled successfully");
      // Refresh context so all components update immediately
      await refresh();
    } catch {
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleChangePlan = () => router.push("/dashboard/pricing");

  // ── Feature rows ──────────────────────────────────────────────────────────
  const renderFeatures = (features: SubscriptionFeatures) => {
    const visible = FEATURE_ORDER.filter((key) => isVisible(features?.[key]));
    if (visible.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 pt-4 border-t border-on-brand/20">
        {visible.map((key) => {
          const value = features[key]!;
          const config = FEATURE_CONFIG[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-on-brand/80 shrink-0" />
              <span className="text-sm text-on-brand/90">
                {config.type === "limit" ? (
                  <>
                    <span className="font-semibold">
                      {formatLimit(value as number | string)}
                    </span>{" "}
                    {config.label}
                  </>
                ) : (
                  config.label
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SectionCard title="Current Plan" icon={CreditCard}>
      {isLoading ? (
        <div className="p-20 flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      ) : !currentPlan || !subscription ? (
        <EmptyState
          icon={CreditCard}
          title="No active subscription yet"
          description="You currently do not have any active subscription. Subscribe to a plan to enjoy all features."
          ctaLabel="View Plans"
          onCTAClick={handleChangePlan}
        />
      ) : (
        <div>
          {/* Plan banner */}
          <div className="bg-brand border border-secondary rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-on-brand mb-1">
                  {currentPlan.name}
                </h3>
                <p className="text-sm text-on-brand/70">
                  {currentPlan.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-on-brand">
                  <span className="text-xl font-semibold">AED </span>
                  {currentPlan.price}
                </p>
                <p className="text-sm text-on-brand/70 mt-0.5">
                  {getRemainingDays(subscription.end_date)} days remaining
                </p>
              </div>
            </div>
            {renderFeatures(currentPlan.features)}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleChangePlan}>Change Plan</Button>
            <Button
              onClick={handleCancelSubscription}
              disabled={cancelLoading}
              className="flex items-center gap-2 bg-transparent border border-border text-text-secondary hover:bg-bg-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Cancel Subscription</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default CurrentSubscription;
