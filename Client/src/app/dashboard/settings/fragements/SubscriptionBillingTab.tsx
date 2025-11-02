// app/settings/components/SubscriptionBillingTab.tsx
"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  FileText,
  RefreshCw,
  Check,
  Download,
  Trash2,
} from "lucide-react";
import SectionCard from "@/app/components/section-card/SectionCard";
import ToggleSwitch from "@/app/components/ui/ToggleSwitch";

const SubscriptionBillingTab: React.FC = () => {
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <div className="space-y-6">
      <SectionCard title="Current Plan" icon={CreditCard}>
        <div className="bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] text-white rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
              <p className="text-white/80">
                Unlimited features for your business
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">$49</p>
              <p className="text-white/80">per month</p>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-sm">Unlimited invoices</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-sm">Unlimited AI queries</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-sm">WhatsApp & Instagram integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-sm">Priority support</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border-2 border-[#2E69A4] text-[#2E69A4] rounded-lg hover:bg-[#2E69A4] hover:text-white transition-colors font-medium">
            Change Plan
          </button>
          <button className="px-6 py-3 border border-[#E1E8F5] text-[#344767] rounded-lg hover:bg-[#F4F7FA] transition-colors">
            Cancel Subscription
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Payment Methods" icon={Wallet}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1B2A49]">
            Payment Methods
          </h2>
          <button className="px-4 py-2 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors text-sm">
            Add Payment Method
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">
                  Visa ending in 4242
                </p>
                <p className="text-sm text-[#344767]">Expires 12/2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#2E69A4] text-white px-2 py-1 rounded">
                Default
              </span>
              <button className="text-[#344767] hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Billing History" icon={FileText}>
        <div className="space-y-3">
          {[
            { date: "Oct 1, 2024", amount: "$49.00", status: "Paid" },
            { date: "Sep 1, 2024", amount: "$49.00", status: "Paid" },
            { date: "Aug 1, 2024", amount: "$49.00", status: "Paid" },
          ].map((invoice, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors"
            >
              <div>
                <p className="font-medium text-[#1B2A49]">{invoice.date}</p>
                <p className="text-sm text-[#344767]">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-600 font-medium">
                  {invoice.status}
                </span>
                <button className="text-[#2E69A4] hover:underline text-sm flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Renewal Settings" icon={RefreshCw}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[#1B2A49]">Auto-Renewal</p>
            <p className="text-sm text-[#344767]">
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
