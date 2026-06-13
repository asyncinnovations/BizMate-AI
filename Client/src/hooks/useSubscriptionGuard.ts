/**
 * useSubscriptionGuard
 *
 * Reads subscription + plan limits from SubscriptionContext (single API call,
 * no duplicate fetching). Pages only pass the usageKey and action — the hook
 * resolves the limit internally.
 *
 * Trackable usage keys → feature limit resolved internally:
 *   "invoices"            → features.invoice_limit_per_month
 *   "ai_messages"         → features.ai_messages_per_month
 *   "document_templates"  → features.document_templates
 *
 * Limit conventions from backend:
 *   -1  → Unlimited (enforcement skipped entirely)
 *    0  → Not available on this plan
 *   >0  → Exact cap
 */

import { useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useSubscription } from "@/context/SubscriptionContext";
import type { SubscriptionFeatures } from "@/context/SubscriptionContext";
import { AxiosError } from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** Trackable usage keys — must match backend usage_key values exactly */
export type UsageKey =
  | "invoices"            // → features.quota.invoicing.standard.limit
  | "ai_messages"         // → features.quota.invoicing.ai_generation.limit
  | "document_templates"  // → features.quota.documents.limit  (FIX 1: was flat "document_templates")
  | "reminders"           // → features.quota.reminders.limit
  | "quotations";         // → features.quota.invoicing.templates.limit

/**
 * FIX 1: dot-notation paths into SubscriptionFeatures.
 * The old flat map (features.document_templates) pointed to a field that does not
 * exist. The real path is features.quota.documents.limit — a nested QuotaDetail object.
 */
const USAGE_KEY_TO_LIMIT_PATH: Record<UsageKey, string> = {
  invoices:           "quota.invoicing.standard.limit",
  ai_messages:        "quota.invoicing.ai_generation.limit",
  document_templates: "quota.documents.limit",
  reminders:          "quota.reminders.limit",
  quotations:         "quota.invoicing.templates.limit",
};

/** Traverses a dot-separated path through a nested object. Returns undefined on any miss. */
function resolveFeaturePath(obj: any, path: string): number | string | undefined {
  return path.split(".").reduce(
    (cur: any, key: string) => (cur != null && typeof cur === "object" ? cur[key] : undefined),
    obj,
  ) as number | string | undefined;
}

/** @deprecated — alias for backward compat */
const USAGE_KEY_TO_LIMIT_KEY = USAGE_KEY_TO_LIMIT_PATH;

/** Human-readable label per usage key — used in error messages */
const USAGE_KEY_LABELS: Record<UsageKey, string> = {
  invoices:           "invoice",
  ai_messages:        "AI message",
  document_templates: "document",
  reminders:          "reminder",
  quotations:         "quotation",
};

export interface GuardResult<T = void> {
  /** true = action was allowed and completed */
  allowed: boolean;
  /** Populated when allowed = false — show directly to the user */
  reason?: string;
  /** Return value of your action callback when allowed = true */
  data?: T;
}

export interface UsageCount {
  id: string;
  subscription_id: string;
  usage_key: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Resolve the numeric limit from a feature value */
function resolveLimit(value: number | string | undefined): number {
  if (value === undefined || value === null) return 0;
  return Number(value);
}

/** -1 = unlimited, 0 = not available, >0 = exact cap */
function isUnlimited(limit: number): boolean {
  return limit === -1;
}

function isNotAvailable(limit: number): boolean {
  return limit === 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────
export function useSubscriptionGuard() {
  const { subscription, features, currentPlan } = useSubscription();

  const [enforcing, setEnforcing] = useState(false);
  const [incrementing, setIncrementing] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // enforceAndIncrement — PRIMARY METHOD
  //
  // Call BEFORE every tracked user action. The hook resolves the limit
  // from context automatically — no need to pass it from the page.
  //
  // Flow:
  //   1. Resolve limit from context features
  //   2. If limit === -1  → unlimited, skip to action
  //   3. If limit === 0   → feature not on plan, block
  //   4. POST /enforce_limit → backend throws 400 if usage + amount > limit
  //   5. Run action callback
  //   6. POST /increment (non-blocking)
  //
  // @example — Invoice creation page:
  //   const { enforceAndIncrement, isLoading } = useSubscriptionGuard();
  //
  //   const handleCreate = async () => {
  //     const { allowed, reason, data } = await enforceAndIncrement(
  //       "invoices",
  //       () => axiosInstance.post("/invoices", payload),
  //     );
  //     if (!allowed) { toast.error(reason); return; }
  //     router.push(`/invoices/${data.id}`);
  //   };
  // ──────────────────────────────────────────────────────────────────────────
  const enforceAndIncrement = useCallback(
    async <T>(
      usageKey: UsageKey,
      action: () => Promise<T>,
      amount = 1,
    ): Promise<GuardResult<T>> => {
      // ── Guard: must have an active subscription ────────────────────────
      if (!subscription?.uuid) {
        return {
          allowed: false,
          reason: "No active subscription found. Please subscribe to a plan.",
        };
      }

      // FIX 1: nested path resolver replaces flat bracket access
      const rawLimit = resolveFeaturePath(features, USAGE_KEY_TO_LIMIT_PATH[usageKey]);
      const limit    = resolveLimit(rawLimit as number | string | undefined);
      const label    = USAGE_KEY_LABELS[usageKey];

      // ── Feature not available on this plan ────────────────────────────
      if (isNotAvailable(limit)) {
        return {
          allowed: false,
          reason: `${label.charAt(0).toUpperCase() + label.slice(1)}s are not available on your current plan. Please upgrade.`,
        };
      }

      setEnforcing(true);

      try {
        // ── Enforce limit (skip if unlimited) ─────────────────────────────
        if (!isUnlimited(limit)) {
          try {
            await axiosInstance.post("/subscription-usage/enforce_limit", {
              subscriptionId: subscription.uuid,
              usageKey,
              limit,
              amount,
            });
          } catch (err: unknown) {
            let message = `You've reached your ${label} limit for this month. Please upgrade your plan.`;

            if (err instanceof AxiosError) {
              message = err.response?.data?.message || err.message;
            } else if (err instanceof Error) {
              message = err.message;
            }

            return { allowed: false, reason: message };
          }
        }

        setEnforcing(false);
        setIncrementing(true);

        // ── Run the actual action ─────────────────────────────────────────
        const data = await action();

        // ── Increment usage (non-blocking — won't fail the action) ────────
        try {
          await axiosInstance.post("/subscription-usage/increment", {
            subscriptionId: subscription.uuid,
            usageKey,
            amount,
          });
        } catch (incrementErr) {
          console.error(
            "[useSubscriptionGuard] increment failed:",
            incrementErr,
          );
        }

        return { allowed: true, data };
      } finally {
        setEnforcing(false);
        setIncrementing(false);
      }
    },
    [subscription, features],
  );

  // ──────────────────────────────────────────────────────────────────────────
  // checkLimit — READ-ONLY UI CHECK
  //
  // Non-blocking. Use to drive UI warnings, disabled states, banners.
  // Does NOT prevent the action — call enforceAndIncrement for that.
  //
  // @example — Invoice list page header:
  //   useEffect(() => {
  //     checkLimit("invoices").then(({ exceeded, used, limit }) => {
  //       if (exceeded) setShowUpgradeBanner(true);
  //       setUsageText(`${used} / ${limit === -1 ? "Unlimited" : limit}`);
  //     });
  //   }, []);
  // ──────────────────────────────────────────────────────────────────────────
  const checkLimit = useCallback(
    async (
      usageKey: UsageKey,
    ): Promise<{ exceeded: boolean; used: number; limit: number }> => {
      if (!subscription?.uuid) return { exceeded: false, used: 0, limit: 0 };

      // FIX 1: nested path resolver
      const rawLimit = resolveFeaturePath(features, USAGE_KEY_TO_LIMIT_PATH[usageKey]);
      const limit    = resolveLimit(rawLimit as number | string | undefined);

      // Unlimited — can never exceed
      if (isUnlimited(limit)) return { exceeded: false, used: 0, limit: -1 };
      // Not on plan — treat as exceeded (feature unavailable)
      if (isNotAvailable(limit)) return { exceeded: true, used: 0, limit: 0 };

      try {
        const res = await axiosInstance.get(
          `/subscription-usage/check_usage_limit/${subscription.uuid}/${usageKey}`,
          { params: { limit } },
        );

        // Also fetch current usage count for display
        const usageRes = await axiosInstance.get(
          `/subscription-usage/feature_usage/${subscription.uuid}/${usageKey}`,
        );

        return {
          exceeded: res.data?.exceeded ?? false,
          used: usageRes.data?.usage_count ?? 0,
          limit,
        };
      } catch (err) {
        console.error("[useSubscriptionGuard] checkLimit failed:", err);
        return { exceeded: false, used: 0, limit };
      }
    },
    [subscription, features],
  );

  // ──────────────────────────────────────────────────────────────────────────
  // getUsage — SINGLE FEATURE COUNT
  //
  // Use for inline counters on feature pages.
  //
  // @example — AI Chat page:
  //   const usage = await getUsage("ai_messages");
  //   // usage.usage_count = 47
  // ──────────────────────────────────────────────────────────────────────────
  const getUsage = useCallback(
    async (usageKey: UsageKey): Promise<UsageCount | null> => {
      if (!subscription?.uuid) return null;

      try {
        const res = await axiosInstance.get(
          `/subscription-usage/feature_usage/${subscription.uuid}/${usageKey}`,
        );
        return res.data ?? null;
      } catch (err) {
        console.error("[useSubscriptionGuard] getUsage failed:", err);
        return null;
      }
    },
    [subscription],
  );

  // ──────────────────────────────────────────────────────────────────────────
  // incrementOnly — RECORD WITHOUT ENFORCING
  //
  // Use when the action already succeeded and you only need to update the counter.
  //
  // @example — After backend-triggered document generation:
  //   await incrementOnly("document_templates");
  // ──────────────────────────────────────────────────────────────────────────
  const incrementOnly = useCallback(
    async (usageKey: UsageKey, amount = 1): Promise<void> => {
      if (!subscription?.uuid) return;

      try {
        await axiosInstance.post("/subscription-usage/increment", {
          subscriptionId: subscription.uuid,
          usageKey,
          amount,
        });
      } catch (err) {
        console.error("[useSubscriptionGuard] incrementOnly failed:", err);
      }
    },
    [subscription],
  );

  // ──────────────────────────────────────────────────────────────────────────
  // getLimitValue — UTILITY
  //
  // Read the resolved limit number for a usage key directly from context.
  // Useful for displaying "X remaining" without an API call.
  //
  // @example
  //   const invoiceLimit = getLimitValue("invoices"); // 5, -1, or 0
  // ──────────────────────────────────────────────────────────────────────────
  const getLimitValue = useCallback(
    (usageKey: UsageKey): number => {
      // FIX 1: nested path resolver
      return resolveLimit(
        resolveFeaturePath(features, USAGE_KEY_TO_LIMIT_PATH[usageKey]) as number | string | undefined
      );
    },
    [features],
  );

  /**
   * FIX 2: isPlanCapable — replace all isPro name-string checks.
   *
   * Usage:  isPlanCapable("documents")  // true if features.capabilities.documents.enabled
   *
   * This is stable across plan renames because it reads the capabilities object
   * in the plan's features JSON, not the plan name string.
   * Falls back to name-string if features not yet loaded.
   */
  const isPlanCapable = useCallback(
    (capabilityKey: keyof NonNullable<typeof features>["capabilities"]): boolean => {
      if (features?.capabilities) {
        return !!(features.capabilities[capabilityKey as keyof typeof features.capabilities]?.enabled);
      }
      // Fallback: any paid plan name — covers bootstrap case before features load
      const planName = (subscription as any)?.plan?.name ?? currentPlan?.name ?? "";
      const paidNames = ["starter", "growth", "pro", "enterprise"];
      return paidNames.some((n) => planName.toLowerCase().includes(n));
    },
    [features, subscription, currentPlan],
  );

  return {
    // Primary: enforce → action → increment
    enforceAndIncrement,

    // UI warning check (non-blocking, returns used + limit too)
    checkLimit,

    // Single feature count
    getUsage,

    // Record without enforcing
    incrementOnly,

    // Read limit from context without API call
    getLimitValue,

    // Loading states
    enforcing,
    incrementing,
    // FIX 2: capability check by key
    isPlanCapable,
    isLoading: enforcing || incrementing,
  };
}
