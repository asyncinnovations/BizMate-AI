"use client";

import React, { useEffect, useState } from "react";
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
  Plus,
  Star,
  Send,
  FileSignature,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/stat-card/StatCard";
import PageHeader from "@/components/page-header/PageHeader";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";

interface DocumentTemplate {
  uuid: string;
  id: string;
  template_name: string;
  description: string;
  fields_schema: Record<string, string>;
  user_id: string | null;
  is_prebuilt: boolean;
}

const dummyTemplates = [
  {
    uuid: "6b71e1ca-c877-40c9-afd8-4f997b435ef1",
    id: 1,
    template_name: "Employment Contract",
    description: "Standard employment agreement for companies.",
    fields_schema: {
      salary: "",
      position: "",
      start_date: "",
      employee_name: "",
    },
    user_id: null,
    is_prebuilt: true,
    version: 1,
    is_active: true,
    created_at: "2025-11-03T05:38:48.886Z",
    updated_at: "2025-11-03T05:38:48.886Z",
  },
];

export default function DocumentGeneratorMain() {
  const router = useRouter();
  const [customTemplates, setCustomTemplates] = useState<DocumentTemplate[]>(
    []
  );
  const [preBuiltTemplates, setPreBuiltTemplates] = useState<
    DocumentTemplate[]
  >([]);
  const [activeTab, setActiveTab] = useState<"platform" | "custom">("platform");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const [allRes, userRes] = await Promise.all([
        axiosInstance.get("/templates/all"),
        axiosInstance.get(`/templates/user/${user?.user?.user_id}`),
      ]);
      console.log("Successfully fetched templates", allRes, userRes);
      const preBuilt = allRes.data?.data.filter((temp) => temp.is_prebuilt);
      setPreBuiltTemplates(preBuilt);
      setCustomTemplates(userRes.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.user) {
      fetchTemplates();
    }
  }, [loading, user]);

  // const updateTemplate = async () => {
  //   try {
  //     const response = await axiosInstance.put(
  //       "/templates/update/6b71e1ca-c877-40c9-afd8-4f997b435ef1",
  //       {
  //         template_name: "Non-Disclosure Agreement",
  //         description:
  //           "Create a legally binding NDA to protect confidential information.",
  //         fields_schema: {
  //           "Disclosing Party Name": "",
  //           "Disclosing Party Address": "",
  //           "Receiving Party Name": "",
  //           "Receiving Party Address": "",
  //           "Effective Date": "",
  //           "Agreement Duration": "",
  //           "Purpose of Disclosure": "",
  //           "Governing Law": "",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success("Template Updated Successfully!");
  //       console.log(response.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   updateTemplate();
  // });

  const iconMapper = {
    nda: <FileCheck className="w-8 h-8" />,
    "non-disclosure": <FileCheck className="w-8 h-8" />,
    employment: <Users className="w-8 h-8" />,
    service: <Briefcase className="w-8 h-8" />,
    invoice: <Receipt className="w-8 h-8" />,
    offer: <FileText className="w-8 h-8" />,
    termination: <FileText className="w-8 h-8" />,
    contract: <FileSignature className="w-8 h-8" />,
  };

  const getTemplateIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();

    for (const [key, icon] of Object.entries(iconMapper)) {
      if (lowerTitle.includes(key)) {
        return icon;
      }
    }

    return <FileText className="w-8 h-8" />;
  };

  // const platformTemplates: DocumentTemplate[] = [
  //   {
  //     id: "nda",
  //     title: "Non-Disclosure Agreement",
  //     description:
  //       "Protect confidential information with AI-generated NDAs compliant with UAE laws",
  //     icon: <FileCheck className="w-8 h-8" />,
  //     category: "legal",
  //     estimatedTime: "2 min",
  //     popularity: 95,
  //     isCustom: false,
  //   },
  //   {
  //     id: "employment-contract",
  //     title: "Employment Contract",
  //     description:
  //       "Generate UAE labor law compliant employment agreements with AI assistance",
  //     icon: <Users className="w-8 h-8" />,
  //     category: "hr",
  //     estimatedTime: "3 min",
  //     popularity: 88,
  //     isCustom: false,
  //   },
  //   {
  //     id: "service-agreement",
  //     title: "Service Agreement",
  //     description:
  //       "Create professional service contracts tailored to your business needs",
  //     icon: <Briefcase className="w-8 h-8" />,
  //     category: "legal",
  //     estimatedTime: "3 min",
  //     popularity: 82,
  //     isCustom: false,
  //   },
  //   {
  //     id: "invoice",
  //     title: "VAT Invoice",
  //     description:
  //       "AI-powered invoices with automatic VAT calculation for UAE compliance",
  //     icon: <Receipt className="w-8 h-8" />,
  //     category: "accounting",
  //     estimatedTime: "1 min",
  //     popularity: 98,
  //     isCustom: false,
  //   },
  //   {
  //     id: "offer-letter",
  //     title: "Job Offer Letter",
  //     description: "Professional offer letters with UAE employment standards",
  //     icon: <FileText className="w-8 h-8" />,
  //     category: "hr",
  //     estimatedTime: "2 min",
  //     popularity: 76,
  //     isCustom: false,
  //   },
  //   {
  //     id: "termination-letter",
  //     title: "Employment Termination",
  //     description:
  //       "Legally compliant termination letters following UAE labor regulations",
  //     icon: <FileText className="w-8 h-8" />,
  //     category: "hr",
  //     estimatedTime: "2 min",
  //     popularity: 64,
  //     isCustom: false,
  //   },
  // ];

  // Example custom templates (you can fetch these from your backend)
  // const customTemplates: DocumentTemplate[] = [
  //   {
  //     id: "custom-partnership-agreement",
  //     title: "Partnership Agreement",
  //     description:
  //       "Custom partnership agreement template for multi-party business ventures",
  //     icon: <Briefcase className="w-8 h-8" />,
  //     category: "legal",
  //     estimatedTime: "4 min",
  //     popularity: 0,
  //     isCustom: true,
  //   },
  //   {
  //     id: "custom-rental-contract",
  //     title: "Rental Agreement",
  //     description:
  //       "Property rental contract template with custom terms and conditions",
  //     icon: <FileText className="w-8 h-8" />,
  //     category: "real-estate",
  //     estimatedTime: "3 min",
  //     popularity: 0,
  //     isCustom: true,
  //   },
  // ];

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

  const handleCreateCustomTemplate = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCustomPrompt("");
  };

  const handleSubmitPrompt = () => {
    if (!customPrompt.trim()) return;

    setIsSubmitting(true);

    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(customPrompt);

    // Navigate to the custom template generation page with the prompt
    router.push(
      `/dashboard/documents/create-custom-template?prompt=${encodedPrompt}`
    );
  };

  const displayedTemplates =
    activeTab === "platform" ? preBuiltTemplates : customTemplates;

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1B2A49]">
                  Document Templates
                </h2>
                <button
                  onClick={handleCreateCustomTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Custom Template
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between mb-6 border-b border-[#E1E8F5]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("platform")}
                    className={`px-4 py-2.5 font-semibold text-sm transition-all relative ${
                      activeTab === "platform"
                        ? "text-[#2E69A4]"
                        : "text-[#344767] hover:text-[#2E69A4]"
                    }`}
                  >
                    Platform Templates
                    {activeTab === "platform" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E69A4]"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("custom")}
                    className={`px-4 py-2.5 font-semibold text-sm transition-all relative ${
                      activeTab === "custom"
                        ? "text-[#2E69A4]"
                        : "text-[#344767] hover:text-[#2E69A4]"
                    }`}
                  >
                    Custom Templates
                    {customTemplates?.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-[#2E69A4] text-white text-xs rounded-full">
                        {customTemplates?.length}
                      </span>
                    )}
                    {activeTab === "custom" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E69A4]"></div>
                    )}
                  </button>
                </div>

                {/* Templates Count Badge */}
                <span className="inline-flex mb-2 items-center px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-[#2E69A4] text-sm font-bold rounded-lg shadow-sm">
                  {displayedTemplates?.length} Template
                  {displayedTemplates?.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Templates Grid */}
              {isLoading ? (
                <div className="p-12">
                  <LoadingSpinner size="w-8 h-8" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedTemplates?.map((template) => (
                    <div
                      key={template.uuid}
                      onClick={() => handleTemplateClick(template.uuid)}
                      className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5] hover:shadow-md transition-all cursor-pointer group hover:border-[#2E69A4] relative"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          {getTemplateIcon(template.template_name)}
                        </div>

                        {template.is_prebuilt ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[#F6A821] text-xs font-semibold bg-[#F6A821]/10 px-2 py-1 rounded">
                              <TrendingUp className="w-3 h-3" />
                              {/* {template.popularity}% */}
                              90%
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 border border-gray-400 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full bg-white shadow-sm">
                            <Star className="w-3 h-3 text-gray-600" />
                            CUSTOM
                          </div>
                        )}
                      </div>

                      <h3 className="text-[#1B2A49] font-bold text-lg mb-2 group-hover:text-[#2E69A4] transition-colors">
                        {template.template_name}
                      </h3>
                      <p className="text-[#344767] text-sm mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-[#E1E8F5]">
                        <div className="flex items-center gap-2 text-[#344767] text-sm">
                          <Clock className="w-4 h-4" />
                          {/* <span>{template.estimatedTime}</span> */}
                        </div>
                        <div className="flex items-center gap-2 text-[#2E69A4] font-semibold group-hover:gap-3 transition-all">
                          <span className="text-sm">Create</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {displayedTemplates?.length === 0 && !isLoading && (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-[#E1E8F5] text-center">
                  <FileText className="w-16 h-16 text-[#344767]/30 mx-auto mb-4" />
                  <h3 className="text-[#1B2A49] font-semibold text-lg mb-2">
                    {activeTab === "custom"
                      ? "No custom templates yet"
                      : "No templates found"}
                  </h3>
                  <p className="text-[#344767] mb-4">
                    {activeTab === "custom"
                      ? "Create your first custom template to get started"
                      : "Try adjusting your search or filter criteria"}
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
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2E69A4] rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Create custom templates for recurring document needs
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Template Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Custom Template"
        showCloseButton={true}
        closeOnOverlayClick={true}
        size="md"
        titleIcon={<Sparkles className="w-5 h-5 text-white" />}
      >
        <div className="p-6">
          <p className="text-[#344767] text-sm mb-4">
            Describe the document template you want to create. Our AI will
            generate a custom template based on your requirements.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1B2A49] mb-2">
              Template Description
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., I need a sales agreement template for B2B software services with payment terms, intellectual property clauses, and termination conditions..."
              className="w-full h-40 px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent resize-none text-sm text-[#344767]"
            />
            <p className="text-xs text-[#6B7280] mt-2">
              Be as specific as possible to get the best results from AI
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#2E69A4] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#1B2A49] mb-1">
                  AI-Powered Generation
                </h4>
                <p className="text-xs text-[#344767]">
                  Our AI will analyze your requirements and create a
                  professional, UAE-compliant document template tailored to your
                  needs.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2.5 border border-[#E1E8F5] text-[#344767] font-semibold text-sm rounded-lg hover:bg-[#F4F7FA] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitPrompt}
              disabled={!customPrompt.trim() || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate Template</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
