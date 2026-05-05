import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Subscriptions & Billing",
  description: "Plans, invoices, and subscription lifecycle",
};

export default function SubscriptionsPage() {
  return (
    <ModulePlaceholder
      title="Subscriptions & Billing"
      subtitle="Plans, renewals, and revenue charts will plug in here. Your subscription UI components can replace this shell when APIs are ready."
      eyebrow="Finance"
    />
  );
}
