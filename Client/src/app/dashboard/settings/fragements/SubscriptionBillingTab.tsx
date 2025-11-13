"use client";

import React, { useState } from "react";
import { CreditCard, FileText, RefreshCw, Check, Download } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Button from "@/components/ui/Button";
import PaymentMethods from "@/components/payment-methods/PaymentMethods";

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
          <Button>Change Plan</Button>
          <Button className="border bg-transparent border-[#344767] text-[#344767] rounded-lg hover:bg-[#F4F7FA] transition-colors">
            Cancel Subscription
          </Button>
        </div>
      </SectionCard>

      {/* Payment Methods Component */}
      <PaymentMethods />

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
