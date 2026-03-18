"use client";

/**
 * SubscriptionContext
 *
 * Single source of truth for the current user's subscription and plan.
 * Fetches once on mount (when userId is available), caches in context,
 * and exposes a refresh() to re-fetch after plan changes.
 *
 * All subscription-related components read from here — zero duplicate API calls.
 *
 * Usage:
 *   const { subscription, currentPlan, features, isLoading, refresh } = useSubscription();
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exact feature keys from backend API response.
 *
 * Limit value conventions:
 *   -1  → Unlimited
 *    0  → Not available on this plan
 *   >0  → Exact cap
 */
export interface SubscriptionFeatures {
  // Invoicing
  invoice_limit_per_month?: number | string;
  // AI
  ai_messages_per_month?: number | string;
  whatsapp_ai?: boolean;
  instagram_auto_reply?: boolean;
  custom_ai_training?: boolean;
  priority_ai_compute?: boolean;
  // Documents
  document_templates?: number | string;
  document_generator?: boolean;
  pdf_export?: boolean;
  // Platform
  dashboard_access?: boolean;
  notifications?: boolean;
  analytics?: boolean;
  // Compliance & Reminders
  vat_reminder?: boolean;
  vat_auto_calculation?: boolean;
  smart_reminders?: boolean;
  payroll_reminders?: boolean;
  // Finance
  expense_tracking?: boolean;
  payment_integrations?: boolean;
  // Team & HR
  team_members?: number | string;
  employee_contract_generator?: boolean;
  // Integrations & Dev
  integration_access?: boolean;
  api_access?: boolean;
  // Support
  email_support?: boolean;
  priority_support?: boolean;
  dedicated_support?: boolean;
}

export interface SubscriptionPlan {
  id: number;
  uuid: string;
  name: string;
  description: string;
  features: SubscriptionFeatures;
  price: string | number;
  duration_days: number;
  is_active: boolean;
}

export interface UserSubscription {
  uuid: string; // subscription UUID — used for usage API calls
  plan_id: string; // matches SubscriptionPlan.uuid
  user_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface SubscriptionContextValue {
  /** The user's active subscription record (null if none) */
  subscription: UserSubscription | null;
  /** Full plan object resolved from subscription.plan_id */
  currentPlan: SubscriptionPlan | null;
  /** Shortcut to currentPlan.features (null if no plan) */
  features: SubscriptionFeatures | null;
  /** All available plans from the backend */
  allPlans: SubscriptionPlan[];
  /** True while initial fetch is in progress */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Call after subscribe / upgrade / cancel to re-sync context */
  refresh: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userId = user?.user?.user_id;

  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!userId) {
      // User logged out — clear state
      setSubscription(null);
      setAllPlans([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [plansRes, subRes] = await Promise.all([
        axiosInstance.get<{ plans: SubscriptionPlan[] }>(
          "/subscription_plan/all",
        ),
        axiosInstance.get<{ subscription: UserSubscription | null }>(
          `/subscription_plan/user_current/${userId}`,
        ),
      ]);

      setAllPlans(plansRes.data.plans || []);
      setSubscription(subRes.data.subscription || null);
    } catch (err) {
      console.error("[SubscriptionContext] fetch failed:", err);
      setError("Failed to load subscription data.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch on mount and whenever userId changes (login / logout / account switch)
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Resolve full plan object from subscription.plan_id
  const currentPlan = useMemo(
    () =>
      subscription
        ? (allPlans.find((p) => p.uuid === subscription.plan_id) ?? null)
        : null,
    [subscription, allPlans],
  );

  const features = currentPlan?.features ?? null;

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      subscription,
      currentPlan,
      features,
      allPlans,
      isLoading,
      error,
      refresh: fetchSubscription,
    }),
    [
      subscription,
      currentPlan,
      features,
      allPlans,
      isLoading,
      error,
      fetchSubscription,
    ],
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
        "Wrap your app (or dashboard layout) with <SubscriptionProvider>.",
    );
  }
  return ctx;
}
