"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/templates/FreelancerTemplate.tsx
// Template 1 — Freelancer: Simple & Clean
// Coral/warm accent · personal name focus · minimal footer
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { InvoiceData, fmtAED, fmtDate, getItems, toWords } from "./invoiceHelpers";

interface Props {
  data: InvoiceData;
}

// Coral accent colour matching the reference design
const CORAL = "#e8533a";
const CORAL_LIGHT = "#fdf0ee";

export default function FreelancerTemplate({ data }: Props) {
  const items    = getItems(data);
  const totalAmt = Number(data.total) || 0;

  return (
    <div style={{ backgroundColor: "#f8f8f8", padding: "32px 20px", fontFamily: "Inter, sans-serif" }}>
      {/* A4 card */}
      <div style={{ maxWidth: 780, margin: "0 auto", backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 24px rgba(0,0,0,0.08)" }}>

        {/* Top coral bar */}
        <div style={{ height: 5, background: CORAL }} />

        <div style={{ padding: "36px 40px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            {/* Left — identity */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: CORAL, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                {(data.business_name || data.customer_name || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
                  {data.business_name || "Your Name"}
                </div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                  {data.business_email || ""}
                </div>
                {data.business_trn && (
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>TRN: {data.business_trn}</div>
                )}
              </div>
            </div>

            {/* Right — invoice label */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: CORAL, letterSpacing: -0.5 }}>INVOICE</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>#{data.invoice_number}</div>
              <div style={{ marginTop: 10, fontSize: 11, color: "#888", lineHeight: 1.7 }}>
                <div>Invoice Date: <strong style={{ color: "#333" }}>{fmtDate(data.invoice_date)}</strong></div>
                <div>Due Date: <strong style={{ color: "#333" }}>{fmtDate(data.due_date)}</strong></div>
                {data.payment_terms && <div>Terms: <strong style={{ color: "#333" }}>{data.payment_terms}</strong></div>}
              </div>
            </div>
          </div>

          {/* From / Bill To */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
            <div style={{ padding: "14px 16px", background: "#fafafa", borderRadius: 6, borderLeft: `3px solid ${CORAL}` }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: CORAL, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>From</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{data.business_name || "Your Business"}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {data.business_address || "Dubai, UAE"}
              </div>
              {data.business_phone && <div style={{ fontSize: 10, color: "#888", marginTop: 3 }}>{data.business_phone}</div>}
            </div>
            <div style={{ padding: "14px 16px", background: "#fafafa", borderRadius: 6, borderLeft: `3px solid #ddd` }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Bill To</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{data.customer_name}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-line" }}>{data.customer_address}</div>
              <div style={{ fontSize: 10, color: CORAL, marginTop: 3 }}>{data.customer_email}</div>
            </div>
          </div>

          {/* Items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 0 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${CORAL}` }}>
                <th style={{ padding: "8px 8px", textAlign: "left",  fontSize: 9, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", width: 28 }}>#</th>
                <th style={{ padding: "8px 8px", textAlign: "left",  fontSize: 9, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em" }}>Description</th>
                <th style={{ padding: "8px 8px", textAlign: "center",fontSize: 9, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", width: 50 }}>Qty</th>
                <th style={{ padding: "8px 8px", textAlign: "right", fontSize: 9, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", width: 90 }}>Rate (AED)</th>
                <th style={{ padding: "8px 8px", textAlign: "right", fontSize: 9, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", width: 90 }}>Amount (AED)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid #f0f0f0" }}>
                  <td style={{ padding: "11px 8px", fontSize: 10, color: CORAL, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                  <td style={{ padding: "11px 8px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: "11px 8px", textAlign: "center", fontSize: 11, color: "#555" }}>{item.quantity}</td>
                  <td style={{ padding: "11px 8px", textAlign: "right", fontSize: 11, color: "#555" }}>{fmtAED(item.price)}</td>
                  <td style={{ padding: "11px 8px", textAlign: "right", fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{fmtAED(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, marginBottom: 24 }}>
            <div style={{ width: 240 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", padding: "4px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <span>Subtotal</span><span>AED {fmtAED(data.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", padding: "4px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <span>Discount</span><span>AED 0.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", padding: "4px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <span>Total Before VAT</span><span>AED {fmtAED(data.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", padding: "4px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <span>VAT @ 5%</span><span>AED {fmtAED(data.vat)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: CORAL_LIGHT, border: `1px solid ${CORAL}`, borderRadius: 5, padding: "9px 12px", marginTop: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: CORAL }}>TOTAL DUE (AED)</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: CORAL }}>{fmtAED(totalAmt)}</span>
              </div>
            </div>
          </div>

          {/* Amount in words */}
          <div style={{ fontSize: 11, color: "#777", marginBottom: 24 }}>
            <span style={{ fontWeight: 600, color: CORAL }}>Amount in Words: </span>
            {toWords(totalAmt)}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "0.5px solid #eee", paddingTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: CORAL, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Payment Methods</div>
              <div style={{ fontSize: 10, color: "#666", lineHeight: 1.7 }}>Bank Transfer<br />Credit / Debit Card<br />PayNow / Tabby / Tamara</div>
            </div>
            {data.business_bank && (
              <div>
                <div style={{ fontSize: 9, fontWeight: 600, color: CORAL, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Bank Details</div>
                <div style={{ fontSize: 10, color: "#666", lineHeight: 1.7 }}>
                  {data.business_bank}<br />
                  {data.business_iban && <>IBAN: {data.business_iban}<br /></>}
                  {data.business_swift && <>SWIFT: {data.business_swift}</>}
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: CORAL, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Notes</div>
              <div style={{ fontSize: 10, color: "#999", lineHeight: 1.7 }}>
                {data.notes || "Please make payment within the due date. This is a computer generated invoice."}
              </div>
            </div>
          </div>

          {/* Thank you */}
          <div style={{ textAlign: "center", paddingTop: 14, borderTop: "0.5px solid #f0f0f0" }}>
            <div style={{ fontSize: 13, fontStyle: "italic", color: "#ccc" }}>Thank you for your business and trust.</div>
            {data.business_website && <div style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>{data.business_website}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
