// "use client";

// /**
//  * SubscriptionContext
//  *
//  * Single source of truth for the current user's subscription and plan.
//  * Fetches once on mount (when userId is available), caches in context,
//  * and exposes a refresh() to re-fetch after plan changes.
//  *
//  * All subscription-related components read from here — zero duplicate API calls.
//  *
//  * Usage:
//  *   const { subscription, currentPlan, features, isLoading, refresh } = useSubscription();
//  */

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   useMemo,
// } from "react";
// import axiosInstance from "@/utils/axiosInstance";
// import { useAuth } from "@/context/AuthContext";

// // ─────────────────────────────────────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────────────────────────────────────

// /**
//  * Exact feature keys from backend API response.
//  *
//  * Limit value conventions:
//  *   -1  → Unlimited
//  *    0  → Not available on this plan
//  *   >0  → Exact cap
//  */
// export interface SubscriptionFeatures {
//   ai_advisory: number | boolean;
//   corporate_tax: number | boolean;
//   ai_assistant: number | boolean;
//   ai_invoicing: number | boolean;
//   analytics_reports: number | boolean;
//   auto_reply_hub: number | boolean;
//   compliance: number | boolean;
//   documents: number | boolean;
//   invoicing: number | boolean;
//   payroll: number | boolean;
//   reminders: number | boolean;
//   // // Invoicing
//   // invoice_limit_per_month?: number | string;
//   // // AI
//   // ai_messages_per_month?: number | string;
//   // whatsapp_ai?: boolean;
//   // instagram_auto_reply?: boolean;
//   // custom_ai_training?: boolean;
//   // priority_ai_compute?: boolean;
//   // // Documents
//   // document_templates?: number | string;
//   // document_generator?: boolean;
//   // pdf_export?: boolean;
//   // // Platform
//   // dashboard_access?: boolean;
//   // notifications?: boolean;
//   // analytics?: boolean;
//   // // Compliance & Reminders
//   // vat_reminder?: boolean;
//   // vat_auto_calculation?: boolean;
//   // smart_reminders?: boolean;
//   // payroll_reminders?: boolean;
//   // // Finance
//   // expense_tracking?: boolean;
//   // payment_integrations?: boolean;
//   // // Team & HR
//   // team_members?: number | string;
//   // employee_contract_generator?: boolean;
//   // // Integrations & Dev
//   // integration_access?: boolean;
//   // api_access?: boolean;
//   // // Support
//   // email_support?: boolean;
//   // priority_support?: boolean;
//   // dedicated_support?: boolean;
// }

// export interface SubscriptionPlan {
//   id: number;
//   uuid: string;
//   name: string;
//   description: string;
//   features: SubscriptionFeatures;
//   price: string | number;
//   duration_days: number;
//   is_active: boolean;
// }

// export interface UserSubscription {
//   uuid: string; // subscription UUID — used for usage API calls
//   plan_id: string; // matches SubscriptionPlan.uuid
//   user_id: string;
//   start_date: string;
//   end_date: string;
//   status: string;
// }

// export interface SubscriptionContextValue {
//   /** The user's active subscription record (null if none) */
//   subscription: UserSubscription | null;
//   /** Full plan object resolved from subscription.plan_id */
//   currentPlan: SubscriptionPlan | null;
//   /** Shortcut to currentPlan.features (null if no plan) */
//   features: SubscriptionFeatures | null;
//   /** All available plans from the backend */
//   allPlans: SubscriptionPlan[];
//   /** True while initial fetch is in progress */
//   isLoading: boolean;
//   /** Error message if fetch failed */
//   error: string | null;
//   /** Call after subscribe / upgrade / cancel to re-sync context */
//   refresh: () => Promise<void>;
//   checkUsageLimit: () => void;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // CONTEXT
// // ─────────────────────────────────────────────────────────────────────────────
// const SubscriptionContext = createContext<SubscriptionContextValue | null>(
//   null,
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // PROVIDER
// // ─────────────────────────────────────────────────────────────────────────────
// export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user } = useAuth();
//   const userId = user?.user?.user_id;
//   const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
//   const [subscription, setSubscription] = useState<UserSubscription | null>(
//     null,
//   );
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSubscription = useCallback(async () => {
//     if (!userId) {
//       // User logged out — clear state
//       setSubscription(null);
//       setAllPlans([]);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const [plansRes, subRes] = await Promise.all([
//         axiosInstance.get<{ plans: SubscriptionPlan[] }>(
//           "/subscription_plan/all",
//         ),
//         axiosInstance.get<{ subscription: UserSubscription | null }>(
//           `/subscription_plan/user_current/${userId}`,
//         ),
//       ]);

//       setAllPlans(plansRes.data.plans || []);
//       console.log(subRes.data.subscription);
//       setSubscription(subRes.data.subscription || null);
//     } catch (err) {
//       console.error("[SubscriptionContext] fetch failed:", err);
//       setError("Failed to load subscription data.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [userId]);

//   // Fetch on mount and whenever userId changes (login / logout / account switch)
//   useEffect(() => {
//     fetchSubscription();
//   }, [fetchSubscription]);
//   // check limitaion
//   const checkUsageLimit = useCallback(
//     async (usageKey: string): Promise<boolean> => {
//       if (!subscription?.uuid) {
//         console.warn("[checkUsageLimit] No active subscription");
//         return false;
//       }

//       try {
//         const { data } = await axiosInstance.get<{
//           exceeded: boolean;
//         }>(
//           `/subscription-usage/check_usage_limit/${subscription.uuid}/${usageKey}`,
//         );

//         return data?.exceeded ?? false;
//       } catch (error) {
//         console.error("[checkUsageLimit] API failed:", error);
//         return false; // safe fallback
//       }
//     },
//     [subscription?.uuid],
//   );
//   // Resolve full plan object from subscription.plan_id
//   const currentPlan = useMemo(
//     () =>
//       subscription
//         ? (allPlans.find((p) => p.uuid === subscription.plan_id) ?? null)
//         : null,
//     [subscription, allPlans],
//   );

//   const features = currentPlan?.features ?? null;

//   const value = useMemo<SubscriptionContextValue>(
//     () => ({
//       subscription,
//       currentPlan,
//       features,
//       allPlans,
//       isLoading,
//       error,
//       refresh: fetchSubscription,
//       checkUsageLimit,
//     }),
//     [
//       subscription,
//       currentPlan,
//       features,
//       allPlans,
//       isLoading,
//       error,
//       fetchSubscription,
//       checkUsageLimit,
//     ],
//   );

//   return (
//     <SubscriptionContext.Provider value={value}>
//       {children}
//     </SubscriptionContext.Provider>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CONSUMER HOOK
// // ─────────────────────────────────────────────────────────────────────────────
// export function useSubscription(): SubscriptionContextValue {
//   const ctx = useContext(SubscriptionContext);
//   if (!ctx) {
//     throw new Error(
//       "[useSubscription] Must be used inside <SubscriptionProvider>. " +
//         "Wrap your app (or dashboard layout) with <SubscriptionProvider>.",
//     );
//   }
//   return ctx;
// }

"use client";

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

//=================================
// ALL CONTEXT DATA TYPES
//=================================

// export interface SubscriptionFeatures {
//   capabilities?: any;
//   tiers?: any;
//   quota?: any;
//   ai_advisory: number | boolean;
//   corporate_tax: number | boolean;
//   ai_assistant: number | boolean;
//   ai_invoicing: number | boolean;
//   analytics_reports: number | boolean;
//   auto_reply_hub: number | boolean;
//   compliance: number | boolean;
//   documents: number | boolean;
//   invoicing: number | boolean;
//   payroll: number | boolean;
//   reminders: number | boolean;
// }
export interface QuotaDetail {
  limit: number;
  period:
    | "daily"
    | "monthly"
    | "total"
    | "unlimited"
    | "fair_use"
    | "active_slots";
  description?: string;
}

export interface InvoicingQuota {
  standard: QuotaDetail;
  ai_generation: QuotaDetail;
  ai_prompts: QuotaDetail;
  ai_regenerate: QuotaDetail;
  templates: QuotaDetail;
  clients?: QuotaDetail;
  downloads?: QuotaDetail;
}

export interface SchedulingQuota {
  one_time: QuotaDetail;
  recurring: QuotaDetail;
}

export interface SubscriptionFeatures {
  quota: {
    documents: QuotaDetail;
    analytics_reports: QuotaDetail;
    reminders: QuotaDetail;
    invoicing: InvoicingQuota;
    scheduling: SchedulingQuota;
    collaboration?: {
      multi_team_workflows: {
        limit: number;
        enabled: boolean;
        description?: string;
      };
    };
  };
  tiers: {
    ai_advisory: { level: string };
    ai_assistant: { level: string };
    ai_forecasting?: { level: string };
  };
  capabilities: {
    payroll: { enabled: boolean };
    analytics: { enabled: boolean };
    documents: { enabled: boolean };
    reminders: { enabled: boolean };
    ai_invoice: { enabled: boolean };
    compliance: { enabled: boolean };
    ai_advisory: { enabled: boolean };
    ai_assistant: { enabled: boolean };
    corporate_tax: { enabled: boolean };
    auto_reply_hub: { enabled: boolean };
    ai_forecasting?: { enabled: boolean };
    multi_team?: { enabled: boolean };
  };
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
  uuid: string;
  plan_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface SubscriptionContextValue {
  subscription: UserSubscription | null;
  currentPlan: SubscriptionPlan | null;
  features: SubscriptionFeatures | null;
  allPlans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;

  refresh: () => Promise<void>;

  //  proper return type
  checkUsageLimit: (usageKey: string) => Promise<any>;
}

//============================
// SUBSCRIPTION CONTEXT
//============================

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

//=========================
// PROVIDER FUNCTION
//=========================

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

  //============================
  // FETCH SUBSCRIPTION
  //============================
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
        axiosInstance.get<{ plans: SubscriptionPlan[] }>(
          "/subscription_plan/all",
        ),
        axiosInstance.get<{ subscription: UserSubscription | null }>(
          `/subscription_plan/user_current/${userId}`,
        ),
      ]);

      setAllPlans(plansRes.data.plans || []);
      setSubscription(subRes.data.subscription || null);
      console.log("user subscription", subRes.data.subscription);
    } catch (err) {
      console.error("[SubscriptionContext] fetch failed:", err);
      setError("Failed to load subscription data.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  //==============================
  // RESOLVE CURRENT PLAN
  //==============================
  const currentPlan = useMemo(() => {
    if (!subscription) return null;
    return allPlans.find((p) => p.uuid === subscription.plan_id) ?? null;
  }, [subscription, allPlans]);

  const features = currentPlan?.features ?? null;

  //=============================
  // USAGE LIMIT CHECK
  //=============================
  const checkUsageLimit = useCallback(
    async (usageKey: string): Promise<any> => {
      if (!subscription?.uuid) return false;

      try {
        const { data }: any = await axiosInstance.get<{
          exceeded: any;
        }>(
          `/subscription-usage/check_usage_limit/${subscription.plan_id}/${usageKey}`,
        );
        return data.usage;
      } catch (error) {
        console.error("[checkUsageLimit] failed:", error);
      }
    },
    [subscription?.uuid],
  );

  //======================
  // CONTEXT VALUE
  //======================
  const value = useMemo<SubscriptionContextValue>(
    () => ({
      subscription,
      currentPlan,
      features,
      allPlans,
      isLoading,
      error,
      refresh: fetchSubscription,
      checkUsageLimit,
    }),
    [
      subscription,
      currentPlan,
      features,
      allPlans,
      isLoading,
      error,
      fetchSubscription,
      checkUsageLimit,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// ========================================
// RETURN HOOKS FOR USE IN THE PAGE
// ========================================
export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);

  if (!ctx) {
    throw new Error(
      "[useSubscription] Must be used inside <SubscriptionProvider>",
    );
  }

  return ctx;
}
