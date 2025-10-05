import React from "react";
import Button from "@/app/components/ui/Button";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const RecentDocuments = () => {
  const router = useRouter();
  const recentDocuments = [
    {
      title: "Service Agreement - Al Manara",
      subtitle: "Generated 2 days ago",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      action: "View",
      btnClass: "text-[#2E69A4] hover:underline",
    },
    {
      title: "NDA Template",
      subtitle: "Created 1 week ago",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      action: "Edit",
      btnClass: "text-[#2E69A4] hover:underline",
    },
    {
      title: "VAT Return Q3 2025",
      subtitle: "Due in 5 days",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      action: "Prepare",
      btnClass:
        "bg-[#1B2A49] text-white px-3 py-1 rounded hover:bg-[#152238] transition-colors",
    },
  ];
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-[#E1E8F5] flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#1B2A49]">
          Recent Documents
        </h2>
        <FileText className="w-5 h-5 text-[#344767]" />
      </div>

      {/* Scrollable List */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {recentDocuments.map((doc, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-[#F4F7FA] rounded-lg border border-[#E1E8F5]"
          >
            <div className="flex items-center space-x-3">
              <div className={`${doc.iconBg} rounded-full p-2`}>
                <FileText className={`w-4 h-4 ${doc.iconColor}`} />
              </div>
              <div>
                <p className="font-medium text-[#344767]">{doc.title}</p>
                <p className="text-sm text-[#6B7C93]">{doc.subtitle}</p>
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
          className="w-full py-2 bg-gradient-to-r from-[#2E69A4] to-[#1B2A49]"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push("/dashboard/documents")}
        >
          Generate New Document
        </Button>
      </div>
    </div>
  );
};

export default RecentDocuments;
