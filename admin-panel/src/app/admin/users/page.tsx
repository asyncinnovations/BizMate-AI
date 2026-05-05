import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage platform users and access",
};

export default function UsersPage() {
  return (
    <ModulePlaceholder
      title="User Management"
      subtitle="Provision admins, audit sessions, and enforce MFA from this workspace once your identity provider is connected."
      eyebrow="Management"
    />
  );
}
