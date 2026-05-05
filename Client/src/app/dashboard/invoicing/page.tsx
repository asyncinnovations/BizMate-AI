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
import { getStatusBadge } from "@/lib/statusBadge";
import PageHeader from "@/components/page-header/PageHeader";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import DropdownMenu from "@/components/ui/DropdownMenu";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import SendInvoiceModal from "@/components/invoice/SendInvoiceModal";
import EmptyState from "@/components/empty-state/EmptyState";
import Card from "@/components/ui/Card";
import OverlayTooltip from "@/components/overlay_tooltip/OverlayTooltip";
import { useSubscription } from "@/context/SubscriptionContext";

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

interface EmailFormData {
  to: string;
  cc: string;
  subject: string;
  message: string;
}

const InvoiceListPage: React.FC = () => {
  const { currentPlan } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all",
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const router = useRouter();
  const { user, loading } = useAuth();
  const userId = !loading ? user?.user.user_id : "";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [userInvoices, setUserInvoices] = useState<Invoice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    to: "",
    cc: "",
    subject: "",
    message: "",
  });

  const statsData = [
    {
      title: "Total Invoices",
      value: userInvoices.length,
      subtitle: "+2 from last month",
      icon: <FileText className="w-6 h-6" />,
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      badgeText: "Active",
      badgeBg: "bg-status-info-bg",
      badgeColor: "text-status-info",
    },
    {
      title: "Paid Invoices",
      value: userInvoices.filter((invoice) => invoice.status === "paid").length,
      subtitle: `${
        userInvoices.filter((invoice) => invoice.status === "paid").length
      } paid invoices`,
      icon: <CheckCircle className="w-6 h-6" />,
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      badgeText: "Paid",
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success",
    },
    {
      title: "UnPaid Invoices",
      value: userInvoices.filter((invoice) => invoice.status === "unpaid")
        .length,
      subtitle: `${
        userInvoices.filter((invoice) => invoice.status === "unpaid").length
      } unpaid invoices`,
      icon: <AlertTriangle className="w-6 h-6" />,
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning",
      badgeText: "Pending",
      badgeBg: "bg-status-warning-bg",
      badgeColor: "text-status-warning",
    },
    {
      title: "Total Revenue",
      value: `AED ${userInvoices
        .filter((invoice) => invoice.status === "paid")
        .reduce((total, invoice) => total + Number(invoice.total | 0), 0)}`,
      subtitle: "+15.2% from last quarter",
      icon: <DollarSign className="w-6 h-6" />,
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      badgeText: "Growth",
      badgeBg: "bg-brand-light",
      badgeColor: "text-secondary",
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

  ///////////////////////////////////
  // Download Invoice PDF
  ///////////////////////////////////
  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      // Currently we are no passing any id in api request ,  because backend to accept yet , need to update bacakend api
      const response = await axiosInstance(`/invoices/preview`);

      if (response.status === 200 && response.data?.url) {
        const fileUrl = `${process.env.NEXT_PUBLIC_ASSET_URL}${response.data.url}`;

        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `invoice-${invoice.invoice_number}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.log("Error occur while downloading the invoice.", error);
      toast.error("Error occur while downloading the invoice.");
    }
  };

  ////////////////////////////////
  // Send Invoice To Customer/Client
  /////////////////////////////////
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await axiosInstance.post("/invoices/send_to_email", {
        invoiceId: currentInvoice?.uuid,
        ...emailFormData,
      });

      toast.success(
        `Invoice ${currentInvoice?.invoice_number} sent successfully to ${emailFormData.to}`,
      );
      closeSendEmailModal();
    } catch (error) {
      console.log("Error sending email:", error);
      toast.error("Failed to send invoice email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  /////////////////////////////////
  // Delete Invoice
  /////////////////////////////////
  const handleDeleteInvoice = async (invoiceId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this invoice? This action cannot be undone.",
      )
    ) {
      try {
        setIsLoading(true);
        const response = await axiosInstance.delete(
          `/invoices/delete/${invoiceId}`,
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
      (invoice) => invoice.uuid === invoiceId,
    );
    const newInvoiceStatus =
      selectedInvoice?.status.toLowerCase() === "unpaid" ? "paid" : "unpaid";
    if (
      confirm(
        `Are you sure you want to mark this invoice as "${newInvoiceStatus}"?`,
      )
    ) {
      try {
        setIsLoading(true);

        const response = await axiosInstance.patch(
          `/invoices/update/status/${invoiceId}`,
          { status: newInvoiceStatus },
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

  ///////////////////////////////////
  // Handle Email Form Changing
  ////////////////////////////////////
  const handleEmailFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEmailFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  ///////////////////////////////////
  // Opening the send email modal with data setting
  ////////////////////////////////////
  const openSendEmailModal = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setEmailFormData({
      to: invoice.customer_email || "",
      cc: "",
      subject: `Invoice ${invoice.invoice_number} from Business Solutions Inc.`,
      message: `Dear ${invoice.customer_name},

Please find attached invoice ${invoice.invoice_number} for AED ${invoice.total}.

Due date: ${new Date(invoice.due_date).toLocaleDateString()}

Best regards,
Business Solutions Inc.`,
    });
    setIsModalOpen(true);
  };

  const closeSendEmailModal = () => {
    setCurrentInvoice(null);
    setIsModalOpen(false);
  };

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
                text: "New Invoice",
                onClick: () => router.push("/dashboard/invoicing/new"),
                icon: <Plus size={20} />,
              },
              {
                disabled: currentPlan?.name == "Starter",
                text: (
                  <OverlayTooltip
                    id="btn-1"
                    title="This feature is not included in your current plan."
                  >
                    <span>AI Insights</span>
                  </OverlayTooltip>
                ),
                onClick: () => {},
                icon: <Brain size={20} />,
                className:
                  "bg-status-warning text-on-brand hover:bg-status-warning/90",
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
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-border bg-surface">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-text-heading flex items-center gap-2">
                    <FileText className="w-5 h-5 text-text-heading" />
                    Smart Invoice Management
                  </h2>
                  <p className="text-text-secondary mt-1">
                    AI-optimized tracking and automated workflows
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="AI-powered search..."
                      className="pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary w-full lg:w-64 bg-bg-base text-text-secondary transition-all duration-200"
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
                      className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-bg-base transition-colors duration-200 w-full lg:w-auto justify-between text-text-secondary"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-text-muted" />
                        <span>Filter</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                          showFilterDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showFilterDropdown && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-raised z-20">
                        <div className="p-2">
                          <div className="text-xs font-semibold text-text-muted px-3 py-2 uppercase tracking-wide">
                            Filter by Status
                          </div>
                          <button
                            onClick={() => {
                              setStatusFilter("all");
                              setShowFilterDropdown(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                              statusFilter === "all"
                                ? "bg-brand text-on-brand"
                                : "hover:bg-bg-base text-text-secondary"
                            }`}
                          >
                            <span>All Invoices</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                statusFilter === "all"
                                  ? "bg-white/20 text-white"
                                  : "bg-border text-text-muted"
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
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                              statusFilter === "paid"
                                ? "bg-status-success-bg text-status-success"
                                : "hover:bg-bg-base text-text-secondary"
                            }`}
                          >
                            <span>Paid</span>
                            <span className="bg-border text-text-muted px-2 py-1 rounded-full text-xs">
                              {
                                userInvoices.filter(
                                  (inv) => inv.status === "paid",
                                ).length
                              }
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setStatusFilter("unpaid");
                              setShowFilterDropdown(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                              statusFilter === "unpaid"
                                ? "bg-status-warning-bg text-status-warning"
                                : "hover:bg-bg-base text-text-secondary"
                            }`}
                          >
                            <span>Unpaid</span>
                            <span className="bg-border text-text-muted px-2 py-1 rounded-full text-xs">
                              {
                                userInvoices.filter(
                                  (inv) => inv.status === "unpaid",
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
                <thead className="bg-brand">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider">
                      Invoice No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider">
                      VAT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.uuid}
                      className="hover:bg-brand-light/30 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-status-info-bg rounded-lg group-hover:bg-brand-light transition-colors duration-200">
                            <FileText className="w-4 h-4 text-secondary" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-text-heading">
                              {invoice.invoice_number}
                            </div>
                            <div className="text-xs text-text-muted">
                              AI Managed
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-text-secondary">
                          {invoice.customer_name}
                        </div>
                        {invoice.customer_email && (
                          <div className="text-sm text-text-muted">
                            {invoice.customer_email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        <div>
                          {new Date(invoice.invoice_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-text-muted">
                          Due {new Date(invoice.due_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-text-heading">
                          AED {invoice.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        AED {invoice.vat.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusBadge(
                            invoice.status,
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
                            className="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all duration-200"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openSendEmailModal(invoice)}
                            className="p-2 text-text-muted hover:text-status-success hover:bg-status-success-bg rounded-lg transition-all duration-200"
                            title="Send"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(invoice)}
                            className="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all duration-200"
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
                            triggerClassName="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all duration-200"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredInvoices.length === 0 && (
                <div className="p-6">
                  <EmptyState
                    icon={Brain}
                    title={
                      searchTerm || statusFilter !== "all"
                        ? "No results match your filters"
                        : "No invoices yet"
                    }
                    description={
                      searchTerm || statusFilter !== "all"
                        ? "Try adjusting your AI-powered search or filter criteria."
                        : "Let AI help you create and manage your first intelligent invoice."
                    }
                    ctaLabel="Create Invoice"
                    onCTAClick={() => router.push("/dashboard/invoicing/new")}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* AI Assistant Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm text-text-secondary shadow-card">
              <Bot className="w-4 h-4 text-secondary" />
              <span>AI Assistant is monitoring your invoices 24/7</span>
            </div>
          </div>
        </div>

        {/* Send Invoice Modal Component */}
        <SendInvoiceModal
          isOpen={isModalOpen}
          onClose={closeSendEmailModal}
          invoiceNumber={currentInvoice?.invoice_number || ""}
          emailFormData={emailFormData}
          onEmailFormChange={handleEmailFormChange}
          onSubmit={handleSendEmail}
          isSending={isSending}
        />
      </div>
    </DashboardLayout>
  );
};

export default InvoiceListPage;
