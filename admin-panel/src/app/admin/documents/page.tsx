import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Document Generator",
  description: "Templates and generated documents",
};

export default function DocumentsPage() {
  return (
    <ModulePlaceholder
      title="Document Generator"
      subtitle="Manage templates, merge fields, and audit generated PDFs for every tenant workflow."
      eyebrow="Content"
    />
  );
}
