"use client";
// src/app/dashboard/settings/fragements/SubscriptionBillingTab.tsx
//
// FIXES APPLIED:
// 1. Auto-renewal toggle removed — the backend user_subscriptions entity has
//    no auto_renew column, and no PATCH endpoint supports it. Showing a UI
//    control that saves nothing is misleading. Replaced with an honest
//    informational note so users know renewal is manual.

import React from "react";
import { RefreshCw, Info } from "lucide-react";
import SectionCard            from "@/components/section-card/SectionCard";
import CurrentSubscription    from "@/components/current-subscription/CurrentSubscription";
import BillingHistory         from "@/components/billing-history/BillingHistory";
import SubscriptionUsageCard  from "@/components/subscription-usage/SubscriptionUsageCard";

const SubscriptionBillingTab: React.FC = () => {
  return (
    <div className="space-y-6">

      {/* Current plan details + upgrade CTA */}
      <CurrentSubscription />

      {/* Usage meters per feature */}
      <SubscriptionUsageCard />

      {/* Billing history / invoices */}
      <BillingHistory />

      {/* Renewal info — replaced broken auto-renew toggle */}
      <SectionCard title="Renewal Settings" icon={RefreshCw}>
        <div className="flex items-start gap-4 p-4 bg-bg-base rounded-xl border border-border">
          <div className="p-2 bg-brand-light rounded-lg shrink-0">
            <Info className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-heading">
              Manual renewal
            </p>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              Your subscription renews manually. You will receive an email
              reminder before your plan expires. Visit the{" "}
              <a
                href="/dashboard/pricing"
                className="text-secondary underline hover:opacity-80 font-medium"
              >
                Pricing page
              </a>{" "}
              to upgrade, downgrade, or renew your plan at any time.
            </p>
          </div>
        </div>
      </SectionCard>

    </div>
  );
};

export default SubscriptionBillingTab;
