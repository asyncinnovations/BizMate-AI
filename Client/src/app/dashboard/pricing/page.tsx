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
  const [loading, setLoading] = useState<boolean>(false);

  //////////////////////////////////////////////////////
  // Fetch All Plans
  //////////////////////////////////////////////////////
  const fetchAllPlans = async () => {
    try {
      const res = await axiosInstance.get("/subscription_plan/all");
      setAllPlans(res.data.plans || []);
      console.log("These are plans", res.data.plans);
    } catch (error) {
      console.error("Failed to fetch plans", error);
      toast.error("Failed to fetch plans");
    }
  };

  //////////////////////////////////////////////////////
  // Fetch Current User Subscription
  //////////////////////////////////////////////////////
  const fetchCurrentPlan = async () => {
    if (!userId) return;

    try {
      const res = await axiosInstance.get(`/subscription_plan/user_current/${userId}`);
      const sub = res.data?.subscription;

      if (sub) {
        setCurrentPlan({
          planId: sub.plan_id,
          price: 0,
        });
      }
    } catch (error) {
      console.log("No current subscription");
    }
  };

  //////////////////////////////////////////////////////
  // PAGE LOAD
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    Promise.all([fetchAllPlans(), fetchCurrentPlan()]).finally(() =>
      setLoading(false)
    );
  }, [userId]);

  //////////////////////////////////////////////////////
  // Helpers
  //////////////////////////////////////////////////////

  // Starter = free plan (price === 0)
  const starterPlan = allPlans.find((p) => Number(p.price) === 0);

  // User is on starter/no-sub when: no subscription OR current plan IS the starter
  const isOnStarterOrNoSub =
    !currentPlan ||
    (starterPlan !== undefined && currentPlan.planId === starterPlan.uuid);

  // User has a real paid subscription
  const hasActivePaidSub = !isOnStarterOrNoSub;

  //////////////////////////////////////////////////////
  // Determine CTA label + action per plan
  //////////////////////////////////////////////////////
  const getPlanState = (plan: PlanFromAPI) => {
    const isPlanStarter = Number(plan.price) === 0;

    // ── No subscription record at all ──
    if (!currentPlan) {
      if (isPlanStarter) {
        // Starter is the implicit default
        return { label: "Current Plan", action: null, disabled: true, isCurrent: false };
      }
      return { label: "Buy Now", action: "subscribe", disabled: false, isCurrent: false };
    }

    // ── User has a subscription record ──
    const currentPlanObj = allPlans.find((p) => p.uuid === currentPlan.planId);
    const currentPrice = Number(currentPlanObj?.price ?? 0);
    const planPrice = Number(plan.price);

    // Starter locked out when user has a paid plan
    if (isPlanStarter && hasActivePaidSub) {
      return { label: "Not Available", action: null, disabled: true, isCurrent: false };
    }

    // This IS the active paid plan
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

  //////////////////////////////////////////////////////
  // Handle Plan Click → Checkout
  //////////////////////////////////////////////////////
  const handlePlanClick = (plan: PlanFromAPI) => {
    const state = getPlanState(plan);
    if (!state.action || !userId) return;
    router.push(`/dashboard/pricing/checkout/${plan.uuid}?action=${state.action}`);
  };


  return (
    <DashboardLayout>
      <div className="min-h-[90vh] bg-[#F4F7FA] pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="text-center my-10">
            <h1 className="text-3xl font-semibold text-[#1B2A49]">
              Select your plan
            </h1>
            {hasActivePaidSub && (
              <p className="text-[#344767] mt-2 text-sm">
                You have an active subscription. Upgrade or manage your plan below.
              </p>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-10">
              <LoadingSpinner />
            </div>
          )}

          {/* EMPTY */}
          {!loading && allPlans.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#344767] text-lg">
                No subscription plans available.
              </p>
            </div>
          )}

          {/* PLANS */}
          {!loading && allPlans.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {allPlans.map((plan) => {
                const Icon = planIcons[plan.name] || Sparkles;
                const state = getPlanState(plan);
                const isPlanStarter = Number(plan.price) === 0;

                // Starter → pass "Free" as price, paid → pass raw number string
                const priceLabel = isPlanStarter
                  ? "Free"
                  : String(plan.price);

                // Period label for paid plans
                const periodLabel = `/ ${plan.duration_days} days`;

                // POPULAR only shown on Standard when user has no paid sub
                const showPopular =
                  plan.name === "Standard" && isOnStarterOrNoSub;

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

          {/* FOOTER */}
          <div className="text-center">
            <p className="text-[#344767] mb-6">
              All plans include secure data storage and updates
            </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}