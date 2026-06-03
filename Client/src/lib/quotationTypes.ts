// src/lib/quotationTypes.ts
// Single source of truth for all quotation-related TypeScript types.

export type QuotationStatus =
  | "draft" | "sent" | "viewed" | "accepted"
  | "rejected" | "expired" | "converted" | "archived";

export type QuotationSource = "manual" | "ai" | "duplicate";

export interface ActivityEntry {
  status: QuotationStatus;
  timestamp: string;
  actor?: string;
}

export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;
  unit_price: number;
  discount_pct: number;
  tax_pct: number;
  line_total: number;
}

export interface LinkedDocument {
  document_uuid: string;
  document_type: string;
  document_name: string;
}

export interface Quotation {
  uuid?: string;
  user_id: string;
  quotation_number: string;
  project_title?: string | null;
  description?: string | null;
  client_id?: string | null;
  client_name: string;
  client_email?: string | null;
  client_address?: string | null;
  client_phone?: string | null;
  currency: string;
  subtotal: number;
  total_discount: number;
  total_tax: number;
  grand_total: number;
  line_items: LineItem[];
  issue_date: string;
  expiry_date: string;
  terms_and_conditions?: string | null;
  notes?: string | null;
  ai_prompt?: string | null;
  status: QuotationStatus;
  source: QuotationSource;
  activity_log?: ActivityEntry[];
  public_token?: string | null;
  viewed_at?: string | null;
  client_action_at?: string | null;
  client_comment?: string | null;
  converted_invoice_id?: string | null;
  linked_documents?: LinkedDocument[];
  pdf_path?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AiQuotationSuggestion {
  type: string;
  quotation_number?: string | null;
  client_name?: string | null;
  message: string;
  priority: "high" | "medium" | "low";
}

export const ALL_QUOTATION_STATUSES: QuotationStatus[] = [
  "draft", "sent", "viewed", "accepted", "rejected", "expired", "converted", "archived",
];

export function getQuotationStatusBadge(status: string): string {
  const base = "inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border";
  const map: Record<string, string> = {
    draft:     `${base} bg-slate-100 text-slate-600 border-slate-200`,
    sent:      `${base} bg-blue-100 text-blue-800 border-blue-200`,
    viewed:    `${base} bg-purple-100 text-purple-800 border-purple-200`,
    accepted:  `${base} bg-green-100 text-green-800 border-green-200`,
    rejected:  `${base} bg-red-100 text-red-800 border-red-200`,
    expired:   `${base} bg-orange-100 text-orange-800 border-orange-200`,
    converted: `${base} bg-indigo-100 text-indigo-800 border-indigo-200`,
    archived:  `${base} bg-slate-100 text-slate-400 border-slate-200`,
  };
  return map[status] ?? `${base} bg-gray-100 text-gray-600 border-gray-200`;
}
