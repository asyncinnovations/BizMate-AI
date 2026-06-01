// ─────────────────────────────────────────────────────────────────────────────
// src/lib/invoiceTypes.ts
// Single source of truth for all invoice-related TypeScript types.
// Import from here — never redeclare these per-file.
// ─────────────────────────────────────────────────────────────────────────────

export type InvoiceStatus =
  | "draft"
  | "saved"
  | "sent"
  | "viewed"
  | "paid"
  | "unpaid"
  | "overdue"
  | "archived";

export type InvoiceSource =
  | "manual"
  | "ai"
  | "duplicate"
  | "template"
  | "recurring";

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "date" | "number" | "textarea" | "select";
  placeholder: string;
  required: boolean;
  value: string;
  options?: string[];
}

export interface ActivityEntry {
  status: InvoiceStatus;
  timestamp: string;
}

export interface Invoice {
  uuid?: string;
  user_id: string | unknown;
  invoice_number: string;
  invoice_name?: string;
  invoice_type?: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  invoice_items: InvoiceItem[];
  custom_fields: Record<string, FormField>;
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  status: InvoiceStatus;
  source?: InvoiceSource;
  activity_log?: ActivityEntry[];
  invoice_pdf?: string;
}

export interface EmailFormData {
  to: string;
  cc: string;
  subject: string;
  message: string;
  send_at?: string;
}

export interface PaymentMethod {
  uuid: string;
  user_id: string;
  gateway_name: string;
  credentails: Record<string, string>;
  is_active: boolean;
  created_at: string;
}

// ─── AI types ─────────────────────────────────────────────────────────────────

export type CreationMethod = "ai" | "manual" | "duplicate" | "recurring" | "scheduled";

export interface AiInsights {
  invoice_uuid?: string;
  customer_name?: string;
  payment_prediction_days: number;
  late_payment_risk_percent: number;
  suggested_action: string;
  client_payment_pattern: string;
  reminder_date?: string;
}

export interface AiSuggestion {
  name: string;
  suggested_price: number;
  times_used?: number;
}

export interface AiSuggestionsResponse {
  suggestions: AiSuggestion[];
  payment_pattern: string;
  overdue_count?: number;
  payment_rate?: number;
  pricing_tip: string;
  professional_notes: string;
}
