"use client";
// src/app/dashboard/invoicing/preview/[id]/page.tsx  — FULL REPLACEMENT
// New additions: InvoiceStatusTimeline, AiInsightsPanel, Quick Actions panel, Duplicate button

import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Send, FileText, ArrowLeft, Printer, CheckCircle, Edit, Copy, RefreshCw, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { getStatusBadge } from "@/lib/statusBadge";
import { Invoice, EmailFormData } from "@/lib/invoiceTypes";
import axiosInstance from "@/utils/axiosInstance";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import SendInvoiceModal from "@/components/invoice/SendInvoiceModal";
import { useAuth } from "@/context/AuthContext";
import InvoicePdfViewer from "@/components/invoice/InvoicePdfViewer";
import toast from "react-hot-toast";
import { useSubscription } from "@/context/SubscriptionContext";
import { useInvoiceDuplicate } from "@/hooks/useInvoiceAI";
import InvoiceStatusTimeline from "@/components/invoice/InvoiceStatusTimeline";
import AiInsightsPanel from "@/components/invoice/AiInsightsPanel";

const buildPaymentLink = (invoiceId: string) => {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/pay/${invoiceId}?method=stripe`;
};

const InvoicePreviewPage: React.FC = () => {
  const params    = useParams();
  const router    = useRouter();
  const { user }  = useAuth();
  const { currentPlan } = useSubscription();
  const { duplicate } = useInvoiceDuplicate();
  const invoiceId = params.id as string;

  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [isSending, setIsSending]           = useState(false);
  const [emailFormData, setEmailFormData]   = useState<EmailFormData>({ to: "", cc: "", subject: "", message: "" });

  const isPro = currentPlan?.name === "Pro" || currentPlan?.name === "Enterprise";
  const userId = user?.user?.user_id as string;

  const fetchSingleInvoice = async () => {
    try {
      const res = await axiosInstance.get(`/invoices/single/${invoiceId}`);
      if (res.status === 200) {
        setCurrentInvoice(res.data);
        const payLink = buildPaymentLink(invoiceId);
        setEmailFormData({
          to:      res.data.customer_email || "",
          cc:      "",
          subject: `Invoice ${res.data.invoice_number} from BizMate`,
          message: `Dear ${res.data.customer_name},\n\nPlease find attached invoice ${res.data.invoice_number} for AED ${Number(res.data.total).toLocaleString()}.\n\nDue: ${new Date(res.data.due_date).toLocaleDateString()}\n\nPay online: ${payLink}\n\nBest regards`,
        });
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchSingleInvoice(); }, [invoiceId]);

  const handleDownloadPDF = async () => {
    if (!currentInvoice) return;
    try {
      const res = await axiosInstance.post("/invoices/preview", currentInvoice);
      if (res.status === 200 && res.data?.url) {
        const link = document.createElement("a");
        link.href = `${process.env.NEXT_PUBLIC_ASSET_URL}${res.data.url}`;
        link.download = `invoice-${currentInvoice.invoice_number}`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
      }
    } catch { toast.error("Error downloading invoice."); }
  };

  const handleSendInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailFormData.to) { toast.error("Recipient email required"); return; }
    setIsSending(true);
    try {
      const isScheduled = !!emailFormData.send_at;
      if (isScheduled) {
        const res = await axiosInstance.post("/invoice-schedules/create", { invoice_id: invoiceId, recipient_email: emailFormData.to, type: "one_time", scheduled_at: emailFormData.send_at });
        if ([200, 201].includes(res.status)) { toast.success(`Scheduled for ${new Date(emailFormData.send_at!).toLocaleString()}`); setIsModalOpen(false); }
      } else {
        const res = await axiosInstance.post("/invoices/send_to_email", { invoiceId, ...emailFormData });
        if (res.status === 200) {
          toast.success(`Invoice sent to ${emailFormData.to}`);
          setIsModalOpen(false);
          // Refresh to pick up the "sent" status auto-update from the backend
          fetchSingleInvoice();
        }
      }
    } catch (error: any) {
      if (!error?.response || error.response.status !== 403) toast.error("Failed to send invoice.");
    } finally { setIsSending(false); }
  };

  const handleDuplicate = async () => {
    const result = await duplicate(invoiceId, userId);
    if (result) { toast.success("Invoice duplicated! Opening draft..."); router.push(`/dashboard/invoicing/new?id=${result.uuid}`); }
    else toast.error("Could not duplicate invoice.");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    try {
      const res = await axiosInstance.delete(`/invoices/delete/${invoiceId}`);
      if (res.status === 200) { toast.success("Invoice deleted."); router.push("/dashboard/invoicing"); }
    } catch { toast.error("Failed to delete invoice."); }
  };

  const handleEmailFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!currentInvoice) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <div className="w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-heading mb-1">Invoice Preview</h1>
              <p className="text-text-secondary">{currentInvoice.invoice_number} · {currentInvoice.customer_name}</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button onClick={() => router.push("/dashboard/invoicing")} startIcon={<ArrowLeft className="w-4 h-4" />}>Back to Invoices</Button>
            </div>
          </div>

          {/* Action bar */}
          <div className="bg-surface rounded-xl shadow-card border border-border p-5 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-light rounded-lg"><FileText className="w-5 h-5 text-secondary" /></div>
                  <div>
                    <h2 className="font-bold text-text-heading text-lg">{currentInvoice.invoice_number}</h2>
                    <p className="text-text-secondary text-sm">For {currentInvoice.customer_name}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 ${getStatusBadge(currentInvoice.status)}`}>
                  <CheckCircle className="w-3 h-3" />
                  {currentInvoice.status.charAt(0).toUpperCase() + currentInvoice.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => window.print()} className="bg-surface border border-border text-text-secondary hover:bg-bg-base" startIcon={<Printer className="w-4 h-4" />}>Print</Button>
                <Button onClick={handleDownloadPDF} className="bg-status-warning text-on-brand hover:bg-status-warning/90" startIcon={<Download className="w-4 h-4" />}>Download PDF</Button>
                <Button onClick={() => setIsModalOpen(true)} startIcon={<Send className="w-4 h-4" />}>Send to Customer</Button>
              </div>
            </div>
          </div>

          {/* Status timeline — NEW, driven by activity_log from API */}
          <div className="mb-6">
            <InvoiceStatusTimeline currentStatus={currentInvoice.status} activityLog={currentInvoice.activity_log} />
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: PDF viewer */}
            <div className="lg:col-span-2">
              <InvoicePdfViewer data={currentInvoice} paymentLink={buildPaymentLink(invoiceId)} />
            </div>

            {/* Right: AI Insights + Quick Actions */}
            <div className="space-y-4">
              {/* AI Insights panel — NEW, calls GET /invoices/ai-insights/:id */}
              <AiInsightsPanel invoiceId={invoiceId} customerName={currentInvoice.customer_name} isPro={isPro} />

              {/* Quick actions */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-bg-base">
                  <h3 className="text-sm font-semibold text-text-heading">Quick Actions</h3>
                </div>
                <div className="p-3 space-y-2">
                  <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all">
                    <Send className="w-4 h-4 text-status-success" /> Send to customer
                  </button>
                  <button onClick={() => router.push(`/dashboard/invoicing/new?id=${invoiceId}`)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all">
                    <Edit className="w-4 h-4 text-status-info" /> Edit invoice
                  </button>
                  {/* NEW: Duplicate button — calls POST /invoices/duplicate */}
                  <button onClick={handleDuplicate} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all">
                    <Copy className="w-4 h-4 text-secondary" /> Duplicate invoice
                  </button>
                  <button onClick={handleDownloadPDF} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all">
                    <Download className="w-4 h-4 text-text-muted" /> Download PDF
                  </button>
                  <button onClick={handleDelete} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-status-error hover:bg-status-error-bg rounded-xl border border-status-error-border transition-all">
                    <Trash2 className="w-4 h-4" /> Delete invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SendInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} invoiceNumber={currentInvoice.invoice_number} emailFormData={emailFormData} onEmailFormChange={handleEmailFormChange} onSubmit={handleSendInvoice} isSending={isSending} />
    </DashboardLayout>
  );
};

export default InvoicePreviewPage;
