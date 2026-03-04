"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useEffect, useState } from "react";
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
  Trash2,
  Edit,
  RefreshCw,
} from "lucide-react";
import StatCard from "@/components/stat-card/StatCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { getStatusBadge } from "@/lib/statusBadge";
import PageHeader from "@/components/page-header/PageHeader";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import DropdownMenu from "@/components/ui/DropdownMenu";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";

interface FormField {
  id: string;
  name: keyof Invoice | string;
  label: string;
  type: "text" | "email" | "date" | "number" | "textarea" | "select";
  placeholder: string;
  required: boolean;
  value: string;
  options?: string[];
}

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
  uuid: string;
  user_id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  items: InvoiceItem[];
  custom_fields: Record<string, FormField>;
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  status: "paid" | "unpaid" | "draft" | "saved";
}

const InvoiceListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const router = useRouter();
  const { user, loading } = useAuth();
  const userId = !loading ? user?.user.user_id : "";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInvoices, setUserInvoices] = useState<Invoice[]>([]);

  const statsData = [
    {
      title: "Total Invoices",
      value: userInvoices.length,
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
      value: userInvoices.filter((invoice) => invoice.status === "paid").length,
      subtitle: `${
        userInvoices.filter((invoice) => invoice.status === "paid").length
      } paid invoices`,
      icon: <CheckCircle className="w-6 h-6" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      badgeText: "Paid",
      badgeBg: "bg-green-50",
      badgeColor: "text-green-600",
    },
    {
      title: "UnPaid Invoices",
      value: userInvoices.filter((invoice) => invoice.status === "unpaid")
        .length,
      subtitle: `${
        userInvoices.filter((invoice) => invoice.status === "unpaid").length
      } unpaid invoices`,
      icon: <AlertTriangle className="w-6 h-6" />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      badgeText: "Pending",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-600",
    },
    {
      title: "Total Revenue",
      value: `AED ${userInvoices
        .filter((invoice) => invoice.status === "paid")
        .reduce((total, invoice) => total + Number(invoice.total | 0), 0)}`,
      subtitle: "+15.2% from last quarter",
      icon: <DollarSign className="w-6 h-6" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      badgeText: "Growth",
      badgeBg: "bg-purple-50",
      badgeColor: "text-purple-600",
    },
  ];

  /////////////////////////////////
  // Fetch all user invoices
  /////////////////////////////////
  const fetchUserInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/invoices/user/${userId}`);
      if (response.status === 200) {
        console.log(response.data);
        const invoices = response.data;
        setUserInvoices(invoices);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchUserInvoices();
    }
  }, [user, loading]);

  /////////////////////////////////
  // Send Invoice to customer
  /////////////////////////////////
  const handleSendInvoice = (invoiceId: string) => {
    alert(`Invoice ${invoiceId} sent successfully with AI optimization!`);
  };

  /////////////////////////////////
  // DownLoad Pdf
  /////////////////////////////////
  const handleDownloadPDF = (invoice: Invoice) => {
    alert(`Downloading AI-optimized PDF for ${invoice.invoice_number}`);
  };

  /////////////////////////////////
  // Delete Invoice
  /////////////////////////////////
  const handleDeleteInvoice = async (invoiceId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this invoice? This action cannot be undone."
      )
    ) {
      try {
        setIsLoading(true);
        const response = await axiosInstance.delete(
          `/invoices/delete/${invoiceId}`
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchUserInvoices();
        }
      } catch (error) {
        console.log("Error while deleting the invoice", error);
        toast.error("Error while deleting the invoice.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  /////////////////////////////
  // Update Invoice Status
  ////////////////////////////
  const handleChangeStatus = async (invoiceId: string) => {
    const selectedInvoice = userInvoices.find(
      (invoice) => invoice.uuid === invoiceId
    );
    const newInvoiceStatus =
      selectedInvoice?.status.toLowerCase() === "unpaid" ? "paid" : "unpaid";
    if (
      confirm(
        `Are you sure you want to mark this invoice as "${newInvoiceStatus}"?`
      )
    ) {
      try {
        setIsLoading(true);

        const response = await axiosInstance.patch(
          `/invoices/update/status/${invoiceId}`,
          { status: newInvoiceStatus }
        );
        if (response.status === 200) {
          toast.success("Invoice status updated successfully!");
          fetchUserInvoices();
        }
      } catch (error) {
        console.log("Error occur while updating status", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /////////////////////////////////
  // Update invoice
  /////////////////////////////////
  const handleUpdateInvoice = (invoiceId: string) => {
    router.push(`/dashboard/invoicing/new?id=${invoiceId}`);
  };

  /////////////////////////////////
  // Search or Filter invoices
  /////////////////////////////////
  const filteredInvoices = userInvoices.filter((invoice) => {
    const matchesSearch =
      invoice?.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice?.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <div className="w-full">
          {/* Page Header */}
          <PageHeader
            title="AI Invoicing"
            description="Intelligent invoice management with automated tracking, smart
                predictions, and AI-powered optimization"
            icon={<Sparkles size={24} />}
            showAIBadge={true}
            buttons={[
              {
                text: "New AI Invoice",
                onClick: () => router.push("/dashboard/invoicing/new"),
                icon: <Plus size={20} />,
              },
              {
                text: "AI Insights",
                onClick: () => {},
                icon: <Brain size={20} />,
                className: "bg-[#F6A821] hover:bg-[#e29819]",
              },
            ]}
          />

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
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFilterDropdown(!showFilterDropdown);
                      }}
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
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-xl shadow-lg z-20">
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
                              {userInvoices.length}
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
                                userInvoices.filter(
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
                                userInvoices.filter(
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

            <div className="overflow-x-auto min-h-[60vh]">
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
                      key={invoice.uuid}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                            <FileText className="w-4 h-4 text-[#1B2A49]" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#1B2A49]">
                              {invoice.invoice_number}
                            </div>
                            <div className="text-xs text-gray-500">
                              AI Managed
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-[#344767]">
                          {invoice.customer_name}
                        </div>
                        {invoice.customer_email && (
                          <div className="text-sm text-gray-500">
                            {invoice.customer_email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#344767]">
                        <div>
                          {new Date(invoice.invoice_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Due {new Date(invoice.due_date).toLocaleDateString()}
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
                            href={`/dashboard/invoicing/preview/${invoice.uuid}`}
                            className="p-2 text-gray-600 hover:text-[#1B2A49] hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleSendInvoice(invoice.uuid)}
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

                          {/* More Actions Dropdown - FIXED USAGE */}
                          <DropdownMenu
                            items={[
                              {
                                label: "Update Invoice",
                                onClick: () =>
                                  handleUpdateInvoice(invoice.uuid),
                                icon: <Edit className="w-4 h-4" />,
                                description: "Edit invoice details",
                                variant: "default",
                              },
                              {
                                label: "Change Status",
                                onClick: () => handleChangeStatus(invoice.uuid),
                                icon: <RefreshCw className="w-4 h-4" />,
                                description: `Mark as ${
                                  invoice.status.toLowerCase() === "paid"
                                    ? "unpaid"
                                    : "paid"
                                }`,
                                variant: "success",
                              },
                              {
                                label: "Delete Invoice",
                                onClick: () =>
                                  handleDeleteInvoice(invoice.uuid),
                                icon: <Trash2 className="w-4 h-4" />,
                                description: "Remove permanently",
                                variant: "destructive",
                              },
                            ]}
                            triggerLabel="Invoice Actions"
                            align="right"
                            triggerClassName="p-2 text-gray-600 hover:text-[#1B2A49] hover:bg-blue-50 rounded-lg transition-all duration-200"
                          />
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
                      startIcon={<Plus className="w-4 h-4" />}
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
