import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Roles & Permissions",
  description: "RBAC and admin access control",
};

export default function RolesPage() {
  return (
    <ModulePlaceholder
      title="Roles & Permissions"
      subtitle="Define administrator roles, scoped permissions, and approval flows for sensitive actions."
      eyebrow="Operations"
    />
  );
}
