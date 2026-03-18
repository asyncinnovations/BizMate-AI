"use client";

import React, { useEffect, useState } from "react";
import { BarChart2, MessageSquare, FileText, Receipt } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import EmptyState from "@/components/empty-state/EmptyState";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance from "@/utils/axiosInstance";
import { useSubscription } from "@/context/SubscriptionContext";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface SubscriptionUsage {
  id: string;
  subscription_id: string;
  usage_key: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// USAGE CONFIG
// Only the 3 countable limit features have usage bars.
// Boolean features are on/off — no bar needed.
// team_members is a seat cap enforced at invite-time — not a usage counter.
// ─────────────────────────────────────────────────────────────────────────────
const USAGE_CONFIG = {
  invoices: {
    label: "Invoices",
    icon: Receipt,
    limitKey: "invoice_limit_per_month",
  },
  ai_messages: {
    label: "AI Chats / Questions",
    icon: MessageSquare,
    limitKey: "ai_messages_per_month",
  },
  document_templates: {
    label: "Document Templates",
    icon: FileText,
    limitKey: "document_templates",
  },
} as const;

type UsageConfigKey = keyof typeof USAGE_CONFIG;

// ─────────────────────────────────────────────────────────────────────────────
// USAGE BAR
// ─────────────────────────────────────────────────────────────────────────────
const getBarColor = (pct: number) => {
  if (pct >= 90) return "bg-status-error";
  if (pct >= 70) return "bg-status-warning";
  return "bg-secondary";
};
const getTrackColor = (pct: number) => {
  if (pct >= 90) return "bg-status-error-bg";
  if (pct >= 70) return "bg-status-warning-bg";
  return "bg-bg-base";
};

interface UsageBarProps {
  label: string;
  icon: React.ElementType;
  used: number;
  limit: number | string;
}

const UsageBar: React.FC<UsageBarProps> = ({
  label,
  icon: Icon,
  used,
  limit,
}) => {
  // -1 from backend = unlimited
  const isUnlimited =
    limit === -1 ||
    limit === "-1" ||
    String(limit).toLowerCase() === "unlimited";

  const limitNum = isUnlimited ? 0 : Number(limit);
  const percent = isUnlimited ? 0 : Math.min((used / limitNum) * 100, 100);
  const barColor = getBarColor(percent);
  const trackColor = getTrackColor(percent);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label + count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-light shrink-0">
            <Icon className="w-3.5 h-3.5 text-secondary" />
          </div>
          <span className="text-sm font-semibold text-text-heading">
            {label}
          </span>
        </div>

        <span className="text-xs">
          {isUnlimited ? (
            <span className="text-secondary font-semibold">Unlimited</span>
          ) : (
            <>
              <span className="font-bold text-text-heading">{used}</span>
              <span className="text-text-muted"> / {limitNum}</span>
            </>
          )}
        </span>
      </div>

      {/* Progress track */}
      <div
        className={`w-full h-1.5 rounded-full overflow-hidden ${trackColor}`}
      >
        {isUnlimited ? (
          <div className="h-full w-full bg-secondary opacity-20 rounded-full" />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>

      {/* Limit warning */}
      {!isUnlimited && percent >= 90 && (
        <p className="text-xs text-status-error font-semibold">
          {percent >= 100 ? "Limit reached" : "Almost at limit"}
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SubscriptionUsageCard: React.FC = () => {
  // ── Subscription + plan from context — no duplicate API calls ─────────────
  const {
    subscription,
    currentPlan,
    isLoading: subscriptionLoading,
  } = useSubscription();

  const [usageList, setUsageList] = useState<SubscriptionUsage[]>([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch usage records whenever subscription changes ─────────────────────
  useEffect(() => {
    if (!subscription?.uuid) {
      setUsageList([]);
      return;
    }
    fetchUsage(subscription.uuid);
  }, [subscription?.uuid]);

  const fetchUsage = async (subscriptionUuid: string) => {
    setUsageLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        `/subscription-usage/all_subscription/${subscriptionUuid}`,
      );
      setUsageList(res.data || []);
    } catch (err) {
      console.error("[SubscriptionUsageCard] fetch usage failed:", err);
      setError("Failed to load usage data.");
    } finally {
      setUsageLoading(false);
    }
  };

  // usage_key → usage_count lookup map
  const usageMap = usageList.reduce<Record<string, number>>((acc, item) => {
    acc[item.usage_key] = item.usage_count;
    return acc;
  }, {});

  // Only show bars for features defined on this plan
  // 0 = not available → hide, -1 = unlimited → show, >0 = capped → show
  const visibleRows = (Object.keys(USAGE_CONFIG) as UsageConfigKey[]).filter(
    (key) => {
      const limitVal =
        currentPlan?.features?.[
          USAGE_CONFIG[key].limitKey as keyof typeof currentPlan.features
        ];
      return limitVal !== undefined && limitVal !== false && limitVal !== 0;
    },
  );

  const isLoading = subscriptionLoading || usageLoading;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SectionCard title="Subscription Usage" icon={BarChart2}>
      {isLoading && (
        <div className="p-20 flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      )}

      {!isLoading && error && (
        <EmptyState
          icon={BarChart2}
          title="Failed to load usage"
          description={error}
          ctaLabel="Retry"
          onCTAClick={() => subscription?.uuid && fetchUsage(subscription.uuid)}
        />
      )}

      {!isLoading && !error && !currentPlan && (
        <EmptyState
          icon={BarChart2}
          title="No active subscription yet"
          description="Subscribe to a plan to track your usage here."
        />
      )}

      {!isLoading && !error && currentPlan && visibleRows.length > 0 && (
        <div className="space-y-5">
          {/* Plan header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <p className="text-sm text-text-secondary">
              Plan:{" "}
              <span className="font-semibold text-text-heading">
                {currentPlan.name}
              </span>
            </p>
            <span className="text-xs text-secondary font-semibold bg-brand-light border border-secondary/20 px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>

          {/* Usage bars */}
          {visibleRows.map((key) => {
            const config = USAGE_CONFIG[key];
            const limit = currentPlan.features?.[
              config.limitKey as keyof typeof currentPlan.features
            ] as number | string;

            return (
              <UsageBar
                key={key}
                label={config.label}
                icon={config.icon}
                used={usageMap[key] ?? 0}
                limit={limit}
              />
            );
          })}
        </div>
      )}
    </SectionCard>
  );
};

export default SubscriptionUsageCard;
