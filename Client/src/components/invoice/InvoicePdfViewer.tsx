"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/InvoicePdfViewer.tsx  — FULL REPLACEMENT
//
// Routes to the correct template based on data.template field.
// Default is "corporate" (most complete, UAE-standard).
// Download button triggers window.print() — browser saves as PDF.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import FreelancerTemplate from "./templates/FreelancerTemplate";
import StartupTemplate    from "./templates/StartupTemplate";
import SMETemplate        from "./templates/SMETemplate";
import CorporateTemplate  from "./templates/CorporateTemplate";
import { InvoiceData }    from "./templates/invoiceHelpers";
import { Download, Printer } from "lucide-react";

interface Props {
  data: any;
  paymentLink?: string;
}

export default function InvoicePdfViewer({ data }: Props) {
  const template = data?.template ?? "corporate";

  const handleDownload = () => window.print();

  const renderTemplate = () => {
    switch (template) {
      case "freelancer": return <FreelancerTemplate data={data as InvoiceData} />;
      case "startup":    return <StartupTemplate    data={data as InvoiceData} />;
      case "sme":        return <SMETemplate        data={data as InvoiceData} />;
      case "corporate":
      default:           return <CorporateTemplate  data={data as InvoiceData} />;
    }
  };

  return (
    <div>
      {/* Action buttons — hidden on print */}
      <div
        className="print:hidden flex items-center gap-3 mb-4"
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}
      >
        <button
          onClick={handleDownload}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            6,
            padding:        "9px 20px",
            background:     "#1e293b",
            color:          "#fff",
            border:         "none",
            borderRadius:   8,
            fontSize:       13,
            fontWeight:     600,
            cursor:         "pointer",
          }}
        >
          <Download size={15} />
          Download PDF
        </button>
        <button
          onClick={() => window.print()}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            6,
            padding:        "9px 16px",
            background:     "transparent",
            color:          "#64748b",
            border:         "0.5px solid #e2e8f0",
            borderRadius:   8,
            fontSize:       13,
            fontWeight:     500,
            cursor:         "pointer",
          }}
        >
          <Printer size={15} />
          Print
        </button>
      </div>

      {/* Invoice render */}
      <div id="invoice-print-area">
        {renderTemplate()}
      </div>

      {/* Print-only CSS — hides everything except the invoice */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print-area, #invoice-print-area * { visibility: visible; }
          #invoice-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          @page { margin: 0; size: A4; }
        }
      `}</style>
    </div>
  );
}
