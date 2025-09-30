"use client";

import DashboardLayout from "@/app/components/layout/DashboardLayout";
import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Plus,
  Search,
  Filter,
  Sparkles,
  Bot,
  Brain,
  Send,
  Download,
  Eye,
  ChevronDown,
} from "lucide-react";
import StatCard from "@/app/components/stat-card/StatCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import { getStatusBadge } from "@/lib/statusBadge";

// TypeScript interfaces
interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  items: InvoiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  status: "paid" | "unpaid" | "draft" | "saved";
  createdAt: string;
}

const InvoiceListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const router = useRouter();

  // Sample data for demonstration

  const sampleInvoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      customerName: "ABC Trading LLC",
      customerEmail: "accounts@abctrading.ae",
      invoiceDate: "2023-03-15",
      dueDate: "2023-03-30",
      paymentTerms: "Net 15",
      items: [
        {
          id: "1-1",
          name: "AI Consulting Services",
          description: "Business advisory and AI implementation consultation",
          quantity: 5,
          price: 1000,
          amount: 5000,
        },
      ],
      subtotal: 5000,
      vat: 250,
      total: 5250,
      notes: "Payment due within 15 days. Thank you for your business.",
      status: "paid",
      createdAt: "2023-03-15T10:30:00Z",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      customerName: "XYZ Consulting",
      customerEmail: "finance@xyzconsulting.ae",
      invoiceDate: "2023-03-22",
      dueDate: "2023-04-06",
      paymentTerms: "Net 15",
      items: [
        {
          id: "2-1",
          name: "AI Document Preparation",
          description: "Smart contract and agreement drafting using AI",
          quantity: 2,
          price: 500,
          amount: 1000,
        },
        {
          id: "2-2",
          name: "AI Compliance Review",
          description: "VAT filing compliance check with AI analysis",
          quantity: 3,
          price: 600,
          amount: 1800,
        },
      ],
      subtotal: 2800,
      vat: 140,
      total: 2940,
      notes: "Please process payment before due date.",
      status: "unpaid",
      createdAt: "2023-03-22T14:45:00Z",
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      customerName: "Tech Solutions ME",
      customerEmail: "billing@techsolutions.ae",
      invoiceDate: "2023-04-01",
      dueDate: "2023-04-16",
      paymentTerms: "Net 15",
      items: [
        {
          id: "3-1",
          name: "AI Integration Services",
          description: "Custom AI solution integration",
          quantity: 10,
          price: 750,
          amount: 7500,
        },
      ],
      subtotal: 7500,
      vat: 375,
      total: 7875,
      notes: "Thank you for your continued partnership.",
      status: "paid",
      createdAt: "2023-04-01T09:15:00Z",
    },
    {
      id: "4",
      invoiceNumber: "INV-004",
      customerName: "Digital Futures FZCO",
      customerEmail: "payments@digitalfutures.ae",
      invoiceDate: "2023-04-10",
      dueDate: "2023-04-25",
      paymentTerms: "Net 15",
      items: [
        {
          id: "4-1",
          name: "AI Predictive Analytics",
          description: "Revenue forecasting with machine learning",
          quantity: 8,
          price: 1200,
          amount: 9600,
        },
      ],
      subtotal: 9600,
      vat: 480,
      total: 10080,
      notes: "AI-generated insights included",
      status: "unpaid",
      createdAt: "2023-04-10T11:20:00Z",
    },
  ];

  const statsData = [
    {
      title: "Total Invoices",
      value: "10",
      subtitle: "+2 from last month",
      icon: <FileText className="w-6 h-6" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badgeText: "Active",
      badgeBg: "bg-blue-50",
      badgeColor: "text-blue-600",
    },
    {
      title: "Paid Invoices",
      value: "3",
      subtitle: "81.6% success rate",
      icon: <CheckCircle className="w-6 h-6" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      badgeText: "Paid",
      badgeBg: "bg-green-50",
      badgeColor: "text-green-600",
    },
    {
      title: "Pending Amount",
      value: "AED 40",
      subtitle: "12 unpaid invoices",
      icon: <AlertTriangle className="w-6 h-6" />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      badgeText: "Pending",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-600",
    },
    {
      title: "Total Revenue",
      value: "AED 200",
      subtitle: "+15.2% from last quarter",
      icon: <DollarSign className="w-6 h-6" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      badgeText: "Growth",
      badgeBg: "bg-purple-50",
      badgeColor: "text-purple-600",
    },
  ];

  const handleSendInvoice = (invoiceId: string) => {
    alert(`Invoice ${invoiceId} sent successfully with AI optimization!`);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    alert(`Downloading AI-optimized PDF for ${invoice.invoiceNumber}`);
  };

  const filteredInvoices = sampleInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 mb-4">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-[#1B2A49] to-[#2D4A7C] rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-br from-[#1B2A49] to-[#2D4A7C] bg-clip-text text-transparent">
                  AI Invoicing
                </h1>
                <span className="px-3 py-1 bg-gradient-to-r from-[#1B2A49] to-[#2D4A7C] text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  Powered by AI
                </span>
              </div>
              <p className="text-[#344767] max-w-2xl">
                Intelligent invoice management with automated tracking, smart
                predictions, and AI-powered optimization
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button
                onClick={() => router.push("/dashboard/invoicing/new")}
                icon={<Plus className="w-4 h-4" />}
              >
                New AI Invoice
              </Button>
              <Button
                icon={<Brain className="w-4 h-4" />}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
              >
                AI Insights
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((item, index) => (
              <StatCard key={index} {...item} />
            ))}
          </div>

          {/* Invoice List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1B2A49] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1B2A49]" />
                    Smart Invoice Management
                  </h2>
                  <p className="text-[#344767] mt-1">
                    AI-optimized tracking and automated workflows
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="AI-powered search..."
                      className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A49] focus:border-[#1B2A49] w-full lg:w-64 bg-gray-50/50 transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 w-full lg:w-auto justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span>Filter</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                          showFilterDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showFilterDropdown && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                        <div className="p-2">
                          <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
                            Filter by Status
                          </div>
                          <button
                            onClick={() => {
                              setStatusFilter("all");
                              setShowFilterDropdown(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm ${
                              statusFilter === "all"
                                ? "bg-[#1B2A49] text-white"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span>All Invoices</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                statusFilter === "all"
                                  ? "bg-white/20 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {sampleInvoices.length}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setStatusFilter("paid");
                              setShowFilterDropdown(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm ${
                              statusFilter === "paid"
                                ? "bg-green-50 text-green-800"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span>Paid</span>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              {
                                sampleInvoices.filter(
                                  (inv) => inv.status === "paid"
                                ).length
                              }
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setStatusFilter("unpaid");
                              setShowFilterDropdown(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm ${
                              statusFilter === "unpaid"
                                ? "bg-amber-50 text-amber-800"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span>Unpaid</span>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              {
                                sampleInvoices.filter(
                                  (inv) => inv.status === "unpaid"
                                ).length
                              }
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1B2A49] to-[#2D4A7C]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Invoice No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      VAT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                            <FileText className="w-4 h-4 text-[#1B2A49]" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#1B2A49]">
                              {invoice.invoiceNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              AI Managed
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-[#344767]">
                          {invoice.customerName}
                        </div>
                        {invoice.customerEmail && (
                          <div className="text-sm text-gray-500">
                            {invoice.customerEmail}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#344767]">
                        <div>
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Due {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-[#1B2A49]">
                          AED {invoice.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#344767]">
                        AED {invoice.vat.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusBadge(
                            invoice.status
                          )}`}
                        >
                          {invoice.status === "paid" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {invoice.status === "unpaid" && (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/invoicing/preview/${invoice.id}`}
                            className="p-2 text-gray-600 hover:text-[#1B2A49] hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleSendInvoice(invoice.id)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="Send"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(invoice)}
                            className="p-2 text-gray-600 hover:text-[#1B2A49] hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                    <Brain className="w-full h-full" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[#1B2A49]">
                    No invoices found
                  </h3>
                  <p className="mt-2 text-[#344767] max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your AI-powered search or filter criteria."
                      : "Let AI help you create and manage your first intelligent invoice."}
                  </p>
                  <div className="mt-8 flex items-center justify-center">
                    <Button
                      onClick={() => router.push("/dashboard/invoicing/new")}
                      className="bg-gradient-to-r from-[#1B2A49] to-[#2D4A7C] hover:from-[#2D4A7C] hover:to-[#1B2A49] shadow-lg hover:shadow-xl transition-all duration-200 text-white"
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Create AI Invoice
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Assistant Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-600">
              <Bot className="w-4 h-4 text-[#1B2A49]" />
              <span>AI Assistant is monitoring your invoices 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceListPage;
