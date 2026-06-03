import type { Metadata } from "next";
import AdminShell from "@/components/layout/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Bizmate Admin",
    template: "%s — Bizmate Admin",
  },
  description: "Bizmate AI-Powered Business Operating System — Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}