"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart2,
  MessageSquare,
  FolderOpen,
  FileText,
  Users,
  HardDrive,
  ShoppingBag,
  Zap,
} from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import EmptyState from "@/components/empty-state/EmptyState";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

// ================= TYPES =================
interface SubscriptionUsage {
  id: string;
  subscription_id: string;
  usage_key: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface SubscriptionFeatures {
  ai_messages_per_month?: number | string;
  projects_limit?: number | string;
  proposal_limit?: number | string;
  team_members?: number | string;
  storage_gb?: number | string;
  active_orders_limit?: number | string;
  file_upload_limit_mb?: number | string;
  [key: string]: number | string | boolean | undefined;
}

interface SubscriptionPlan {
  uuid: string;
  name: string;
  features: SubscriptionFeatures;
}

// ================= USAGE KEY CONFIG =================
// Maps usage_key from backend → display label + icon
const usageConfig: Record<
  string,
  { label: string; icon: React.ElementType; limitKey: string; unit?: string }
> = {
  ai_messages: {
    label: "AI Messages",
    icon: MessageSquare,
    limitKey: "ai_messages_per_month",
  },
  projects: {
    label: "Projects",
    icon: FolderOpen,
    limitKey: "projects_limit",
  },
  proposals: {
    label: "Proposals",
    icon: FileText,
    limitKey: "proposal_limit",
  },
  team_members: {
    label: "Team Members",
    icon: Users,
    limitKey: "team_members",
  },
  storage_gb: {
    label: "Storage",
    icon: HardDrive,
    limitKey: "storage_gb",
    unit: "GB",
  },
  active_orders: {
    label: "Active Orders",
    icon: ShoppingBag,
    limitKey: "active_orders_limit",
  },
  file_uploads: {
    label: "File Uploads",
    icon: Zap,
    limitKey: "file_upload_limit_mb",
    unit: "MB",
  },
};

// ================= PROGRESS BAR =================
const getBarColor = (percent: number) => {
  if (percent >= 90) return "bg-red-500";
  if (percent >= 70) return "bg-yellow-400";
  return "bg-[#2E69A4]";
};

interface UsageBarProps {
  label: string;
  icon: React.ElementType;
  used: number;
  limit: number | string;
  unit?: string;
}

const UsageBar: React.FC<UsageBarProps> = ({
  label,
  icon: Icon,
  used,
  limit,
  unit,
}) => {
  const isUnlimited =
    limit === "unlimited" || limit === -1 || limit === 0 || limit === undefined;
  const limitNum = isUnlimited ? 0 : Number(limit);
  const percent = isUnlimited ? 0 : Math.min((used / limitNum) * 100, 100);
  const barColor = getBarColor(percent);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1.5 rounded-md bg-[#E1E8F5]">
            <Icon className="w-3.5 h-3.5 text-[#1B2A49]" />
          </div>
          <span className="text-sm font-medium text-[#1B2A49]">{label}</span>
        </div>
        <span className="text-xs text-[#344767]">
          {isUnlimited ? (
            <span className="text-[#2E69A4] font-medium">Unlimited</span>
          ) : (
            <>
              <span className="font-semibold text-[#1B2A49]">
                {used}
                {unit ? ` ${unit}` : ""}
              </span>
              <span className="text-gray-400">
                {" "}
                / {limitNum}
                {unit ? ` ${unit}` : ""}
              </span>
            </>
          )}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#F4F7FA] rounded-full overflow-hidden">
        {isUnlimited ? (
          <div className="h-full w-full bg-[#2E69A4] opacity-20 rounded-full" />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>

      {/* Warning */}
      {!isUnlimited && percent >= 90 && (
        <p className="text-xs text-red-500 font-medium">
          {percent >= 100 ? "Limit reached" : "Almost at limit"}
        </p>
      )}
    </div>
  );
};

// ================= MAIN COMPONENT =================
const SubscriptionUsageCard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user?.user_id;

  const [usageList, setUsageList] = useState<SubscriptionUsage[]>([]);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchUsage();
  }, [userId]);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Get current subscription + plan details
      const [subRes, plansRes] = await Promise.all([
        axiosInstance.get(`/subscription_plan/user_current/${userId}`),
        axiosInstance.get("/subscription_plan/all"),
      ]);

      const subscription = subRes.data?.subscription;
      const plans: SubscriptionPlan[] = plansRes.data?.plans || [];

      if (!subscription?.uuid) {
        setUsageList([]);
        setCurrentPlan(null);
        return;
      }

      // Match plan to get feature limits
      const plan = plans.find((p) => p.uuid === subscription.plan_id) || null;
      setCurrentPlan(plan);

      // Step 2: Get all usage for this subscription
      const usageRes = await axiosInstance.get(
        `/subscription-usage/all_subscription/${subscription.uuid}`
      );
      setUsageList(usageRes.data || []);
    } catch (err) {
      console.error("Failed to fetch usage", err);
      setError("Failed to load usage data.");
    } finally {
      setLoading(false);
    }
  };

  // Build a map of usage_key → usage_count for quick lookup
  const usageMap = usageList.reduce<Record<string, number>>((acc, item) => {
    acc[item.usage_key] = item.usage_count;
    return acc;
  }, {});

  // Only render usage rows that exist in our config
  const usageRows = Object.entries(usageConfig).filter(([key, config]) => {
    const limitVal = currentPlan?.features?.[config.limitKey];
    return limitVal !== undefined && limitVal !== false;
  });

  return (
    <SectionCard title="Subscription Usage" icon={BarChart2}>
      {/* Loading */}
      {loading && (
        <div className="p-20 flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <EmptyState
          icon={BarChart2}
          title="Failed to load usage"
          description={error}
          ctaLabel="Retry"
          onCTAClick={fetchUsage}
        />
      )}

      {/* No subscription */}
      {!loading && !error && !currentPlan && (
        <EmptyState
          icon={BarChart2}
          title="No active subscription"
          description="Subscribe to a plan to track your usage here."
        />
      )}

      {/* Usage rows */}
      {!loading && !error && currentPlan && usageRows.length > 0 && (
        <div className="space-y-5">
          {/* Plan label */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F5]">
            <p className="text-sm text-[#344767]">
              Plan:{" "}
              <span className="font-semibold text-[#1B2A49]">
                {currentPlan.name}
              </span>
            </p>
            <span className="text-xs text-[#2E69A4] font-medium bg-[#E1E8F5] px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>

          {/* Usage bars */}
          {usageRows.map(([key, config]) => {
            const limit = currentPlan.features?.[config.limitKey];
            const used = usageMap[key] ?? 0;
            return (
              <UsageBar
                key={key}
                label={config.label}
                icon={config.icon}
                used={used}
                limit={limit as number | string}
                unit={config.unit}
              />
            );
          })}
        </div>
      )}
    </SectionCard>
  );
};

export default SubscriptionUsageCard;