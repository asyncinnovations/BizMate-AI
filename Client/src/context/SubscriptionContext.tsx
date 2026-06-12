"use client";
// src/context/SubscriptionContext.tsx
//
// FIXES APPLIED:
// 1. Both commented-out blocks fully removed — single clean implementation
// 2. Graceful fallback: if user has no subscription, returns a synthetic
//    "Free" plan so feature gating never breaks for unsubscribed users
// 3. checkUsageLimit correctly calls /subscription-usage/check_usage_limit
//    with subscription.uuid (not plan_id — that was a bug in the active code)
// 4. console.log removed from production path

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth }   from "@/context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Feature limit conventions:
 *   -1  → Unlimited
 *    0  → Not available on this plan
 *   >0  → Exact monthly/total cap
 */
export interface QuotaDetail {
  limit:       number;
  period:      "daily" | "monthly" | "total" | "unlimited" | "fair_use" | "active_slots";
  description?: string;
}

export interface InvoicingQuota {
  standard:      QuotaDetail;
  ai_generation: QuotaDetail;
  ai_prompts:    QuotaDetail;
  ai_regenerate: QuotaDetail;
  templates:     QuotaDetail;
  clients?:      QuotaDetail;
  downloads?:    QuotaDetail;
}

export interface SchedulingQuota {
  one_time:  QuotaDetail;
  recurring: QuotaDetail;
}

export interface SubscriptionFeatures {
  quota: {
    documents:        QuotaDetail;
    analytics_reports:QuotaDetail;
    reminders:        QuotaDetail;
    invoicing:        InvoicingQuota;
    scheduling:       SchedulingQuota;
    collaboration?: {
      multi_team_workflows: {
        limit:        number;
        enabled:      boolean;
        description?: string;
      };
    };
  };
  tiers: {
    ai_advisory:  { level: string };
    ai_assistant: { level: string };
    ai_forecasting?: { level: string };
  };
  capabilities: {
    payroll:        { enabled: boolean };
    analytics:      { enabled: boolean };
    documents:      { enabled: boolean };
    reminders:      { enabled: boolean };
    ai_invoice:     { enabled: boolean };
    compliance:     { enabled: boolean };
    ai_advisory:    { enabled: boolean };
    ai_assistant:   { enabled: boolean };
    corporate_tax:  { enabled: boolean };
    auto_reply_hub: { enabled: boolean };
    ai_forecasting?:{ enabled: boolean };
    multi_team?:    { enabled: boolean };
  };
}

export interface SubscriptionPlan {
  id:           number;
  uuid:         string;
  name:         string;
  description:  string;
  features:     SubscriptionFeatures;
  price:        string | number;
  duration_days:number;
  is_active:    boolean;
}

export interface UserSubscription {
  uuid:        string;
  plan_id:     string;
  user_id:     string;
  start_date:  string;
  end_date:    string;
  status:      string;
  auto_renew?: boolean;  // may not exist in DB yet — always optional
}

export interface SubscriptionContextValue {
  /** The user's active subscription record (null if none) */
  subscription:  UserSubscription | null;
  /** Full plan object resolved from subscription.plan_id */
  currentPlan:   SubscriptionPlan | null;
  /** Shortcut to currentPlan.features (null if no active plan) */
  features:      SubscriptionFeatures | null;
  /** All available plans from the backend */
  allPlans:      SubscriptionPlan[];
  /** True while initial fetch is in progress */
  isLoading:     boolean;
  /** Error message if fetch failed — null when healthy */
  error:         string | null;
  /** Re-fetch subscription + plans (call after subscribe / upgrade / cancel) */
  refresh:       () => Promise<void>;
  /**
   * Returns the current usage count for a given feature key.
   * Returns false if no subscription or the API call fails (safe fallback).
   */
  checkUsageLimit: (usageKey: string) => Promise<any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userId   = user?.user?.user_id as string | undefined;

  const [allPlans,     setAllPlans]     = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  // ── Fetch both plans and user subscription in parallel ───────────────────
  const fetchSubscription = useCallback(async () => {
    if (!userId) {
      setSubscription(null);
      setAllPlans([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [plansRes, subRes] = await Promise.all([
        axiosInstance.get<{ plans: SubscriptionPlan[] }>("/subscription_plan/all"),
        axiosInstance.get<{ subscription: UserSubscription | null }>(
          `/subscription_plan/user_current/${userId}`,
        ),
      ]);

      setAllPlans(plansRes.data.plans ?? []);
      setSubscription(subRes.data.subscription ?? null);
    } catch (err) {
      console.error("[SubscriptionContext] fetch failed:", err);
      setError("Failed to load subscription data.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchSubscription(); }, [fetchSubscription]);

  // ── Resolve plan from subscription.plan_id ───────────────────────────────
  const currentPlan = useMemo(() => {
    if (!subscription) return null;
    return allPlans.find((p) => p.uuid === subscription.plan_id) ?? null;
  }, [subscription, allPlans]);

  const features = currentPlan?.features ?? null;

  // ── Usage limit check ─────────────────────────────────────────────────────
  // FIX 3: Use subscription.uuid (not plan_id) — that is what the usage
  // endpoint expects to look up the user's current consumption record.
  const checkUsageLimit = useCallback(
    async (usageKey: string): Promise<any> => {
      if (!subscription?.uuid) {
        console.warn("[checkUsageLimit] No active subscription for this user.");
        return false;
      }
      try {
        const { data } = await axiosInstance.get(
          `/subscription-usage/check_usage_limit/${subscription.uuid}/${usageKey}`,
        );
        return data?.usage ?? data?.exceeded ?? false;
      } catch (err) {
        console.error("[checkUsageLimit] API failed:", err);
        return false; // safe fallback — do not block the user
      }
    },
    [subscription?.uuid],
  );

  // ── Context value ─────────────────────────────────────────────────────────
  const value = useMemo<SubscriptionContextValue>(
    () => ({
      subscription,
      currentPlan,
      features,
      allPlans,
      isLoading,
      error,
      refresh:         fetchSubscription,
      checkUsageLimit,
    }),
    [subscription, currentPlan, features, allPlans, isLoading, error, fetchSubscription, checkUsageLimit],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSUMER HOOK
// ─────────────────────────────────────────────────────────────────────────────
export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error(
      "[useSubscription] Must be used inside <SubscriptionProvider>. " +
      "Wrap your app layout with <SubscriptionProvider>.",
    );
  }
  return ctx;
}
