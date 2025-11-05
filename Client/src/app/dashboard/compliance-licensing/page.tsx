"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  // Visa,
  Building,
  Search,
  Filter,
  Plus,
  ChevronDown,
  Sparkles,
  TrendingUp,
  RefreshCw,
  UserCheck,
  Shield,
  CalendarClock,
  Zap,
  Receipt,
  ArrowRight,
  FileSearch,
  Calculator,
  CreditCard,
  MapPin,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import StatCard from "@/app/components/stat-card/StatCard";
import PageHeader from "@/app/components/page-header/PageHeader";
import Modal from "@/app/components/ui/Modal";

interface ComplianceItem {
  id: string;
  title: string;
  type: "license" | "visa" | "vat" | "custom";
  dueDate: string;
  status: "pending" | "completed" | "overdue" | "warning";
  priority: "high" | "medium" | "low";
  description: string;
  daysRemaining: number;
  lastUpdated: string;
  associatedDocument?: string;
  governmentAuthority: string;
  renewalFee?: number;
  processingTime?: string;
  requirements: string[];
  autoRenew: boolean;
  reminderSent: boolean;
  category: "free_zone" | "mainland" | "offshore";
  submissionStatus: "not_started" | "in_progress" | "submitted" | "approved";
  paymentStatus: "pending" | "paid" | "failed";
  trackingNumber?: string;
  serviceCenter?: string;
  officerAssigned?: string;
  estimatedCompletion?: string;
}

interface VisaApplication {
  id: string;
  employeeName: string;
  nationality: string;
  passportNumber: string;
  visaType: "employment" | "investor" | "family" | "visit";
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "medical_pending"
    | "approved"
    | "rejected";
  submissionDate: string;
  expiryDate: string;
  currentStage: string;
  nextStep: string;
  documents: string[];
  fees: number;
  processingTime: string;
}

interface LicenseInfo {
  id: string;
  licenseNumber: string;
  licenseType: string;
  businessActivity: string;
  establishmentName: string;
  issueDate: string;
  expiryDate: string;
  status: "active" | "expired" | "renewal_pending";
  authority: string;
  freeZone?: string;
  renewalCost: number;
  lateFees: number;
}

export default function ComplianceLicensingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "license" | "visa" | "vat"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed" | "overdue"
  >("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "licenses" | "visas" | "vat" | "reports"
  >("dashboard");
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  // Enhanced compliance items with real UAE business data
  const complianceItems: ComplianceItem[] = [
    {
      id: "1",
      title: "Trade License Renewal - DED Mainland",
      type: "license",
      dueDate: "2024-06-15",
      status: "pending",
      priority: "high",
      description: "Annual commercial license renewal for mainland company",
      daysRemaining: 45,
      lastUpdated: "2024-04-30",
      associatedDocument: "trade_license_2023.pdf",
      governmentAuthority: "Dubai DED",
      renewalFee: 15200,
      processingTime: "5-7 working days",
      requirements: [
        "Renewal application form",
        "Passport copies of partners",
        "Tenancy contract",
        "Previous license",
      ],
      autoRenew: true,
      reminderSent: true,
      category: "mainland",
      submissionStatus: "not_started",
      paymentStatus: "pending",
      trackingNumber: "DED-2024-06789",
      serviceCenter: "Business Village",
      estimatedCompletion: "2024-06-22",
    },
    {
      id: "2",
      title: "Employment Visa - Senior Developer",
      type: "visa",
      dueDate: "2024-05-20",
      status: "warning",
      priority: "high",
      description: "Employment visa renewal under Tasheel processing",
      daysRemaining: 20,
      lastUpdated: "2024-04-28",
      governmentAuthority: "GDRFA Dubai",
      renewalFee: 3500,
      processingTime: "10-12 working days",
      requirements: [
        "Employment contract",
        "Emirates ID application",
        "Medical fitness",
        "Insurance card",
      ],
      autoRenew: false,
      reminderSent: true,
      category: "mainland",
      submissionStatus: "in_progress",
      paymentStatus: "paid",
      trackingNumber: "GDRFA-V-234567",
      serviceCenter: "Al Twar Center",
      officerAssigned: "Ahmed Mohammed",
      estimatedCompletion: "2024-05-30",
    },
    {
      id: "3",
      title: "VAT Return - Q2 2024",
      type: "vat",
      dueDate: "2024-07-28",
      status: "pending",
      priority: "medium",
      description: "Quarterly VAT return submission for AED 1.2M turnover",
      daysRemaining: 88,
      lastUpdated: "2024-04-25",
      governmentAuthority: "Federal Tax Authority",
      requirements: [
        "Sales records",
        "Purchase records",
        "VAT calculation sheet",
        "Bank statements",
      ],
      autoRenew: true,
      reminderSent: false,
      category: "mainland",
      submissionStatus: "not_started",
      paymentStatus: "pending",
    },
    {
      id: "4",
      title: "Free Zone License - DMCC",
      type: "license",
      dueDate: "2024-08-10",
      status: "pending",
      priority: "medium",
      description: "DMCC free zone company license renewal",
      daysRemaining: 101,
      lastUpdated: "2024-04-20",
      governmentAuthority: "DMCC Authority",
      renewalFee: 18500,
      processingTime: "3-5 working days",
      requirements: [
        "Renewal form",
        "Office tenancy",
        "Share certificate",
        "Board resolution",
      ],
      autoRenew: false,
      reminderSent: false,
      category: "free_zone",
      submissionStatus: "not_started",
      paymentStatus: "pending",
      trackingNumber: "DMCC-FZ-456789",
      serviceCenter: "DMCC Business Center",
    },
  ];

  const visaApplications: VisaApplication[] = [
    {
      id: "visa-1",
      employeeName: "Ahmed Hassan",
      nationality: "Egyptian",
      passportNumber: "A12345678",
      visaType: "employment",
      status: "medical_pending",
      submissionDate: "2024-04-15",
      expiryDate: "2026-04-15",
      currentStage: "Medical Testing",
      nextStep: "Emirates ID Application",
      documents: [
        "Passport copy",
        "Photo",
        "Medical certificate",
        "Employment contract",
      ],
      fees: 5200,
      processingTime: "15-20 working days",
    },
    {
      id: "visa-2",
      employeeName: "Sarah Johnson",
      nationality: "British",
      passportNumber: "B87654321",
      visaType: "investor",
      status: "under_review",
      submissionDate: "2024-04-10",
      expiryDate: "2025-04-10",
      currentStage: "Security Clearance",
      nextStep: "Visa Stamping",
      documents: [
        "Passport copy",
        "Investment proof",
        "Business license",
        "Bank statements",
      ],
      fees: 7500,
      processingTime: "25-30 working days",
    },
  ];

  const licenseInfo: LicenseInfo[] = [
    {
      id: "lic-1",
      licenseNumber: "CN-123456789",
      licenseType: "Commercial",
      businessActivity: "Information Technology Services",
      establishmentName: "Tech Solutions Middle East LLC",
      issueDate: "2023-06-15",
      expiryDate: "2024-06-15",
      status: "active",
      authority: "Dubai DED",
      renewalCost: 15200,
      lateFees: 1000,
    },
    {
      id: "lic-2",
      licenseNumber: "FZ-987654321",
      licenseType: "Free Zone Commercial",
      businessActivity: "E-commerce & Digital Marketing",
      establishmentName: "Digital Ventures FZCO",
      issueDate: "2023-08-20",
      expiryDate: "2024-08-20",
      status: "active",
      authority: "DMCC",
      freeZone: "DMCC",
      renewalCost: 18500,
      lateFees: 1500,
    },
  ];

  const statsData = [
    {
      icon: <Calendar />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badgeText: "+2 Urgent",
      badgeBg: "bg-blue-50",
      badgeColor: "text-blue-500",
      title: "Pending Renewals",
      value: "4",
      subtitle: "Need immediate attention",
    },
    {
      icon: <Clock />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      badgeText: "20 days",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-500",
      title: "Nearest Deadline",
      value: "May 20",
      subtitle: "Employment Visa",
    },
    {
      icon: <Calculator />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      badgeText: "AED 42K",
      badgeBg: "bg-purple-50",
      badgeColor: "text-purple-500",
      title: "Upcoming Fees",
      value: "4 Items",
      subtitle: "Total due amount",
    },
    {
      icon: <TrendingUp />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeText: "AI Active",
      badgeBg: "bg-green-50",
      badgeColor: "text-green-500",
      title: "Compliance Score",
      value: "92%",
      subtitle: "Excellent standing",
      gradient: true,
    },
  ];

  const governmentPortals = [
    {
      name: "Dubai DED",
      url: "https://ded.gov.ae",
      icon: <Building className="w-4 h-4" />,
    },
    {
      name: "GDRFA Dubai",
      url: "https://gdrfad.gov.ae",
      icon: <Building className="w-4 h-4" />,
    },
    {
      name: "FTA Portal",
      url: "https://tax.gov.ae",
      icon: <Receipt className="w-4 h-4" />,
    },
    {
      name: "DMCC",
      url: "https://dmcc.ae",
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  const quickActions = [
    {
      name: "Renew License",
      icon: <RefreshCw className="w-5 h-5" />,
      action: () => setIsRenewalModalOpen(true),
    },
    {
      name: "Apply Visa",
      icon: <UserCheck className="w-5 h-5" />,
      action: () => router.push("/dashboard/visas/new"),
    },
    {
      name: "File VAT",
      icon: <Calculator className="w-5 h-5" />,
      action: () => router.push("/dashboard/vat/filing"),
    },
    {
      name: "Track Application",
      icon: <FileSearch className="w-5 h-5" />,
      action: () => router.push("/dashboard/tracking"),
    },
  ];

  const getStatusIcon = (status: ComplianceItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: ComplianceItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "overdue":
        return "bg-red-50 text-red-700 border border-red-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-blue-50 text-blue-700 border border-blue-200";
    }
  };

  const getPriorityBadge = (priority: ComplianceItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-green-50 text-green-700 border border-green-200";
    }
  };

  const getTypeIcon = (type: ComplianceItem["type"]) => {
    switch (type) {
      case "license":
        return <Building className="w-4 h-4" />;
      case "visa":
        return <Building className="w-4 h-4" />;
      case "vat":
        return <Receipt className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleSendReminder = (item: ComplianceItem) => {
    setSelectedItem(item);
    setIsReminderModalOpen(true);
  };

  const handleRenewNow = (item: ComplianceItem) => {
    setSelectedItem(item);
    setIsRenewalModalOpen(true);
  };

  const handleTrackApplication = (item: ComplianceItem) => {
    router.push(`/dashboard/compliance/tracking/${item.trackingNumber}`);
  };

  const handlePayFees = (item: ComplianceItem) => {
    router.push(`/dashboard/payments/${item.id}`);
  };

  const filteredItems = complianceItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const upcomingItems = complianceItems
    .filter((item) => item.status === "pending" || item.status === "warning")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 3);

  const urgentItems = complianceItems.filter(
    (item) =>
      item.priority === "high" &&
      (item.status === "pending" || item.status === "warning")
  );

  const totalUpcomingFees = complianceItems
    .filter((item) => item.status === "pending" || item.status === "warning")
    .reduce((sum, item) => sum + (item.renewalFee || 0), 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        {/* Header */}
        <PageHeader
          title="Compliance & Licensing Hub"
          description="AI-powered license renewal, visa tracking, VAT filing, and smart expiry reminders with UAE government integration"
          showAIBadge={true}
          icon={<Shield size={24} />}
          buttons={[
            {
              text: "Quick Renewal",
              onClick: () => setIsRenewalModalOpen(true),
              icon: <RefreshCw size={20} />,
              className: "bg-[#F6A821] hover:bg-[#e29819]",
            },
            {
              text: "Add New Item",
              onClick: () => router.push("/dashboard/compliance/new"),
              icon: <Plus size={20} />,
            },
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Alerts */}
            {urgentItems.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800">
                      Urgent Action Required
                    </h3>
                    <p className="text-red-700 text-sm">
                      {urgentItems.length} high-priority item
                      {urgentItems.length > 1 ? "s" : ""} need
                      {urgentItems.length > 1 ? "" : "s"} immediate attention
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
                    Take Action
                  </button>
                </div>
              </div>
            )}

            {/* Compliance Items Grid */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1B2A49]">
                  Active Compliance Items
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search compliance items..."
                      className="pl-10 pr-4 py-2.5 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent w-64 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-[#E1E8F5] rounded-lg hover:bg-[#F4F7FA] transition-colors text-sm font-semibold text-[#344767]"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showFilterDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#E1E8F5] rounded-lg p-4 hover:border-[#2E69A4] transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] rounded-lg flex items-center justify-center text-white">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-[#1B2A49] text-lg">
                              {item.title}
                            </h3>
                            {item.autoRenew && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                                <RefreshCw className="w-3 h-3" />
                                Auto-renew
                              </span>
                            )}
                          </div>
                          <p className="text-[#344767] text-sm mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.governmentAuthority}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.processingTime}
                            </span>
                            {item.trackingNumber && (
                              <span className="flex items-center gap-1">
                                <FileSearch className="w-3 h-3" />
                                {item.trackingNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(
                            item.priority
                          )}`}
                        >
                          {item.priority.toUpperCase()}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {getStatusIcon(item.status)}
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-xs text-gray-500">Due Date</div>
                          <div className="text-sm font-semibold text-[#1B2A49]">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">
                            Days Remaining
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              item.daysRemaining < 30
                                ? "text-red-600"
                                : item.daysRemaining < 60
                                ? "text-amber-600"
                                : "text-green-600"
                            }`}
                          >
                            {item.daysRemaining > 0
                              ? `${item.daysRemaining} days`
                              : "Overdue"}
                          </div>
                        </div>
                        {item.renewalFee && (
                          <div>
                            <div className="text-xs text-gray-500">Fee</div>
                            <div className="text-sm font-semibold text-[#1B2A49]">
                              AED {item.renewalFee.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.trackingNumber && (
                          <button
                            onClick={() => handleTrackApplication(item)}
                            className="flex items-center gap-2 px-3 py-1.5 border border-[#E1E8F5] text-[#344767] text-sm rounded-lg hover:bg-[#F4F7FA] transition-colors"
                          >
                            <FileSearch className="w-4 h-4" />
                            Track
                          </button>
                        )}
                        {item.renewalFee && (
                          <button
                            onClick={() => handlePayFees(item)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#F6A821] text-white text-sm rounded-lg hover:bg-[#e29819] transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                            Pay Fees
                          </button>
                        )}
                        <button
                          onClick={() => handleRenewNow(item)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#2E69A4] text-white text-sm rounded-lg hover:bg-[#1B2A49] transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Renew
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1B2A49]">
                  Upcoming Deadlines
                </h3>
                <CalendarClock className="w-5 h-5 text-[#2E69A4]" />
              </div>
              <div className="space-y-3">
                {upcomingItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-[#E1E8F5] rounded-lg hover:border-[#2E69A4] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-[#1B2A49]">
                        {item.title}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          item.daysRemaining < 30
                            ? "text-red-600"
                            : item.daysRemaining < 60
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.daysRemaining}d
                      </span>
                    </div>
                    <div className="text-xs text-[#344767] mb-2">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.daysRemaining < 30
                            ? "bg-red-500"
                            : item.daysRemaining < 60
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.max(
                            10,
                            100 - (item.daysRemaining / 120) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Government Portals */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
              <h3 className="text-lg font-bold text-[#1B2A49] mb-4">
                Government Portals
              </h3>
              <div className="space-y-2">
                {governmentPortals.map((portal, index) => (
                  <a
                    key={index}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-[#E1E8F5] rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors group"
                  >
                    {portal.icon}
                    <span className="flex-1 text-sm font-medium text-[#344767] group-hover:text-[#2E69A4]">
                      {portal.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2E69A4]" />
                  </a>
                ))}
              </div>
            </div>

            {/* AI Compliance Assistant */}
            <div className="bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-lg font-bold">AI Compliance Assistant</h3>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Proactive monitoring of 12+ UAE government regulations with
                real-time updates
              </p>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between items-center">
                  <span>License Compliance</span>
                  <span className="font-semibold bg-green-500/20 px-2 py-1 rounded">
                    92%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Visa Processing</span>
                  <span className="font-semibold bg-amber-500/20 px-2 py-1 rounded">
                    2 Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax Compliance</span>
                  <span className="font-semibold bg-green-500/20 px-2 py-1 rounded">
                    100%
                  </span>
                </div>
              </div>
              <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Get Smart Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title="Set Reminder Preferences"
        showCloseButton={true}
        closeOnOverlayClick={true}
        size="md"
      >
        <div className="p-6">{/* Reminder settings form */}</div>
      </Modal>

      <Modal
        isOpen={isRenewalModalOpen}
        onClose={() => setIsRenewalModalOpen(false)}
        title="Start Renewal Process"
        showCloseButton={true}
        closeOnOverlayClick={true}
        size="lg"
      >
        <div className="p-6">{/* Renewal process form */}</div>
      </Modal>
    </DashboardLayout>
  );
}
