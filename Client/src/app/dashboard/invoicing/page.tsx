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
  Check,
  LockKeyhole,
  Zap,
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
import "./styles.css";
import { Button } from "react-bootstrap";
import Modal from "@/components/ui/Modal";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";

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
  const { checkUsage, incrementUsage } = useSubscriptionUsage();
  const [usageStats, setUsageStats] = useState<{
    used: number;
    limit: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ActiveTabs, setActiveTabs] = useState<"invoices" | "templates">(
    "templates",
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all",
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const router = useRouter();
  const { user, loading } = useAuth();
  const userId = !loading ? user?.user.user_id : "";

  const [AllPrebuildInvoice, setAllPrebuildInvoice] = useState([]);
  const [PrebuildTemplateLoader, setPrebuildTemplateLoader] = useState(false);

  const [OpenAinvoiceModal, setOpenAinvoiceModal] = useState(false);
  const [AiPrompt, setAiPrompt] = useState("");
  const [AIinvoiceGenLoader, setAIinvoiceGenLoader] = useState(false);

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
  useEffect(() => {
    const fetchStatus = async () => {
      const data = await checkUsage("invoicing.ai_prompts");
      setUsageStats(data);
    };
    fetchStatus();
  }, []);
  //==========================
  // Download Invoice PDF
  //==========================
  const fetch_prebuild_invoice = async () => {
    try {
      setPrebuildTemplateLoader(true);
      const response = await axiosInstance.get(`/invoices/prebuild`);
      if (response.status == 200) {
        setPrebuildTemplateLoader(false);
        console.log("fetch_prebuild_invoice", response.data);
        setAllPrebuildInvoice(response.data.response);
      }
    } catch (error) {
      setPrebuildTemplateLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_prebuild_invoice();
  }, []);
  //===========================
  // Download Invoice PDF
  //===========================
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
  //=======================
  // CALCULATE THE LIMIT
  //=======================
  const limit =
    currentPlan?.name === "Starter"
      ? 3
      : currentPlan?.name === "Startup"
        ? 15
        : currentPlan?.name === "Pro"
          ? 50
          : Infinity;

  //=======================
  // GENERATE AI INVOCIE
  //=======================
  async function handleAiGenerate() {
    const plan = currentPlan;

    //Safety Guard: Check local limit before doing anything
    if (isLimitReached) {
      toast.error("Daily AI prompt limit reached. Please try again tomorrow.");
      return;
    }

    try {
      setAIinvoiceGenLoader(true);

      //Increment & Enforce Usage (Backend check)
      // We await this first. If the backend says "Limit Exceeded",
      // it throws an error and jumps to catch, stopping the AI call.
      await incrementUsage({ usageKey: "invoicing.ai_prompts" });

      const data = { prompt: AiPrompt };
      const response = await axiosInstance.post(
        `/invoices/generate_invoice`,
        data,
      );

      if (response.status === 201) {
        //Success Sequence
        setAIinvoiceGenLoader(false);
        setOpenAinvoiceModal(false);
        setAiPrompt("");

        // Update local usage counter on success
        setUsageStats((prev) =>
          prev ? { ...prev, used: prev.used + 1 } : null,
        );

        const rawContent = response.data.response.data.content;
        const gen_data = JSON.parse(rawContent);

        toast.success("Invoice Draft Generated");

        //Navigation
        router.push(
          `/dashboard/invoicing/new?data=${encodeURIComponent(JSON.stringify(gen_data))}`,
        );
      }
    } catch (error) {
      setAIinvoiceGenLoader(false);
      // If error is from incrementUsage, toast is already handled in the hook
      console.error("AI Generation Error:", error);
    }
  }
  const isLimitReached =
    usageStats &&
    usageStats.limit !== -1 && // -1 is unlimited
    Number(usageStats.used) >= Number(usageStats.limit);

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
                // disabled: currentPlan?.name == "Starter",
                text:
                  currentPlan?.name == "Starter" ? (
                    <OverlayTooltip
                      id="btn-1"
                      title="This feature is not included in your current plan."
                    >
                      <span>AI-Assisted Invoicing</span>
                    </OverlayTooltip>
                  ) : (
                    <span>AI-Assisted Invoicing</span>
                  ),
                onClick() {
                  setOpenAinvoiceModal(true);
                },
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
          <div className="invoice_tabs">
            <button
              className={`${ActiveTabs === "templates" ? "active" : "inactive"}`}
              onClick={() => setActiveTabs("templates")}
            >
              Templates
            </button>
            <button
              className={`${ActiveTabs === "invoices" ? "active" : "inactive"}`}
              onClick={() => setActiveTabs("invoices")}
            >
              My Invoices
            </button>
          </div>
          {/* Invoice List */}
          <Card
            className={`p-0 overflow-hidden ${ActiveTabs === "templates" && "hidden"} `}
          >
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
          {/* invoice templates */}
          <Card
            className={`p-6 overflow-hidden ${ActiveTabs === "invoices" && "hidden"}`}
          >
            {PrebuildTemplateLoader && (
              <h1 className="text-center ">Loading...</h1>
            )}
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-xl font-bold text-text-heading flex items-center gap-2">
                  <FileText className="w-5 h-5 text-text-heading" />
                  Choose Invoice Template
                </h2>
                <p className="text-text-secondary mt-1">
                  Select a design to represent your brand professionally.
                </p>
              </div>

              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {AllPrebuildInvoice.length} Designs Available
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {AllPrebuildInvoice.map((template: any, index: number) => {
                // if this specific card is beyond the user's plan limit
                const isLocked = index >= limit;

                return (
                  <div
                    key={template.id}
                    className={`group relative rounded-2xl transition-all duration-500 bg-white border-2 flex flex-col
                      ${isLocked ? "opacity-80 grayscale-[0.5]" : "border-[#eee] hover:shadow-xl hover:-translate-y-1"}`}
                  >
                    {/* Premium Overlay for locked templates */}
                    {isLocked && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-2xl">
                        <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-xl mb-2">
                          <LockKeyhole />
                          PREMIUM
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 px-4 text-center">
                          Upgrade to{" "}
                          {currentPlan?.name === "Starter"
                            ? "Startup Growth"
                            : "Pro"}
                          to unlock
                        </p>
                      </div>
                    )}

                    {/* Details & Action Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-800 text-lg leading-none">
                            {template.invoice_name}
                          </h3>
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-widest">
                            {template.invoice_type}
                          </span>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${template.color} ring-4 ring-slate-50`}
                        />
                      </div>

                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">
                        {template.notes ||
                          "Professional invoice template for your business."}
                      </p>

                      <div className="mt-auto">
                        <Button
                          disabled={isLocked}
                          onClick={() => {
                            if (isLocked) return;
                            router.push(
                              `/dashboard/invoicing/new?data=${encodeURIComponent(JSON.stringify(template))}`,
                            );
                          }}
                          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 
                          ${
                            isLocked
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-sm"
                          }`}
                        >
                          {isLocked ? "Plan Locked" : "Use This Template"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
        {/* AI ASSISTED INVOICE MODAL */}
        <Modal
          isOpen={OpenAinvoiceModal}
          onClose={() => setOpenAinvoiceModal(false)}
          size={"md"}
        >
          <div className="p-6">
            {/* Header with AI Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  AI Invoice Generator
                </h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Powered by Bizmate-AI Intelligence
                </p>
              </div>
              <p className="text-xs mb-2">
                Daily Prompts: {usageStats?.used ?? 0} /{" "}
                {usageStats?.limit === -1 ? "∞" : usageStats?.limit}
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Describe your project in natural language. AI will extract
                items, amounts, and client details to draft your invoice
                instantly.
              </p>
            </div>

            {/* Prompt Input Area */}
            <div className="space-y-4">
              <div className="relative">
                <label className="text-xs font-bold text-slate-700 mb-1.5 block ml-1">
                  Your Prompt
                </label>
                <textarea
                  disabled={AIinvoiceGenLoader}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-0 transition-all resize-none min-h-[120px] shadow-sm"
                  placeholder="e.g., 'Create invoice for website redesign for ABC company worth AED 4,500'"
                  value={AiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <div className="absolute bottom-3 right-3">
                  <kbd className="px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-md">
                    Shift + Enter
                  </kbd>
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase w-full mb-1">
                  Quick Examples:
                </span>
                {[
                  "Software consulting for 20 hours",
                  "Logo design for StartUp Co",
                ].map((chip) => (
                  <button
                    key={chip}
                    className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setOpenAinvoiceModal(false)}
                className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                className={`${isLimitReached ? "bg-gray-400" : "bg-indigo-600"} flex-[2] py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100`}
                onClick={handleAiGenerate}
                disabled={AIinvoiceGenLoader || isLimitReached}
              >
                <Zap size={18} fill="currentColor" />
                {/* {AIinvoiceGenLoader ? "Generating...." : "Generate Draft"} */}
                {isLimitReached ? "Daily Limit Reached" : "Generate Invoice"}
              </Button>
            </div>
          </div>
        </Modal>
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
