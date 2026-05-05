import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Notifications & Alerts",
  description: "Alert routing and notification preferences",
};

export default function NotificationsPage() {
  return (
    <ModulePlaceholder
      title="Notifications & Alerts"
      subtitle="Configure escalation paths, channels, and quiet hours so the right people respond at the right time."
      eyebrow="System"
    />
  );
}
