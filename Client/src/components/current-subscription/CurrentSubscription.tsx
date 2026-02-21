"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Check, Loader2 } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import EmptyState from "../empty-state/EmptyState";
import Button from "../ui/Button";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

// ================= TYPES =================
interface SubscriptionFeatures {
  analytics: boolean;
  api_access: boolean;
  storage_gb: number;
  auto_reports: boolean;
  chat_support: boolean;
  team_members: number;
  email_support: boolean;
  notifications: boolean;
  projects_limit: number;
  proposal_limit: number;
  custom_branding: boolean;
  dashboard_access: boolean;
  priority_support: boolean;
  integration_access: boolean;
  invoice_generation: boolean;
  active_orders_limit: number;
  file_upload_limit_mb: number;
  ai_messages_per_month: number;
}

interface SubscriptionPlan {
  id: number;
  uuid: string;
  name: string;
  description: string;
  features: SubscriptionFeatures;
  price: string | number;
  duration_days: number;
  is_active: boolean;
}

interface UserSubscription {
  plan_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

const CurrentSubscription: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const userId = user?.user?.user_id;

  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  //////////////////////////////////
  // Fetch User Subscription Details
  ///////////////////////////////////
  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [plansRes, subRes] = await Promise.all([
        axiosInstance.get<{ plans: SubscriptionPlan[] }>("/subscription_plan/all"),
        axiosInstance.get<{ subscription: UserSubscription | null }>(
          `/subscription_plan/user_current/${userId}`
        ),
      ]);
      setAllPlans(plansRes.data.plans || []);
      setUserSubscription(subRes.data.subscription || null);
    } catch (error) {
      console.error("Failed to fetch subscription data", error);
      setUserSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);


  /////////////////////////////////////
  // Cancel subscription
  /////////////////////////////////////
  const handleCancelSubscription = async () => {
    if (!userId) return;
    setCancelLoading(true);
    try {
      await axiosInstance.post(`/subscription_plan/cancel_user/${userId}`);
      toast.success("Subscription cancelled successfully");
      fetchData();
    } catch {
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

  // Change plan
  const handleChangePlan = () => router.push("/dashboard/pricing");

  // Find plan details for current subscription
  const currentPlan = userSubscription
    ? allPlans.find((plan) => plan.uuid === userSubscription.plan_id)
    : null;

  // Countdown
  const getRemainingDays = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // Render features dynamically
  const renderFeatures = (features: SubscriptionFeatures) =>
    Object.entries(features)
      .filter(([_, value]) => value && value !== 0)
      .map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span className="text-sm">
            {key.replace(/_/g, " ")}: {typeof value === "boolean" ? "Yes" : value}
          </span>
        </div>
      ));

  return (
    <SectionCard title="Current Plan" icon={CreditCard}>
      {loading ? (
        <div className="p-20 flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      ) : !currentPlan || !userSubscription ? (
        <EmptyState
          icon={CreditCard}
          title="No active subscription yet"
          description="You currently do not have any active subscription. Subscribe to a plan to enjoy all features."
          ctaLabel="View Plans"
          onCTAClick={handleChangePlan}
        />
      ) : (
        <div>
          <div className="bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] text-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{currentPlan.name}</h3>
                <p className="text-white/80">{currentPlan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold"><span className="text-xl font-semibold">AED</span> {currentPlan.price}</p>
                <p className="text-white/80">
                  Remaining: {getRemainingDays(userSubscription.end_date)} days
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/20">
              {renderFeatures(currentPlan.features)}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleChangePlan}>Change Plan</Button>
            <Button
              onClick={handleCancelSubscription}
              disabled={cancelLoading}
              className="flex items-center gap-2 border bg-transparent border-[#344767] text-[#344767] rounded-lg px-4 py-2 font-semibold hover:bg-[#F4F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Cancel Subscription</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default CurrentSubscription; 