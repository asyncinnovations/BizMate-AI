"use client";

import React, { useState } from "react";
import { CreditCard, FileText, RefreshCw, Check, Download } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Button from "@/components/ui/Button";
import CurrentSubscription from "@/components/current-subscription/CurrentSubscription";
import BillingHistory from "@/components/billing-history/BillingHistory";
import SubscriptionUsageCard from "@/components/subscription-usage/SubscriptionUsageCard";

const SubscriptionBillingTab: React.FC = () => {
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <div className="space-y-6">
      <CurrentSubscription />
      <SubscriptionUsageCard />

      <BillingHistory />

      <SectionCard title="Renewal Settings" icon={RefreshCw}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-heading">
              Auto-Renewal
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Automatically renew subscription each month
            </p>
          </div>
          <ToggleSwitch
            enabled={autoRenew}
            onChange={() => setAutoRenew(!autoRenew)}
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default SubscriptionBillingTab;
