"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, CircleCheck } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import Card from "@/components/ui/Card";
import CheckoutPaymentForm, { PaymentMethod, CardForm } from "@/components/checkout-form/CheckoutPaymentForm";
import CheckoutPlanSummary from "@/components/check-out-plan-summary/Checkoutplansummary";

// ================= TYPES =================
type SubscriptionAction = "subscribe" | "upgrade" | "downgrade";

interface PlanDetails {
  uuid: string;
  name: string;
  description?: string;
  price: number | string;
  duration_days: number;
  features?: Record<string, boolean | string | number>;
}

const EMPTY_CARD: CardForm = {
  cardHolder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

// ================= MAIN PAGE =================
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
  const [cardForm, setCardForm] = useState<CardForm>(EMPTY_CARD);
  const [stripeCard, setStripeCard] = useState<CardForm>(EMPTY_CARD);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [stripeEmail, setStripeEmail] = useState("");

  // ─────────────────────────────────────────────────────────────
  // API: GET /subscription_plan/all
  // Finds the plan matching planId from URL params.
  // ─────────────────────────────────────────────────────────────
  const fetchPlan = async () => {
    if (!planId || !userId) return;
    setLoadingPlan(true);
    try {
      const res = await axiosInstance.get("/subscription_plan/all");
      const plans: PlanDetails[] = res.data.plans || [];
      const found = plans.find((p) => p.uuid === planId);
      if (!found) {
        toast.error("Plan not found");
        router.back();
        return;
      }
      setPlan(found);
    } catch (error) {
      console.error("fetchPlan failed:", error);
      toast.error("Failed to load plan details");
      router.back();
    } finally {
      setLoadingPlan(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [planId, userId]);

  // Validate action param — redirect if missing or unrecognised
  useEffect(() => {
    if (!actionParam || !["subscribe", "upgrade", "downgrade"].includes(actionParam)) {
      toast.error("Invalid subscription action");
      router.back();
    }
  }, [actionParam]);

  // ─────────────────────────────────────────────────────────────
  // API: POST /subscription_plan/subscribe|upgrade|downgrade/:userId
  // Body: { planId }
  // Returns subscriptionId to pass to the next step.
  // ─────────────────────────────────────────────────────────────
  const activateSubscription = async (): Promise<string | null> => {
    try {
      const payload = { planId: plan!.uuid };
      let res;

      if (actionParam === "subscribe") {
        res = await axiosInstance.post(`/subscription_plan/subscribe/${userId}`, payload);
      } else if (actionParam === "upgrade") {
        res = await axiosInstance.post(`/subscription_plan/upgrade/${userId}`, payload);
      } else {
        res = await axiosInstance.post(`/subscription_plan/downgrade/${userId}`, payload);
      }

      const subscriptionId = res.data?.subscription?.uuid || res.data?.subscription?.id;
      return subscriptionId || null;
    } catch (error) {
      console.error("activateSubscription failed:", error);
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // API: POST /subscription-payments/create/:subscriptionId
  // Body: { amount, paymentMethod }
  // Returns paymentId to pass to the confirm step.
  // ─────────────────────────────────────────────────────────────
  const createPaymentRecord = async (subscriptionId: string): Promise<string | null> => {
    try {
      const res = await axiosInstance.post(
        `/subscription-payments/create/${subscriptionId}`,
        {
          amount: Number(plan!.price),
          paymentMethod: selectedMethod,
        }
      );
      const paymentId = res.data?.payment?.uuid || res.data?.payment?.id;
      return paymentId || null;
    } catch (error) {
      console.error("createPaymentRecord failed:", error);
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // API: POST /subscription-payments/status/:paymentId
  // Body: { status, transactionId, paidAt }
  // Marks the payment as completed.
  // ─────────────────────────────────────────────────────────────
  const confirmPayment = async (paymentId: string): Promise<boolean> => {
    try {
      await axiosInstance.post(`/subscription-payments/status/${paymentId}`, {
        status: "completed",
        transactionId: `TXN-${Date.now()}`,
        paidAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("confirmPayment failed:", error);
      return false;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SUBMIT — calls the 3 API steps in order:
  // 1. activateSubscription  → subscriptionId
  // 2. createPaymentRecord   → paymentId
  // 3. confirmPayment        → done
  // If any step fails it shows a toast and stops.
  // ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !userId || !actionParam) return;
    setProcessing(true);

    try {
      const subscriptionId = await activateSubscription();
      if (!subscriptionId) {
        toast.error("Failed to activate subscription. Please try again.");
        return;
      }

      const paymentId = await createPaymentRecord(subscriptionId);
      if (!paymentId) {
        toast.error("Failed to create payment record. Please try again.");
        return;
      }

      const confirmed = await confirmPayment(paymentId);
      if (!confirmed) {
        toast.error("Payment confirmation failed. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.back(), 3000);
    } catch (error) {
      console.error("handleSubmit failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // ================= SUCCESS STATE =================
  if (success) {
    return (
      <DashboardLayout>
        <div className="min-h-[90vh] flex items-center justify-center bg-bg-base">
          <Card className="p-12 max-w-sm w-full mx-4 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-status-success-bg animate-ping opacity-40" />
              <div className="relative w-20 h-20 bg-status-success-bg rounded-full flex items-center justify-center">
                <CircleCheck className="w-10 h-10 text-status-success" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text-heading mb-2">
              Payment Confirmed!
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your{" "}
              <span className="font-semibold text-text-heading">{plan?.name}</span>{" "}
              plan is now active. Enjoy your access!
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Redirecting you back to plans...</span>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // ================= LOADING STATE =================
  if (loadingPlan) {
    return (
      <DashboardLayout>
        <div className="min-h-[90vh] flex items-center justify-center bg-bg-base">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!plan || !actionParam) return null;

  const isFreePlan = Number(plan.price) === 0;

  // ================= RENDER =================
  return (
    <DashboardLayout>
      <div className="min-h-[90vh] bg-bg-base py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-text-secondary hover:text-text-heading mb-8 text-sm font-medium transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to Plans
          </button>

          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* LEFT — Payment form */}
            <div className="lg:col-span-3">
              <CheckoutPaymentForm
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
                cardForm={cardForm}
                onCardFormChange={setCardForm}
                stripeCard={stripeCard}
                onStripeCardChange={setStripeCard}
                paypalEmail={paypalEmail}
                onPaypalEmailChange={setPaypalEmail}
                stripeEmail={stripeEmail}
                onStripeEmailChange={setStripeEmail}
                processing={processing}
                isFreePlan={isFreePlan}
                price={plan.price}
                onSubmit={handleSubmit}
              />
            </div>

            {/* RIGHT — Plan summary (sticky on desktop) */}
            <div className="lg:col-span-2 lg:sticky lg:top-6">
              <CheckoutPlanSummary
                plan={plan}
                isFreePlan={isFreePlan}
              />
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}