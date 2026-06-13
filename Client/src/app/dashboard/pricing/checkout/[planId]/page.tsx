"use client";
// src/app/dashboard/pricing/checkout/[planId]/page.tsx
// COMPLETE REWRITE — Real payment gateway redirect.
// The old checkout collected card details but never charged them.
// This page:
//   1. Shows the plan summary + gateway picker
//   2. Calls POST /subscription_plan/create-checkout-session/:userId
//   3. Redirects the user to the gateway payment page (Stripe/Telr/Tap/PayPal)
//   4. Gateway handles card, Apple Pay, Google Pay
//   5. Gateway calls our webhook on completion
//   6. User lands on /dashboard/payment/success or /cancel

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Loader2, CreditCard, Shield, CheckCircle,
  Zap, Globe, Lock,
} from "lucide-react";
import DashboardLayout  from "@/components/layout/DashboardLayout";
import axiosInstance    from "@/utils/axiosInstance";
import toast            from "react-hot-toast";
import { useAuth }      from "@/context/AuthContext";
import LoadingSpinner   from "@/components/loading-spinner/LoadingSpinner";
import CheckoutPlanSummary from "@/components/check-out-plan-summary/Checkoutplansummary";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlanDetails {
  uuid:          string;
  name:          string;
  description?:  string;
  price:         number | string;
  duration_days: number;
  features?:     Record<string, any>;
}

type Gateway = "stripe" | "telr" | "tap" | "paypal";

// ─── Gateway options ──────────────────────────────────────────────────────────
const GATEWAY_OPTIONS: {
  id:       Gateway;
  label:    string;
  sublabel: string;
  icon:     React.ReactNode;
  badge?:   string;
  region:   string;
}[] = [
  {
    id:       "telr",
    label:    "Telr",
    sublabel: "Visa · MC · AMEX · Mada · Apple Pay",
    icon:     <span className="text-xl font-black text-[#0052CC]">T</span>,
    badge:    "UAE Recommended",
    region:   "UAE / GCC",
  },
  {
    id:       "stripe",
    label:    "Card / Apple Pay / Google Pay",
    sublabel: "Stripe — PCI DSS Level 1",
    icon:     <CreditCard className="w-5 h-5 text-indigo-600" />,
    region:   "International",
  },
  {
    id:       "tap",
    label:    "Tap Payments",
    sublabel: "KNET · mada · Benefit Pay · Apple Pay · Google Pay",
    icon:     <span className="text-xl font-black text-[#0090E7]">⊛</span>,
    region:   "UAE / SA / KW / BH",
  },
  {
    id:       "paypal",
    label:    "PayPal",
    sublabel: "Buyer Protection · PayPal Balance",
    icon:     <span className="text-xl font-black text-[#003087]">P</span>,
    region:   "International",
  },
];

// ─── Inner component ──────────────────────────────────────────────────────────
function CheckoutInner() {
  const { planId }    = useParams<{ planId: string }>();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const actionParam   = searchParams.get("action") ?? "subscribe";

  const { user } = useAuth();
  const userId   = user?.user?.user_id as string | undefined;

  const [plan,        setPlan]        = useState<PlanDetails | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [processing,  setProcessing]  = useState(false);
  const [gateway,     setGateway]     = useState<Gateway>("telr");

  // ── Load plan details ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!planId || !userId) return;
    const load = async () => {
      try {
        const res = await axiosInstance.get("/subscription_plan/all");
        const plans: PlanDetails[] = res.data.plans ?? [];
        const found = plans.find((p) => p.uuid === planId);
        if (!found) { toast.error("Plan not found"); router.back(); return; }
        setPlan(found);
        // Free plan → no gateway needed
        if (Number(found.price) === 0) await handleFreePlan(found.uuid);
      } catch { toast.error("Failed to load plan"); router.back(); }
      finally  { setLoading(false); }
    };
    load();
  }, [planId, userId]);

  // ── Free plan — activate immediately ─────────────────────────────────────
  const handleFreePlan = async (pid: string) => {
    setProcessing(true);
    try {
      await axiosInstance.post(`/subscription_plan/create-checkout-session/${userId}`, {
        planId:   pid,
        gateway:  "free",
        currency: "AED",
        action:   actionParam,
      });
      toast.success("Free plan activated!");
      router.replace("/dashboard/payment/success?gateway=free");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to activate free plan.");
    } finally { setProcessing(false); }
  };

  // ── Paid plan — get redirect URL from backend then navigate ──────────────
  const handlePay = async () => {
    if (!plan || !userId) return;
    setProcessing(true);
    try {
      const res = await axiosInstance.post(
        `/subscription_plan/create-checkout-session/${userId}`,
        {
          planId:   plan.uuid,
          gateway,
          currency: "AED",
          action:   actionParam,
        }
      );

      const { payment_url, order_ref, free } = res.data;

      if (free) {
        toast.success("Plan activated!");
        router.replace("/dashboard/payment/success?gateway=free");
        return;
      }

      if (!payment_url) {
        toast.error("No payment URL returned. Please try again.");
        return;
      }

      // Redirect user to the gateway-hosted payment page
      // The gateway handles card entry, Apple Pay, Google Pay etc.
      window.location.href = payment_url;

    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Checkout failed. Please try again.");
      setProcessing(false);
    }
    // Don't setProcessing(false) here — user is navigating away
  };

  const isFreePlan = Number(plan?.price) === 0;
  const inputCls   = "w-full px-3 py-2 border border-border rounded-lg text-sm";

  if (loading || (isFreePlan && processing)) {
    return (
      <DashboardLayout>
        <div className="min-h-[90vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!plan) return null;

  return (
    <DashboardLayout>
      <div className="min-h-[90vh] bg-bg-base py-10 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-text-secondary hover:text-text-heading mb-8 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Plans
          </button>

          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* LEFT — Gateway picker + pay button */}
            <div className="lg:col-span-3 space-y-5">

              {/* Gateway selection */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-text-heading mb-1">Choose Payment Method</h2>
                <p className="text-sm text-text-muted mb-5">
                  You will be securely redirected to complete payment. Card details are never stored by BizMate AI.
                </p>

                <div className="space-y-3">
                  {GATEWAY_OPTIONS.map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setGateway(gw.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        gateway === gw.id
                          ? "border-secondary bg-brand-light"
                          : "border-border bg-bg-base hover:border-border-strong hover:bg-surface"
                      }`}
                    >
                      {/* Radio dot */}
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        gateway === gw.id ? "border-secondary" : "border-border"
                      }`}>
                        {gateway === gw.id && <div className="w-2 h-2 rounded-full bg-secondary" />}
                      </div>

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0">
                        {gw.icon}
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${gateway === gw.id ? "text-secondary" : "text-text-heading"}`}>
                            {gw.label}
                          </span>
                          {gw.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                              {gw.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{gw.sublabel}</p>
                      </div>

                      <span className="text-xs text-text-muted flex-shrink-0">{gw.region}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Apple Pay / Google Pay note */}
              <div className="flex items-start gap-3 p-4 bg-bg-base border border-border rounded-xl">
                <Zap className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted leading-relaxed">
                  <strong className="text-text-secondary">Apple Pay and Google Pay</strong> appear automatically on supported devices when using Telr, Stripe, or Tap — no extra setup required.
                </p>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Lock className="w-3.5 h-3.5" />
                <span>256-bit SSL encryption · PCI DSS compliant · No card data stored by BizMate AI</span>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-secondary text-on-brand rounded-xl font-bold text-base hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              >
                {processing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting to payment…</>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Pay AED {Number(plan.price).toFixed(2)} securely with {GATEWAY_OPTIONS.find(g => g.id === gateway)?.label}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-text-muted">
                By clicking Pay, you agree to our{" "}
                <a href="#" className="text-secondary hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-secondary hover:underline">Privacy Policy</a>.
              </p>
            </div>

            {/* RIGHT — Plan summary */}
            <div className="lg:col-span-2 lg:sticky lg:top-6">
              <CheckoutPlanSummary plan={plan} isFreePlan={isFreePlan} />

              {/* Trust badges */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { icon: "🔒", label: "SSL Secured" },
                  { icon: "✅", label: "PCI Compliant" },
                  { icon: "🔄", label: "Cancel Anytime" },
                  { icon: "🏦", label: "Bank-grade Security" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 p-2.5 bg-surface border border-border rounded-lg">
                    <span className="text-base">{badge.icon}</span>
                    <span className="text-xs font-medium text-text-secondary">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="min-h-[90vh] flex items-center justify-center"><LoadingSpinner /></div></DashboardLayout>}>
      <CheckoutInner />
    </Suspense>
  );
}
