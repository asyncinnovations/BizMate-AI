"use client";

import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import EmptyState from "@/components/empty-state/EmptyState";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

// ================= TYPES =================
type PaymentStatus = "pending" | "completed" | "failed";
type PaymentMethod = "stripe" | "paypal" | "card";

interface SubscriptionPayment {
  id: string;
  user_subscription_id: string;
  payment_method: PaymentMethod;
  amount: number;
  payment_status: PaymentStatus;
  transaction_id?: string;
  paid_at?: string;
  created_at: string;
}

// ================= HELPERS =================
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatAmount = (amount: number): string =>
  `AED ${Number(amount).toFixed(2)}`;

const statusStyles: Record<PaymentStatus, string> = {
  completed:
    "bg-status-success-bg text-status-success border border-status-success-border",
  pending:
    "bg-status-warning-bg text-status-warning border border-status-warning-border",
  failed:
    "bg-status-error-bg text-status-error border border-status-error-border",
};

const statusLabel: Record<PaymentStatus, string> = {
  completed: "Paid",
  pending: "Pending",
  failed: "Failed",
};

const methodLabel: Record<PaymentMethod, string> = {
  stripe: "Stripe",
  paypal: "PayPal",
  card: "Card",
};

// ================= COMPONENT =================
const BillingHistory: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user?.user_id;

  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchBillingHistory();
  }, [userId]);

  const fetchBillingHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Get user's current subscription UUID
      const subRes = await axiosInstance.get(
        `/subscription_plan/user_current/${userId}`,
      );
      const subscriptionId = subRes.data?.subscription?.uuid;

      if (!subscriptionId) {
        setPayments([]);
        return;
      }

      // Step 2: Fetch all payments for that subscription
      const paymentsRes = await axiosInstance.get(
        `/subscription-payments/subscription/${subscriptionId}`,
      );
      setPayments(paymentsRes.data?.payments || []);
    } catch (err) {
      console.error("Failed to fetch billing history", err);
      setError("Failed to load billing history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard title="Billing History" icon={FileText}>
      {/* ── Loading ── */}
      {loading && (
        <div className="p-20 flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <EmptyState
          icon={FileText}
          title="Failed to load billing history"
          description={error}
          ctaLabel="Retry"
          onCTAClick={fetchBillingHistory}
        />
      )}

      {/* ── Empty ── */}
      {!loading && !error && payments.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No transactions yet"
          description="Your billing history will appear here after your first payment."
        />
      )}

      {/* ── Transactions list ── */}
      {!loading && !error && payments.length > 0 && (
        <div className="space-y-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-bg-base border border-border rounded-xl hover:border-border-strong hover:shadow-card transition-all"
            >
              {/* Left — date + method + txn id */}
              <div>
                <p className="text-sm font-semibold text-text-heading">
                  {formatDate(payment.paid_at || payment.created_at)}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {methodLabel[payment.payment_method] ??
                    payment.payment_method}
                  {payment.transaction_id && (
                    <span className="ml-1 text-text-muted">
                      · #{payment.transaction_id}
                    </span>
                  )}
                </p>
              </div>

              {/* Right — amount + status badge */}
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-text-heading">
                  {formatAmount(payment.amount)}
                </p>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    statusStyles[payment.payment_status] ??
                    "bg-bg-base text-text-muted border border-border"
                  }`}
                >
                  {statusLabel[payment.payment_status] ??
                    payment.payment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default BillingHistory;
