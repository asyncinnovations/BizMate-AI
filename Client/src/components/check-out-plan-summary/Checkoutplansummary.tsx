import React from "react";
import {
  Check,
  Lock,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  Clock,
} from "lucide-react";

// ================= TYPES =================
interface PlanDetails {
  uuid: string;
  name: string;
  description?: string;
  price: number | string;
  duration_days: number;
  features?: Record<string, boolean | string | number>;
}

interface CheckoutPlanSummaryProps {
  plan: PlanDetails;
  isFreePlan: boolean;
}

// ================= TRUST BADGES =================
const TRUST_BADGES = [
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure", sub: "256-bit SSL" },
  { icon: <Lock className="w-4 h-4" />, label: "Private", sub: "No data sold" },
  { icon: <CalendarDays className="w-4 h-4" />, label: "Cancel", sub: "Anytime" },
];

// ================= COMPONENT =================
const CheckoutPlanSummary: React.FC<CheckoutPlanSummaryProps> = ({
  plan,
  isFreePlan,
}) => {
  const featureEntries = Object.entries(plan.features || {}).slice(0, 6);

  return (
    <div className="space-y-4">

      {/* ── Plan card ── */}
      <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden">

        {/* Dark header */}
        <div className="relative bg-brand px-6 py-6 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.04] pointer-events-none" />
          <div className="absolute -bottom-8 -left-5 w-28 h-28 rounded-full bg-white/[0.03] pointer-events-none" />

          <div className="relative z-10">
            {/* Plan name + selected badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1">
                <Sparkles className="w-3 h-3 text-white/70" />
                <span className="text-white/85 text-[11px] font-semibold">
                  {plan.name} Plan
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Selected
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-1">
              {!isFreePlan && (
                <span className="text-[15px] font-semibold text-on-brand/45 tracking-wider">
                  AED
                </span>
              )}
              <span className="text-[42px] font-black text-on-brand tracking-tight leading-none">
                {isFreePlan ? "Free" : plan.price}
              </span>
            </div>
            {!isFreePlan && (
              <p className="text-on-brand/40 text-sm font-medium">
                per {plan.duration_days} days
              </p>
            )}
            {plan.description && (
              <p className="text-on-brand/45 text-[13px] mt-2.5 leading-relaxed">
                {plan.description}
              </p>
            )}
          </div>
        </div>

        {/* Access period banner — floats over the header/body seam */}
        <div className="mx-5 -mt-3 relative z-10">
          <div className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3 shadow-raised">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-on-brand" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-heading uppercase tracking-wide">
                  Access Period
                </p>
                <p className="text-xs text-text-secondary">Full access included</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-text-heading leading-none">
                {plan.duration_days}
              </p>
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide">
                Days
              </p>
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="px-6 pt-5 pb-5 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted">{plan.name} Subscription</span>
            <span className="font-semibold text-text-heading">
              {isFreePlan
                ? "Free"
                : <><span className="text-[10px] font-medium text-text-muted mr-0.5">AED</span>{plan.price}</>
              }
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted">Taxes &amp; Fees</span>
            <span className="font-semibold text-status-success">Free</span>
          </div>
          <div className="border-t border-dashed border-border pt-3 flex justify-between items-center">
            <span className="font-bold text-text-heading text-sm">Total Due Today</span>
            <span className="text-xl font-black text-text-heading">
              {isFreePlan
                ? "Free"
                : <><span className="text-xs font-semibold text-text-muted mr-1">AED</span>{plan.price}</>
              }
            </span>
          </div>
        </div>

        {/* Features list */}
        {featureEntries.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted mb-3.5">
              What&apos;s Included
            </p>
            <ul className="space-y-2.5">
              {featureEntries.map(([key, value]) => (
                <li key={key} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-status-success-bg border border-status-success-border flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-status-success" />
                  </span>
                  <span className="text-sm text-text-primary capitalize">
                    {key.replace(/_/g, " ")}
                    {typeof value !== "boolean" && (
                      <span className="text-text-muted ml-1 text-xs">
                        ({String(value)})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Trust badges ── */}
      <div className="bg-surface rounded-2xl border border-border shadow-card px-5 py-4">
        <div className="grid grid-cols-3 gap-1 text-center divide-x divide-border">
          {TRUST_BADGES.map((b) => (
            <div key={b.label} className="px-2">
              <div className="w-8 h-8 rounded-lg bg-bg-base flex items-center justify-center mx-auto text-text-secondary">
                {b.icon}
              </div>
              <p className="text-[11px] font-bold text-text-heading mt-1.5">{b.label}</p>
              <p className="text-[10px] text-text-muted">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Need help ── */}
      <p className="text-center text-xs text-text-muted">
        Questions?{" "}
        <span className="text-text-secondary font-medium cursor-pointer hover:text-text-heading transition-colors underline underline-offset-2">
          Contact support
        </span>
      </p>
    </div>
  );
};

export default CheckoutPlanSummary;