"use client";

/**
 * InvoicePaymentPage
 *
 * Public page — NO DashboardLayout, no top header bar.
 * Folder: app/pay/[invoiceId]/page.tsx
 *
 * URL: /pay/[invoiceId]?method=stripe   (stripe | card | paypal)
 * Uses project design tokens to match CheckoutPaymentForm.
 *
 * No API calls — dummy data only.
 * Replace DUMMY_INVOICE with: GET /invoices/single/:invoiceId
 * Payment submit:             POST /invoices/pay/:invoiceId { method, ...formData }
 */

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  CreditCard, Wallet, Landmark, Lock,
  CheckCircle2, Loader2, ShieldCheck, ChevronDown,
  ChevronRight, AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentMethod = "stripe" | "card" | "paypal";

interface InvoiceItem {
  id: string; name: string; description: string;
  quantity: number; price: number; amount: number;
}

interface InvoiceData {
  invoice_number: string; customer_name: string;
  customer_email: string; customer_address: string;
  business_name: string; business_address: string;
  business_trn: string; invoice_date: string;
  due_date: string; payment_terms: string;
  invoice_items: InvoiceItem[];
  subtotal: number; vat: number; total: number; notes: string;
}

interface CardForm {
  cardHolder: string; cardNumber: string; expiry: string; cvv: string;
}

// ─── Dummy invoice ─────────────────────────────────────────────────────────
const DUMMY_INVOICE: InvoiceData = {
  invoice_number: "INV-2026-0042",
  customer_name: "Khalid Al Mansoori",
  customer_email: "khalid@company.ae",
  customer_address: "Office 14, Media City, Dubai, UAE",
  business_name: "Tech Solutions LLC",
  business_address: "Suite 205, DIFC, Dubai, UAE",
  business_trn: "100123456700003",
  invoice_date: "2026-03-20",
  due_date: "2026-04-04",
  payment_terms: "Net 15",
  invoice_items: [
    { id: "1", name: "Web Development Services", description: "Frontend development — React/Next.js", quantity: 1, price: 8500, amount: 8500 },
    { id: "2", name: "UI/UX Design", description: "Figma design + prototyping", quantity: 1, price: 4200, amount: 4200 },
    { id: "3", name: "Monthly Maintenance", description: "Hosting + support", quantity: 2, price: 650, amount: 1300 },
  ],
  subtotal: 14000, vat: 700, total: 14700,
  notes: "Payment due within 15 days. Bank transfer and online payment accepted.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtAED = (n: number) =>
  `AED ${Number(n).toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" });

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const getCardBrand = (n: string): string | null => {
  const raw = n.replace(/\s/g, "");
  if (raw.startsWith("4")) return "VISA";
  if (raw.startsWith("5") || raw.startsWith("2")) return "MC";
  if (raw.startsWith("3")) return "AMEX";
  return null;
};

// ─── Form field — matches CheckoutFormField style ─────────────────────────────
function Field({
  label, value, onChange, placeholder, type = "text",
  maxLength, required, hint, inputMode, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; maxLength?: number;
  required?: boolean; hint?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        maxLength={maxLength} inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-heading placeholder:text-text-muted bg-bg-base focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-all"
      />
      {hint && (
        <p className="text-[11px] text-text-muted mt-1">{hint}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function InvoicePaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const invoiceId = params?.invoiceId as string;

  const rawMethod = searchParams?.get("method") || "stripe";
  const validMethods: PaymentMethod[] = ["stripe", "card", "paypal"];
  const method: PaymentMethod = validMethods.includes(rawMethod as PaymentMethod)
    ? (rawMethod as PaymentMethod) : "stripe";

  const invoice = DUMMY_INVOICE;
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [card, setCard] = useState<CardForm>({ cardHolder: "", cardNumber: "", expiry: "", cvv: "" });
  const setCardField = (k: keyof CardForm, v: string) => setCard(p => ({ ...p, [k]: v }));
  const [stripeCard, setStripeCard] = useState<CardForm>({ cardHolder: "", cardNumber: "", expiry: "", cvv: "" });
  const setStripeField = (k: keyof CardForm, v: string) => setStripeCard(p => ({ ...p, [k]: v }));
  const [stripeEmail, setStripeEmail] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // TODO: POST /invoices/pay/:invoiceId { method, ...formData }
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    setPaid(true);
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (paid) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
        <div className="bg-surface rounded-2xl border border-border shadow-card p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-text-heading mb-1.5">Payment Successful</h2>
          <p className="text-sm text-text-muted mb-1">
            {invoice.invoice_number} has been settled.
          </p>
          <p className="text-2xl font-bold text-text-heading mt-4 mb-5">
            {fmtAED(invoice.total)}
          </p>
          <div className="bg-bg-subtle rounded-xl border border-border p-4 text-left space-y-2.5 mb-5">
            {[["Reference", invoice.invoice_number], ["Paid to", invoice.business_name], ["Date", new Date().toLocaleDateString("en-AE")]].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-text-muted">{l}</span>
                <span className="font-semibold text-text-heading">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted">
            Receipt sent to <span className="text-text-secondary font-medium">{invoice.customer_email}</span>
          </p>
        </div>
      </div>
    );
  }

  // ── Page ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-base flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-[460px]">

        {/* Brand header */}
        <div className="text-center mb-6">
          <p className="text-[14px] font-semibold text-text-heading">{invoice.business_name}</p>
          <p className="text-xs text-text-muted mt-0.5">Secure Payment Portal</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden">

          {/* ── Invoice summary ── */}
          <div className="px-8 pt-7 pb-6 border-b border-border">

            {/* Who & invoice ref */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted mb-1">
                  Billed To
                </p>
                <p className="text-[15px] font-bold text-text-heading">{invoice.customer_name}</p>
                <p className="text-xs text-text-muted mt-0.5">{invoice.customer_email}</p>
              </div>
              <span className="text-[11px] font-medium text-text-muted bg-bg-subtle border border-border rounded-lg px-2.5 py-1 font-mono mt-0.5">
                {invoice.invoice_number}
              </span>
            </div>

            {/* Amount + due */}
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-text-heading tracking-tight">
                {fmtAED(invoice.total)}
              </p>
              <p className="text-xs font-medium text-red-500">
                Due {fmtDate(invoice.due_date)}
              </p>
            </div>

            {/* Breakdown toggle */}
            <button
              type="button"
              onClick={() => setShowDetails(v => !v)}
              className="flex items-center gap-1 mt-3 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{ transform: showDetails ? "rotate(180deg)" : "rotate(0deg)" }}
              />
              {showDetails ? "Hide" : "View"} breakdown
            </button>

            {/* Breakdown panel */}
            {showDetails && (
              <div className="mt-4 pt-4 border-t border-border space-y-1">
                {invoice.invoice_items.map(item => (
                  <div key={item.id} className="flex justify-between py-1.5 text-sm border-b border-border/50">
                    <div>
                      <p className="font-medium text-text-heading text-[13px]">{item.name}</p>
                      {item.description && (
                        <p className="text-[11px] text-text-muted">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-[13px] font-medium text-text-secondary">{fmtAED(item.amount)}</p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-text-muted">×{item.quantity}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-xs text-text-muted pt-2">
                  <span>Subtotal</span><span>{fmtAED(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-text-muted">
                  <span>VAT (5%)</span><span>{fmtAED(invoice.vat)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-text-heading pt-1 border-t border-border">
                  <span>Total</span><span>{fmtAED(invoice.total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Payment form ── */}
          <div className="px-8 py-7">
            <h2 className="text-[17px] font-bold text-text-heading">
              Complete your payment
            </h2>
            <p className="text-sm text-text-muted mt-1 mb-7">
              Your transaction is secured with bank-level encryption.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Card form ── */}
              {method === "card" && (
                <>
                  <Field label="Cardholder Name" value={card.cardHolder}
                    onChange={v => setCardField("cardHolder", v)}
                    placeholder="Name on card" required autoComplete="cc-name" />
                  <div className="relative">
                    <Field label="Card Number" value={card.cardNumber}
                      onChange={v => setCardField("cardNumber", formatCardNumber(v))}
                      placeholder="1234  5678  9012  3456"
                      maxLength={19} inputMode="numeric" required autoComplete="cc-number" />
                    {getCardBrand(card.cardNumber) && (
                      <span className="absolute right-3.5 top-[34px] text-[9px] font-black tracking-widest text-text-heading bg-brand-light border border-border px-2 py-0.5 rounded">
                        {getCardBrand(card.cardNumber)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry Date" value={card.expiry}
                      onChange={v => setCardField("expiry", formatExpiry(v))}
                      placeholder="MM / YY" maxLength={5} inputMode="numeric"
                      required autoComplete="cc-exp" />
                    <Field label="CVV" value={card.cvv}
                      onChange={v => setCardField("cvv", v.replace(/\D/g, "").slice(0, 4))}
                      placeholder="• • •" type="password" maxLength={4}
                      inputMode="numeric" required autoComplete="cc-csc"
                      hint="3–4 digits on back of card" />
                  </div>
                </>
              )}

              {/* ── Stripe form ── */}
              {method === "stripe" && (
                <>
                  <div className="flex items-center gap-3.5 bg-bg-subtle border border-border rounded-xl px-4 py-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#635BFF] flex items-center justify-center shrink-0 shadow-card">
                      <Landmark className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-heading">Stripe Secure Payment</p>
                      <p className="text-xs text-text-secondary mt-0.5">PCI DSS Level 1 · Bank-level encryption</p>
                    </div>
                  </div>
                  <Field label="Email Address" value={stripeEmail}
                    onChange={setStripeEmail}
                    placeholder="you@example.com" type="email"
                    required autoComplete="email" />
                  <div className="relative">
                    <Field label="Card Number" value={stripeCard.cardNumber}
                      onChange={v => setStripeField("cardNumber", formatCardNumber(v))}
                      placeholder="1234  5678  9012  3456"
                      maxLength={19} inputMode="numeric" required autoComplete="cc-number" />
                    {getCardBrand(stripeCard.cardNumber) && (
                      <span className="absolute right-3.5 top-[34px] text-[9px] font-black tracking-widest text-text-heading bg-brand-light border border-border px-2 py-0.5 rounded">
                        {getCardBrand(stripeCard.cardNumber)}
                      </span>
                    )}
                  </div>
                  <Field label="Cardholder Name" value={stripeCard.cardHolder}
                    onChange={v => setStripeField("cardHolder", v)}
                    placeholder="Name on card" required autoComplete="cc-name" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry Date" value={stripeCard.expiry}
                      onChange={v => setStripeField("expiry", formatExpiry(v))}
                      placeholder="MM / YY" maxLength={5} inputMode="numeric"
                      required autoComplete="cc-exp" />
                    <Field label="CVV" value={stripeCard.cvv}
                      onChange={v => setStripeField("cvv", v.replace(/\D/g, "").slice(0, 4))}
                      placeholder="• • •" type="password" maxLength={4}
                      inputMode="numeric" required autoComplete="cc-csc" />
                  </div>
                </>
              )}

              {/* ── PayPal form ── */}
              {method === "paypal" && (
                <>
                  <div className="flex items-center gap-3.5 bg-status-info-bg border border-status-info-border rounded-xl px-4 py-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#003087] flex items-center justify-center shrink-0 shadow-card">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-heading">Secure PayPal Checkout</p>
                      <p className="text-xs text-text-secondary mt-0.5">Buyer protection included on every purchase</p>
                    </div>
                  </div>
                  <Field label="PayPal Email Address" value={paypalEmail}
                    onChange={setPaypalEmail}
                    placeholder="you@paypal.com" type="email"
                    required autoComplete="email" />
                  <p className="text-xs text-text-muted flex items-start gap-1.5 -mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    You'll be redirected to PayPal to complete your payment securely.
                  </p>
                </>
              )}

              {/* Security note */}
              <div className="flex items-center gap-2 pt-1">
                <Lock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span className="text-xs text-text-muted">
                  256-bit SSL encrypted · Your card data is never stored on our servers
                </span>
              </div>

              <div className="border-t border-border" />

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="w-full relative flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand hover:bg-brand-hover active:scale-[0.99] text-on-brand font-semibold text-[14px] transition-all duration-200 shadow-card hover:shadow-raised disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Processing Payment…</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Pay {fmtAED(invoice.total)} Securely</span>
                    <ChevronRight className="w-4 h-4 shrink-0 absolute right-5" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-text-muted">
                By paying you agree to our{" "}
                <span className="underline cursor-pointer hover:text-text-secondary transition-colors">Terms of Service</span>
                {" "}and{" "}
                <span className="underline cursor-pointer hover:text-text-secondary transition-colors">Privacy Policy</span>
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-5">
          Billed by <span className="text-text-secondary font-medium">{invoice.business_name}</span>
          {" "}· TRN {invoice.business_trn}
        </p>

      </div>
    </div>
  );
}