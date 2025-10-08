"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  FileCheck,
  Briefcase,
  Receipt,
  Users,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  Download,
  CheckCircle,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import StatCard from "@/app/components/stat-card/StatCard";
import PageHeader from "@/app/components/page-header/PageHeader";

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  estimatedTime: string;
  popularity: number;
}

export default function DocumentGeneratorMain() {
  const router = useRouter();

  const templates: DocumentTemplate[] = [
    {
      id: "nda",
      title: "Non-Disclosure Agreement",
      description:
        "Protect confidential information with AI-generated NDAs compliant with UAE laws",
      icon: <FileCheck className="w-8 h-8" />,
      category: "legal",
      estimatedTime: "2 min",
      popularity: 95,
    },
    {
      id: "employment-contract",
      title: "Employment Contract",
      description:
        "Generate UAE labor law compliant employment agreements with AI assistance",
      icon: <Users className="w-8 h-8" />,
      category: "hr",
      estimatedTime: "3 min",
      popularity: 88,
    },
    {
      id: "service-agreement",
      title: "Service Agreement",
      description:
        "Create professional service contracts tailored to your business needs",
      icon: <Briefcase className="w-8 h-8" />,
      category: "legal",
      estimatedTime: "3 min",
      popularity: 82,
    },
    {
      id: "invoice",
      title: "VAT Invoice",
      description:
        "AI-powered invoices with automatic VAT calculation for UAE compliance",
      icon: <Receipt className="w-8 h-8" />,
      category: "accounting",
      estimatedTime: "1 min",
      popularity: 98,
    },
    {
      id: "offer-letter",
      title: "Job Offer Letter",
      description: "Professional offer letters with UAE employment standards",
      icon: <FileText className="w-8 h-8" />,
      category: "hr",
      estimatedTime: "2 min",
      popularity: 76,
    },
    {
      id: "termination-letter",
      title: "Employment Termination",
      description:
        "Legally compliant termination letters following UAE labor regulations",
      icon: <FileText className="w-8 h-8" />,
      category: "hr",
      estimatedTime: "2 min",
      popularity: 64,
    },
  ];

  const recentDocuments = [
    { name: "NDA - Tech Solutions LLC", date: "2 hours ago", type: "NDA" },
    {
      name: "Employment Contract - John Doe",
      date: "1 day ago",
      type: "Contract",
    },
    { name: "Invoice #INV-2024-0156", date: "2 days ago", type: "Invoice" },
  ];

  const statsData = [
    {
      icon: <FileText />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badgeText: "+23%",
      badgeBg: "bg-blue-50",
      badgeColor: "text-blue-500",
      title: "Documents Created",
      value: "127",
      subtitle: "vs yesterday",
    },
    {
      icon: <Download />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeText: "+15%",
      badgeBg: "bg-green-50",
      badgeColor: "text-green-500",
      title: "Downloads",
      value: "89",
      subtitle: "this week",
    },
    {
      icon: <Clock />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      badgeText: "-8%",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-500",
      title: "Time Saved",
      value: "42hrs",
      subtitle: "this month",
    },
    {
      icon: <CheckCircle />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeText: "+5%",
      badgeBg: "bg-green-50",
      badgeColor: "text-green-500",
      title: "AI Accuracy",
      value: "99.7%",
      subtitle: "UAE Compliance Check",
      gradient: true,
    },
  ];

  const handleTemplateClick = (templateId: string) => {
    router.push(`/dashboard/documents/new/${templateId}`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 mb-4">
        {/* Header */}
        <PageHeader
          title="AI Document Generator"
          description="Create professional, UAE-compliant documents in minutes with AI assistance"
          showAIBadge={true}
          icon={<Sparkles size={24} />}
        />

        {/* Stats Cards - Using Reusable StatCard Component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Left Side Wrapper Container */}
          <div className="lg:col-span-2">
            {/* Document Templates Grid Container */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1B2A49]">
                  Document Templates
                </h2>
                <span className="text-sm text-[#344767]">
                  {templates.length} templates found
                </span>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateClick(template.id)}
                    className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5] hover:shadow-md transition-all cursor-pointer group hover:border-[#2E69A4]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        {template.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[#F6A821] text-xs font-semibold bg-[#F6A821]/10 px-2 py-1 rounded">
                          <TrendingUp className="w-3 h-3" />
                          {template.popularity}%
                        </div>
                      </div>
                    </div>

                    <h3 className="text-[#1B2A49] font-bold text-lg mb-2 group-hover:text-[#2E69A4] transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-[#344767] text-sm mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-[#E1E8F5]">
                      <div className="flex items-center gap-2 text-[#344767] text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{template.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#2E69A4] font-semibold group-hover:gap-3 transition-all">
                        <span className="text-sm">Create</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {templates.length === 0 && (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-[#E1E8F5] text-center">
                  <FileText className="w-16 h-16 text-[#344767]/30 mx-auto mb-4" />
                  <h3 className="text-[#1B2A49] font-semibold text-lg mb-2">
                    No templates found
                  </h3>
                  <p className="text-[#344767]">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Container */}
          <div className="space-y-6 sticky top-2 h-[80vh]">
            {/* Recent Documents */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E5EAF2]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[#1B2A49] font-semibold text-lg tracking-tight">
                  Recent Documents
                </h3>
                <button
                  onClick={() => router.push("/dashboard/documents/history")}
                  className="text-[#2E69A4] text-sm font-medium hover:underline hover:text-[#184d82] transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-[#EDEFF3]">
                {recentDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 py-3 px-2 hover:bg-[#F9FAFB] rounded-lg transition-all cursor-pointer group"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#F3F6FB] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#E9F1FB] transition-colors">
                      <FileText className="w-5 h-5 text-[#2E69A4]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1B2A49] font-medium text-sm truncate group-hover:text-[#2E69A4] transition-colors">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#6B7280]">
                          {doc.date}
                        </span>
                        <span className="text-xs font-medium text-[#2563EB] bg-[#E9F1FB] px-2 py-0.5 rounded-full">
                          {doc.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Button */}
              <button
                onClick={() => router.push("/dashboard/documents/history")}
                className="w-full mt-5 py-2.5 border border-[#D7E3F2] text-[#2E69A4] font-semibold text-sm rounded-lg hover:bg-[#F4F7FA] transition-colors"
              >
                View All Documents
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
              <h3 className="text-[#1B2A49] font-bold text-lg mb-4">
                Quick Tips
              </h3>
              <ul className="space-y-3 text-sm text-[#344767]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2E69A4] rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    All documents are automatically saved to your archive
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2E69A4] rounded-full mt-2 flex-shrink-0"></div>
                  <span>AI pre-fills data from your business profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2E69A4] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Review and edit before downloading</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
