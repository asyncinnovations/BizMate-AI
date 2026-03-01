import React from "react";
import Button from "@/components/ui/Button";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";

const RecentDocuments = () => {
  const router = useRouter();
  const recentDocuments = [
    {
      title: "Service Agreement - Al Manara",
      subtitle: "Generated 2 days ago",
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      action: "View",
      btnClass: "text-secondary hover:underline",
    },
    {
      title: "NDA Template",
      subtitle: "Created 1 week ago",
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      action: "Edit",
      btnClass: "text-secondary hover:underline",
    },
    {
      title: "VAT Return Q3 2025",
      subtitle: "Due in 5 days",
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      action: "Prepare",
      btnClass:
        "bg-brand text-on-brand px-3 py-1 rounded hover:bg-brand-hover transition-colors",
    },
  ];

  return (
    <Card className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-heading">
          Recent Documents
        </h2>
        <FileText className="w-5 h-5 text-text-secondary" />
      </div>

      {/* Scrollable List */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {recentDocuments.map((doc, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-bg-base rounded-lg border border-border hover:border-border-strong hover:shadow-card transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`${doc.iconBg} rounded-full p-2`}>
                <FileText className={`w-4 h-4 ${doc.iconColor}`} />
              </div>
              <div>
                <p className="font-medium text-text-secondary">{doc.title}</p>
                <p className="text-sm text-text-muted">{doc.subtitle}</p>
              </div>
            </div>
            <button className={`text-sm font-medium ${doc.btnClass}`}>
              {doc.action}
            </button>
          </div>
        ))}
      </div>

      {/* Button at bottom */}
      <div className="mt-4">
        <Button
          className="w-full py-2 bg-brand hover:bg-brand-hover text-on-brand"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => router.push("/dashboard/documents")}
        >
          Generate New Document
        </Button>
      </div>
    </Card>
  );
};

export default RecentDocuments;
