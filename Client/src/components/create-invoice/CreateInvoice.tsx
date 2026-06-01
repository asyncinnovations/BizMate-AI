"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/create-invoice/CreateInvoice.tsx  — FULL REPLACEMENT
//
// What changed from original:
//  1. BUG FIX: handleRemoveItem now assigns to invoice_items (not items)
//  2. source field sent with create/update calls
//  3. generateAiSuggestions replaced by real AiSuggestionsSidebar component
//  4. Sidebar auto-loads for Pro users when customer_name is filled (debounced)
//  5. AI pre-filled banner shown when invoice came from AI generator
//  6. All other logic, form fields, and UI preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  Plus, Brain, Zap, TrendingUp, Clock, ArrowLeft, Send,
  FileText, File, Trash2, Star, Lightbulb, Sparkles, CheckCircle,
} from "lucide-react";
import PageHeader from "@/components/page-header/PageHeader";
import Card from "@/components/ui/Card";
import SectionCard from "@/components/section-card/SectionCard";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import InputField from "@/components/ui/InputField";
import { useSubscription } from "@/context/SubscriptionContext";
import OverlayTooltip from "../overlay_tooltip/OverlayTooltip";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";
import { useSubscriptionGuard } from "@/hooks/useSubscriptionGuard";
import { Invoice, InvoiceItem, FormField, PaymentMethod } from "@/lib/invoiceTypes";

// NEW: real AI sidebar
import AiSuggestionsSidebar from "./AiSuggestionsSidebar";

type FieldChangeHandler = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => void;

const CreateInvoicePage: React.FC = () => {
  const { currentPlan, checkUsageLimit } = useSubscription();
  const { incrementUsage } = useSubscriptionUsage();
  const { checkLimit } = useSubscriptionGuard();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const invoice_id = searchParams.get("id");

  const [isLoading, setIsLoading]           = useState(false);
  const isEditingMode                       = !!invoice_id;
  const router                              = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const userId = !loading ? (user?.user?.user_id as string) : "";
  const isPro  = currentPlan?.name === "Pro" || currentPlan?.name === "Enterprise";

  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    user_id:        user?.user?.user_id,
    invoice_number: "INV-" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
    customer_name:  "",
    customer_email: "",
    customer_address: "",
    invoice_date:   new Date().toISOString().split("T")[0],
    due_date:       new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    payment_terms:  "Net 15",
    invoice_items:  [{ id: "1", name: "", description: "", quantity: 0, price: 0, amount: 0 }],
    custom_fields:  {},
    subtotal: 0,
    vat:      0,
    total:    0,
    notes:    "",
    status:   "draft",
    source:   "manual",
  });

  // Parse pre-filled data from URL (AI-generated or template)
  const prebuild_invoice = useMemo(() => {
    const data = searchParams.get("data");
    if (!data) return null;
    try { return JSON.parse(decodeURIComponent(data)); }
    catch { return null; }
  }, [searchParams]);

  // Modal state
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newField, setNewField] = useState<FormField>({
    id: `${new Date()}`, name: "", label: "", type: "text", placeholder: "", value: "", required: false,
  });

  // ── Fetch payment methods ────────────────────────────────────────────────
  const fetchPaymentMethods = async () => {
    if (loading || !user?.user?.user_id) return;
    try {
      const res = await axiosInstance.get(`/user_payment_gateway/user/${user.user.user_id}`);
      if (res.status === 200) {
        setPaymentMethods(res.data.response.filter((m: PaymentMethod) => m.is_active));
      }
    } catch { console.log("Error fetching payment methods"); }
  };

  useEffect(() => { if (!loading && user?.user?.user_id) fetchPaymentMethods(); }, [loading, user?.user?.user_id]);

  // ── Fetch invoice in edit mode ────────────────────────────────────────────
  const fetchInvoiceDetails = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/invoices/single/${invoice_id}`);
      if (res.status === 200) {
        const d = res.data;
        setCurrentInvoice({
          ...d,
          due_date:     d.due_date     ? new Date(d.due_date).toISOString().split("T")[0]     : d.due_date,
          invoice_date: d.invoice_date ? new Date(d.invoice_date).toISOString().split("T")[0] : d.invoice_date,
          invoice_items: d.invoice_items.map((item: InvoiceItem) => ({
            ...item,
            quantity: Number(item.quantity) || 0,
            price:    Number(item.price)    || 0,
            amount:   Number(item.amount)   || 0,
          })),
          vat:      Number(d.vat)      || 0,
          total:    Number(d.total)    || 0,
          subtotal: Number(d.subtotal) || 0,
        });
      }
    } catch (e) { console.log("Error fetching invoice details", e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { if (invoice_id) fetchInvoiceDetails(); }, [invoice_id]);

  // Pre-fill from URL data (AI generator or template)
  useEffect(() => {
    if (prebuild_invoice) {
      setCurrentInvoice((prev) => ({ ...prev, ...prebuild_invoice }));
    }
  }, [invoice_id]);

  // ── Form fields definition ────────────────────────────────────────────────
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "1", name: "customer_name",    label: "Customer Name",    type: "text",   placeholder: "Enter customer name...", required: true,  value: "" },
    { id: "2", name: "invoice_number",   label: "Invoice Number",   type: "text",   placeholder: "",                        required: false, value: currentInvoice.invoice_number },
    { id: "3", name: "customer_email",   label: "Customer Email",   type: "email",  placeholder: "Enter customer email",    required: true,  value: "" },
    { id: "4", name: "customer_address", label: "Customer Address", type: "text",   placeholder: "Enter customer address",  required: false, value: "" },
    { id: "5", name: "invoice_date",     label: "Invoice Date",     type: "date",   placeholder: "",                        required: false, value: currentInvoice.invoice_date },
    { id: "6", name: "due_date",         label: "Due Date",         type: "date",   placeholder: "",                        required: false, value: currentInvoice.due_date },
    { id: "7", name: "paymentTerms",     label: "Payment Terms",    type: "select", placeholder: "",                        required: false, value: currentInvoice.payment_terms, options: ["Net 15", "Net 30", "Net 45", "Due on receipt"] },
  ]);

  useEffect(() => {
    setFormFields((prev) =>
      prev.map((f) => ({ ...f, value: (currentInvoice[f.name as keyof Invoice] as string) || "" }))
    );
  }, [currentInvoice]);

  // ── Compute totals ────────────────────────────────────────────────────────
  const computeTotals = async (subtotal: number, vatRate: number) => {
    try {
      const res = await axiosInstance.post("/invoices/compute-totals", { subtotal, vatRate });
      if (res.status === 200) setCurrentInvoice((prev) => ({ ...prev, vat: res.data.vat, total: res.data.total }));
    } catch { console.log("compute totals error"); }
  };

  useEffect(() => {
    const subtotal = currentInvoice.invoice_items?.reduce((sum, item) => sum + item.amount, 0);
    computeTotals(subtotal, 5);
    setCurrentInvoice((prev) => ({ ...prev, subtotal }));
  }, [currentInvoice.invoice_items]);

  // ── Item handlers ─────────────────────────────────────────────────────────

  const handleAddItem = () => {
    setCurrentInvoice((prev) => ({
      ...prev,
      invoice_items: [...prev.invoice_items, { id: Date.now().toString(), name: "", description: "", quantity: 0, price: 0, amount: 0 }],
    }));
  };

  // BUG FIX: was assigning to `items` — now correctly assigns to `invoice_items`
  const handleRemoveItem = (id: string) => {
    if (currentInvoice.invoice_items.length > 1) {
      setCurrentInvoice((prev) => ({
        ...prev,
        invoice_items: prev.invoice_items.filter((item) => item.id !== id),
      }));
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: number | string) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      invoice_items: prev.invoice_items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "price") {
          updated.amount = Number(updated.quantity) * Number(updated.price);
        }
        return updated;
      }),
    }));
  };

  const handleInputChange = (field: keyof Invoice | string, value: string) => {
    setCurrentInvoice((prev) => ({ ...prev, [field]: value }));
  };

  // ── Sidebar callbacks (called by AiSuggestionsSidebar) ───────────────────

  const handleApplySidebarSuggestion = (name: string, price: number) => {
    // Find first empty item row, fall back to first row
    const targetId = currentInvoice.invoice_items.find((i) => !i.name)?.id ?? currentInvoice.invoice_items[0].id;
    handleItemChange(targetId, "name",     name);
    handleItemChange(targetId, "price",    price);
    handleItemChange(targetId, "quantity", 1);
    toast.success(`"${name}" added to items`);
  };

  const handleApplySidebarNotes = (notes: string) => {
    handleInputChange("notes", notes);
    toast.success("Notes applied");
  };

  // ── Custom fields ─────────────────────────────────────────────────────────

  const handleAddField = () => {
    const fieldId = `custom_${Date.now()}`;
    setCurrentInvoice((prev) => ({
      ...prev,
      custom_fields: { ...prev.custom_fields, [fieldId]: { ...newField, id: fieldId, name: fieldId } },
    }));
    toast.success("Field added!");
    setIsAddFieldModalOpen(false);
    setNewField({ id: `${new Date()}`, name: "", label: "", type: "text", value: "", placeholder: "", required: false });
  };

  const handleDeleteField = (fieldId: string) => {
    setCurrentInvoice((prev) => {
      const updated = { ...prev.custom_fields };
      delete updated[fieldId];
      return { ...prev, custom_fields: updated };
    });
    toast.success("Field deleted!");
  };

  const handleCloseAddFieldModal = () => {
    setIsAddFieldModalOpen(false);
    setNewField({ id: `${new Date()}`, name: "", label: "", type: "text", value: "", placeholder: "", required: false });
  };

  // ── Save & Preview ────────────────────────────────────────────────────────

  const handleSaveandPreviewInvoice = async () => {
    if (!selectedMethod) { toast.error("Select payment method first!"); return; }

    const data = {
      ...currentInvoice,
      items:  currentInvoice.invoice_items,
      source: prebuild_invoice?.source ?? currentInvoice.source ?? "manual",
    };

    try {
      if (isEditingMode) {
        const res = await axiosInstance.put(`/invoices/update/${invoice_id}`, data);
        if (res.status === 200) {
          toast.success("Invoice updated successfully!");
          router.push(`/dashboard/invoicing/preview/${invoice_id}?data=${encodeURIComponent(JSON.stringify(data))}`);
        }
      } else {
        await incrementUsage({ usageKey: "invoicing", amount: 1 });
        const res = await axiosInstance.post("/invoices/create", data);
        if (res.status === 201) {
          toast.success("Invoice saved successfully!");
          const new_invoice_id = res.data.invoice.uuid;
          router.push(`/dashboard/invoicing/preview/${new_invoice_id}?data=${encodeURIComponent(JSON.stringify(data))}`);
        }
      }
    } catch (error: any) {
      if (!error.response || error.response.status !== 400) toast.error("Error saving or updating invoice");
    }
  };

  // ── Input field renderer (unchanged from original) ────────────────────────

  const renderInputField = (field: FormField & { onChange?: FieldChangeHandler }) => {
    const onChange = field.onChange || ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleInputChange(field.name as keyof Invoice, e.target.value));
    switch (field.type) {
      case "textarea":
        return (<textarea rows={4} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary text-text-secondary bg-bg-base resize-none" value={field.value} onChange={onChange} placeholder={field.placeholder} />);
      case "select":
        return (<select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary text-text-secondary bg-bg-base" value={field.value} onChange={onChange}>{field.options?.map((o, i) => <option key={i} value={o}>{o}</option>)}</select>);
      default:
        return (<InputField name={String(field.name)} type={field.type} value={field.value} onChange={onChange as React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>} placeholder={field.placeholder} required={field.required} readOnly={field.name === "invoice_number"} />);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen={true} />;

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        <div className="w-full">
          <PageHeader
            showAIBadge={true}
            icon={<File size={24} />}
            title="Create AI Invoice"
            description="Intelligent invoice creation with AI-powered suggestions and automated optimization"
            buttons={[{ text: "Back To Invoices", onClick: () => router.push("/dashboard/invoicing"), icon: <ArrowLeft size={20} /> }]}
          />

          {/* AI pre-filled banner — shown when invoice came from AI generator */}
          {prebuild_invoice?.source === "ai" && (
            <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl mb-6">
              <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-indigo-700">AI Draft Pre-filled</p>
                <p className="text-xs text-indigo-500">Review all fields carefully. AI may not capture every detail — edit as needed before saving.</p>
              </div>
            </div>
          )}

          {/* AI Assistant Banner */}
          <Card className="bg-brand text-on-brand mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mt-1"><Brain className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Invoice Assistant</h3>
                  <p className="text-white/80 max-w-2xl">Get intelligent suggestions for items, pricing, and professional notes based on your client's invoice history.</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-surface flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-text-heading flex items-center gap-2"><FileText className="w-5 h-5 text-text-heading" />Invoice Details</h2>
                    <p className="text-text-secondary mt-1">Fill in the basic information for your AI-powered invoice</p>
                  </div>
                  <button onClick={() => setIsAddFieldModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-on-brand rounded-lg hover:shadow-raised transition-all font-semibold text-sm">
                    <Plus className="w-4 h-4" />Add Field
                  </button>
                </div>

                <div className="p-6">
                  {/* Standard fields */}
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-1.5 relative group">
                        <div className="flex items-center justify-between">
                          <label className="block text-text-secondary text-sm font-medium flex items-center gap-2">
                            {field.label}
                            {field.name === "customer_name" && <Lightbulb className="w-3 h-3 text-status-warning" />}
                            {field.required && <span className="text-status-error ml-1">*</span>}
                          </label>
                        </div>
                        {renderInputField(field)}
                      </div>
                    ))}

                    {/* Custom fields */}
                    {Object.entries(currentInvoice.custom_fields).map(([key, field]) => (
                      <div key={key} className="space-y-1.5 relative group">
                        <div className="flex items-center justify-between">
                          <label className="block text-text-secondary text-sm font-medium flex items-center gap-2">
                            {field.label}
                            {field.required && <span className="text-status-error ml-1">*</span>}
                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-status-warning bg-status-warning-bg border border-status-warning-border rounded-full"><Star className="w-3 h-3" />Custom Added</span>
                          </label>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDeleteField(field.id)} type="button" className="p-1.5 bg-status-error-bg text-status-error rounded hover:bg-status-error hover:text-on-brand transition-colors" title="Remove field">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {renderInputField({
                          ...field,
                          onChange: (e) => {
                            setCurrentInvoice((prev) => ({
                              ...prev,
                              custom_fields: { ...prev.custom_fields, [key]: { ...prev.custom_fields[key], value: e.target.value } },
                            }));
                          },
                        })}
                      </div>
                    ))}

                    {/* Payment method */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="addPaymentMethod" checked={showPaymentMethod} onChange={(e) => setShowPaymentMethod(e.target.checked)} className="w-4 h-4 accent-secondary border-border rounded" />
                        <label htmlFor="addPaymentMethod" className="text-sm font-medium text-text-secondary cursor-pointer">Add Payment Method</label>
                      </div>
                      {showPaymentMethod && (
                        <div className="space-y-3 relative group">
                          {paymentMethods.length === 0 ? (
                            <div className="p-4 bg-status-warning-bg border border-status-warning-border rounded-lg text-sm text-status-warning flex flex-col items-start gap-2">
                              <p>No active payment method exists.</p>
                              <Button startIcon={<Plus className="w-4 h-4" />} onClick={() => router.push("/dashboard/settings")} className="px-4 py-2 text-sm font-medium">Add Payment Method</Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <label className="block text-text-secondary text-sm font-medium">Payment Method</label>
                              <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary text-text-secondary bg-bg-base" value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
                                <option value="">Select Payment Method</option>
                                {paymentMethods.map((m) => <option key={m.uuid} value={m.gateway_name} className="capitalize">{m.gateway_name}</option>)}
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items table */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-text-heading flex items-center gap-2"><TrendingUp className="w-5 h-5 text-text-heading" />Items & Services</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary bg-status-info-bg border border-status-info-border px-3 py-1 rounded-full"><Sparkles className="w-3 h-3 text-status-info" />AI Pricing Suggestions</div>
                    </div>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full">
                        <thead className="bg-brand">
                          <tr>
                            {["Item/Service", "Description", "Qty", "Price (AED)", "Amount (AED)", "Action"].map((h) => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-on-brand uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentInvoice.invoice_items?.map((item, index) => (
                            <tr key={index + item.id} className="border-b border-border hover:bg-brand-light/30 transition-colors">
                              <td className="px-4 py-3"><input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary text-text-secondary bg-bg-base text-sm" value={item.name} onChange={(e) => handleItemChange(item.id, "name", e.target.value)} placeholder="Service Name" /></td>
                              <td className="px-4 py-3"><input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary text-text-secondary bg-bg-base text-sm" value={item.description} onChange={(e) => handleItemChange(item.id, "description", e.target.value)} placeholder="Description" /></td>
                              <td className="px-4 py-3"><input type="number" min="0" className="w-20 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary text-text-secondary bg-bg-base text-sm" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", e.target.value || 0)} /></td>
                              <td className="px-4 py-3"><input type="number" step="0.01" className="w-32 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary text-text-secondary bg-bg-base text-sm" value={item.price} onChange={(e) => handleItemChange(item.id, "price", parseFloat(e.target.value) || 0)} placeholder="0.00" /></td>
                              <td className="px-4 py-3 text-sm font-semibold text-text-heading">AED {item.amount.toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <button onClick={() => handleRemoveItem(item.id)} className="text-status-error hover:text-status-error/80 text-sm font-medium transition-colors px-3 py-1 rounded-lg hover:bg-status-error-bg disabled:text-text-muted disabled:cursor-not-allowed" disabled={currentInvoice.invoice_items.length === 1}>Remove</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Button onClick={handleAddItem} className="mb-8 bg-transparent shadow-none py-2 px-4 text-text-heading hover:bg-brand-light border border-dashed border-border rounded-lg" startIcon={<Plus className="w-4 h-4" />}>Add Another Item</Button>

                  {/* Summary */}
                  <div className="bg-surface rounded-lg shadow-card border border-border overflow-hidden mb-8">
                    <div className="p-4 border-b border-border bg-bg-base"><h3 className="text-lg font-bold text-text-heading flex items-center gap-2"><FileText className="w-5 h-5 text-text-heading" />Invoice Summary</h3></div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><span className="text-sm text-text-secondary">Subtotal:</span><span className="text-sm font-semibold text-text-heading">AED {Number(currentInvoice.subtotal).toFixed(2)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-sm text-text-secondary">VAT (5%):</span><span className="text-sm font-semibold text-text-heading">AED {Number(currentInvoice.vat).toFixed(2)}</span></div>
                        <div className="border-t border-border pt-4 flex justify-between items-center"><span className="font-bold text-text-heading">Total:</span><span className="font-bold text-xl text-text-heading">AED {Number(currentInvoice.total).toFixed(2)}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-8">
                    <div className="space-y-1.5 relative group">
                      <label className="block text-text-secondary text-sm font-medium flex items-center gap-2">Notes & AI Suggestions<Sparkles className="w-3 h-3 text-status-info" /></label>
                      <textarea rows={4} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary text-text-secondary bg-bg-base resize-none" value={currentInvoice.notes} onChange={(e) => handleInputChange("notes", e.target.value)} placeholder="Add notes or let AI generate professional invoice notes..." />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4 pt-6 border-t border-border">
                    <Button onClick={() => router.push("/dashboard/invoicing")} className="border border-border text-text-secondary bg-surface hover:bg-bg-base shadow-sm">Cancel</Button>
                    <Button className="flex-1" onClick={handleSaveandPreviewInvoice} startIcon={<Send className="w-4 h-4" />}>Save & Preview</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions Sidebar — REPLACED with real component */}
            <div className="lg:col-span-1">
              <AiSuggestionsSidebar
                userId={userId}
                customerName={currentInvoice.customer_name}
                isPro={isPro}
                onApplySuggestion={handleApplySidebarSuggestion}
                onApplyNotes={handleApplySidebarNotes}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      <Modal isOpen={isAddFieldModalOpen} onClose={handleCloseAddFieldModal} title="Add Custom Field" showCloseButton closeOnOverlayClick size="md" titleIcon={<Plus className="w-5 h-5 text-white" />}>
        <div className="p-6">
          <div className="space-y-4">
            <InputField label="Field Label" name="add_field_label" type="text" value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} placeholder="e.g., Contract Value" required />
            <div>
              <label className="block mb-2 text-text-secondary text-sm font-medium">Field Type</label>
              <select value={newField.type} onChange={(e) => setNewField({ ...newField, type: e.target.value as FormField["type"] })} className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary text-sm text-text-secondary bg-bg-base">
                <option value="text">Text</option><option value="email">Email</option><option value="number">Number</option><option value="date">Date</option><option value="textarea">Textarea</option><option value="select">Dropdown</option>
              </select>
            </div>
            {newField.type === "select"
              ? <InputField label="Options (comma-separated)" name="add_field_options" type="text" value={newField.placeholder} onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })} placeholder="e.g., Option 1, Option 2" />
              : <InputField label="Placeholder Text" name="add_field_placeholder" type="text" value={newField.placeholder} onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })} placeholder="e.g., Enter contract value" />
            }
            <div className="flex items-center gap-3">
              <input type="checkbox" id="newFieldRequired" checked={newField.required} onChange={(e) => setNewField({ ...newField, required: e.target.checked })} className="w-4 h-4 accent-secondary border-border rounded" />
              <label htmlFor="newFieldRequired" className="text-sm font-medium text-text-secondary cursor-pointer">Make this field required</label>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button onClick={handleCloseAddFieldModal} className="flex-1 px-4 py-2.5 border border-border text-text-secondary font-semibold text-sm rounded-lg hover:bg-bg-base transition-colors">Cancel</button>
            <button onClick={handleAddField} disabled={!newField.label.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-lg hover:shadow-raised transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <Plus className="w-4 h-4" />Add Field
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default CreateInvoicePage;
