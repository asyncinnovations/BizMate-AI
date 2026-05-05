"use client";

import { useSubscription } from "@/context/SubscriptionContext";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  usageKey: string;
  count?: number;
}

export const useSubscriptionUsage = () => {
  const { currentPlan } = useSubscription();

  const incrementUsage = async ({ usageKey, count = 1 }: Props) => {
    if (!currentPlan?.uuid) {
      console.warn("No subscription found");
      return;
    }

    const data = {
      subscriptionId: currentPlan.uuid,
      usageKey,
      amount: count,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription-usage/increment`,
        data,
      );

      if ([200, 201].includes(response.status)) {
        toast.success("Usage counted");
      }

      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update usage");
    }
  };

  return { incrementUsage };
};
