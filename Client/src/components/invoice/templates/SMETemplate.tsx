"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/templates/SMETemplate.tsx
// Template 3 — SME: Professional & Structured
// Navy table header · full bank details · discount column · procurement-ready
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { InvoiceData, fmtAED, fmtDate, getItems, toWords } from "./invoiceHelpers";

interface Props {
  data: InvoiceData;
}

const NAVY   = "#0f2a4a";
const BLUE   = "#1d6ab5";
const BLUE_L = "#edf4fd";

export default function SMETemplate({ data }: Props) {
  const items    = getItems(data);
  const totalAmt = Number(data.total) || 0;

  return (
    <div style={{ backgroundColor: "#f0f4f8", padding: "32px 20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>

        {/* Header */}
        <div style={{ padding: "28px 36px 22px", borderBottom: `3px solid ${NAVY}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, letterSpacing: -0.5 }}>
              {data.business_name || "Al Hilal Business Services"}
            </div>
            <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>
              {data.business_address || "Dubai, UAE"}
            </div>
            {data.business_trn && (
              <div style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>TRN: {data.business_trn}</div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tax Invoice</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: BLUE, marginTop: 4 }}>{data.invoice_number}</div>
            <div style={{ fontSize: 10, color: "#777", lineHeight: 1.8, marginTop: 6 }}>
              <div>Invoice Date: <strong style={{ color: NAVY }}>{fmtDate(data.invoice_date)}</strong></div>
              <div>Due Date: <strong style={{ color: NAVY }}>{fmtDate(data.due_date)}</strong></div>
              <div>Payment Terms: <strong style={{ color: NAVY }}>{data.payment_terms || "Net 30"}</strong></div>
            </div>
          </div>
        </div>

        {/* Navy data band */}
        <div style={{ background: NAVY, padding: "10px 36px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {[
            ["Client", data.customer_name],
            ["Currency", "AED"],
            ["Terms", data.payment_terms || "Net 30"],
            ["Status", "Unpaid"],
          ].map(([label, val]) => (
            <div key={label} style={{ paddingRight: 12 }}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "24px 36px" }}>

          {/* Bill from / to */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
            {[
              { label: "From", name: data.business_name || "Your Company", addr: data.business_address, email: data.business_email, extra: data.business_trn ? `TRN: ${data.business_trn}` : "" },
              { label: "Bill To", name: data.customer_name, addr: data.customer_address, email: data.customer_email },
            ].map((b) => (
              <div key={b.label} style={{ padding: "12px 14px", border: "0.5px solid #e5e9ef", borderRadius: 5 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: BLUE, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "0.5px solid #f0f4f8", paddingBottom: 5, marginBottom: 7 }}>{b.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{b.name}</div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 3, lineHeight: 1.6, whiteSpace: "pre-line" }}>{b.addr}</div>
                {b.email && <div style={{ fontSize: 10, color: BLUE, marginTop: 2 }}>{b.email}</div>}
                {b.extra && <div style={{ fontSize: 9, color: "#999", marginTop: 2 }}>{b.extra}</div>}
              </div>
            ))}
          </div>

          {/* Items table — includes Discount column */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
            <thead>
              <tr style={{ background: NAVY }}>
                {["#", "Description", "Qty", "Unit Price (AED)", "Discount", "VAT 5%", "Amount (AED)"].map((h, i) => (
                  <th key={h} style={{ padding: "8px 9px", textAlign: i === 0 ? "left" : i < 2 ? "left" : "right", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const vat_per_item = Number((Number(item.amount) * 0.05).toFixed(2));
                const total_item   = Number(item.amount) + vat_per_item;
                return (
                  <tr key={i} style={{ borderBottom: "0.5px solid #f0f4f8", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <td style={{ padding: "10px 9px", fontSize: 10, color: "#aaa" }}>{i + 1}</td>
                    <td style={{ padding: "10px 9px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: NAVY }}>{item.name}</div>
                      {item.description && <div style={{ fontSize: 9, color: "#999", marginTop: 1 }}>{item.description}</div>}
                    </td>
                    <td style={{ padding: "10px 9px", textAlign: "right", fontSize: 11, color: "#555" }}>{item.quantity}</td>
                    <td style={{ padding: "10px 9px", textAlign: "right", fontSize: 11, color: "#555" }}>{fmtAED(item.price)}</td>
                    <td style={{ padding: "10px 9px", textAlign: "right", fontSize: 11, color: "#555" }}>0.00</td>
                    <td style={{ padding: "10px 9px", textAlign: "right", fontSize: 11, color: "#555" }}>{fmtAED(vat_per_item)}</td>
                    <td style={{ padding: "10px 9px", textAlign: "right", fontSize: 12, fontWeight: 700, color: NAVY }}>{fmtAED(total_item)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Amount in words + totals */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: 22 }}>
            <div style={{ maxWidth: 320 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Amount in Words</div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>{toWords(totalAmt)}</div>
            </div>
            <div style={{ width: 250 }}>
              {[["Subtotal", fmtAED(data.subtotal)], ["Discount", "0.00"], ["Total Before VAT", fmtAED(data.subtotal)], ["VAT @ 5%", fmtAED(data.vat)]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#777", padding: "3px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                  <span>{l}</span><span>AED {v}</span>
                </div>
              ))}
              <div style={{ background: BLUE_L, border: `1.5px solid ${BLUE}`, borderRadius: 5, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>TOTAL DUE (AED)</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: BLUE }}>{fmtAED(totalAmt)}</span>
              </div>
            </div>
          </div>

          {/* Bank details + notes footer */}
          <div style={{ borderTop: "0.5px solid #eaeef2", paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Bank Details</div>
              <div style={{ fontSize: 10, color: "#666", lineHeight: 1.8 }}>
                <div><strong>{data.business_bank || "Emirates NBD"}</strong></div>
                {data.business_iban && <div>IBAN: {data.business_iban}</div>}
                {data.business_swift && <div>SWIFT: {data.business_swift}</div>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Payment Terms</div>
              <div style={{ fontSize: 10, color: "#777", lineHeight: 1.8 }}>
                {data.payment_terms || "Net 30"} days from invoice date.<br />
                Late payment: 2% per month.<br />
                Please quote invoice number.
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Notes</div>
              <div style={{ fontSize: 10, color: "#999", lineHeight: 1.7 }}>
                {data.notes || "Please make payment within the due date. Goods once sold will not be taken back. This is a computer generated invoice."}
              </div>
            </div>
          </div>

          {/* Contact bar */}
          <div style={{ background: NAVY, borderRadius: 5, marginTop: 18, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{data.business_phone || "+971 4 XXX XXXX"}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{data.business_email || "accounts@yourbusiness.ae"}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{data.business_website || "www.yourbusiness.ae"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
