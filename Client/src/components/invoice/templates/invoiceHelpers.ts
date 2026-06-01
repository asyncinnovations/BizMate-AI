// src/components/invoice/templates/invoiceHelpers.ts
// ─────────────────────────────────────────────────────
// Shared utilities used by all 4 invoice template components.

export interface InvoiceItem {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface InvoiceData {
  uuid?: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  payment_terms?: string;
  customer_name: string;
  customer_email?: string;
  customer_address?: string;
  notes?: string;
  subtotal: number;
  vat: number;
  total: number;
  invoice_items?: InvoiceItem[];
  items?: InvoiceItem[];
  // Business profile fields (pulled from user's business info)
  business_name?: string;
  business_address?: string;
  business_email?: string;
  business_phone?: string;
  business_trn?: string;
  business_iban?: string;
  business_swift?: string;
  business_bank?: string;
  business_website?: string;
  // UI helpers
  template?: "freelancer" | "startup" | "sme" | "corporate";
}

/** Format AED currency — e.g. 9,345.00 */
export const fmtAED = (n: number | string): string => {
  const num = Number(n) || 0;
  return new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/** Convert number to words (UAE dirhams format) */
export const toWords = (n: number): string => {
  if (!n || isNaN(n)) return "";
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens  = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convert = (num: number): string => {
    if (num === 0) return "";
    if (num < 20) return units[num] + " ";
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + units[num % 10] : "") + " ";
    if (num < 1000) return units[Math.floor(num / 100)] + " Hundred " + convert(num % 100);
    if (num < 100000) return convert(Math.floor(num / 1000)) + "Thousand " + convert(num % 1000);
    if (num < 10000000) return convert(Math.floor(num / 100000)) + "Lakh " + convert(num % 100000);
    return convert(Math.floor(num / 10000000)) + "Crore " + convert(num % 10000000);
  };

  const whole = Math.floor(n);
  const fils  = Math.round((n - whole) * 100);
  let result  = convert(whole).trim() + " Dirhams";
  if (fils > 0) result += " and " + convert(fils).trim() + " Fils";
  return result + " Only";
};

/** Get items from either field name */
export const getItems = (data: InvoiceData): InvoiceItem[] =>
  (data.invoice_items || data.items || []);

/** Format a date string to readable format */
export const fmtDate = (d?: string): string => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-AE", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return d; }
};
