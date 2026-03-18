import React from "react";
import { Check, LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE TYPE
// Exact keys from backend API response (verified against real plan data).
//
// Limit conventions:
//   -1  = Unlimited
//    0  = Not available on this plan
//   >0  = Exact cap (e.g. 5 invoices, 3 team members)
// ─────────────────────────────────────────────────────────────────────────────
export interface SubscriptionFeatures {
  // ── Invoicing ──────────────────────────────────────────────────────────────
  invoice_limit_per_month?: number | string;

  // ── AI ─────────────────────────────────────────────────────────────────────
  ai_messages_per_month?: number | string;
  whatsapp_ai?: boolean;
  instagram_auto_reply?: boolean;
  custom_ai_training?: boolean;
  priority_ai_compute?: boolean;

  // ── Documents ──────────────────────────────────────────────────────────────
  document_templates?: number | string;
  document_generator?: boolean;   // ← real data: Starter / Standard / Premium
  pdf_export?: boolean;           // ← real data: Starter / Standard / Premium

  // ── Platform ───────────────────────────────────────────────────────────────
  dashboard_access?: boolean;
  notifications?: boolean;
  analytics?: boolean;

  // ── Compliance & Reminders ─────────────────────────────────────────────────
  vat_reminder?: boolean;
  vat_auto_calculation?: boolean;
  smart_reminders?: boolean;
  payroll_reminders?: boolean;

  // ── Finance ────────────────────────────────────────────────────────────────
  expense_tracking?: boolean;
  payment_integrations?: boolean;

  // ── Team & HR ──────────────────────────────────────────────────────────────
  team_members?: number | string;
  employee_contract_generator?: boolean;

  // ── Integrations & Dev ─────────────────────────────────────────────────────
  integration_access?: boolean;
  api_access?: boolean;

  // ── Support ────────────────────────────────────────────────────────────────
  email_support?: boolean;        // ← real data: Starter / Standard / Premium
  priority_support?: boolean;     // ← real data: Standard / Premium
  dedicated_support?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE DISPLAY CONFIG
// ─────────────────────────────────────────────────────────────────────────────
type FeatureType = "boolean" | "limit";

interface FeatureConfig {
  label: string;
  type: FeatureType;
}

// Canonical display order — top to bottom in the card
const FEATURE_ORDER: (keyof SubscriptionFeatures)[] = [
  // Invoicing
  "invoice_limit_per_month",
  // AI
  "ai_messages_per_month",
  "whatsapp_ai",
  "instagram_auto_reply",
  "custom_ai_training",
  "priority_ai_compute",
  // Documents
  "document_templates",
  "document_generator",
  "pdf_export",
  // Platform
  "dashboard_access",
  "notifications",
  "analytics",
  // Compliance
  "vat_reminder",
  "vat_auto_calculation",
  "smart_reminders",
  "payroll_reminders",
  // Finance
  "expense_tracking",
  "payment_integrations",
  // Team & HR
  "team_members",
  "employee_contract_generator",
  // Integrations & Dev
  "integration_access",
  "api_access",
  // Support
  "email_support",
  "priority_support",
  "dedicated_support",
];

const FEATURE_CONFIG: Record<keyof SubscriptionFeatures, FeatureConfig> = {
  invoice_limit_per_month:      { label: "Invoices per Month",         type: "limit"   },
  ai_messages_per_month:        { label: "AI Chats / Questions",       type: "limit"   },
  whatsapp_ai:                  { label: "WhatsApp Automation",        type: "boolean" },
  instagram_auto_reply:         { label: "Instagram Auto Reply",       type: "boolean" },
  custom_ai_training:           { label: "Custom AI Training",         type: "boolean" },
  priority_ai_compute:          { label: "Priority AI Compute",        type: "boolean" },
  document_templates:           { label: "Document Templates",         type: "limit"   },
  document_generator:           { label: "Document Generator",         type: "boolean" },
  pdf_export:                   { label: "PDF Export",                 type: "boolean" },
  dashboard_access:             { label: "Dashboard Access",           type: "boolean" },
  notifications:                { label: "Email Notifications",        type: "boolean" },
  analytics:                    { label: "Analytics Dashboard",        type: "boolean" },
  vat_reminder:                 { label: "VAT Reminder",               type: "boolean" },
  vat_auto_calculation:         { label: "VAT Auto Calculation",       type: "boolean" },
  smart_reminders:              { label: "Smart Reminders",            type: "boolean" },
  payroll_reminders:            { label: "Payroll Reminders",          type: "boolean" },
  expense_tracking:             { label: "Expense Tracking",           type: "boolean" },
  payment_integrations:         { label: "Payment Integrations",       type: "boolean" },
  team_members:                 { label: "Team Members",               type: "limit"   },
  employee_contract_generator:  { label: "Employee Contracts",         type: "boolean" },
  integration_access:           { label: "Integrations",               type: "boolean" },
  api_access:                   { label: "API Access",                 type: "boolean" },
  email_support:                { label: "Email Support",              type: "boolean" },
  priority_support:             { label: "Priority Support",           type: "boolean" },
  dedicated_support:            { label: "Dedicated Support",          type: "boolean" },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a limit value for display.
 *   -1         → "Unlimited"
 *   "unlimited" → "Unlimited"
 *   50         → "50"
 */
function formatLimit(value: number | string): string {
  if (value === -1 || value === "-1") return "Unlimited";
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    if (lower === "unlimited" || lower === "∞") return "Unlimited";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value.toLocaleString();
}

/**
 * Decide if a feature should be rendered on this card.
 *   boolean false  → hidden
 *   number  0      → hidden  (0 = "not available on this plan")
 *   number -1      → visible (unlimited)
 *   number >0      → visible (exact cap)
 *   string "0"     → hidden
 */
function isVisible(
  value: SubscriptionFeatures[keyof SubscriptionFeatures],
): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "boolean")            return value === true;
  if (typeof value === "number")             return value !== 0;   // -1 and >0 are visible
  if (typeof value === "string") {
    const v = value.trim();
    return v !== "" && v !== "0";
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────
export interface PlanCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
  /** Numeric price string e.g. "149.99". Ignored when isStarter=true. */
  price: string;
  /** e.g. "per month, billed monthly" */
  period: string;
  features: SubscriptionFeatures;
  cta: string;
  isPopular?: boolean;
  isActive?: boolean;
  /** Free / trial plan — shows "Free" instead of a price */
  isStarter?: boolean;
  /** Plan exists but is not available to this user */
  isDisabledNotAvailable?: boolean;
  onClickCTA?: () => void;
  disabledCTA?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const PlanCard: React.FC<PlanCardProps> = ({
  name,
  icon: Icon,
  description,
  price,
  period,
  features,
  cta,
  isPopular = false,
  isActive = false,
  isStarter = false,
  isDisabledNotAvailable = false,
  onClickCTA,
  disabledCTA = false,
}) => {
  // ── Style variants ───────────────────────────────────────────────────────
  const cardClass = (() => {
    if (isActive)               return "shadow-raised border-2 border-secondary";
    if (isPopular && !isActive) return "shadow-raised border-2 border-secondary";
    if (isDisabledNotAvailable) return "shadow-card border border-border opacity-50";
    return "shadow-card border border-border";
  })();

  const iconBg = (() => {
    if (isPopular && !isActive)                          return "bg-secondary";
    if (isStarter || isDisabledNotAvailable || isActive) return "bg-bg-subtle";
    return "bg-brand-light";
  })();

  const iconColor = (() => {
    if (isPopular && !isActive)                          return "text-on-secondary";
    if (isStarter || isDisabledNotAvailable || isActive) return "text-text-muted";
    return "text-text-heading";
  })();

  const textPrimary   = isStarter || isActive ? "text-text-muted" : "text-text-heading";
  const textSecondary = isStarter || isActive ? "text-text-muted" : "text-text-primary";
  const checkColor    = isStarter             ? "text-border-strong" : "text-secondary";

  const buttonClass = (() => {
    if (isDisabledNotAvailable)
      return "bg-bg-subtle text-text-muted cursor-not-allowed border border-border";
    if (isStarter)
      return "bg-bg-subtle text-text-muted cursor-default border border-border";
    if (isActive)
      return "bg-bg-subtle text-text-muted cursor-not-allowed border border-border";
    if (disabledCTA)
      return "bg-bg-muted text-text-muted cursor-not-allowed";
    return "bg-brand text-on-brand hover:bg-brand-hover";
  })();

  const isButtonDisabled =
    isDisabledNotAvailable || isStarter || isActive || disabledCTA;

  // ── Build visible feature list ───────────────────────────────────────────
  const visibleFeatures = FEATURE_ORDER.filter((key) =>
    isVisible(features?.[key]),
  );

  return (
    <div className="relative">

      {/* CURRENT PLAN badge */}
      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-brand text-on-brand text-[10px] font-semibold py-1 px-3 rounded-full whitespace-nowrap">
            CURRENT PLAN
          </div>
        </div>
      )}

      {/* POPULAR badge */}
      {isPopular && !isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-brand text-on-brand text-[10px] font-semibold py-1 px-3 rounded-full whitespace-nowrap">
            POPULAR
          </div>
        </div>
      )}

      <div
        className={`bg-surface rounded-xl overflow-hidden transition-shadow hover:shadow-raised ${cardClass}`}
      >
        <div className="p-6">

          {/* Icon */}
          <div className={`inline-flex p-2.5 rounded-md mb-4 ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>

          {/* Plan name */}
          <h3 className={`text-xl font-semibold mb-1 ${textPrimary}`}>
            {name}
          </h3>

          {/* Description */}
          <p className={`mb-4 text-sm leading-snug h-10 ${textSecondary}`}>
            {description}
          </p>

          {/* Price */}
          <div className="mb-6">
            {isStarter ? (
              <div>
                <span className={`text-4xl font-bold ${textPrimary}`}>Free</span>
                <p className="text-sm mt-0.5 invisible">placeholder</p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-sm font-medium ${textSecondary}`}>AED</span>
                  <span className={`text-4xl font-bold ${textPrimary}`}>{price}</span>
                </div>
                <p className={`text-sm mt-0.5 ${textSecondary}`}>{period}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={isButtonDisabled ? undefined : onClickCTA}
            disabled={isButtonDisabled}
            className={`w-full py-2.5 px-5 rounded-md font-semibold transition-colors mb-6 text-sm ${buttonClass}`}
          >
            {cta}
          </button>

          {/* Divider */}
          <div className="border-t border-border mb-5" />

          {/* Features */}
          {visibleFeatures.length > 0 ? (
            <ul className="space-y-2.5">
              {visibleFeatures.map((key) => {
                const value  = features[key]!;
                const config = FEATURE_CONFIG[key];

                return (
                  <li key={key} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${checkColor}`}
                      aria-hidden="true"
                    />
                    <span className={`text-sm leading-tight ${textSecondary}`}>
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
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">
              No features configured for this plan.
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default PlanCard;