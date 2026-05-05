import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "System Settings",
  description: "Platform configuration and integrations",
};

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="System Settings"
      subtitle="Environment keys, webhooks, feature flags, and integrations ship here—aligned with your deployment pipeline."
      eyebrow="System"
    />
  );
}
