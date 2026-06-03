"use client";
// src/app/dashboard/quotations/new/page.tsx
// Create and Edit quotation form with AI pre-fill support and sidebar

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus, Trash2, ArrowLeft, Save, Send, Sparkles,
  Building2, FileText, Calculator, StickyNote, Link2, Zap,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader      from "@/components/page-header/PageHeader";
import Card            from "@/components/ui/Card";
import Button          from "@/components/ui/Button";
import InputField      from "@/components/ui/InputField";
import axiosInstance   from "@/utils/axiosInstance";
import { useAuth }     from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import toast           from "react-hot-toast";
import { LineItem }    from "@/lib/quotationTypes";
import QuotationAiSuggestionsSidebar from "@/components/quotation/QuotationAiSuggestionsSidebar";

const DEFAULT_TERMS = "Payment due within 30 days of invoice date. 50% deposit required before work commences. All deliverables remain property of the supplier until full payment is received.";

const EMPTY_ITEM = (): LineItem => ({
  id:           Math.random().toString(36).slice(2),
  name:         "",
  description:  "",
  quantity:     1,
  unit:         "item",
  unit_price:   0,
  discount_pct: 0,
  tax_pct:      5,
  line_total:   0,
});

export default function NewQuotationPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { currentPlan }   = useSubscription();

  const quotationId = searchParams.get("id");   // edit mode
  const isEditMode  = !!quotationId;
  const userId      = !loading ? (user?.user?.user_id as string) : "";
  const isPro       = currentPlan?.name === "Pro" || currentPlan?.name === "Enterprise";

  // Pre-filled data from AI generator
  const prefilledData = useMemo(() => {
    const raw = searchParams.get("data");
    if (!raw) return null;
    try { return JSON.parse(decodeURIComponent(raw)); } catch { return null; }
  }, []);

  // ── Form state ────────────────────────────────────────────────────────────
  const [isSaving,   setIsSaving]   = useState(false);
  const [isLoading,  setIsLoading]  = useState(false);

  const [form, setForm] = useState({
    project_title:        prefilledData?.project_title        ?? "",
    description:          prefilledData?.description          ?? "",
    client_name:          prefilledData?.client_name          ?? "",
    client_email:         prefilledData?.client_email         ?? "",
    client_address:       prefilledData?.client_address       ?? "",
    client_phone:         prefilledData?.client_phone         ?? "",
    currency:             prefilledData?.currency             ?? "AED",
    issue_date:           prefilledData?.issue_date           ?? new Date().toISOString().split("T")[0],
    expiry_date:          prefilledData?.expiry_date          ?? new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    terms_and_conditions: prefilledData?.terms_and_conditions ?? DEFAULT_TERMS,
    notes:                prefilledData?.notes                ?? "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>(
    prefilledData?.line_items?.length ? prefilledData.line_items : [EMPTY_ITEM()],
  );

  // ── Load in edit mode ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEditMode || !quotationId) return;
    setIsLoading(true);
    axiosInstance.get(`/quotations/single/${quotationId}`)
      .then((res) => {
        const d = res.data.data;
        setForm({
          project_title:        d.project_title        ?? "",
          description:          d.description          ?? "",
          client_name:          d.client_name          ?? "",
          client_email:         d.client_email         ?? "",
          client_address:       d.client_address       ?? "",
          client_phone:         d.client_phone         ?? "",
          currency:             d.currency             ?? "AED",
          issue_date:           d.issue_date           ? new Date(d.issue_date).toISOString().split("T")[0]   : "",
          expiry_date:          d.expiry_date          ? new Date(d.expiry_date).toISOString().split("T")[0]  : "",
          terms_and_conditions: d.terms_and_conditions ?? DEFAULT_TERMS,
          notes:                d.notes                ?? "",
        });
        setLineItems(d.line_items?.length ? d.line_items : [EMPTY_ITEM()]);
      })
      .catch(() => toast.error("Could not load quotation."))
      .finally(() => setIsLoading(false));
  }, [quotationId, isEditMode]);

  // ── Line item helpers ─────────────────────────────────────────────────────
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      const base     = Number(updated.quantity)   * Number(updated.unit_price);
      const disc     = base * (Number(updated.discount_pct) / 100);
      const taxable  = base - disc;
      updated.line_total = parseFloat((taxable * (1 + Number(updated.tax_pct) / 100)).toFixed(2));
      return updated;
    }));
  };

  const removeItem = (id: string) => {
    if (lineItems.length > 1) setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Computed totals ───────────────────────────────────────────────────────
  const subtotal       = lineItems.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_price), 0);
  const totalDiscount  = lineItems.reduce((s, i) => s + (Number(i.quantity) * Number(i.unit_price) * Number(i.discount_pct) / 100), 0);
  const totalTax       = lineItems.reduce((s, i) => {
    const base = Number(i.quantity) * Number(i.unit_price) * (1 - Number(i.discount_pct) / 100);
    return s + base * (Number(i.tax_pct) / 100);
  }, 0);
  const grandTotal     = subtotal - totalDiscount + totalTax;

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.client_name.trim())  { toast.error("Client name is required.");   return false; }
    if (!form.issue_date)          { toast.error("Issue date is required.");     return false; }
    if (!form.expiry_date)         { toast.error("Expiry date is required.");    return false; }
    if (lineItems.some((i) => !i.name.trim())) { toast.error("All line items must have a name."); return false; }
    if (lineItems.some((i) => Number(i.unit_price) <= 0)) { toast.error("All line items must have a price greater than 0."); return false; }
    return true;
  };

  // ── Save handlers ─────────────────────────────────────────────────────────
  const buildPayload = () => ({
    user_id:              userId,
    ...form,
    line_items:           lineItems,
    source:               prefilledData?.source ?? "manual",
    ...(prefilledData?.ai_prompt ? { ai_prompt: prefilledData.ai_prompt } : {}),
  });

  const handleSaveDraft = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      if (isEditMode) {
        await axiosInstance.put(`/quotations/update/${quotationId}`, buildPayload());
        toast.success("Quotation updated.");
      } else {
        const res = await axiosInstance.post("/quotations/create", buildPayload());
        toast.success("Quotation saved as draft.");
        router.push(`/dashboard/quotations/${res.data.quotation.uuid}`);
        return;
      }
      router.push(`/dashboard/quotations/${quotationId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save quotation.");
    } finally { setIsSaving(false); }
  };

  const handleSaveAndPreview = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      let uuid = quotationId;
      if (isEditMode) {
        await axiosInstance.put(`/quotations/update/${quotationId}`, buildPayload());
      } else {
        const res = await axiosInstance.post("/quotations/create", buildPayload());
        uuid = res.data.quotation.uuid;
      }
      router.push(`/dashboard/quotations/${uuid}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save quotation.");
    } finally { setIsSaving(false); }
  };

  const fieldClass = "w-full px-4 py-2.5 border border-border rounded-xl text-sm text-text-secondary bg-bg-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all";
  const labelClass = "block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider";

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">

        <PageHeader
          title={isEditMode ? "Edit Quotation" : "New Quotation"}
          description={isEditMode ? "Update quotation details below" : "Fill in the details to create a professional quotation"}
          showAIBadge={!!prefilledData?.source === true && prefilledData?.source === "ai"}
          icon={<FileText size={24} />}
          buttons={[{ text: "Back", icon: <ArrowLeft size={20} />, onClick: () => router.back() }]}
        />

        {/* AI pre-fill banner */}
        {prefilledData?.source === "ai" && (
          <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl mb-6">
            <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-700">AI Draft Pre-filled</p>
              <p className="text-xs text-indigo-500">Review all fields carefully — edit as needed before saving.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main form (2/3) ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Client & Project */}
            <Card className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-surface flex items-center gap-2">
                <Building2 className="w-5 h-5 text-text-muted" />
                <h2 className="text-base font-bold text-text-heading">Client & Project Details</h2>
                {prefilledData?.source === "ai" && <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />AI pre-filled</span>}
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Project Title *</label>
                  <input className={fieldClass} placeholder="e.g. Website Redesign 2026" value={form.project_title} onChange={(e) => setForm((p) => ({ ...p, project_title: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea rows={2} className={`${fieldClass} resize-none`} placeholder="Brief project overview…" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Client Name *</label>
                  <input className={fieldClass} placeholder="Acme Corporation" value={form.client_name} onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Client Email</label>
                  <input type="email" className={fieldClass} placeholder="billing@client.ae" value={form.client_email} onChange={(e) => setForm((p) => ({ ...p, client_email: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Client Address</label>
                  <input className={fieldClass} placeholder="Dubai, UAE" value={form.client_address} onChange={(e) => setForm((p) => ({ ...p, client_address: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Client Phone</label>
                  <input className={fieldClass} placeholder="+971 50 000 0000" value={form.client_phone} onChange={(e) => setForm((p) => ({ ...p, client_phone: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Issue Date *</label>
                  <input type="date" className={fieldClass} value={form.issue_date} onChange={(e) => setForm((p) => ({ ...p, issue_date: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Expiry Date *</label>
                  <input type="date" className={fieldClass} value={form.expiry_date} onChange={(e) => setForm((p) => ({ ...p, expiry_date: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Currency</label>
                  <select className={fieldClass} value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
                    {["AED", "USD", "EUR", "GBP", "SAR"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            {/* Line Items */}
            <Card className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-text-muted" />
                  <h2 className="text-base font-bold text-text-heading">Line Items</h2>
                </div>
                <button onClick={() => setLineItems((p) => [...p, EMPTY_ITEM()])} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>
              <div className="p-5">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
                  <div className="col-span-3">Item / Service</div>
                  <div className="col-span-2">Description</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-1 text-center">Unit</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-1 text-center">Disc %</div>
                  <div className="col-span-1 text-center">Tax %</div>
                  <div className="col-span-1 text-right">Total</div>
                </div>

                <div className="space-y-3">
                  {lineItems.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start bg-bg-base rounded-xl p-3 border border-border group">
                      <div className="col-span-12 md:col-span-3">
                        <input className={fieldClass} placeholder="Service name" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <input className={fieldClass} placeholder="Brief description" value={item.description ?? ""} onChange={(e) => updateItem(item.id, "description", e.target.value)} />
                      </div>
                      <div className="col-span-4 md:col-span-1">
                        <input type="number" min="0" className={`${fieldClass} text-center`} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-4 md:col-span-1">
                        <select className={fieldClass} value={item.unit ?? "item"} onChange={(e) => updateItem(item.id, "unit", e.target.value)}>
                          {["item", "hour", "day", "month", "page", "kg", "sqft"].map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input type="number" min="0" step="0.01" className={`${fieldClass} text-right`} value={item.unit_price} onChange={(e) => updateItem(item.id, "unit_price", parseFloat(e.target.value) || 0)} placeholder="0.00" />
                      </div>
                      <div className="col-span-4 md:col-span-1">
                        <input type="number" min="0" max="100" className={`${fieldClass} text-center`} value={item.discount_pct} onChange={(e) => updateItem(item.id, "discount_pct", Number(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-4 md:col-span-1">
                        <input type="number" min="0" max="100" className={`${fieldClass} text-center`} value={item.tax_pct} onChange={(e) => updateItem(item.id, "tax_pct", Number(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-4 md:col-span-1 flex items-center justify-end gap-2">
                        <span className="text-sm font-bold text-text-heading">{form.currency} {Number(item.line_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <button onClick={() => removeItem(item.id)} disabled={lineItems.length === 1} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-0"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals summary */}
                <div className="mt-5 flex justify-end">
                  <div className="w-full max-w-xs space-y-1">
                    {[
                      ["Subtotal",          `${form.currency} ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
                      ["Total Discount",    `- ${form.currency} ${totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
                      ["Total Tax (VAT)",   `${form.currency} ${totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between text-sm text-text-secondary">
                        <span>{label}</span><span className={label.includes("Discount") ? "text-green-600" : ""}>{val}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2 flex justify-between items-center">
                      <span className="text-base font-bold text-text-heading">Grand Total</span>
                      <span className="text-xl font-bold text-indigo-600">{form.currency} {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Terms & Notes */}
            <Card className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-surface flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-text-muted" />
                <h2 className="text-base font-bold text-text-heading">Terms & Notes</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className={labelClass}>Terms & Conditions</label>
                  <textarea rows={4} className={`${fieldClass} resize-none`} value={form.terms_and_conditions} onChange={(e) => setForm((p) => ({ ...p, terms_and_conditions: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Additional Notes</label>
                  <textarea rows={3} className={`${fieldClass} resize-none`} placeholder="Any additional notes for the client…" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
                </div>
              </div>
            </Card>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={() => router.back()} className="bg-surface border border-border text-text-secondary hover:bg-bg-base">Cancel</Button>
              <Button onClick={handleSaveDraft} disabled={isSaving} className="bg-surface border border-indigo-200 text-indigo-700 hover:bg-indigo-50" startIcon={<Save className="w-4 h-4" />}>
                {isSaving ? "Saving…" : "Save Draft"}
              </Button>
              <Button onClick={handleSaveAndPreview} disabled={isSaving} startIcon={<Send className="w-4 h-4" />} className="flex-1 justify-center">
                {isSaving ? "Saving…" : (isEditMode ? "Update & Preview" : "Save & Preview")}
              </Button>
            </div>
          </div>

          {/* ── Sidebar (1/3) ─────────────────────────────────────────────── */}
          <div className="space-y-5">
            <QuotationAiSuggestionsSidebar userId={userId} isPro={isPro} />

            {/* Linked documents tip */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-heading">Document Linking</h3>
              </div>
              <p className="text-xs text-text-secondary mb-3">After saving, you can link proposals, contracts, or NDAs to this quotation from the detail page.</p>
              <div className="text-xs text-indigo-600 font-medium">Available on the quotation detail page →</div>
            </Card>

            {/* Summary card */}
            <Card className="p-4 bg-indigo-50/40 border-indigo-200">
              <h3 className="text-sm font-semibold text-indigo-700 mb-3 flex items-center gap-2"><Zap className="w-4 h-4" />Summary</h3>
              <div className="space-y-2 text-xs text-indigo-600">
                <div className="flex justify-between"><span>Client</span><span className="font-semibold">{form.client_name || "—"}</span></div>
                <div className="flex justify-between"><span>Items</span><span className="font-semibold">{lineItems.length}</span></div>
                <div className="flex justify-between"><span>Valid until</span><span className="font-semibold">{form.expiry_date ? new Date(form.expiry_date).toLocaleDateString("en-AE", { day: "numeric", month: "short" }) : "—"}</span></div>
                <div className="flex justify-between border-t border-indigo-200 pt-2 text-sm font-bold text-indigo-700"><span>Grand Total</span><span>{form.currency} {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
