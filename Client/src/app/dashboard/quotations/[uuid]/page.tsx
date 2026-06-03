"use client";
// src/app/dashboard/quotations/[uuid]/page.tsx
// Full quotation detail page — shows status timeline, linked docs,
// AI suggestions, and all actions including send, convert, duplicate.

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Send, Download, Edit, Copy, Trash2, RefreshCw, Archive,
  FileText, ExternalLink, Link2, Check, CheckCircle, Eye, Clock,
  Building2, Calendar, Hash, DollarSign, Printer, X, AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button          from "@/components/ui/Button";
import Card            from "@/components/ui/Card";
import Modal           from "@/components/ui/Modal";
import InputField      from "@/components/ui/InputField";
import LoadingSpinner  from "@/components/loading-spinner/LoadingSpinner";
import { useAuth }     from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import axiosInstance   from "@/utils/axiosInstance";
import toast           from "react-hot-toast";
import { Quotation, getQuotationStatusBadge } from "@/lib/quotationTypes";
import { useQuotationDuplicate }             from "@/hooks/useQuotationAI";
import QuotationStatusTimeline               from "@/components/quotation/QuotationStatusTimeline";
import QuotationAiSuggestionsSidebar         from "@/components/quotation/QuotationAiSuggestionsSidebar";

export default function QuotationDetailPage() {
  const params       = useParams();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user }     = useAuth();
  const { currentPlan } = useSubscription();
  const { duplicate, isDuplicating } = useQuotationDuplicate();

  const uuid   = params.uuid as string;
  const userId = user?.user?.user_id as string;
  const isPro  = currentPlan?.name === "Pro" || currentPlan?.name === "Enterprise";

  const [quotation,    setQuotation]    = useState<Quotation | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isConverting, setIsConverting] = useState(false);

  // Send modal
  const [showSendModal, setShowSendModal] = useState(searchParams.get("action") === "send");
  const [isSending,     setIsSending]     = useState(false);
  const [emailForm,     setEmailForm]     = useState({ to: "", subject: "", message: "" });
  const [publicUrl,     setPublicUrl]     = useState<string | null>(null);

  // Link document modal
  const [showLinkModal,  setShowLinkModal]  = useState(false);
  const [linkForm,       setLinkForm]       = useState({ document_uuid: "", document_type: "Proposal", document_name: "" });

  // Convert confirm
  const [showConvertModal, setShowConvertModal] = useState(false);

  const fetchQuotation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/quotations/single/${uuid}`);
      const q: Quotation = res.data.data;
      setQuotation(q);
      setEmailForm({
        to:      q.client_email ?? "",
        subject: `Quotation ${q.quotation_number} from BizMate`,
        message: `Dear ${q.client_name},\n\nPlease review the attached quotation for ${q.project_title ?? "your project"}.\n\nTotal: ${q.currency} ${Number(q.grand_total).toLocaleString()}\nValid until: ${new Date(q.expiry_date).toLocaleDateString("en-AE")}\n\nBest regards`,
      });
      if (q.public_token) {
        setPublicUrl(`${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/q/${q.public_token}`);
      }
    } catch { toast.error("Could not load quotation."); }
    finally { setIsLoading(false); }
  }, [uuid]);

  useEffect(() => { fetchQuotation(); }, [fetchQuotation]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await axiosInstance.post(`/quotations/send/${uuid}`, {
        email_to:       emailForm.to,
        email_subject:  emailForm.subject,
        email_message:  emailForm.message,
      });
      setPublicUrl(res.data.public_url);
      toast.success("Quotation sent! Shareable link generated.");
      setShowSendModal(false);
      fetchQuotation();
    } catch (err: any) { toast.error(err?.response?.data?.message ?? "Failed to send."); }
    finally { setIsSending(false); }
  };

  const handleConvertToInvoice = async () => {
    setIsConverting(true);
    try {
      const res = await axiosInstance.post("/quotations/convert-to-invoice", {
        quotation_uuid: uuid, user_id: userId,
      });
      toast.success(`Invoice ${res.data.invoice_number} created!`);
      setShowConvertModal(false);
      router.push(`/dashboard/invoicing/preview/${res.data.invoice_uuid}`);
    } catch (err: any) { toast.error(err?.response?.data?.message ?? "Conversion failed."); }
    finally { setIsConverting(false); }
  };

  const handleDuplicate = async () => {
    const result = await duplicate(uuid, userId);
    if (result) { toast.success("Quotation duplicated!"); router.push(`/dashboard/quotations/${result.uuid}`); }
    else toast.error("Could not duplicate.");
  };

  const handleArchive = async () => {
    if (!confirm("Archive this quotation?")) return;
    try {
      await axiosInstance.patch(`/quotations/status/${uuid}`, { status: "archived" });
      toast.success("Quotation archived."); fetchQuotation();
    } catch { toast.error("Failed to archive."); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this quotation? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/quotations/delete/${uuid}`);
      toast.success("Quotation deleted.");
      router.push("/dashboard/quotations");
    } catch { toast.error("Failed to delete."); }
  };

  const handleDownloadPdf = async () => {
    try {
      if (quotation?.pdf_path) {
        window.open(`${process.env.NEXT_PUBLIC_ASSET_URL}${quotation.pdf_path}`, "_blank");
        return;
      }
      const res = await axiosInstance.post(`/quotations/generate-pdf/${uuid}`);
      if (res.data?.url) window.open(`${process.env.NEXT_PUBLIC_ASSET_URL}${res.data.url}`, "_blank");
    } catch { toast.error("Could not generate PDF."); }
  };

  const handleCopyLink = () => {
    if (!publicUrl) { toast.error("Send the quotation first to generate a link."); return; }
    navigator.clipboard.writeText(publicUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleLinkDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.document_uuid || !linkForm.document_name) { toast.error("All fields required."); return; }
    try {
      await axiosInstance.post("/quotations/link-document", { quotation_uuid: uuid, ...linkForm });
      toast.success("Document linked."); setShowLinkModal(false); fetchQuotation();
    } catch (err: any) { toast.error(err?.response?.data?.message ?? "Failed to link document."); }
  };

  const handleUnlinkDocument = async (documentUuid: string) => {
    if (!confirm("Remove this linked document?")) return;
    try {
      await axiosInstance.delete("/quotations/unlink-document", { data: { quotation_uuid: uuid, document_uuid: documentUuid } });
      toast.success("Document unlinked."); fetchQuotation();
    } catch { toast.error("Failed to unlink document."); }
  };

  if (isLoading) return <DashboardLayout><div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div></DashboardLayout>;
  if (!quotation) return null;

  const isExpired   = new Date(quotation.expiry_date) < new Date() && !["converted","archived"].includes(quotation.status);
  const canConvert  = quotation.status === "accepted" && !quotation.converted_invoice_id;
  const canSend     = ["draft", "sent"].includes(quotation.status);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-heading">{quotation.quotation_number}</h1>
            <p className="text-text-secondary mt-0.5">{quotation.project_title ?? quotation.client_name}</p>
          </div>
          <Button onClick={() => router.push("/dashboard/quotations")} startIcon={<ArrowLeft className="w-4 h-4" />} className="bg-surface border border-border text-text-secondary hover:bg-bg-base">Back</Button>
        </div>

        {/* Action bar */}
        <Card className="p-5 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-light rounded-lg"><FileText className="w-5 h-5 text-secondary" /></div>
                <div>
                  <h2 className="font-bold text-text-heading">{quotation.quotation_number}</h2>
                  <p className="text-sm text-text-secondary">{quotation.client_name}</p>
                </div>
              </div>
              <span className={getQuotationStatusBadge(quotation.status)}>
                {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
              </span>
              {isExpired && <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full">Expired</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => window.print()} className="bg-surface border border-border text-text-secondary hover:bg-bg-base text-sm py-2 px-3" startIcon={<Printer className="w-4 h-4" />}>Print</Button>
              <Button onClick={handleDownloadPdf} className="bg-surface border border-border text-text-secondary hover:bg-bg-base text-sm py-2 px-3" startIcon={<Download className="w-4 h-4" />}>PDF</Button>
              {canSend && <Button onClick={() => setShowSendModal(true)} className="text-sm py-2 px-4" startIcon={<Send className="w-4 h-4" />}>Send to Client</Button>}
              {canConvert && (
                <Button onClick={() => setShowConvertModal(true)} className="bg-green-600 text-white hover:bg-green-700 text-sm py-2 px-4" startIcon={<RefreshCw className="w-4 h-4" />}>Convert to Invoice</Button>
              )}
            </div>
          </div>
        </Card>

        {/* Status timeline */}
        <div className="mb-6">
          <QuotationStatusTimeline currentStatus={quotation.status} activityLog={quotation.activity_log} />
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main content ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Grand Total",  value: `${quotation.currency} ${Number(quotation.grand_total).toLocaleString()}`, icon: <DollarSign className="w-4 h-4" />, color: "text-indigo-600" },
                { label: "Issue Date",   value: new Date(quotation.issue_date).toLocaleDateString("en-AE", { day: "numeric", month: "short" }), icon: <Calendar className="w-4 h-4" />, color: "text-text-secondary" },
                { label: "Expiry Date",  value: new Date(quotation.expiry_date).toLocaleDateString("en-AE", { day: "numeric", month: "short" }), icon: <Clock className="w-4 h-4" />, color: isExpired ? "text-red-600" : "text-text-secondary" },
                { label: "Line Items",   value: `${quotation.line_items?.length ?? 0} items`, icon: <Hash className="w-4 h-4" />, color: "text-text-secondary" },
              ].map(({ label, value, icon, color }) => (
                <Card key={label} className="p-4">
                  <div className={`flex items-center gap-2 mb-1 ${color}`}>{icon}<span className="text-xs font-semibold uppercase tracking-wider">{label}</span></div>
                  <div className={`text-base font-bold ${color}`}>{value}</div>
                </Card>
              ))}
            </div>

            {/* Client info */}
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border bg-surface flex items-center gap-2">
                <Building2 className="w-4 h-4 text-text-muted" />
                <h3 className="font-semibold text-text-heading text-sm">Client Information</h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  ["Name",    quotation.client_name],
                  ["Email",   quotation.client_email],
                  ["Address", quotation.client_address],
                  ["Phone",   quotation.client_phone],
                ].map(([label, value]) => value ? (
                  <div key={label}><div className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">{label}</div><div className="text-text-heading font-medium">{value}</div></div>
                ) : null)}
              </div>
            </Card>

            {/* Line items table */}
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border bg-surface">
                <h3 className="font-semibold text-text-heading text-sm">Line Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand"><tr>{["Item", "Qty", "Unit Price", "Disc%", "Tax%", "Total"].map((h) => <th key={h} className="px-5 py-3 text-left text-xs font-medium text-on-brand uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-border">
                    {(quotation.line_items ?? []).map((item, i) => (
                      <tr key={i} className="hover:bg-bg-base transition-colors">
                        <td className="px-5 py-3.5"><div className="font-semibold text-text-heading">{item.name}</div>{item.description && <div className="text-xs text-text-muted mt-0.5">{item.description}</div>}</td>
                        <td className="px-5 py-3.5 text-text-secondary">{item.quantity} {item.unit}</td>
                        <td className="px-5 py-3.5 text-text-secondary">{quotation.currency} {Number(item.unit_price).toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-text-secondary">{item.discount_pct}%</td>
                        <td className="px-5 py-3.5 text-text-secondary">{item.tax_pct}%</td>
                        <td className="px-5 py-3.5 font-bold text-text-heading">{quotation.currency} {Number(item.line_total).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-5 border-t border-border flex justify-end">
                <div className="w-64 space-y-1.5 text-sm">
                  <div className="flex justify-between text-text-secondary"><span>Subtotal</span><span>{quotation.currency} {Number(quotation.subtotal).toLocaleString()}</span></div>
                  <div className="flex justify-between text-green-600"><span>Discount</span><span>- {quotation.currency} {Number(quotation.total_discount).toLocaleString()}</span></div>
                  <div className="flex justify-between text-text-secondary"><span>Tax (VAT)</span><span>{quotation.currency} {Number(quotation.total_tax).toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-base text-indigo-600 border-t border-border pt-2"><span>Grand Total</span><span>{quotation.currency} {Number(quotation.grand_total).toLocaleString()}</span></div>
                </div>
              </div>
            </Card>

            {/* Terms, notes, client comment */}
            {(quotation.terms_and_conditions || quotation.notes) && (
              <Card className="p-5 space-y-4">
                {quotation.terms_and_conditions && (<div><div className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">Terms & Conditions</div><p className="text-sm text-text-secondary leading-relaxed">{quotation.terms_and_conditions}</p></div>)}
                {quotation.notes && (<div><div className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">Notes</div><p className="text-sm text-text-secondary leading-relaxed">{quotation.notes}</p></div>)}
              </Card>
            )}
            {quotation.client_comment && (
              <Card className="p-5 bg-indigo-50/40 border-indigo-200">
                <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-2">Client Comment</div>
                <p className="text-sm text-indigo-700 leading-relaxed">"{quotation.client_comment}"</p>
                {quotation.client_action_at && <p className="text-xs text-indigo-400 mt-2">Received {new Date(quotation.client_action_at).toLocaleString("en-AE")}</p>}
              </Card>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* AI suggestions */}
            <QuotationAiSuggestionsSidebar userId={userId} isPro={isPro} />

            {/* Shareable link */}
            {publicUrl && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-text-heading mb-2 flex items-center gap-2"><ExternalLink className="w-4 h-4 text-secondary" />Client Link</h3>
                <div className="text-xs text-text-muted bg-bg-base border border-border rounded-lg p-2.5 break-all font-mono mb-2">{publicUrl}</div>
                <button onClick={handleCopyLink} className="w-full py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Copy Link
                </button>
              </Card>
            )}

            {/* Linked documents */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
                <div className="flex items-center gap-2"><Link2 className="w-4 h-4 text-text-muted" /><span className="text-sm font-semibold text-text-heading">Linked Documents</span></div>
                <button onClick={() => setShowLinkModal(true)} className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1"><Link2 className="w-3 h-3" /> Link</button>
              </div>
              <div className="p-3 space-y-2">
                {(!quotation.linked_documents || quotation.linked_documents.length === 0) ? (
                  <p className="text-xs text-text-muted text-center py-2">No linked documents yet.</p>
                ) : (
                  quotation.linked_documents.map((doc) => (
                    <div key={doc.document_uuid} className="flex items-center gap-2 p-2.5 border border-border rounded-xl hover:bg-bg-base group transition-colors">
                      <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0"><div className="text-xs font-medium text-text-heading truncate">{doc.document_name}</div><div className="text-[9px] text-text-muted">{doc.document_type}</div></div>
                      <button onClick={() => handleUnlinkDocument(doc.document_uuid)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400 hover:text-red-600 rounded"><X className="w-3 h-3" /></button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Converted invoice link */}
            {quotation.converted_invoice_id && (
              <Card className="p-4 bg-indigo-50/40 border-indigo-200">
                <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-2">Converted to Invoice</div>
                <button onClick={() => router.push(`/dashboard/invoicing/preview/${quotation.converted_invoice_id}`)} className="w-full text-left p-2.5 bg-surface border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="text-xs font-medium text-indigo-700 flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> View Invoice →</div>
                </button>
              </Card>
            )}

            {/* Quick actions */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-bg-base"><h3 className="text-sm font-semibold text-text-heading">Quick Actions</h3></div>
              <div className="p-3 space-y-1.5">
                {[
                  { label: "Edit quotation",   icon: <Edit className="w-4 h-4 text-status-info" />,    onClick: () => router.push(`/dashboard/quotations/new?id=${uuid}`), show: true },
                  { label: "Duplicate",        icon: <Copy className="w-4 h-4 text-text-muted" />,     onClick: handleDuplicate,             show: true, loading: isDuplicating },
                  { label: "Archive",          icon: <Archive className="w-4 h-4 text-text-muted" />,  onClick: handleArchive,               show: quotation.status !== "archived" },
                  { label: "Delete quotation", icon: <Trash2 className="w-4 h-4" />,                   onClick: handleDelete,                show: true, danger: true },
                ].filter((a) => a.show).map(({ label, icon, onClick, loading, danger }) => (
                  <button key={label} onClick={onClick} disabled={loading} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl border transition-all disabled:opacity-50 ${danger ? "text-status-error border-status-error-border hover:bg-status-error-bg" : "text-text-secondary border-border hover:bg-bg-base"}`}>
                    {icon} {loading ? "Please wait…" : label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Send Modal ────────────────────────────────────────────────────── */}
      <Modal isOpen={showSendModal} onClose={() => !isSending && setShowSendModal(false)} title="Send Quotation to Client" showCloseButton={!isSending} closeOnOverlayClick={!isSending} size="md" titleIcon={<Send className="w-5 h-5 text-white" />}>
        <form onSubmit={handleSend}>
          <div className="p-6 space-y-4">
            <div className="bg-status-info-bg border border-status-info-border rounded-lg p-3 text-sm text-status-info">
              A shareable public link will be generated for {quotation.client_name}. They can view, accept, or reject without logging in.
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">To *</label>
              <input type="email" required className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-bg-base text-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-200" value={emailForm.to} onChange={(e) => setEmailForm((p) => ({ ...p, to: e.target.value }))} placeholder="client@email.ae" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Subject</label>
              <input className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-bg-base text-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-200" value={emailForm.subject} onChange={(e) => setEmailForm((p) => ({ ...p, subject: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Message</label>
              <textarea rows={5} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-bg-base text-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" value={emailForm.message} onChange={(e) => setEmailForm((p) => ({ ...p, message: e.target.value }))} />
            </div>
          </div>
          <div className="px-6 pb-5 flex gap-3">
            <Button type="button" onClick={() => setShowSendModal(false)} disabled={isSending} className="bg-surface border border-border text-text-secondary hover:bg-bg-base">Cancel</Button>
            <Button type="submit" disabled={isSending} className="flex-1 justify-center" startIcon={isSending ? null : <Send className="w-4 h-4" />}>
              {isSending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</> : "Send Quotation"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Convert Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={showConvertModal} onClose={() => !isConverting && setShowConvertModal(false)} title="Convert to Invoice" showCloseButton={!isConverting} closeOnOverlayClick={!isConverting} size="sm" titleIcon={<RefreshCw className="w-5 h-5 text-white" />}>
        <div className="p-6">
          <div className="bg-surface border border-border rounded-xl p-4 mb-4">
            <div className="text-sm font-semibold text-text-heading">{quotation.quotation_number}</div>
            <div className="text-sm text-text-secondary mt-1">{quotation.client_name} · {quotation.currency} {Number(quotation.grand_total).toLocaleString()}</div>
          </div>
          <p className="text-sm text-text-secondary mb-5">All line items, taxes, and client details will be copied to a new invoice. This quotation will be marked as converted.</p>
          <div className="flex gap-3">
            <Button onClick={() => setShowConvertModal(false)} disabled={isConverting} className="bg-surface border border-border text-text-secondary hover:bg-bg-base">Cancel</Button>
            <Button onClick={handleConvertToInvoice} disabled={isConverting} className="flex-1 justify-center bg-green-600 text-white hover:bg-green-700" startIcon={<RefreshCw className={`w-4 h-4 ${isConverting ? "animate-spin" : ""}`} />}>
              {isConverting ? "Converting…" : "Confirm & Create Invoice"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Link Document Modal ───────────────────────────────────────────── */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title="Link Document" showCloseButton closeOnOverlayClick size="sm" titleIcon={<Link2 className="w-5 h-5 text-white" />}>
        <form onSubmit={handleLinkDocument}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Document UUID *</label>
              <input required className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-bg-base text-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-200" value={linkForm.document_uuid} onChange={(e) => setLinkForm((p) => ({ ...p, document_uuid: e.target.value }))} placeholder="Paste document UUID" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Document Type</label>
              <select className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-bg-base text-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-200" value={linkForm.document_type} onChange={(e) => setLinkForm((p) => ({ ...p, document_type: e.target.value }))}>
                {["Proposal", "Contract", "NDA", "Scope of Work", "Other"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Document Name *</label>
              <input required className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-bg-base text-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-200" value={linkForm.document_name} onChange={(e) => setLinkForm((p) => ({ ...p, document_name: e.target.value }))} placeholder="e.g. Website Proposal PR-001" />
            </div>
          </div>
          <div className="px-6 pb-5 flex gap-3">
            <Button type="button" onClick={() => setShowLinkModal(false)} className="bg-surface border border-border text-text-secondary hover:bg-bg-base">Cancel</Button>
            <Button type="submit" className="flex-1 justify-center" startIcon={<Link2 className="w-4 h-4" />}>Link Document</Button>
          </div>
        </form>
      </Modal>

      <style>{`@media print { body * { visibility: hidden; } .print-area, .print-area * { visibility: visible; } }`}</style>
    </DashboardLayout>
  );
}
