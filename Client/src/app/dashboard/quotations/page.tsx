"use client";
// src/app/dashboard/quotations/page.tsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Plus, Search, Eye, Send, Download, Copy, Trash2,
  Edit, RefreshCw, Sparkles, Brain, Zap, FileSignature, Check,
  AlertCircle, X, TrendingUp, DollarSign, Clock, CheckCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard        from "@/components/stat-card/StatCard";
import PageHeader      from "@/components/page-header/PageHeader";
import Card            from "@/components/ui/Card";
import Modal           from "@/components/ui/Modal";
import DropdownMenu    from "@/components/ui/DropdownMenu";
import EmptyState      from "@/components/empty-state/EmptyState";
import LoadingSpinner  from "@/components/loading-spinner/LoadingSpinner";
import { useAuth }        from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import axiosInstance   from "@/utils/axiosInstance";
import toast           from "react-hot-toast";
import { Quotation, QuotationStatus, getQuotationStatusBadge, ALL_QUOTATION_STATUSES } from "@/lib/quotationTypes";
import { useAiQuotationGenerator, useQuotationDuplicate } from "@/hooks/useQuotationAI";
import QuotationAiSuggestionsSidebar from "@/components/quotation/QuotationAiSuggestionsSidebar";

const AI_CHIPS = [
  "SEO retainer 3 months for Dubai client, AED 2,500/month",
  "Website redesign 10 screens + dev for Abu Dhabi startup",
  "Mobile app MVP — React Native, 8 weeks, AED 45,000",
  "Monthly social media management for SME, AED 1,800/month",
];

const AI_STAGES = [
  "Extracting project scope",
  "Identifying line items",
  "Calculating pricing",
  "Applying UAE VAT",
  "Finalising draft",
];

export default function QuotationsPage() {
  const router = useRouter();
  const { user, loading }             = useAuth();
  const { currentPlan }               = useSubscription();
  const { duplicate, isDuplicating }  = useQuotationDuplicate();
  const { generate, isGenerating, error: aiError } = useAiQuotationGenerator();
  const userId = !loading ? (user?.user?.user_id as string) : "";
  const isPro  = currentPlan?.name === "Pro" || currentPlan?.name === "Enterprise";

  // ── Data state ──────────────────────────────────────────────────────────
  const [quotations,    setQuotations]    = useState<Quotation[]>([]);
  const [isLoading,     setIsLoading]     = useState(false);
  const [searchTerm,    setSearchTerm]    = useState("");
  const [statusFilter,  setStatusFilter]  = useState<QuotationStatus | "all">("all");

  // ── AI modal state ───────────────────────────────────────────────────────
  const [showAiModal,   setShowAiModal]   = useState(false);
  const [aiPrompt,      setAiPrompt]      = useState("");
  const [aiStageIdx,    setAiStageIdx]    = useState(0);
  const [aiPromptErr,   setAiPromptErr]   = useState("");
  const stageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Convert confirm modal ────────────────────────────────────────────────
  const [convertTarget, setConvertTarget] = useState<Quotation | null>(null);
  const [isConverting,  setIsConverting]  = useState(false);

  // ── KPI derivations ──────────────────────────────────────────────────────
  const stats = {
    total:     quotations.length,
    accepted:  quotations.filter((q) => q.status === "accepted").length,
    pending:   quotations.filter((q) => ["sent", "viewed"].includes(q.status)).length,
    value:     quotations.filter((q) => !["rejected", "expired", "archived"].includes(q.status))
                         .reduce((s, q) => s + Number(q.grand_total ?? 0), 0),
  };

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchQuotations = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const params: any = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchTerm.trim())       params.search = searchTerm.trim();
      const res = await axiosInstance.get(`/quotations/user/${userId}`, { params });
      if (res.status === 200) setQuotations(res.data.data ?? []);
    } catch { toast.error("Could not load quotations."); }
    finally { setIsLoading(false); }
  }, [userId, statusFilter, searchTerm]);

  useEffect(() => { if (!loading && userId) fetchQuotations(); }, [loading, userId, statusFilter]);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => { if (!loading && userId) fetchQuotations(); }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // ── AI modal stages ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isGenerating) {
      setAiStageIdx(0);
      stageTimerRef.current = setInterval(() => {
        setAiStageIdx((p) => Math.min(p + 1, AI_STAGES.length - 1));
      }, 800);
    } else {
      if (stageTimerRef.current) clearInterval(stageTimerRef.current);
    }
    return () => { if (stageTimerRef.current) clearInterval(stageTimerRef.current); };
  }, [isGenerating]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) { setAiPromptErr("Please describe the project."); return; }
    setAiPromptErr("");
    const result = await generate(userId, aiPrompt);
    if (result?.ai_result) {
      toast.success("Draft generated! Review and save below.");
      setShowAiModal(false);
      router.push(`/dashboard/quotations/new?data=${encodeURIComponent(JSON.stringify({
        ...result.ai_result, ai_prompt: result.ai_prompt, source: "ai",
      }))}`);
      setAiPrompt("");
    }
  };

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete this quotation? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/quotations/delete/${uuid}`);
      toast.success("Quotation deleted.");
      fetchQuotations();
    } catch { toast.error("Failed to delete quotation."); }
  };

  const handleDuplicate = async (q: Quotation) => {
    const result = await duplicate(q.uuid!, userId);
    if (result) { toast.success("Quotation duplicated!"); fetchQuotations(); }
    else toast.error("Could not duplicate quotation.");
  };

  const handleArchive = async (uuid: string) => {
    try {
      await axiosInstance.patch(`/quotations/status/${uuid}`, { status: "archived" });
      toast.success("Quotation archived.");
      fetchQuotations();
    } catch { toast.error("Failed to archive."); }
  };

  const handleConvertToInvoice = async () => {
    if (!convertTarget) return;
    setIsConverting(true);
    try {
      const res = await axiosInstance.post("/quotations/convert-to-invoice", {
        quotation_uuid: convertTarget.uuid,
        user_id:        userId,
      });
      if (res.status === 201) {
        toast.success(`Invoice ${res.data.invoice_number} created!`);
        setConvertTarget(null);
        fetchQuotations();
        router.push(`/dashboard/invoicing/preview/${res.data.invoice_uuid}`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Conversion failed.");
    } finally { setIsConverting(false); }
  };

  const handleDownloadPdf = async (q: Quotation) => {
    try {
      if (q.pdf_path) {
        const link = document.createElement("a");
        link.href = `${process.env.NEXT_PUBLIC_ASSET_URL}${q.pdf_path}`;
        link.download = `quotation-${q.quotation_number}.pdf`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        return;
      }
      const res = await axiosInstance.post(`/quotations/generate-pdf/${q.uuid}`);
      if (res.data?.url) window.open(`${process.env.NEXT_PUBLIC_ASSET_URL}${res.data.url}`, "_blank");
    } catch { toast.error("Could not generate PDF."); }
  };

  const filteredQuotations = quotations.filter((q) =>
    q.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.project_title ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const progressPct = Math.round(((aiStageIdx + 1) / AI_STAGES.length) * 100);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">

        <PageHeader
          title="Quotation Management"
          description="Create, send, and track professional quotations with AI assistance"
          showAIBadge
          icon={<FileSignature size={24} />}
          buttons={[
            { text: "New Quotation", onClick: () => router.push("/dashboard/quotations/new"), icon: <Plus size={20} /> },
            { text: "AI Generate", onClick: () => setShowAiModal(true), icon: <Brain size={20} />, className: "bg-status-warning text-on-brand hover:bg-status-warning/90" },
          ]}
        />

        {/* ── KPI Cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<FileText className="w-6 h-6" />} iconBg="bg-status-info-bg" iconColor="text-status-info" badgeText="All time" badgeBg="bg-status-info-bg" badgeColor="text-status-info" title="Total Quotations" value={stats.total} subtitle="All quotations" />
          <StatCard icon={<CheckCircle className="w-6 h-6" />} iconBg="bg-status-success-bg" iconColor="text-status-success" badgeText={`${stats.total ? Math.round((stats.accepted/stats.total)*100) : 0}% rate`} badgeBg="bg-status-success-bg" badgeColor="text-status-success" title="Accepted" value={stats.accepted} subtitle="Accepted by clients" />
          <StatCard icon={<Clock className="w-6 h-6" />} iconBg="bg-status-warning-bg" iconColor="text-status-warning" badgeText="Awaiting" badgeBg="bg-status-warning-bg" badgeColor="text-status-warning" title="Pending" value={stats.pending} subtitle="Sent or viewed" />
          <StatCard icon={<DollarSign className="w-6 h-6" />} iconBg="bg-brand-light" iconColor="text-secondary" badgeText="Open pipeline" badgeBg="bg-brand-light" badgeColor="text-secondary" title="Total Value" value={`AED ${stats.value.toLocaleString()}`} subtitle="Active quotation value" />
        </div>

        {/* ── 2-column layout ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Table (3/4 width) ──────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <Card className="p-0 overflow-hidden">
              {/* Table header */}
              <div className="p-5 border-b border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-text-heading flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Quotations
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="text" placeholder="Search by client, number…"
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary w-full sm:w-56"
                    />
                  </div>
                  {/* Status filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as QuotationStatus | "all")}
                    className="py-2.5 px-3 border border-border rounded-xl text-sm bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                  >
                    <option value="all">All Statuses</option>
                    {ALL_QUOTATION_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table body */}
              <div className="overflow-x-auto min-h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-brand">
                      <tr>
                        {["Quotation", "Client", "Amount", "Expiry", "Status", "Linked", "Actions"].map((h) => (
                          <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-on-brand uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-surface divide-y divide-border">
                      {filteredQuotations.map((q) => (
                        <tr key={q.uuid} className="hover:bg-brand-light/30 transition-all group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-status-info-bg rounded-lg group-hover:bg-brand-light">
                                <FileText className="w-4 h-4 text-secondary" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-text-heading">{q.quotation_number}</div>
                                <div className="text-xs text-text-muted mt-0.5 max-w-[140px] truncate">{q.project_title ?? "—"}</div>
                                {q.source === "ai" && (
                                  <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-semibold">AI</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-sm font-semibold text-text-secondary">{q.client_name}</div>
                            {q.client_email && <div className="text-xs text-text-muted">{q.client_email}</div>}
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-sm font-bold text-text-heading">{q.currency} {Number(q.grand_total).toLocaleString()}</div>
                            {q.total_discount > 0 && <div className="text-xs text-green-600">-{q.currency} {Number(q.total_discount).toLocaleString()} disc</div>}
                          </td>
                          <td className="px-5 py-4">
                            <div className={`text-sm ${new Date(q.expiry_date) < new Date() && !["converted","archived"].includes(q.status) ? "text-red-600 font-semibold" : "text-text-secondary"}`}>
                              {new Date(q.expiry_date).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={getQuotationStatusBadge(q.status)}>
                              {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {q.linked_documents && q.linked_documents.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {q.linked_documents.slice(0, 2).map((d, i) => (
                                  <span key={i} className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded font-medium">{d.document_type}</span>
                                ))}
                                {q.linked_documents.length > 2 && <span className="text-[9px] text-text-muted">+{q.linked_documents.length - 2}</span>}
                              </div>
                            ) : <span className="text-xs text-text-muted">—</span>}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => router.push(`/dashboard/quotations/${q.uuid}`)} className="p-1.5 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all" title="View"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => router.push(`/dashboard/quotations/new?id=${q.uuid}`)} className="p-1.5 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
                              <DropdownMenu
                                align="right"
                                triggerLabel="More"
                                triggerClassName="p-1.5 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all"
                                items={[
                                  { label: "Send to client",    onClick: () => router.push(`/dashboard/quotations/${q.uuid}?action=send`), icon: <Send className="w-4 h-4" />, description: "Email + share link", variant: "default" },
                                  { label: "Download PDF",      onClick: () => handleDownloadPdf(q), icon: <Download className="w-4 h-4" />, description: "Generate & download", variant: "default" },
                                  { label: "Duplicate",         onClick: () => handleDuplicate(q),   icon: <Copy className="w-4 h-4" />,     description: "New draft copy",      variant: "default" },
                                  ...(q.status === "accepted" ? [{ label: "Convert to Invoice", onClick: () => setConvertTarget(q), icon: <RefreshCw className="w-4 h-4" />, description: "Create invoice", variant: "success" as const }] : []),
                                  { label: "Archive",           onClick: () => handleArchive(q.uuid!), icon: <Check className="w-4 h-4" />, description: "Move to archive", variant: "default" },
                                  { label: "Delete",            onClick: () => handleDelete(q.uuid!),  icon: <Trash2 className="w-4 h-4" />, description: "Permanently remove", variant: "destructive" },
                                ]}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {!isLoading && filteredQuotations.length === 0 && (
                  <div className="p-6">
                    <EmptyState icon={FileSignature} title={searchTerm || statusFilter !== "all" ? "No results match your filters" : "No quotations yet"} description="Create your first quotation manually or use the AI generator." ctaLabel="Create Quotation" onCTAClick={() => router.push("/dashboard/quotations/new")} />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* ── Right sidebar (1/4 width) ──────────────────────────────────── */}
          <div className="space-y-5">
            <QuotationAiSuggestionsSidebar userId={userId} isPro={isPro} />

            {/* Quick stats */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-text-heading mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-secondary" />Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { label: "Draft",     color: "bg-slate-400", count: quotations.filter((q) => q.status === "draft").length },
                  { label: "Sent",      color: "bg-blue-500",  count: quotations.filter((q) => q.status === "sent").length },
                  { label: "Viewed",    color: "bg-purple-500",count: quotations.filter((q) => q.status === "viewed").length },
                  { label: "Rejected",  color: "bg-red-500",   count: quotations.filter((q) => q.status === "rejected").length },
                  { label: "Converted", color: "bg-indigo-500",count: quotations.filter((q) => q.status === "converted").length },
                ].map(({ label, color, count }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
                    <span className="text-sm text-text-secondary flex-1">{label}</span>
                    <span className="text-sm font-bold text-text-heading">{count}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick tips */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-text-heading mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                {["Accepted quotations convert to invoices in one click", "AI generates full scope, pricing, and terms instantly", "Clients get a shareable link — no account needed", "View tracking notifies you when clients open quotations"].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0" /><span>{tip}</span></li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* ── AI Generate Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={showAiModal} onClose={() => { if (!isGenerating) { setShowAiModal(false); setAiPrompt(""); setAiPromptErr(""); } }} title="AI Quotation Generator" showCloseButton={!isGenerating} closeOnOverlayClick={!isGenerating} size="md" titleIcon={<Sparkles className="w-5 h-5 text-white" />}>
        <div className="p-6">
          <div className="bg-status-info-bg border border-status-info-border rounded-xl p-4 mb-5 text-sm text-status-info leading-relaxed">
            Describe your project in plain language. AI drafts the full quotation for your review — nothing is sent until you approve.
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Your prompt</label>
            <div className="relative">
              <textarea
                disabled={isGenerating}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-text-secondary bg-bg-base resize-none min-h-[100px] transition-all ${aiPromptErr ? "border-status-error" : "border-border"} ${isGenerating ? "opacity-60 cursor-not-allowed" : ""}`}
                placeholder='e.g. Website redesign for Acme Corp, 10 screens + frontend dev, Dubai client, AED 18,000 total...'
                value={aiPrompt}
                onChange={(e) => { setAiPrompt(e.target.value); setAiPromptErr(""); }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !isGenerating) { e.preventDefault(); handleAiGenerate(); } }}
              />
              <kbd className="absolute bottom-3 right-3 px-2 py-1 text-[10px] text-text-muted bg-bg-base border border-border rounded">↵</kbd>
            </div>
            {(aiPromptErr || aiError) && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs text-status-error">
                <AlertCircle className="w-3 h-3" />{aiPromptErr || aiError}
              </p>
            )}
          </div>
          {!isGenerating && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Examples — click to fill:</p>
              <div className="flex flex-wrap gap-2">
                {AI_CHIPS.map((chip) => (
                  <button key={chip} onClick={() => { setAiPrompt(chip); setAiPromptErr(""); }} className="text-xs bg-surface border border-border text-text-secondary px-3 py-1.5 rounded-full hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">{chip}</button>
                ))}
              </div>
            </div>
          )}
          {isGenerating && (
            <div className="mb-5">
              <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {AI_STAGES.map((s, i) => (
                  <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${i < aiStageIdx ? "bg-indigo-100 text-indigo-600" : i === aiStageIdx ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    {i < aiStageIdx ? "✓ " : ""}{s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3 text-center">Nothing is saved until you review and approve</p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => { setShowAiModal(false); setAiPrompt(""); }} disabled={isGenerating} className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold text-text-secondary hover:bg-bg-base transition-colors disabled:opacity-40">Cancel</button>
            <button onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt.trim()} className={`flex-[2] py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all ${isGenerating || !aiPrompt.trim() ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"}`}>
              <Zap className="w-4 h-4" fill="currentColor" />
              {isGenerating ? "Generating…" : "Generate Quotation"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Convert to Invoice Modal ──────────────────────────────────────── */}
      <Modal isOpen={!!convertTarget} onClose={() => !isConverting && setConvertTarget(null)} title="Convert to Invoice" showCloseButton={!isConverting} closeOnOverlayClick={!isConverting} size="sm" titleIcon={<RefreshCw className="w-5 h-5 text-white" />}>
        <div className="p-6">
          <div className="bg-surface border border-border rounded-xl p-4 mb-5">
            <div className="text-sm font-semibold text-text-heading">{convertTarget?.quotation_number}</div>
            <div className="text-sm text-text-secondary mt-1">{convertTarget?.client_name} · {convertTarget?.currency} {Number(convertTarget?.grand_total ?? 0).toLocaleString()}</div>
          </div>
          <p className="text-sm text-text-secondary mb-4">A new invoice will be created with all line items, taxes, and client details copied from this quotation. The quotation will be marked as converted.</p>
          <div className="flex gap-3">
            <button onClick={() => setConvertTarget(null)} disabled={isConverting} className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold text-text-secondary hover:bg-bg-base disabled:opacity-40">Cancel</button>
            <button onClick={handleConvertToInvoice} disabled={isConverting} className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
              <RefreshCw className={`w-4 h-4 ${isConverting ? "animate-spin" : ""}`} />
              {isConverting ? "Converting…" : "Confirm & Create Invoice"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
