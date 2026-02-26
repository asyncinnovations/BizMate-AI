"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Building2, Rocket, LucideIcon } from "lucide-react";
import PlanCard, { SubscriptionFeatures } from "@/components/plan-card/PlanCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import { useRouter } from "next/navigation";

// ================= TYPES =================
interface PlanFromAPI {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  duration_days: number;
  features?: SubscriptionFeatures;
  is_active?: boolean;
  uuid: string;
}

interface CurrentSubscription {
  planId: string;
  price: number;
}

// ================= ICON MAP =================
const planIcons: Record<string, React.ElementType> = {
  Starter: Sparkles,
  Standard: Building2,
  Premium: Rocket,
  Trial: Sparkles,
};

export default function PricingPage() {
  const { user } = useAuth();
  const userId = user?.user?.user_id;
  const router = useRouter();

  const [allPlans, setAllPlans] = useState<PlanFromAPI[]>([]);
  const [currentPlan, setCurrentPlan] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────
  // API: GET /subscription_plan/all
  // Returns: { plans: PlanFromAPI[] }
  // ─────────────────────────────────────────
  const fetchAllPlans = async () => {
    try {
      const res = await axiosInstance.get("/subscription_plan/all");
      setAllPlans(res.data.plans || []);
    } catch (error) {
      console.error("fetchAllPlans failed:", error);
      toast.error("Failed to fetch plans");
    }
  };

  // ─────────────────────────────────────────
  // API: GET /subscription_plan/user_current/:userId
  // Returns: { subscription: { plan_id } }
  // ─────────────────────────────────────────
  const fetchCurrentPlan = async () => {
    if (!userId) return;
    try {
      const res = await axiosInstance.get(`/subscription_plan/user_current/${userId}`);
      const sub = res.data?.subscription;
      if (sub) setCurrentPlan({ planId: sub.plan_id, price: 0 });
    } catch (error) {
      console.error("fetchCurrentPlan failed:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([fetchAllPlans(), fetchCurrentPlan()]).finally(() =>
      setLoading(false)
    );
  }, [userId]);

  // ================= HELPERS =================

  // Starter = free plan (price === 0)
  const starterPlan = allPlans.find((p) => Number(p.price) === 0);

  // User is on starter / no sub when: no subscription OR current plan IS the starter
  const isOnStarterOrNoSub =
    !currentPlan ||
    (starterPlan !== undefined && currentPlan.planId === starterPlan.uuid);

  const hasActivePaidSub = !isOnStarterOrNoSub;

  // ── Determine CTA label + action per plan ──
  const getPlanState = (plan: PlanFromAPI) => {
    const isPlanStarter = Number(plan.price) === 0;

    if (!currentPlan) {
      if (isPlanStarter) {
        return { label: "Current Plan", action: null, disabled: true, isCurrent: false };
      }
      return { label: "Buy Now", action: "subscribe", disabled: false, isCurrent: false };
    }

    const currentPlanObj = allPlans.find((p) => p.uuid === currentPlan.planId);
    const currentPrice = Number(currentPlanObj?.price ?? 0);
    const planPrice = Number(plan.price);

    if (isPlanStarter && hasActivePaidSub) {
      return { label: "Not Available", action: null, disabled: true, isCurrent: false };
    }

    if (plan.uuid === currentPlan.planId) {
      return { label: "Current Plan", action: null, disabled: true, isCurrent: true };
    }

    if (planPrice > currentPrice) {
      return { label: "Upgrade", action: "upgrade", disabled: false, isCurrent: false };
    }

    if (planPrice < currentPrice) {
      return { label: "Downgrade", action: "downgrade", disabled: false, isCurrent: false };
    }

    return { label: "Buy Now", action: "subscribe", disabled: false, isCurrent: false };
  };

  // ── Navigate to checkout ──
  const handlePlanClick = (plan: PlanFromAPI) => {
    const state = getPlanState(plan);
    if (!state.action || !userId) return;
    router.push(`/dashboard/pricing/checkout/${plan.uuid}?action=${state.action}`);
  };

  // ================= RENDER =================
  return (
    <DashboardLayout>
      <div className="min-h-[90vh] pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center my-10">
            <h1 className="text-3xl font-semibold text-text-heading">
              Select your plan
            </h1>
            {hasActivePaidSub && (
              <p className="text-text-primary mt-2 text-sm">
                You have an active subscription. Upgrade or manage your plan below.
              </p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-10">
              <LoadingSpinner />
            </div>
          )}

          {/* Empty */}
          {!loading && allPlans.length === 0 && (
            <div className="text-center py-10">
              <p className="text-text-primary text-lg">
                No subscription plans available.
              </p>
            </div>
          )}

          {/* Plans grid */}
          {!loading && allPlans.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {allPlans.map((plan) => {
                const Icon = planIcons[plan.name] || Sparkles;
                const state = getPlanState(plan);
                const isPlanStarter = Number(plan.price) === 0;
                const priceLabel = isPlanStarter ? "Free" : String(plan.price);
                const periodLabel = `/ ${plan.duration_days} days`;
                const showPopular = plan.name === "Standard" && isOnStarterOrNoSub;

                return (
                  <PlanCard
                    key={plan.uuid}
                    name={plan.name}
                    icon={Icon as LucideIcon}
                    description={plan.description || ""}
                    price={priceLabel}
                    period={periodLabel}
                    features={plan.features || {}}
                    cta={state.label}
                    isActive={state.isCurrent}
                    isStarter={isPlanStarter}
                    isPopular={showPopular}
                    isDisabledNotAvailable={state.label === "Not Available"}
                    onClickCTA={() => handlePlanClick(plan)}
                    disabledCTA={state.disabled}
                  />
                );
              })}
            </div>
          )}

          {/* Footer note */}
          <div className="text-center">
            <p className="text-text-primary mb-6">
              All plans include secure data storage and updates
            </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}