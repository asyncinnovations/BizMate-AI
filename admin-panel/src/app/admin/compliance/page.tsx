import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Compliance & Licensing",
  description: "Licenses, audits, and regulatory controls",
};

export default function CompliancePage() {
  return (
    <ModulePlaceholder
      title="Compliance & Licensing"
      subtitle="Track obligations, license consumption, and audit trails across regions and industries."
      eyebrow="Content"
    />
  );
}
