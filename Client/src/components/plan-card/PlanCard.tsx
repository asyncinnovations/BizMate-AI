import React from "react";
import { Check, LucideIcon } from "lucide-react";

// ================= FEATURE TYPE =================
export interface SubscriptionFeatures {
  analytics?: boolean;
  api_access?: boolean;
  storage_gb?: number;
  auto_reports?: boolean;
  chat_support?: boolean;
  team_members?: number;
  email_support?: boolean;
  notifications?: boolean;
  projects_limit?: number | string;
  proposal_limit?: number | string;
  custom_branding?: boolean;
  dashboard_access?: boolean;
  priority_support?: boolean;
  integration_access?: boolean;
  invoice_generation?: boolean;
  active_orders_limit?: number | string;
  file_upload_limit_mb?: number;
  ai_messages_per_month?: number | string;
}

// ================= PROPS =================
interface PlanCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
  price: string;
  period: string;
  features: SubscriptionFeatures;
  cta: string;
  isPopular?: boolean;
  isActive?: boolean;
  isStarter?: boolean;
  isDisabledNotAvailable?: boolean;
  onClickCTA?: () => void;
  disabledCTA?: boolean;
}

// ================= FEATURE LABELS =================
const featureLabels: Record<string, string> = {
  analytics: "Analytics",
  api_access: "API Access",
  storage_gb: "Storage (GB)",
  auto_reports: "Auto Reports",
  chat_support: "Chat Support",
  team_members: "Team Members",
  email_support: "Email Support",
  notifications: "Notifications",
  projects_limit: "Projects Limit",
  proposal_limit: "Proposal Limit",
  custom_branding: "Custom Branding",
  dashboard_access: "Dashboard Access",
  priority_support: "Priority Support",
  integration_access: "Integration Access",
  invoice_generation: "Invoice Generation",
  active_orders_limit: "Active Orders Limit",
  file_upload_limit_mb: "File Upload Limit (MB)",
  ai_messages_per_month: "AI Messages per Month",
};

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
  const isFree = isStarter;

  // ── Card border ──
  const cardClass = (() => {
    if (isActive) return "shadow-raised border-2 border-secondary";
    if (isPopular && !isActive) return "shadow-raised border-2 border-secondary";
    if (isDisabledNotAvailable) return "shadow-card border border-border opacity-50";
    return "shadow-card border border-border";
  })();

  // ── Icon bg ──
  const iconBg = (() => {
    if (isPopular && !isActive) return "bg-secondary";
    if (isStarter || isDisabledNotAvailable || isActive) return "bg-bg-subtle";
    return "bg-brand-light";
  })();

  // ── Icon color ──
  const iconColor = (() => {
    if (isPopular && !isActive) return "text-on-secondary";
    if (isStarter || isDisabledNotAvailable || isActive) return "text-text-muted";
    return "text-text-heading";
  })();

  // ── Text colors ──
  const textPrimary = isStarter || isActive ? "text-text-muted" : "text-text-heading";
  const textSecondary = isStarter || isActive ? "text-text-muted" : "text-text-primary";
  const checkColor = isStarter ? "text-border-strong" : "text-secondary";

  // ── Button ──
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

      <div className={`bg-surface rounded-xl overflow-hidden transition-shadow hover:shadow-raised ${cardClass}`}>
        <div className="p-6">

          {/* Icon */}
          <div className={`inline-flex p-2.5 rounded-md mb-4 ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>

          {/* Name */}
          <h3 className={`text-xl font-semibold mb-1 ${textPrimary}`}>
            {name}
          </h3>

          {/* Description */}
          <p className={`mb-4 text-sm leading-snug h-10 ${textSecondary}`}>
            {description}
          </p>

          {/* Price block */}
          <div className="mb-6">
            {isFree ? (
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

          {/* CTA button */}
          <button
            onClick={disabledCTA ? undefined : onClickCTA}
            disabled={disabledCTA}
            className={`w-full py-2.5 px-5 rounded-md cursor-pointer disabled:cursor-not-allowed font-semibold transition-colors mb-6 text-sm ${buttonClass}`}
          >
            {cta}
          </button>

          {/* Features list */}
          <div className="space-y-3">
            {Object.entries(featureLabels).map(([key, label]) => {
              const value = features?.[key as keyof SubscriptionFeatures];
              if (value === undefined || value === false) return null;
              return (
                <div key={key} className="flex items-start gap-2.5">
                  <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${checkColor}`} />
                  <span className={`text-sm leading-tight ${textSecondary}`}>
                    {label}: {typeof value === "boolean" ? "Yes" : value}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlanCard;