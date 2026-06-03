// ─── Plan ─────────────────────────────────────────────────────────────
export type PlanTier = "starter" | "pro" | "enterprise" | "custom";
export type BillingCycle = "monthly" | "annual";
export type PlanStatus = "active" | "draft" | "archived";

export interface PlanFeature {
  label: string;
  included: boolean;
  limit?: string; // e.g. "5 users", "10k tokens"
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  status: PlanStatus;
  monthlyPrice: number;   // USD
  annualPrice: number;    // USD (per month billed annually)
  currency: string;
  description: string;
  features: PlanFeature[];
  limits: {
    users: number | "unlimited";
    aiCredits: number | "unlimited"; // tokens/month
    documents: number | "unlimited";
    businesses: number | "unlimited";
    storage: string;   // e.g. "5 GB"
  };
  subscriberCount: number;
  mrr: number;           // calculated
  createdAt: string;
  updatedAt: string;
  isPopular?: boolean;
  trialDays: number;
}

// ─── Subscription ─────────────────────────────────────────────────────
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "paused"
  | "unpaid";

export interface Subscription {
  id: string;
  businessId: string;
  businessName: string;
  businessEmail: string;
  planId: string;
  planName: string;
  planTier: PlanTier;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  amount: number;           // current billing amount USD
  currency: string;
  startDate: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  seats: number;
  aiCreditsUsed: number;
  aiCreditsLimit: number | "unlimited";
  nextInvoiceDate: string;
  nextInvoiceAmount: number;
  paymentMethod: string;    // e.g. "Visa •••• 4242"
  country: string;
}

// ─── Invoice / Billing ────────────────────────────────────────────────
export type InvoiceStatus = "paid" | "open" | "void" | "uncollectible" | "draft";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessId: string;
  businessName: string;
  subscriptionId: string;
  planName: string;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  billingCycle: BillingCycle;
  paymentMethod?: string;
  items: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

// ─── Analytics ────────────────────────────────────────────────────────
export interface RevenueDataPoint {
  month: string;
  mrr: number;
  newMrr: number;
  churnedMrr: number;
  netMrr: number;
}

export interface SubscriptionMetrics {
  mrr: number;
  mrrGrowth: number;         // %
  arr: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  churnRate: number;         // %
  arpu: number;              // avg revenue per user
  ltv: number;               // lifetime value
  newThisMonth: number;
  canceledThisMonth: number;
}