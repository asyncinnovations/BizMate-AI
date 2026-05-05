import React from "react";
import {
  CreditCard,
  Lock,
  Loader2,
  ChevronRight,
  Wallet,
  Landmark,
  AlertCircle,
} from "lucide-react";
import CheckoutFormField from "../chekout-form-field/Checkoutformfield";

// ================= TYPES =================
export type PaymentMethod = "card" | "paypal" | "stripe";

export interface CardForm {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface CheckoutPaymentFormProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  cardForm: CardForm;
  onCardFormChange: (form: CardForm) => void;
  stripeCard: CardForm;
  onStripeCardChange: (form: CardForm) => void;
  paypalEmail: string;
  onPaypalEmailChange: (v: string) => void;
  stripeEmail: string;
  onStripeEmailChange: (v: string) => void;
  processing: boolean;
  isFreePlan: boolean;
  price: number | string;
  onSubmit: (e: React.FormEvent) => void;
}

// ================= HELPERS =================
const formatCardNumber = (value: string) =>
  value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const getCardBrand = (number: string) => {
  const n = number.replace(/\s/g, "");
  if (n.startsWith("4")) return "VISA";
  if (n.startsWith("5") || n.startsWith("2")) return "MC";
  if (n.startsWith("3")) return "AMEX";
  return null;
};

// ================= PAYMENT METHOD OPTIONS =================
const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}[] = [
    { id: "stripe", label: "Stripe", sublabel: "PCI compliant", icon: <Landmark className="w-5 h-5" /> },
    { id: "card", label: "Card", sublabel: "Credit / Debit", icon: <CreditCard className="w-5 h-5" /> },
    { id: "paypal", label: "PayPal", sublabel: "Buyer protected", icon: <Wallet className="w-5 h-5" /> },
  ];

// ================= COMPONENT =================
const CheckoutPaymentForm: React.FC<CheckoutPaymentFormProps> = ({
  selectedMethod,
  onMethodChange,
  cardForm,
  onCardFormChange,
  stripeCard,
  onStripeCardChange,
  paypalEmail,
  onPaypalEmailChange,
  stripeEmail,
  onStripeEmailChange,
  processing,
  isFreePlan,
  price,
  onSubmit,
}) => {
  const cardBrand = getCardBrand(cardForm.cardNumber);

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden">

      {/* Header */}
      <div className="px-8 pt-7 pb-6 border-b border-border">
        <h2 className="text-[17px] font-bold text-text-heading">
          Complete your purchase
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Choose your preferred payment method below
        </p>
      </div>

      <div className="px-8 py-7">

        {/* Method selector */}
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted mb-3">
          Payment Method
        </p>
        <div className="flex gap-3 mb-8">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => onMethodChange(method.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${selectedMethod === method.id
                  ? "border-brand bg-brand text-on-brand shadow-raised scale-[1.02]"
                  : "border-border bg-bg-base text-text-secondary hover:border-border-strong hover:bg-surface hover:text-text-heading"
                }`}
            >
              {method.icon}
              <span className="text-[11px] font-bold leading-none">{method.label}</span>
              <span className={`text-[9px] leading-none font-medium ${selectedMethod === method.id ? "text-on-brand/60" : "text-text-muted"
                }`}>
                {method.sublabel}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">

          {/* ── Card form ── */}
          {selectedMethod === "card" && (
            <>
              <CheckoutFormField
                label="Cardholder Name"
                placeholder="John Doe"
                value={cardForm.cardHolder}
                onChange={(v) => onCardFormChange({ ...cardForm, cardHolder: v })}
                required
                autoComplete="cc-name"
              />
              <div className="relative">
                <CheckoutFormField
                  label="Card Number"
                  placeholder="1234  5678  9012  3456"
                  value={cardForm.cardNumber}
                  onChange={(v) => onCardFormChange({ ...cardForm, cardNumber: formatCardNumber(v) })}
                  maxLength={19}
                  required
                  autoComplete="cc-number"
                  inputMode="numeric"
                />
                {cardBrand && (
                  <span className="absolute right-3.5 top-[34px] text-[9px] font-black tracking-widest text-text-heading bg-brand-light border border-border px-2 py-0.5 rounded">
                    {cardBrand}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CheckoutFormField
                  label="Expiry Date"
                  placeholder="MM / YY"
                  value={cardForm.expiry}
                  onChange={(v) => onCardFormChange({ ...cardForm, expiry: formatExpiry(v) })}
                  maxLength={5}
                  required
                  autoComplete="cc-exp"
                  inputMode="numeric"
                />
                <CheckoutFormField
                  label="CVV"
                  placeholder="• • •"
                  value={cardForm.cvv}
                  onChange={(v) => onCardFormChange({ ...cardForm, cvv: v.replace(/\D/g, "").slice(0, 4) })}
                  type="password"
                  maxLength={4}
                  required
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  hint="3–4 digits on back of card"
                />
              </div>
            </>
          )}

          {/* ── PayPal form ── */}
          {selectedMethod === "paypal" && (
            <>
              <div className="flex items-center gap-3.5 bg-status-info-bg border border-status-info-border rounded-xl px-4 py-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#003087] flex items-center justify-center shrink-0 shadow-card">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-heading">Secure PayPal Checkout</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Buyer protection included on every purchase
                  </p>
                </div>
              </div>
              <CheckoutFormField
                label="PayPal Email Address"
                placeholder="you@paypal.com"
                type="email"
                value={paypalEmail}
                onChange={onPaypalEmailChange}
                required
                autoComplete="email"
              />
              <p className="text-xs text-text-muted flex items-start gap-1.5 -mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                You&apos;ll be redirected to PayPal to complete your payment securely.
              </p>
            </>
          )}

          {/* ── Stripe form ── */}
          {selectedMethod === "stripe" && (
            <>
              <div className="flex items-center gap-3.5 bg-bg-subtle border border-border rounded-xl px-4 py-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#635BFF] flex items-center justify-center shrink-0 shadow-card">
                  <Landmark className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-heading">Stripe Secure Payment</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    PCI DSS Level 1 certified · Bank-level encryption
                  </p>
                </div>
              </div>
              <CheckoutFormField
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                value={stripeEmail}
                onChange={onStripeEmailChange}
                required
                autoComplete="email"
              />
              <CheckoutFormField
                label="Card Number"
                placeholder="1234  5678  9012  3456"
                value={stripeCard.cardNumber}
                onChange={(v) => onStripeCardChange({ ...stripeCard, cardNumber: formatCardNumber(v) })}
                maxLength={19}
                required
                autoComplete="cc-number"
                inputMode="numeric"
              />
              <CheckoutFormField
                label="Cardholder Name"
                placeholder="John Doe"
                value={stripeCard.cardHolder}
                onChange={(v) => onStripeCardChange({ ...stripeCard, cardHolder: v })}
                required
                autoComplete="cc-name"
              />
              <div className="grid grid-cols-2 gap-4">
                <CheckoutFormField
                  label="Expiry Date"
                  placeholder="MM / YY"
                  value={stripeCard.expiry}
                  onChange={(v) => onStripeCardChange({ ...stripeCard, expiry: formatExpiry(v) })}
                  maxLength={5}
                  required
                  autoComplete="cc-exp"
                  inputMode="numeric"
                />
                <CheckoutFormField
                  label="CVV"
                  placeholder="• • •"
                  value={stripeCard.cvv}
                  onChange={(v) => onStripeCardChange({ ...stripeCard, cvv: v.replace(/\D/g, "").slice(0, 4) })}
                  type="password"
                  maxLength={4}
                  required
                  autoComplete="cc-csc"
                  inputMode="numeric"
                />
              </div>
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
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  {isFreePlan ? "Activate Free Plan" : `Pay AED ${price} Securely`}
                </span>
                <ChevronRight className="w-4 h-4 shrink-0 absolute right-5" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-text-muted">
            By subscribing you agree to our{" "}
            <span className="underline cursor-pointer hover:text-text-secondary transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-text-secondary transition-colors">
              Privacy Policy
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPaymentForm;