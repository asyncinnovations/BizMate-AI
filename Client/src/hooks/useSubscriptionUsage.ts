// "use client";

// import { useSubscription } from "@/context/SubscriptionContext";
// import axios from "axios";
// import toast from "react-hot-toast";

// interface Props {
//   usageKey: string;
//   count?: number;
// }

// export const useSubscriptionUsage = () => {
//   const { currentPlan } = useSubscription();
//   const incrementUsage = async ({ usageKey, count = 1 }: Props) => {
//     const theLimit = currentPlan?.features?.quota?.usageKey.limit;
//     const policy = currentPlan?.name === 'Enterprise' ? 'unlimited' : 'strict';
//     if (!currentPlan?.uuid) {
//       console.warn("No subscription found");
//       return;
//     }

//     const data = {
//       subscriptionId: currentPlan.uuid,
//       usageKey,
//       amount: count,
//     };

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/subscription-usage/increment`,
//         data,
//       );

//       if ([200, 201].includes(response.status)) {
//         toast.success("Usage counted");
//       }

//       return response.data;
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update usage");
//     }
//   };

//   return { incrementUsage };
// };

// // Inside your InvoicesService
// // async createInvoice(userId: string, invoiceData: any) {
// //     // Get the user's current subscription plan details
// //     // (e.g., from your Plan/Subscription table)
// //     const userSub = await this.subscriptionRepo.findOne({ where: { userId } });

// //     // Identify the limit based on their plan (e.g., Starter = 5, Startup = 50)
// //     const invoiceLimit = userSub.plan.quota.invoicing.limit; // e.g., 50
// //     const policy = userSub.plan.type === 'enterprise' ? 'unlimited' : 'strict';

// //     // ENFORCE THE LIMIT
// //     // This will check usage, throw error if over limit, or increment if okay
// //     await this.usageService.enforce_limit_service(
// //       userSub.id,
// //       "invoicing",      // The key from your JSON config
// //       invoiceLimit,
// //       1,                // Increment by 1
// //       {
// //         periodType: "monthly", // Invoices are reset monthly
// //         policyType: policy
// //       }
// //     );

// //     // PROCEED TO CREATE INVOICE
// //     return this.invoiceRepo.save(invoiceData);
// // }

// "use client";

// import { useSubscription } from "@/context/SubscriptionContext";
// import axios from "axios";
// import toast from "react-hot-toast";

// interface Props {
//   usageKey: string;
//   amount?: number;
// }

// export const useSubscriptionUsage = () => {
//   const { currentPlan } = useSubscription();

//   const incrementUsage = async ({ usageKey, amount = 1 }: Props) => {
//     if (!currentPlan?.uuid) {
//       console.warn("No subscription found");
//       return null;
//     }

//     // Use brackets [usageKey] because usageKey is a variable (e.g., 'invoicing')
//     const quotaData = currentPlan?.features?.quota?.[usageKey];

//     if (!quotaData) {
//       console.error(`Usage key "${usageKey}" not found in plan quota.`);
//       return null;
//     }

//     // Determine Policy and Period
//     const theLimit = quotaData.limit;
//     const period = quotaData.period; // "monthly" or "daily"
//     const policy = currentPlan?.name === "Enterprise" ? "unlimited" : "strict";

//     const data = {
//       subscriptionId: currentPlan.uuid,
//       usageKey: usageKey,
//       limit: theLimit,
//       amount: amount,
//       periodType: period,
//       policyType: policy,
//     };

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/subscription-usage/enforce_limit`,
//         data,
//       );

//       // We only show success if needed, often counting usage is silent
//       // unless it's a major action.
//       return response.data;
//     } catch (error: any) {
//       const message = error.response?.data?.message || "Usage limit exceeded";
//       toast.error(message);
//       throw error;
//     }
//   };

//   return { incrementUsage };
// };
"use client";

import { useSubscription } from "@/context/SubscriptionContext";
import axios from "axios";
import toast from "react-hot-toast";

interface UsageProps {
  usageKey: string;
  amount?: number;
}

export const useSubscriptionUsage = () => {
  const { currentPlan } = useSubscription();

  const getNestedQuota = (obj: any, path: string) => {
    return path.split(".").reduce((prev, curr) => prev?.[curr], obj);
  };
  const checkUsage = async (usageKey: string) => {
    if (!currentPlan?.uuid) return null;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription-usage/check_usage_limit/${currentPlan.uuid}/${usageKey}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error checking usage limit:", error);
      return null;
    }
  };

  const incrementUsage = async ({ usageKey, amount = 1 }: UsageProps) => {
    if (!currentPlan?.uuid) {
      console.warn("No active subscription plan found");
      return null;
    }

    const quotaData = getNestedQuota(currentPlan?.features?.quota, usageKey);

    if (!quotaData || typeof quotaData.limit === "undefined") {
      console.error(`Quota configuration for "${usageKey}" not found.`);
      return null;
    }

    const { limit, period } = quotaData;
    const isEnterprise = currentPlan.name === "Enterprise" || limit === -1;
    const policy = isEnterprise ? "unlimited" : "strict";

    const payload = {
      subscriptionId: currentPlan.uuid,
      usageKey: usageKey,
      limit: limit,
      amount: amount,
      periodType: period,
      policyType: policy,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription-usage/enforce_limit`,
        payload,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Limit exceeded for this feature.";
      toast.error(message);
      throw error;
    }
  };

  return { incrementUsage, checkUsage };
};
