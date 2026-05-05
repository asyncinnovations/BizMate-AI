import type { Metadata } from "next";
import AdminShell from "@/components/layout/AdminShell";

// export const metadata: Metadata = {
//   title: {
//     default: "BizMate Admin",
//     template: "%s — BizMate Admin",
//   },
//   description: "BizMate AI — administrator control panel",
//   robots: { index: false, follow: false },
// };


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}