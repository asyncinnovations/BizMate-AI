import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "AI Control Panel",
  description: "Model routing, limits, and AI governance",
};

export default function AiControlPage() {
  return (
    <ModulePlaceholder
      title="AI Control Panel"
      subtitle="Set token budgets, model routes, and safety policies before scaling AI features to every tenant."
      eyebrow="Intelligence"
    />
  );
}
