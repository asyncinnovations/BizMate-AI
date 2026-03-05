import React from "react";
import { FileText } from "lucide-react";

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface Invoice {
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  invoice_items: InvoiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
}

interface InvoicePreviewCardProps {
  invoice: Invoice;
}

const InvoicePreviewCard: React.FC<InvoicePreviewCardProps> = ({ invoice }) => {
  return (
    <div className="bg-surface rounded-lg shadow-card border border-border overflow-hidden">
      <div className="p-8">
        <div className="max-w-4xl mx-auto bg-surface p-8 border border-border rounded-lg">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-border">
            <div>
              <div className="text-2xl font-bold text-text-heading mb-1">
                Business Solutions Inc.
              </div>
              <div className="text-text-secondary text-sm">
                Professional Services & Consulting
              </div>
              <div className="text-text-secondary text-sm mt-2">
                Dubai Internet City, Dubai, UAE
              </div>
              <div className="text-text-secondary text-sm">
                Tel: +971 4 123 4567
              </div>
              <div className="text-text-secondary text-sm">
                VAT No: 123456789012345
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-text-heading mb-3">
                INVOICE
              </h1>
              <div className="space-y-1 text-sm text-text-secondary">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">Invoice #:</span>
                  <span>{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">Date:</span>
                  <span>
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">Due Date:</span>
                  <span className="font-semibold text-text-heading">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">Terms:</span>
                  <span>{invoice.payment_terms}</span>
                </div>
              </div>
            </div>
          </div>

          {/* From/To Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-text-heading mb-3 text-xs uppercase tracking-widest">
                From
              </h3>
              <div className="text-text-heading font-semibold">
                Business Solutions Inc.
              </div>
              <div className="text-text-secondary">Dubai Internet City</div>
              <div className="text-text-secondary">
                Dubai, United Arab Emirates
              </div>
              <div className="text-text-secondary mt-2">
                Email: accounting@businesssolutions.ae
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text-heading mb-3 text-xs uppercase tracking-widest">
                Bill To
              </h3>
              <div className="text-text-heading font-semibold">
                {invoice.customer_name}
              </div>
              {invoice.customer_address && (
                <div className="text-text-secondary">
                  {invoice.customer_address}
                </div>
              )}
              {invoice.customer_email && (
                <div className="text-text-secondary">
                  {invoice.customer_email}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-base">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-heading uppercase tracking-wider border-b border-border w-2/5">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-heading uppercase tracking-wider border-b border-border w-1/6">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-heading uppercase tracking-wider border-b border-border w-1/6">
                    Unit Price (AED)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-heading uppercase tracking-wider border-b border-border w-1/6">
                    Amount (AED)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {invoice.invoice_items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-heading">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-sm text-text-muted mt-1 max-w-xs break-words">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary text-right">
                      {item.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-heading text-right">
                      {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="bg-bg-base p-6 rounded-lg border border-border">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-2 text-sm text-text-secondary">
                        Subtotal:
                      </td>
                      <td className="py-2 text-sm font-semibold text-text-heading text-right">
                        AED {invoice.subtotal.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-text-secondary">
                        VAT (5%):
                      </td>
                      <td className="py-2 text-sm font-semibold text-text-heading text-right">
                        AED {invoice.vat.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="py-3 font-bold text-text-heading">
                        Total Due:
                      </td>
                      <td className="py-3 font-bold text-lg text-text-heading text-right">
                        AED {invoice.total.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-semibold text-text-heading mb-3">
              Payment Instructions
            </h3>
            <div className="text-text-secondary text-sm leading-relaxed">
              <p className="mb-2">
                <strong>Bank Transfer:</strong>
                <br />
                Bank: Emirates NBD
                <br />
                Account Name: Business Solutions Inc.
                <br />
                Account Number: 012345678901
                <br />
                IBAN: AE070331234567890123456
              </p>
              <p>
                Please include invoice number {invoice.invoice_number} with your
                payment.
              </p>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-text-heading mb-3">Notes</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-text-muted">
              Thank you for your business. For questions regarding this invoice,
              <br />
              please contact our accounting department at
              accounting@businesssolutions.ae
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewCard;
