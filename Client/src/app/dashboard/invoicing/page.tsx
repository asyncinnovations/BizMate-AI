"use client";
// Full file — see CHANGES section in README for diff summary
// Paste this file into: src/app/dashboard/invoicing/page.tsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useEffect, useRef, useState } from "react";
import { FileText, CheckCircle, AlertTriangle, DollarSign, Plus, Search, Sparkles, Bot, Brain, Send, Download, Eye, Trash2, Edit, RefreshCw, LockKeyhole, Copy, Clock, X } from "lucide-react";
import StatCard from "@/components/stat-card/StatCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStatusBadge } from "@/lib/statusBadge";
import { Invoice, EmailFormData, CreationMethod } from "@/lib/invoiceTypes";
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
import { Button } from "react-bootstrap";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";
import { useInvoiceDuplicate } from "@/hooks/useInvoiceAI";
import InvoiceCreationMethodModal from "@/components/invoice/InvoiceCreationMethodModal";
import AiInvoiceGeneratorModal from "@/components/invoice/AiInvoiceGeneratorModal";
import InvoiceFilterPanel, { InvoiceFilters, DEFAULT_FILTERS } from "@/components/invoice/InvoiceFilterPanel";
import "./styles.css";

const PLAN_TEMPLATE_LIMIT: Record<string, number> = { Starter: 3, Startup: 15, Growth: 15, Pro: 50 };
const getTemplateLimit = (planName?: string) => PLAN_TEMPLATE_LIMIT[planName ?? "Starter"] ?? Infinity;

const InvoiceListPage: React.FC = () => {
  const { currentPlan, checkUsageLimit } = useSubscription();
  const { incrementUsage } = useSubscriptionUsage();
  const { duplicate } = useInvoiceDuplicate();
  const router = useRouter();
  const { user, loading } = useAuth();
  const userId = !loading ? (user?.user?.user_id as string) : "";

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"invoices" | "templates">("templates");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS);
  const filterRef = useRef<HTMLDivElement>(null);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [usageStats, setUsageStats] = useState<{ used: number; limit: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInvoices, setUserInvoices] = useState<Invoice[]>([]);
  const [allPrebuildInvoice, setAllPrebuildInvoice] = useState<any[]>([]);
  const [prebuildLoader, setPrebuildLoader] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({ to: "", cc: "", subject: "", message: "" });

  const paidCount = userInvoices.filter((i) => i.status === "paid").length;
  const unpaidCount = userInvoices.filter((i) => i.status === "unpaid").length;
  const overdueCount = userInvoices.filter((i) => i.status === "overdue").length;
  const totalRevenue = userInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total ?? 0), 0);

  const statsData = [
    { title: "Total Invoices", value: userInvoices.length, subtitle: "All invoices", icon: <FileText className="w-6 h-6" />, iconBg: "bg-status-info-bg", iconColor: "text-status-info", badgeText: "Active", badgeBg: "bg-status-info-bg", badgeColor: "text-status-info" },
    { title: "Paid Invoices", value: paidCount, subtitle: `${paidCount} collected`, icon: <CheckCircle className="w-6 h-6" />, iconBg: "bg-status-success-bg", iconColor: "text-status-success", badgeText: "Paid", badgeBg: "bg-status-success-bg", badgeColor: "text-status-success" },
    { title: "Unpaid", value: unpaidCount, subtitle: `${unpaidCount} pending`, icon: <Clock className="w-6 h-6" />, iconBg: "bg-status-warning-bg", iconColor: "text-status-warning", badgeText: "Pending", badgeBg: "bg-status-warning-bg", badgeColor: "text-status-warning" },
    { title: "Overdue", value: overdueCount, subtitle: overdueCount > 0 ? "Needs action" : "None overdue", icon: <AlertTriangle className="w-6 h-6" />, iconBg: overdueCount > 0 ? "bg-red-100" : "bg-status-success-bg", iconColor: overdueCount > 0 ? "text-red-600" : "text-status-success", badgeText: overdueCount > 0 ? "Action needed" : "All clear", badgeBg: overdueCount > 0 ? "bg-red-100" : "bg-status-success-bg", badgeColor: overdueCount > 0 ? "text-red-700" : "text-status-success" },
    { title: "Total Revenue", value: `AED ${totalRevenue.toLocaleString()}`, subtitle: "+15.2% from last quarter", icon: <DollarSign className="w-6 h-6" />, iconBg: "bg-brand-light", iconColor: "text-secondary", badgeText: "Growth", badgeBg: "bg-brand-light", badgeColor: "text-secondary" },
  ];

  const fetchUserInvoices = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/invoices/user/${userId}`);
      if (res.status === 200) setUserInvoices(res.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const fetchPrebuildInvoices = async () => {
    setPrebuildLoader(true);
    try {
      const res = await axiosInstance.get("/invoices/prebuild");
      if (res.status === 200) setAllPrebuildInvoice(res.data.response);
    } catch (e) { console.error(e); }
    finally { setPrebuildLoader(false); }
  };

  useEffect(() => { if (!loading && userId) fetchUserInvoices(); }, [loading, userId]);
  useEffect(() => { fetchPrebuildInvoices(); checkUsageLimit?.("invoicing.ai_prompts").then(setUsageStats).catch(() => {}); }, []);

  const handleCreationMethod = (method: CreationMethod) => {
    switch (method) {
      case "ai": setShowAiModal(true); break;
      case "manual": router.push("/dashboard/invoicing/new"); break;
      case "duplicate": setActiveTab("invoices"); toast("Select an invoice below to duplicate it.", { icon: "📋" }); break;
      default: router.push("/dashboard/invoicing/new"); break;
    }
  };

  const isLimitReached = usageStats != null && usageStats.limit !== -1 && usageStats.used >= usageStats.limit;

  const handleAiSuccess = (invoiceData: any) => {
    setUsageStats((prev) => prev ? { ...prev, used: prev.used + 1 } : null);
    toast.success("Invoice draft generated!");
    setShowAiModal(false);
    router.push(`/dashboard/invoicing/new?data=${encodeURIComponent(JSON.stringify(invoiceData))}`);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      const res = await axiosInstance.post("/invoices/preview", invoice);
      if (res.status === 200 && res.data?.url) {
        const link = document.createElement("a");
        link.href = `${process.env.NEXT_PUBLIC_ASSET_URL}${res.data.url}`;
        link.download = `invoice-${invoice.invoice_number}`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
      }
    } catch { toast.error("Error downloading the invoice."); }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await axiosInstance.post("/invoices/send_to_email", { invoiceId: currentInvoice?.uuid, ...emailFormData });
      if (res.status === 200) { toast.success(`Invoice sent to ${emailFormData.to}`); closeSendModal(); fetchUserInvoices(); }
    } catch { toast.error("Failed to send invoice email."); }
    finally { setIsSending(false); }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.delete(`/invoices/delete/${invoiceId}`);
      if (res.status === 200) { toast.success(res.data.message); fetchUserInvoices(); }
    } catch { toast.error("Error deleting the invoice."); }
    finally { setIsLoading(false); }
  };

  const handleChangeStatus = async (invoiceId: string) => {
    const inv = userInvoices.find((i) => i.uuid === invoiceId);
    const next = inv?.status === "paid" ? "unpaid" : "paid";
    if (!confirm(`Mark invoice as "${next}"?`)) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.patch(`/invoices/update/status/${invoiceId}`, { status: next });
      if (res.status === 200) { toast.success("Status updated!"); fetchUserInvoices(); }
    } catch { console.error("Status update failed"); }
    finally { setIsLoading(false); }
  };

  const handleDuplicateInvoice = async (invoiceId: string) => {
    const result = await duplicate(invoiceId, userId);
    if (result) { toast.success("Invoice duplicated! Opening draft..."); router.push(`/dashboard/invoicing/new?id=${result.uuid}`); }
    else toast.error("Could not duplicate invoice.");
  };

  const openSendModal = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setEmailFormData({ to: invoice.customer_email || "", cc: "", subject: `Invoice ${invoice.invoice_number} from BizMate`, message: `Dear ${invoice.customer_name},\n\nPlease find attached invoice ${invoice.invoice_number} for AED ${invoice.total}.\n\nDue: ${new Date(invoice.due_date).toLocaleDateString()}\n\nBest regards` });
    setIsModalOpen(true);
  };
  const closeSendModal = () => { setCurrentInvoice(null); setIsModalOpen(false); };
  const handleEmailFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setEmailFormData((prev) => ({ ...prev, [name]: value })); };

  const filteredInvoices = userInvoices.filter((inv) => {
    const f = appliedFilters;
    return (
      (inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) || (inv.customer_email ?? "").toLowerCase().includes(searchTerm.toLowerCase())) &&
      (f.statuses.length === 0 || f.statuses.includes(inv.status)) &&
      (!f.dateFrom || new Date(inv.invoice_date) >= new Date(f.dateFrom)) &&
      (!f.dateTo   || new Date(inv.invoice_date) <= new Date(f.dateTo)) &&
      (!f.amountMin || inv.total >= Number(f.amountMin)) &&
      (!f.amountMax || inv.total <= Number(f.amountMax))
    );
  });

  const hasActiveFilters = appliedFilters.statuses.length > 0 || appliedFilters.dateFrom || appliedFilters.dateTo || appliedFilters.amountMin || appliedFilters.amountMax;
  const removeStatusFilter = (s: string) => { const n = { ...appliedFilters, statuses: appliedFilters.statuses.filter((x) => x !== s) }; setAppliedFilters(n); setFilters(n); };
  const templateLimit = getTemplateLimit(currentPlan?.name);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <div className="w-full">
          <PageHeader title="AI Invoicing" description="Intelligent invoice management with automated tracking, smart predictions, and AI-powered optimization" icon={<Sparkles size={24} />} showAIBadge
            buttons={[
              { text: "New Invoice", onClick: () => setShowCreationModal(true), icon: <Plus size={20} /> },
              { text: currentPlan?.name === "Starter" ? (<OverlayTooltip id="ai-btn" title="Not included in your current plan."><span>AI-Assisted Invoicing</span></OverlayTooltip>) : <span>AI-Assisted Invoicing</span>, onClick: () => setShowAiModal(true), icon: <Brain size={20} />, className: "bg-status-warning text-on-brand hover:bg-status-warning/90" },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {statsData.map((item, i) => <StatCard key={i} {...item} />)}
          </div>

          <div className="invoice_tabs">
            <button className={activeTab === "templates" ? "active" : "inactive"} onClick={() => setActiveTab("templates")}>Templates</button>
            <button className={activeTab === "invoices" ? "active" : "inactive"} onClick={() => setActiveTab("invoices")}>My Invoices</button>
          </div>

          <Card className={`p-0 overflow-hidden ${activeTab === "templates" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-border bg-surface">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-text-heading flex items-center gap-2"><FileText className="w-5 h-5" />Smart Invoice Management</h2>
                  <p className="text-text-secondary mt-1">AI-optimized tracking and automated workflows</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input type="text" placeholder="Search invoices..." className="pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary w-full lg:w-64 bg-bg-base text-text-secondary" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="relative" ref={filterRef}>
                    <button onClick={() => setShowFilterPanel((v) => !v)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${hasActiveFilters ? "bg-indigo-600 border-indigo-600 text-white" : "border-border hover:bg-bg-base text-text-secondary"}`}>
                      <Eye className="h-4 w-4" />Filter
                      {hasActiveFilters && <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs font-bold">{appliedFilters.statuses.length + (appliedFilters.dateFrom || appliedFilters.dateTo ? 1 : 0) + (appliedFilters.amountMin || appliedFilters.amountMax ? 1 : 0)}</span>}
                    </button>
                    <InvoiceFilterPanel isOpen={showFilterPanel} onClose={() => setShowFilterPanel(false)} filters={filters} onChange={setFilters} onReset={() => { setFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS); }} onApply={() => setAppliedFilters({ ...filters })} totalMatching={filteredInvoices.length} />
                  </div>
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {appliedFilters.statuses.map((s) => (<span key={s} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium capitalize">{s}<button onClick={() => removeStatusFilter(s)}><X className="w-3 h-3" /></button></span>))}
                  {(appliedFilters.dateFrom || appliedFilters.dateTo) && (<span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-medium">{appliedFilters.dateFrom} – {appliedFilters.dateTo || "now"}<button onClick={() => { const n = { ...appliedFilters, dateFrom: "", dateTo: "" }; setAppliedFilters(n); setFilters(n); }}><X className="w-3 h-3" /></button></span>)}
                  {(appliedFilters.amountMin || appliedFilters.amountMax) && (<span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-medium">AED {appliedFilters.amountMin || "0"} – {appliedFilters.amountMax || "any"}<button onClick={() => { const n = { ...appliedFilters, amountMin: "", amountMax: "" }; setAppliedFilters(n); setFilters(n); }}><X className="w-3 h-3" /></button></span>)}
                  <button onClick={() => { setFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS); }} className="text-xs text-status-error font-medium">Clear all</button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto min-h-[60vh]">
              <table className="w-full">
                <thead className="bg-brand"><tr>{["Invoice No.", "Customer", "Date", "Amount", "VAT", "Status", "Actions"].map((h) => (<th key={h} className="px-6 py-4 text-left text-xs font-medium text-on-brand uppercase tracking-wider">{h}</th>))}</tr></thead>
                <tbody className="bg-surface divide-y divide-border">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.uuid} className="hover:bg-brand-light/30 transition-all group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-status-info-bg rounded-lg group-hover:bg-brand-light"><FileText className="w-4 h-4 text-secondary" /></div>
                          <div>
                            <div className="text-sm font-bold text-text-heading">{invoice.invoice_number}</div>
                            {invoice.source && <div className={`text-[10px] px-1.5 py-0.5 rounded inline-block mt-0.5 font-medium ${invoice.source === "ai" ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>{invoice.source === "ai" ? "AI Generated" : invoice.source}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-semibold text-text-secondary">{invoice.customer_name}</div>{invoice.customer_email && <div className="text-sm text-text-muted">{invoice.customer_email}</div>}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary"><div>{new Date(invoice.invoice_date).toLocaleDateString()}</div><div className={`text-xs ${invoice.status === "overdue" ? "text-red-500 font-semibold" : "text-text-muted"}`}>Due {new Date(invoice.due_date).toLocaleDateString()}{invoice.status === "overdue" && " — OVERDUE"}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-text-heading">AED {Number(invoice.total).toLocaleString()}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">AED {Number(invoice.vat).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center gap-1 ${getStatusBadge(invoice.status)}`}>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/invoicing/preview/${invoice.uuid}`} className="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all" title="View"><Eye className="w-4 h-4" /></Link>
                          <button onClick={() => openSendModal(invoice)} className="p-2 text-text-muted hover:text-status-success hover:bg-status-success-bg rounded-lg transition-all" title="Send"><Send className="w-4 h-4" /></button>
                          <button onClick={() => handleDownloadPDF(invoice)} className="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all" title="Download"><Download className="w-4 h-4" /></button>
                          <DropdownMenu
                            items={[
                              { label: "Edit Invoice",      onClick: () => router.push(`/dashboard/invoicing/new?id=${invoice.uuid}`), icon: <Edit className="w-4 h-4" />,     description: "Edit invoice details",               variant: "default" },
                              { label: "Duplicate Invoice", onClick: () => handleDuplicateInvoice(invoice.uuid!),                       icon: <Copy className="w-4 h-4" />,     description: "Clone this invoice as a new draft",  variant: "default" },
                              { label: "Change Status",     onClick: () => handleChangeStatus(invoice.uuid!),                           icon: <RefreshCw className="w-4 h-4" />, description: `Mark as ${invoice.status === "paid" ? "unpaid" : "paid"}`, variant: "success" },
                              { label: "Delete Invoice",    onClick: () => handleDeleteInvoice(invoice.uuid!),                          icon: <Trash2 className="w-4 h-4" />,   description: "Remove permanently",                 variant: "destructive" },
                            ]}
                            triggerLabel="More actions" align="right" triggerClassName="p-2 text-text-muted hover:text-secondary hover:bg-brand-light rounded-lg transition-all"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && (
                <div className="p-6"><EmptyState icon={Brain} title={searchTerm || hasActiveFilters ? "No results match your filters" : "No invoices yet"} description={searchTerm || hasActiveFilters ? "Try adjusting your search or filter criteria." : "Create your first invoice using AI or manually."} ctaLabel="Create Invoice" onCTAClick={() => setShowCreationModal(true)} /></div>
              )}
            </div>
          </Card>

          <Card className={`p-6 overflow-hidden ${activeTab === "invoices" ? "hidden" : ""}`}>
            {prebuildLoader && <p className="text-center">Loading templates...</p>}
            <div className="mb-8 flex justify-between items-end">
              <div><h2 className="text-xl font-bold text-text-heading flex items-center gap-2"><FileText className="w-5 h-5" />Choose Invoice Template</h2><p className="text-text-secondary mt-1">Select a design to represent your brand professionally.</p></div>
              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">{allPrebuildInvoice.length} Designs Available</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allPrebuildInvoice.map((template: any, index: number) => {
                const locked = index >= templateLimit;
                return (
                  <div key={template.id} className={`group relative rounded-2xl transition-all duration-500 bg-white border-2 flex flex-col ${locked ? "opacity-80 grayscale-[0.5]" : "border-[#eee] hover:shadow-xl hover:-translate-y-1"}`}>
                    {locked && (<div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-2xl"><div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-xl mb-2"><LockKeyhole className="w-3 h-3" /> PREMIUM</div><p className="text-[10px] font-bold text-slate-600 px-4 text-center">Upgrade to {currentPlan?.name === "Starter" ? "Growth" : "Pro"} to unlock</p></div>)}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-3"><div className="space-y-1"><h3 className="font-bold text-slate-800 text-lg">{template.invoice_name}</h3><span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{template.invoice_type}</span></div><div className={`w-3 h-3 rounded-full ${template.color} ring-4 ring-slate-50`} /></div>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">{template.notes || "Professional invoice template for your business."}</p>
                      <div className="mt-auto"><Button disabled={locked} onClick={() => { if (!locked) router.push(`/dashboard/invoicing/new?data=${encodeURIComponent(JSON.stringify(template))}`); }} className={`w-full py-3 rounded-xl font-bold transition-all ${locked ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"}`}>{locked ? "Plan Locked" : "Use This Template"}</Button></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="mt-8 text-center"><div className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm text-text-secondary shadow-card"><Bot className="w-4 h-4 text-secondary" /><span>AI Assistant is monitoring your invoices 24/7</span></div></div>
        </div>
      </div>

      <InvoiceCreationMethodModal isOpen={showCreationModal} onClose={() => setShowCreationModal(false)} onSelect={handleCreationMethod} />
      <AiInvoiceGeneratorModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} onSuccess={handleAiSuccess} usageStats={usageStats} isLimitReached={!!isLimitReached} />
      <SendInvoiceModal isOpen={isModalOpen} onClose={closeSendModal} invoiceNumber={currentInvoice?.invoice_number || ""} emailFormData={emailFormData} onEmailFormChange={handleEmailFormChange} onSubmit={handleSendEmail} isSending={isSending} />
    </DashboardLayout>
  );
};

export default InvoiceListPage;
