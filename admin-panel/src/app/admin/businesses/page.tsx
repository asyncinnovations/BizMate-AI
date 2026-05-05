import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Business Management",
  description: "Manage tenant businesses on the platform",
};

export default function BusinessesPage() {
  return (
    <ModulePlaceholder
      title="Business Management"
      subtitle="Onboard tenants, manage plans, and oversee compliance posture across organizations."
      eyebrow="Management"
    />
  );
}
