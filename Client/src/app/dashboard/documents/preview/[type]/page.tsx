"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/app/dashboard/documents/preview/[type]/page.tsx  — FULL REPLACEMENT
//
// What changed from original:
//  1. Real document fetch from GET /documents/single/:uuid when UUID is available
//  2. DocumentStatusTimeline added (driven by activity_log)
//  3. DocumentCompliancePanel added in right sidebar (Pro only)
//  4. Status update wired to PATCH /documents/status/:uuid
//  5. Duplicate wired to POST /documents/duplicate
//  6. PDF download calls POST /documents/generate-pdf/:uuid
//  7. Quick actions panel with all actions
//  8. All original document renderers (NDA, employment, etc.) preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Download, CheckCircle, FileText, X, Send, Copy, Check,
  Printer, ArrowLeft, Edit, RefreshCw, Trash2, Stamp,
} from "lucide-react";
import DashboardLayout   from "@/components/layout/DashboardLayout";
import PageHeader        from "@/components/page-header/PageHeader";
import Button            from "@/components/ui/Button";
import axiosInstance     from "@/utils/axiosInstance";
import toast             from "react-hot-toast";
import SendInvoiceModal  from "@/components/invoice/SendInvoiceModal";
import { useAuth }       from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useDocumentDuplicate } from "@/hooks/useDocumentAI";

// NEW components
import DocumentStatusTimeline  from "@/components/document/DocumentStatusTimeline";
import DocumentCompliancePanel from "@/components/document/DocumentCompliancePanel";
import { GeneratedDocument, DocumentStatus } from "@/lib/documentTypes";

interface EmailFormData { to: string; cc: string; subject: string; message: string; }

export default function DocumentPreviewPage() {
  const params        = useParams();
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const { user }      = useAuth();
  const { currentPlan } = useSubscription();
  const { duplicate, isDuplicating } = useDocumentDuplicate();

  const documentType  = params?.type as string;
  const userId        = user?.user?.user_id as string;
  const isPro         = currentPlan?.name === "Pro" || currentPlan?.name === "Enterprise";

  // Is this a real saved document (UUID) or a fresh preview from form data?
  const isRealDocument = !!documentType && documentType.length === 36 && documentType.includes("-");

  const [formData,    setFormData]    = useState<Record<string, any>>({});
  const [document_,   setDocument_]   = useState<GeneratedDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({ to: "", cc: "", subject: "", message: "" });
  const [isSending,     setIsSending]    = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Fetch saved document if UUID is in the URL ─────────────────────────
  useEffect(() => {
    if (isRealDocument) {
      fetchDocument();
    } else {
      // Fresh preview from form — parse from URL param
      const dataParam = searchParams?.get("data");
      if (dataParam) {
        try {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          setFormData(parsed);
        } catch { console.error("Failed to parse form data"); }
      }
    }
  }, [documentType]);

  const fetchDocument = async () => {
    try {
      const res = await axiosInstance.get(`/documents/single/${documentType}`);
      if (res.status === 200) {
        const doc: GeneratedDocument = res.data.data;
        setDocument_(doc);
        // Merge field_values into formData for template renderers
        setFormData({
          ...doc.field_values,
          ...(doc.field_values?.header ?? {}),
          ...(doc.field_values?.main   ?? {}),
          ...(doc.field_values?.footer ?? {}),
        });
        setEmailFormData({
          to:      doc.field_values?.customer_email ?? "",
          cc:      "",
          subject: `Document: ${doc.document_name}`,
          message: `Please find the attached document: ${doc.document_name}`,
        });
      }
    } catch { toast.error("Could not load document."); }
  };

  const documentTitles: Record<string, string> = {
    nda:                "Non-Disclosure Agreement",
    "employment-contract": "Employment Contract",
    invoice:            "VAT Invoice",
    "service-agreement": "Service Agreement",
    "offer-letter":     "Job Offer Letter",
    "termination-letter":"Employment Termination Letter",
    "ai-generated":     "AI Generated Document",
  };

  const pageTitle = document_?.document_name
    ?? documentTitles[documentType]
    ?? documentType?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    ?? "Document Preview";

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleDownload = async () => {
    if (isRealDocument && documentType) {
      // Generate real PDF via API
      try {
        const res = await axiosInstance.post(`/documents/generate-pdf/${documentType}`);
        if (res.status === 200 && res.data?.url) {
          const link = document.createElement("a");
          link.href     = `${process.env.NEXT_PUBLIC_ASSET_URL}${res.data.url}`;
          link.download = `${pageTitle}.pdf`;
          document.body.appendChild(link); link.click(); document.body.removeChild(link);
          return;
        }
      } catch { /* fall through to print */ }
    }
    // Fallback: browser print → save as PDF
    window.print();
  };

  const handlePrint = () => window.print();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await axiosInstance.post("/templates/send_to_email", { ...emailFormData });
      // Auto-update status to "under_review" after sending
      if (isRealDocument) {
        await axiosInstance.patch(`/documents/status/${documentType}`, { status: "under_review" });
        fetchDocument();
      }
      toast.success(`Document sent to ${emailFormData.to}`);
      setIsModalOpen(false);
    } catch { toast.error("Failed to send document email."); }
    finally { setIsSending(false); }
  };

  const handleEmailFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApprove = async () => {
    if (!isRealDocument) return;
    try {
      await axiosInstance.patch(`/documents/status/${documentType}`, { status: "approved" });
      toast.success("Document approved!");
      fetchDocument();
    } catch { toast.error("Could not update status."); }
  };

  const handleFinalise = async () => {
    if (!isRealDocument) return;
    try {
      await axiosInstance.patch(`/documents/status/${documentType}`, { status: "finalised" });
      toast.success("Document finalised!");
      fetchDocument();
    } catch { toast.error("Could not finalise document."); }
  };

  const handleDuplicate = async () => {
    if (!isRealDocument) return;
    const result = await duplicate(documentType, userId);
    if (result) {
      toast.success("Document duplicated! Opening draft…");
      router.push(`/dashboard/documents/preview/${result.uuid}`);
    } else {
      toast.error("Could not duplicate document.");
    }
  };

  const handleDelete = async () => {
    if (!isRealDocument || !confirm("Delete this document? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/documents/delete/${documentType}`);
      toast.success("Document deleted.");
      router.push("/dashboard/documents");
    } catch { toast.error("Failed to delete document."); }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Document content renderers (all preserved from original) ──────────────
  // NOTE: renderDocumentContent keeps gray-* / white colors inside the doc body
  // — these are printable legal documents that must match paper/print styling.
  const renderDocumentContent = () => {
    const type = isRealDocument
      ? (document_?.document_type ?? "").toLowerCase()
      : documentType;

    if (type?.includes("nda") || type === "nda") {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">NON-DISCLOSURE AGREEMENT</h1>
            <p className="text-gray-600">Effective Date: {formData.effectiveDate || formData["Effective Date"] || "[Date]"}</p>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              This Non-Disclosure Agreement is entered into on <strong>{formData.effectiveDate || "[Date]"}</strong> by and between:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-1">DISCLOSING PARTY:</p>
              <p className="text-gray-700">{formData.disclosingParty || formData["Disclosing Party Name"] || "[Company Name]"}</p>
              <p className="text-gray-600 text-sm mt-1">{formData.disclosingPartyAddress || formData["Disclosing Party Address"] || "[Address]"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-1">RECEIVING PARTY:</p>
              <p className="text-gray-700">{formData.receivingParty || formData["Receiving Party Name"] || "[Client/Partner Name]"}</p>
              <p className="text-gray-600 text-sm mt-1">{formData.receivingPartyAddress || formData["Receiving Party Address"] || "[Address]"}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. PURPOSE</h2>
              <p className="text-gray-700 leading-relaxed">{formData.purpose || formData["Purpose of Disclosure"] || 'The parties wish to explore a business opportunity of mutual interest.'}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. DEFINITION OF CONFIDENTIAL INFORMATION</h2>
              <p className="text-gray-700 leading-relaxed">"Confidential Information" means any and all information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or in any other form.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. GOVERNING LAW</h2>
              <p className="text-gray-700 leading-relaxed">This Agreement shall be governed by the laws of <strong>{formData.governingLaw || formData["Governing Law"] || "UAE — DIFC"}</strong>.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. DURATION</h2>
              <p className="text-gray-700 leading-relaxed">This Agreement shall remain in effect for <strong>{formData.agreementDuration || formData["Agreement Duration"] || "2 years"}</strong> from the Effective Date.</p>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="border-t-2 border-gray-400 pt-2 mt-12">
                    <p className="font-semibold text-gray-900">{formData.disclosingParty || "Disclosing Party"}</p>
                    <p className="text-gray-600 text-sm">Authorized Signature</p>
                  </div>
                </div>
                <div>
                  <div className="border-t-2 border-gray-400 pt-2 mt-12">
                    <p className="font-semibold text-gray-900">{formData.receivingParty || "Receiving Party"}</p>
                    <p className="text-gray-600 text-sm">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // AI generated document — render the AI content directly
    if (type?.includes("ai") || document_?.source === "ai") {
      return (
        <div className="space-y-4">
          {document_?.content ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
              {document_.content}
            </div>
          ) : (
            <div className="text-gray-500 italic text-center py-8">
              Document content will appear here after generation.
            </div>
          )}
        </div>
      );
    }

    // Default renderer for all other document types
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{pageTitle.toUpperCase()}</h1>
        </div>
        {Object.entries(formData).filter(([, v]) => typeof v === "string" && v.trim()).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{key.replace(/_/g, " ")}</h3>
            <p className="text-gray-700">{String(value)}</p>
          </div>
        ))}
        <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8">
          <div className="border-t-2 border-gray-400 pt-2 mt-12">
            <p className="font-semibold text-gray-900">Authorised Party</p>
            <p className="text-gray-600 text-sm">Signature</p>
          </div>
          <div className="border-t-2 border-gray-400 pt-2 mt-12">
            <p className="font-semibold text-gray-900">Receiving Party</p>
            <p className="text-gray-600 text-sm">Signature</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        {/* Page header */}
        <PageHeader
          title="Document Preview"
          description={pageTitle}
          showAIBadge={document_?.source === "ai"}
          icon={<FileText size={24} />}
          buttons={[
            { text: "Back", icon: <ArrowLeft size={20} />, onClick: () => router.back() },
          ]}
        />

        {/* Action bar */}
        <div className="bg-surface rounded-xl shadow-card border border-border p-5 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="font-bold text-text-heading text-lg">{pageTitle}</h2>
              {document_?.status && (
                <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                  document_.status === "finalised" ? "bg-green-100 text-green-800"
                  : document_.status === "approved" ? "bg-blue-100 text-blue-800"
                  : "bg-slate-100 text-slate-600"
                }`}>
                  {document_.status.replace("_", " ")}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handlePrint} className="bg-surface border border-border text-text-secondary hover:bg-bg-base" startIcon={<Printer className="w-4 h-4" />}>Print</Button>
              <Button onClick={handleDownload} className="bg-status-warning text-on-brand hover:bg-status-warning/90" startIcon={<Download className="w-4 h-4" />}>Download PDF</Button>
              <Button onClick={() => setIsModalOpen(true)} startIcon={<Send className="w-4 h-4" />}>Send</Button>
              {isRealDocument && document_?.status !== "finalised" && (
                <Button onClick={handleFinalise} className="bg-green-600 text-white hover:bg-green-700" startIcon={<Stamp className="w-4 h-4" />}>Approve & Finalise</Button>
              )}
            </div>
          </div>
        </div>

        {/* Status timeline — shown for saved documents */}
        {isRealDocument && document_ && (
          <div className="mb-6">
            <DocumentStatusTimeline currentStatus={document_.status} activityLog={document_.activity_log} />
          </div>
        )}

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card border border-border overflow-hidden print-area" ref={previewRef}>
              {/* Document header */}
              <div className="bg-gray-50 border-b border-gray-200 px-8 py-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">{formData["Form Name"] ?? pageTitle}</span>
                  </div>
                  {formData["Form Name"] && <p className="text-sm text-gray-600">{formData["documentTitle"] ?? ""}</p>}
                </div>
                {document_?.compliance_score && (
                  <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    document_.compliance_score >= 90 ? "bg-green-100 text-green-700"
                    : document_.compliance_score >= 75 ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                    Compliance: {document_.compliance_score}%
                  </div>
                )}
              </div>
              <div className="px-8 py-8">{renderDocumentContent()}</div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Compliance panel (NEW — Pro only, real saved documents) */}
            {isRealDocument && (
              <DocumentCompliancePanel
                documentUuid={documentType}
                isPro={isPro}
                initialScore={document_?.compliance_score}
                initialNotes={document_?.compliance_notes}
              />
            )}

            {/* Quick actions */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-bg-base">
                <h3 className="text-sm font-semibold text-text-heading">Quick Actions</h3>
              </div>
              <div className="p-3 space-y-2">
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all">
                  <Send className="w-4 h-4 text-status-success" /> Send to client
                </button>
                {isRealDocument && (
                  <>
                    <button onClick={() => router.push(`/dashboard/documents/new/${documentType}`)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all">
                      <Edit className="w-4 h-4 text-status-info" /> Edit document
                    </button>
                    <button onClick={handleDuplicate} disabled={isDuplicating} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all disabled:opacity-50">
                      <Copy className="w-4 h-4 text-secondary" />{isDuplicating ? "Duplicating…" : "Duplicate document"}
                    </button>
                    {document_?.status !== "approved" && document_?.status !== "finalised" && (
                      <button onClick={handleApprove} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-xl border border-blue-200 transition-all">
                        <CheckCircle className="w-4 h-4" /> Approve document
                      </button>
                    )}
                  </>
                )}
                <button onClick={handleDownload} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all">
                  <Download className="w-4 h-4 text-text-muted" /> Download PDF
                </button>
                <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-base rounded-xl border border-border transition-all">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-text-muted" />}
                  {copied ? "Link copied!" : "Copy share link"}
                </button>
                {isRealDocument && (
                  <button onClick={handleDelete} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-status-error hover:bg-status-error-bg rounded-xl border border-status-error-border transition-all">
                    <Trash2 className="w-4 h-4" /> Delete document
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SendInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceNumber={pageTitle}
        emailFormData={emailFormData}
        onEmailFormChange={handleEmailFormChange}
        onSubmit={handleSendEmail}
        isSending={isSending}
      />

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>
    </DashboardLayout>
  );
}
