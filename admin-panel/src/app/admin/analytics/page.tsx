import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Platform Analytics",
  description: "Platform analytics and reporting",
};

export default function AnalyticsPage() {
  return (
    <ModulePlaceholder
      title="Platform Analytics"
      subtitle="Unify MRR, activation, and product funnels. Connect your warehouse and event stream when you are ready to go live."
      eyebrow="Intelligence"
    />
  );
}
