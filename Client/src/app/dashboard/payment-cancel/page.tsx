"use client";
// src/app/dashboard/payment/cancel/page.tsx

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

function PaymentCancelInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const orderRef     = searchParams.get("order_ref");

  return (
    <DashboardLayout>
      <div className="min-h-[90vh] flex items-center justify-center bg-bg-base p-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-10 text-center shadow-lg">

          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center border border-red-200">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-text-heading mb-2">Payment Cancelled</h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Your payment was cancelled and no charge was made. You can try again at any time.
          </p>

          {orderRef && (
            <p className="text-xs text-text-muted mb-6">
              Reference: <span className="font-mono">{orderRef}</span>
            </p>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard/pricing")}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-secondary text-on-brand rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-border text-text-secondary rounded-xl font-medium hover:bg-bg-base transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div />}>
      <PaymentCancelInner />
    </Suspense>
  );
}
