"use client";
// src/app/dashboard/payment/success/page.tsx
// User lands here after gateway redirects them back.
// Shows success state, refreshes subscription context.

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSubscription } from "@/context/SubscriptionContext";

const GATEWAY_LABELS: Record<string, string> = {
  stripe: "Stripe", telr: "Telr", tap: "Tap Payments",
  paypal: "PayPal", free: "Free Plan", apple_pay: "Apple Pay", google_pay: "Google Pay",
};

function PaymentSuccessInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { refresh }  = useSubscription();

  const gateway  = searchParams.get("gateway") ?? "card";
  const orderRef = searchParams.get("order_ref");
  const isFree   = gateway === "free";

  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    // Refresh subscription context so the new plan shows immediately
    const t = setTimeout(async () => {
      await refresh();
      setRefreshed(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [refresh]);

  return (
    <DashboardLayout>
      <div className="min-h-[90vh] flex items-center justify-center bg-bg-base p-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-10 text-center shadow-lg">

          {/* Animated success icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
            <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text-heading mb-2">
            {isFree ? "Free Plan Activated!" : "Payment Successful!"}
          </h1>

          <p className="text-text-secondary text-sm leading-relaxed mb-2">
            {isFree
              ? "Your free plan is now active. Enjoy BizMate AI!"
              : `Payment processed via ${GATEWAY_LABELS[gateway] ?? gateway}. Your subscription is now active.`
            }
          </p>

          {orderRef && !isFree && (
            <p className="text-xs text-text-muted mb-6">
              Order reference: <span className="font-mono font-semibold">{orderRef}</span>
            </p>
          )}

          <div className="space-y-3 mt-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-secondary text-on-brand rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="w-full py-3 px-6 border border-border text-text-secondary rounded-xl font-medium hover:bg-bg-base transition-colors text-sm"
            >
              View Billing History
            </button>
          </div>

          {!refreshed && (
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" /> Updating your plan details…
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="min-h-[90vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-text-muted" /></div></DashboardLayout>}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
