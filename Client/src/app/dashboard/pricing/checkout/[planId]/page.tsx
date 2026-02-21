"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  Check,
  Lock,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  ChevronRight,
  CircleCheck,
  Wallet,
  Landmark,
  Clock,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import Card from "@/components/ui/Card";

// ======================== TYPES ========================
type PaymentMethod = "card" | "paypal" | "stripe";
type SubscriptionAction = "subscribe" | "upgrade" | "downgrade";

interface PlanDetails {
  uuid: string;
  name: string;
  description?: string;
  price: number | string;
  duration_days: number;
  features?: Record<string, boolean | string | number>;
}

interface CardForm {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

// ======================== HELPERS ========================
const formatCardNumber = (value: string) =>
  value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const getCardBrand = (number: string) => {
  const n = number.replace(/\s/g, "");
  if (n.startsWith("4")) return "VISA";
  if (n.startsWith("5") || n.startsWith("2")) return "MC";
  if (n.startsWith("3")) return "AMEX";
  return null;
};

// ======================== PAYMENT METHODS ========================
const paymentMethods: {
  id: PaymentMethod;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}[] = [
    {
      id: "stripe",
      label: "Stripe",
      sublabel: "PCI compliant",
      icon: <Landmark className="w-5 h-5" />,
    },
    {
      id: "card",
      label: "Card",
      sublabel: "Credit / Debit",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "paypal",
      label: "PayPal",
      sublabel: "Buyer protected",
      icon: <Wallet className="w-5 h-5" />,
    },
  ];

// ======================== MAIN PAGE ========================
export default function CheckoutPage() {
  const { planId } = useParams<{ planId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action") as SubscriptionAction | null;

  const { user } = useAuth();
  const userId = user?.user?.user_id;

  const [plan, setPlan] = useState<PlanDetails | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("stripe");

  const [cardForm, setCardForm] = useState<CardForm>({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [paypalEmail, setPaypalEmail] = useState("");
  const [stripeEmail, setStripeEmail] = useState("");
  const [stripeCard, setStripeCard] = useState<CardForm>({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // ===================== FETCH PLAN =====================
  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId || !userId) return;
      setLoadingPlan(true);
      try {
        const plansRes = await axiosInstance.get("/subscription_plan/all");
        const plans: PlanDetails[] = plansRes.data.plans || [];
        const found = plans.find((p) => p.uuid === planId);
        if (!found) {
          toast.error("Plan not found");
          router.back();
          return;
        }
        setPlan(found);
      } catch {
        toast.error("Failed to load plan details");
        router.back();
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [planId, userId, router]);

  // Validate action parameter (fallback to redirect if missing/invalid)
  useEffect(() => {
    if (!actionParam || !["subscribe", "upgrade", "downgrade"].includes(actionParam)) {
      toast.error("Invalid subscription action");
      router.back();
    }
  }, [actionParam, router]);

  // ===================== SUBMIT (CORRECTED ORDER) =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !userId || !actionParam) return;
    setProcessing(true);

    try {
      // ── Step 1: Create/update subscription (subscribe/upgrade/downgrade) ───
      let subscriptionRes;
      const subscriptionPayload = { planId: plan.uuid };

      if (actionParam === "subscribe") {
        subscriptionRes = await axiosInstance.post(
          `/subscription_plan/subscribe/${userId}`,
          subscriptionPayload
        );
      } else if (actionParam === "upgrade") {
        subscriptionRes = await axiosInstance.post(
          `/subscription_plan/upgrade/${userId}`,
          subscriptionPayload
        );
      } else if (actionParam === "downgrade") {
        subscriptionRes = await axiosInstance.post(
          `/subscription_plan/downgrade/${userId}`,
          subscriptionPayload
        );
      } else {
        throw new Error("Invalid action");
      }

      if (!subscriptionRes.data?.success) throw new Error("Subscription activation failed");
      const subscription = subscriptionRes.data.subscription;
      const subscriptionId = subscription?.uuid || subscription?.id;
      if (!subscriptionId) throw new Error("Could not determine subscription ID");

      // ── Step 2: Create payment record using the subscription ID ────────────
      const paymentRes = await axiosInstance.post(
        `/subscription-payments/create/${subscriptionId}`,
        {
          amount: Number(plan.price),
          paymentMethod: selectedMethod,
        }
      );

      if (!paymentRes.data?.success) throw new Error("Payment initiation failed");
      const payment = paymentRes.data.payment;
      const paymentId = payment?.uuid || payment?.id;
      if (!paymentId) throw new Error("Could not determine payment ID");

      // ── Step 3: Mark payment as completed ───────────────────────────────────
      const statusRes = await axiosInstance.post(`/subscription-payments/status/${paymentId}`, {
        status: "completed",
        transactionId: `TXN-${Date.now()}`,
        paidAt: new Date().toISOString(),
      });

      if (!statusRes.data?.success) throw new Error("Payment confirmation failed");

      // ── All done ───────────────────────────────────────────────────────────
      setSuccess(true);
      setTimeout(() => router.back(), 3000);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.log("Payment Failed", error)
    } finally {
      setProcessing(false);
    }
  };

  // ===================== SUCCESS =====================
  if (success) {
    return (
      <DashboardLayout>
        <div className="min-h-[90vh] flex items-center justify-center bg-[#F4F7FA]">
          <Card className=" p-12 max-w-sm w-full mx-4 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-40" />
              <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CircleCheck className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#1B2A49] mb-2">Payment Confirmed!</h2>
            <p className="text-[#6B7A99] text-sm leading-relaxed">
              Your <span className="font-semibold text-[#1B2A49]">{plan?.name}</span> plan is now active. Enjoy your access!
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#A0ADBE]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Redirecting you back to plans...</span>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // ===================== LOADING =====================
  if (loadingPlan) {
    return (
      <DashboardLayout>
        <div className="min-h-[90vh] flex items-center justify-center bg-[#F4F7FA]">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!plan || !actionParam) return null;

  const isFreePlan = Number(plan.price) === 0;
  const featureEntries = Object.entries(plan.features || {}).slice(0, 6);
  const cardBrand = getCardBrand(cardForm.cardNumber);

  return (
    <DashboardLayout>
      <div className="min-h-[90vh] bg-[#F4F7FA] py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-[#6B7A99] hover:text-[#1B2A49] mb-8 text-sm font-medium transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to Plans
          </button>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* LEFT COLUMN – Payment form */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 pt-7 pb-6 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-[#1B2A49]">Complete your purchase</h2>
                <p className="text-sm text-[#8A97B0] mt-1">
                  Choose your preferred payment method below
                </p>
              </div>

              <div className="px-8 py-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A0ADBE] mb-3">
                  Payment Method
                </p>
                <div className="flex gap-3 mb-8">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex-1 flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border-2 transition-all duration-200 cursor-pointer
                        ${selectedMethod === method.id
                          ? "border-[#1B2A49] bg-[#1B2A49] text-white shadow-md shadow-[#1B2A49]/20 scale-[1.02]"
                          : "border-gray-200 bg-gray-50 text-[#6B7A99] hover:border-gray-300 hover:bg-white hover:text-[#1B2A49]"
                        }`}
                    >
                      {method.icon}
                      <span className="text-[11px] font-bold leading-none">{method.label}</span>
                      <span className={`text-[9px] leading-none font-medium ${selectedMethod === method.id ? "text-white/60" : "text-[#B0BAC9]"}`}>
                        {method.sublabel}
                      </span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Card Form */}
                  {selectedMethod === "card" && (
                    <>
                      <FormField
                        label="Cardholder Name"
                        placeholder="John Doe"
                        value={cardForm.cardHolder}
                        onChange={(v) => setCardForm({ ...cardForm, cardHolder: v })}
                        required
                        autoComplete="cc-name"
                      />
                      <div className="relative">
                        <FormField
                          label="Card Number"
                          placeholder="1234  5678  9012  3456"
                          value={cardForm.cardNumber}
                          onChange={(v) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(v) })}
                          maxLength={19}
                          required
                          autoComplete="cc-number"
                          inputMode="numeric"
                        />
                        {cardBrand && (
                          <span className="absolute right-3.5 top-[34px] text-[9px] font-black tracking-widest text-[#1B2A49] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                            {cardBrand}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Expiry Date"
                          placeholder="MM / YY"
                          value={cardForm.expiry}
                          onChange={(v) => setCardForm({ ...cardForm, expiry: formatExpiry(v) })}
                          maxLength={5}
                          required
                          autoComplete="cc-exp"
                          inputMode="numeric"
                        />
                        <FormField
                          label="CVV"
                          placeholder="• • •"
                          value={cardForm.cvv}
                          onChange={(v) => setCardForm({ ...cardForm, cvv: v.replace(/\D/g, "").slice(0, 4) })}
                          type="password"
                          maxLength={4}
                          required
                          autoComplete="cc-csc"
                          inputMode="numeric"
                          hint="3–4 digits on back of card"
                        />
                      </div>
                    </>
                  )}

                  {/* PayPal Form */}
                  {selectedMethod === "paypal" && (
                    <>
                      <div className="flex items-center gap-3.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#003087] flex items-center justify-center shrink-0 shadow-sm">
                          <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1B2A49]">Secure PayPal Checkout</p>
                          <p className="text-xs text-[#6B7A99] mt-0.5">
                            Buyer protection included on every purchase
                          </p>
                        </div>
                      </div>
                      <FormField
                        label="PayPal Email Address"
                        placeholder="you@paypal.com"
                        type="email"
                        value={paypalEmail}
                        onChange={setPaypalEmail}
                        required
                        autoComplete="email"
                      />
                      <p className="text-xs text-[#A0ADBE] flex items-start gap-1.5 -mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        You&apos;ll be redirected to PayPal to complete your payment securely.
                      </p>
                    </>
                  )}

                  {/* Stripe Form */}
                  {selectedMethod === "stripe" && (
                    <>
                      <div className="flex items-center gap-3.5 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#635BFF] flex items-center justify-center shrink-0 shadow-sm">
                          <Landmark className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1B2A49]">Stripe Secure Payment</p>
                          <p className="text-xs text-[#6B7A99] mt-0.5">
                            PCI DSS Level 1 certified · Bank-level encryption
                          </p>
                        </div>
                      </div>
                      <FormField
                        label="Email Address"
                        placeholder="you@example.com"
                        type="email"
                        value={stripeEmail}
                        onChange={setStripeEmail}
                        required
                        autoComplete="email"
                      />
                      <div className="relative">
                        <FormField
                          label="Card Number"
                          placeholder="1234  5678  9012  3456"
                          value={stripeCard.cardNumber}
                          onChange={(v) => setStripeCard({ ...stripeCard, cardNumber: formatCardNumber(v) })}
                          maxLength={19}
                          required
                          autoComplete="cc-number"
                          inputMode="numeric"
                        />
                      </div>
                      <FormField
                        label="Cardholder Name"
                        placeholder="John Doe"
                        value={stripeCard.cardHolder}
                        onChange={(v) => setStripeCard({ ...stripeCard, cardHolder: v })}
                        required
                        autoComplete="cc-name"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Expiry Date"
                          placeholder="MM / YY"
                          value={stripeCard.expiry}
                          onChange={(v) => setStripeCard({ ...stripeCard, expiry: formatExpiry(v) })}
                          maxLength={5}
                          required
                          autoComplete="cc-exp"
                          inputMode="numeric"
                        />
                        <FormField
                          label="CVV"
                          placeholder="• • •"
                          value={stripeCard.cvv}
                          onChange={(v) => setStripeCard({ ...stripeCard, cvv: v.replace(/\D/g, "").slice(0, 4) })}
                          type="password"
                          maxLength={4}
                          required
                          autoComplete="cc-csc"
                          inputMode="numeric"
                        />
                      </div>
                    </>
                  )}

                  {/* Security note */}
                  <div className="flex items-center gap-2 pt-1 pb-1">
                    <Lock className="w-3.5 h-3.5 text-[#A0ADBE] shrink-0" />
                    <span className="text-xs text-[#A0ADBE]">
                      256-bit SSL encrypted · Your card data is never stored on our servers
                    </span>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full relative flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1B2A49] hover:bg-[#243868] active:scale-[0.99] text-white font-semibold text-[14px] transition-all duration-200 shadow-md shadow-[#1B2A49]/20 hover:shadow-lg hover:shadow-[#1B2A49]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>
                          {isFreePlan
                            ? "Activate Free Plan"
                            : `Pay AED ${plan.price} Securely`}
                        </span>
                        <ChevronRight className="w-4 h-4 shrink-0 absolute right-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#B0BAC9]">
                    By subscribing you agree to our{" "}
                    <span className="underline cursor-pointer hover:text-[#6B7A99] transition-colors">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="underline cursor-pointer hover:text-[#6B7A99] transition-colors">
                      Privacy Policy
                    </span>
                  </p>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN – Plan summary */}
            <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Dark header */}
                <div className="relative bg-[#1B2A49] px-6 py-6 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/[0.04] pointer-events-none" />
                  <div className="absolute -bottom-8 -left-5 w-28 h-28 rounded-full bg-white/[0.03] pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1">
                        <Sparkles className="w-3 h-3 text-white/70" />
                        <span className="text-white/85 text-[11px] font-semibold">{plan.name} Plan</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                        Selected
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-1">
                      {!isFreePlan && (
                        <span className="text-[15px] font-semibold text-white/45 tracking-wider">AED</span>
                      )}
                      <span className="text-[42px] font-black text-white tracking-tight leading-none">
                        {isFreePlan ? "Free" : plan.price}
                      </span>
                    </div>
                    {!isFreePlan && (
                      <p className="text-white/40 text-sm font-medium">per {plan.duration_days} days</p>
                    )}
                    {plan.description && (
                      <p className="text-white/45 text-[13px] mt-2.5 leading-relaxed">{plan.description}</p>
                    )}
                  </div>
                </div>

                {/* Access period banner */}
                <div className="mx-5 -mt-3 relative z-10">
                  <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-md shadow-gray-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1B2A49] flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#1B2A49] uppercase tracking-wide">Access Period</p>
                        <p className="text-xs text-[#6B7A99]">Full access included</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#1B2A49] leading-none">{plan.duration_days}</p>
                      <p className="text-[10px] font-semibold text-[#6B7A99] uppercase tracking-wide">Days</p>
                    </div>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="px-6 pt-5 pb-5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8A97B0]">{plan.name} Subscription</span>
                    <span className="font-semibold text-[#1B2A49]">
                      {isFreePlan ? "Free" : <><span className="text-[10px] font-medium text-[#8A97B0] mr-0.5">AED</span>{plan.price}</>}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8A97B0]">Taxes &amp; Fees</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-[#1B2A49] text-sm">Total Due Today</span>
                    <span className="text-xl font-black text-[#1B2A49]">
                      {isFreePlan ? "Free" : <><span className="text-xs font-semibold text-[#8A97B0] mr-1">AED</span>{plan.price}</>}
                    </span>
                  </div>
                </div>

                {/* Features */}
                {featureEntries.length > 0 && (
                  <div className="border-t border-gray-100 px-6 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A0ADBE] mb-3.5">What&apos;s Included</p>
                    <ul className="space-y-2.5">
                      {featureEntries.map(([key, value]) => (
                        <li key={key} className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-green-500" />
                          </span>
                          <span className="text-sm text-[#344767] capitalize">
                            {key.replace(/_/g, " ")}
                            {typeof value !== "boolean" && (
                              <span className="text-[#A0ADBE] ml-1 text-xs">({String(value)})</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                <div className="grid grid-cols-3 gap-1 text-center divide-x divide-gray-100">
                  {[
                    { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure", sub: "256-bit SSL" },
                    { icon: <Lock className="w-4 h-4" />, label: "Private", sub: "No data sold" },
                    { icon: <CalendarDays className="w-4 h-4" />, label: "Cancel", sub: "Anytime" },
                  ].map((b) => (
                    <div key={b.label} className="px-2">
                      <div className="w-8 h-8 rounded-lg bg-[#F4F7FA] flex items-center justify-center mx-auto text-[#6B7A99]">
                        {b.icon}
                      </div>
                      <p className="text-[11px] font-bold text-[#1B2A49] mt-1.5">{b.label}</p>
                      <p className="text-[10px] text-[#A0ADBE]">{b.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need help */}
              <p className="text-center text-xs text-[#A0ADBE]">
                Questions?{" "}
                <span className="text-[#6B7A99] font-medium cursor-pointer hover:text-[#1B2A49] transition-colors underline underline-offset-2">
                  Contact support
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ======================== FORM FIELD ========================
interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  maxLength,
  required,
  autoComplete,
  inputMode,
  hint,
}: FormFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-[#344767] tracking-wide">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[10px] text-[#B0BAC9]">{hint}</span>}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1B2A49] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B2A49]/15 focus:border-[#1B2A49] transition-all duration-150 bg-gray-50 hover:bg-white hover:border-gray-300"
      />
    </div>
  );
}