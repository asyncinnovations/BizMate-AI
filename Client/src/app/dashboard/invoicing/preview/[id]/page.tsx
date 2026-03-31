"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  Send,
  FileText,
  ArrowLeft,
  Printer,
  CheckCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getStatusBadge } from "@/lib/statusBadge";
import axiosInstance from "@/utils/axiosInstance";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import InvoicePreviewCard from "@/components/invoice/InvoicePreviewCard";
import SendInvoiceModal from "@/components/invoice/SendInvoiceModal";

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
  user_id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  invoice_items: InvoiceItem[];
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

// ─── Payment link helper ──────────────────────────────────────────────────────
// Generates: /pay/[invoiceId]?method=stripe
// method is always stripe — customer cannot change it from the PDF link
const buildPaymentLink = (invoiceId: string): string => {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/pay/${invoiceId}?method=stripe`;
};

const InvoicePreviewPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    to: "",
    cc: "",
    subject: "",
    message: "",
  });

  ///////////////////////////////
  // Fetch Single Invoice Data
  /////////////////////////////////////////
  const fetchSingleInvoice = async () => {
    try {
      const response = await axiosInstance.get(`/invoices/single/${invoiceId}`);
      if (response.status === 200) {
        setCurrentInvoice(response.data);
        // Pre-fill email — include the payment link in the message body
        const payLink = buildPaymentLink(invoiceId);
        setEmailFormData({
          to: response.data.customer_email || "",
          cc: "",
          subject: `Invoice ${response.data.invoice_number} from Business Solutions Inc.`,
          message: `Dear ${response.data.customer_name},

Please find attached invoice ${response.data.invoice_number} for the amount of AED ${response.data.total.toLocaleString()}.

Payment is due by ${new Date(response.data.due_date).toLocaleDateString()}.

Pay online: ${payLink}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Best regards,
Business Solutions Inc.`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSingleInvoice();
  }, [invoiceId]);

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
        invoiceId: invoiceId,
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

  //////////////////////////////////
  // Handle Print Invoice
  /////////////////////////////////
  const handlePrint = () => {
    console.log("Document Print Successfully!");
    alert("Document Print Successfully!");
  };

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

  const openSendEmailModal = (invoice: Invoice) => {
    setIsModalOpen(true);
  };

  const closeSendEmailModal = () => {
    setIsModalOpen(false);
  };

  if (!currentInvoice) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-heading mb-2">
                Invoice Preview
              </h1>
              <p className="text-text-secondary">
                Review your invoice before sending to customer
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button
                onClick={() => router.push("/dashboard/invoicing")}
                startIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Invoices
              </Button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-surface rounded-xl shadow-card border border-border p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-light rounded-lg">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-text-heading text-lg">
                      {currentInvoice.invoice_number}
                    </h2>
                    <p className="text-text-secondary text-sm">
                      For {currentInvoice.customer_name}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusBadge(currentInvoice.status)}`}>
                  {(currentInvoice.status === "paid" || "saved") && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {currentInvoice.status.charAt(0).toUpperCase() +
                    currentInvoice.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handlePrint}
                  className="bg-surface border border-border text-text-secondary hover:bg-bg-base"
                  startIcon={<Printer className="w-4 h-4" />}
                >
                  Print
                </Button>
                <Button
                  onClick={() => handleDownloadPDF(currentInvoice)}
                  className="bg-status-warning text-on-brand hover:bg-status-warning/90"
                  startIcon={<Download className="w-4 h-4" />}
                >
                  Download PDF
                </Button>
                <Button
                  onClick={() => openSendEmailModal(currentInvoice)}
                  startIcon={<Send className="w-4 h-4" />}
                >
                  Send to Customer
                </Button>
              </div>
            </div>
          </div>

          {/* Invoice Preview Card Component */}
          {/*
            The InvoicePreviewCard renders the paper-style invoice.
            The payment link is embedded inside InvoicePreviewCard via the
            paymentLink prop — it appears in the "Payment Instructions" section
            of the invoice itself, so it is visible in both the screen view
            and the downloaded PDF.
          */}
          <InvoicePreviewCard
            invoice={currentInvoice}
            paymentLink={buildPaymentLink(invoiceId)}
          />

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-6 bg-surface border border-border rounded-lg px-6 py-4 shadow-card">
              <div className="text-sm text-text-secondary">
                Ready to send this invoice to your customer?
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/dashboard/invoicing/new")}
                  className="bg-surface border border-border text-text-secondary hover:bg-bg-base text-sm"
                >
                  Create New
                </Button>
                <Button
                  onClick={() => openSendEmailModal(currentInvoice)}
                  className="text-sm"
                  startIcon={<Send className="w-4 h-4" />}
                >
                  Send to Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Invoice Modal Component */}
      <SendInvoiceModal
        isOpen={isModalOpen}
        onClose={closeSendEmailModal}
        invoiceNumber={currentInvoice.invoice_number}
        emailFormData={emailFormData}
        onEmailFormChange={handleEmailFormChange}
        onSubmit={handleSendEmail}
        isSending={isSending}
      />
    </DashboardLayout>
  );
};

export default InvoicePreviewPage;