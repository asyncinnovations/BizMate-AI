import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Support & Comms",
  description: "Support tickets and customer communications",
};

export default function SupportPage() {
  return (
    <ModulePlaceholder
      title="Support & Comms"
      subtitle="Route tickets, SLA timers, and broadcast messages to customers from a single operations desk."
      eyebrow="Operations"
    />
  );
}
