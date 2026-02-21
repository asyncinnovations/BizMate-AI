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
  price: string;           // "Free" for starter, numeric string for paid
  period: string;
  features: SubscriptionFeatures;
  cta: string;
  isPopular?: boolean;
  isActive?: boolean;               // true = currently subscribed PAID plan
  isStarter?: boolean;              // true = this is the free/default plan
  isDisabledNotAvailable?: boolean; // true = starter locked because user has paid plan
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
    if (isActive) return "shadow-lg border-2 border-[#2E69A4]";
    if (isPopular && !isActive) return "shadow-lg border-2 border-[#2E69A4]";
    if (isDisabledNotAvailable) return "shadow-sm border border-gray-200 opacity-50";
    if (isStarter) return "shadow-sm border border-[#D1D5DB]";
    return "shadow-md border border-[#E1E8F5]";
  })();

  // ── Icon bg ──
  const iconBg = (() => {
    if (isPopular && !isActive) return "bg-[#2E69A4]";
    if (isStarter || isDisabledNotAvailable || isActive) return "bg-gray-100";
    return "bg-[#E1E8F5]";
  })();

  // ── Icon color ──
  const iconColor = (() => {
    if (isPopular && !isActive) return "text-white";
    if (isStarter || isDisabledNotAvailable || isActive) return "text-gray-400";
    return "text-[#1B2A49]";
  })();

  // ── Text colors:
  //    starter/active → muted gray but still readable
  //    normal paid → brand colors
  const textPrimary =
    isStarter || isActive ? "text-gray-400" : "text-[#1B2A49]";
  const textSecondary =
    isStarter || isActive ? "text-gray-400" : "text-[#344767]";
  const checkColor =
    isStarter ? "text-gray-300" : "text-[#2E69A4]";

  // ── Button ──
  const buttonClass = (() => {
    if (isDisabledNotAvailable)
      return "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200";
    if (isStarter)
      return "bg-gray-100 text-gray-400 cursor-default border border-gray-200";
    if (isActive)
      return "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200";
    if (disabledCTA)
      return "bg-gray-200 text-gray-400 cursor-not-allowed";
    return "bg-[#1B2A49] text-white hover:bg-[#2E69A4]";
  })();

  return (
    <div className="relative">

      {/* CURRENT PLAN badge */}
      {isActive && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-[#1B2A49] text-white text-[10px] font-semibold py-1 px-3 rounded-full whitespace-nowrap">
            CURRENT PLAN
          </div>
        </div>
      )}

      {/* POPULAR badge */}
      {isPopular && !isActive && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-[#1B2A49] text-white text-[10px] font-semibold py-1 px-3 rounded-full whitespace-nowrap">
            POPULAR
          </div>
        </div>
      )}

      <div
        className={`bg-white rounded-xl overflow-hidden transition-shadow hover:shadow-lg ${cardClass}`}
      >
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

          {/* ── Price block ──
               Starter → shows "Free" in large text, no AED, no period
               Paid    → shows "AED {price}" + period underneath
          */}
          <div className="mb-6">
            {isFree ? (
              /* Free plan: just "Free" in big text, same visual height as paid */
              <div>
                <span className={`text-4xl font-bold ${textPrimary}`}>
                  Free
                </span>
                {/* empty line to match height of period row */}
                <p className="text-sm mt-0.5 invisible">placeholder</p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-sm font-medium ${textSecondary}`}>
                    AED
                  </span>
                  <span className={`text-4xl font-bold ${textPrimary}`}>
                    {price}
                  </span>
                </div>
                <p className={`text-sm mt-0.5 ${textSecondary}`}>{period}</p>
              </div>
            )}
          </div>

          {/* CTA BUTTON */}
          <button
            onClick={disabledCTA ? undefined : onClickCTA}
            disabled={disabledCTA}
            className={`w-full py-2.5 px-5 rounded-md cursor-pointer disabled:cursor-not-allowed font-semibold transition-colors mb-6 text-sm ${buttonClass}`}
          >
            {cta}
          </button>

          {/* FEATURES */}
          <div className="space-y-3">
            {Object.entries(featureLabels).map(([key, label]) => {
              const value = features?.[key as keyof SubscriptionFeatures];
              if (value === undefined || value === false) return null;

              return (
                <div key={key} className="flex items-start gap-2.5">
                  <Check
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${checkColor}`}
                  />
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