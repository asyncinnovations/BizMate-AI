"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/templates/StartupTemplate.tsx
// Template 2 — Startup: Modern & Minimal
// Green/teal accent · bold total block · clean data rows
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { InvoiceData, fmtAED, fmtDate, getItems, toWords } from "./invoiceHelpers";

interface Props {
  data: InvoiceData;
}

const GREEN = "#16a34a";
const GREEN_DARK = "#14532d";
const GREEN_LIGHT = "#f0fdf4";
const TEAL_HEADER = "#0d2b1e";

export default function StartupTemplate({ data }: Props) {
  const items    = getItems(data);
  const totalAmt = Number(data.total) || 0;

  return (
    <div style={{ backgroundColor: "#f4f4f5", padding: "32px 20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>

        {/* Green header bar */}
        <div style={{ background: TEAL_HEADER, padding: "28px 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>
                {data.business_name || "BizMate AI"}
              </div>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>
              {data.business_address || "Dubai, UAE"}
            </div>
            {data.business_trn && (
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                TRN: {data.business_trn}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: GREEN, textTransform: "uppercase", letterSpacing: "0.1em" }}>Invoice</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 2 }}>{data.invoice_number}</div>
            <div style={{ marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
              <div>Date: <span style={{ color: "rgba(255,255,255,0.8)" }}>{fmtDate(data.invoice_date)}</span></div>
              <div>Due: <span style={{ color: "rgba(255,255,255,0.8)" }}>{fmtDate(data.due_date)}</span></div>
            </div>
          </div>
        </div>

        {/* Total Due highlight block */}
        <div style={{ background: GREEN, padding: "14px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Due (AED)</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{fmtAED(totalAmt)}</div>
        </div>

        <div style={{ padding: "28px 36px" }}>

          {/* Bill To + Payment Terms */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "0.5px solid #f0f0f0" }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Bill To</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{data.customer_name}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 4, lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.customer_address}</div>
              <div style={{ fontSize: 10, color: GREEN, marginTop: 3 }}>{data.customer_email}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Payment Terms</div>
              <div style={{ fontSize: 11, lineHeight: 1.8, color: "#555" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "0.5px solid #f4f4f4", paddingBottom: 4, marginBottom: 4 }}>
                  <span>Payment Terms</span><strong style={{ color: "#111" }}>{data.payment_terms || "Net 15"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "0.5px solid #f4f4f4", paddingBottom: 4, marginBottom: 4 }}>
                  <span>Due Date</span><strong style={{ color: "#111" }}>{fmtDate(data.due_date)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Late Fee</span><strong style={{ color: "#111" }}>2% / month</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
            <thead>
              <tr style={{ background: "#f8fafb", borderTop: "0.5px solid #e8e8e8", borderBottom: "0.5px solid #e8e8e8" }}>
                <th style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.06em", width: 28 }}>#</th>
                <th style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</th>
                <th style={{ padding: "8px 10px", textAlign: "center", fontSize: 9, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.06em", width: 50 }}>Qty</th>
                <th style={{ padding: "8px 10px", textAlign: "right", fontSize: 9, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.06em", width: 100 }}>Unit Price (AED)</th>
                <th style={{ padding: "8px 10px", textAlign: "right", fontSize: 9, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.06em", width: 100 }}>Amount (AED)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid #f4f4f4" }}>
                  <td style={{ padding: "11px 10px", fontSize: 10, color: "#aaa" }}>{i + 1}</td>
                  <td style={{ padding: "11px 10px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: "11px 10px", textAlign: "center", fontSize: 11, color: "#555" }}>{item.quantity}</td>
                  <td style={{ padding: "11px 10px", textAlign: "right", fontSize: 11, color: "#555" }}>{fmtAED(item.price)}</td>
                  <td style={{ padding: "11px 10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#111" }}>{fmtAED(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals + Amount in words side by side */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Amount in Words</div>
              <div style={{ fontSize: 11, color: "#555", maxWidth: 320, lineHeight: 1.6 }}>{toWords(totalAmt)}</div>
            </div>
            <div style={{ width: 250 }}>
              {[["Subtotal", fmtAED(data.subtotal)], ["Discount", "0.00"], ["Total Before VAT", fmtAED(data.subtotal)], ["VAT @ 5%", fmtAED(data.vat)]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", padding: "3px 0", borderBottom: "0.5px solid #f4f4f4" }}>
                  <span>{l}</span><span>AED {v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: GREEN_LIGHT, border: `1px solid ${GREEN}`, borderRadius: 5, padding: "9px 12px", marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: GREEN_DARK }}>TOTAL DUE (AED)</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>{fmtAED(totalAmt)}</span>
              </div>
            </div>
          </div>

          {/* Footer 3-col */}
          <div style={{ borderTop: "0.5px solid #eee", paddingTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Payment Methods</div>
              <div style={{ fontSize: 10, color: "#777", lineHeight: 1.8 }}>Bank Transfer<br />Credit / Debit Card<br />Tabby / Tamara</div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Bank Details</div>
              <div style={{ fontSize: 10, color: "#777", lineHeight: 1.8 }}>
                {data.business_bank || "Emirates NBD"}<br />
                {data.business_iban && <>{data.business_iban}<br /></>}
                {data.business_swift && <>SWIFT: {data.business_swift}</>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Notes</div>
              <div style={{ fontSize: 10, color: "#999", lineHeight: 1.7 }}>
                {data.notes || "Please make payment within the due date. This is a computer generated invoice and does not require a signature."}
              </div>
            </div>
          </div>

          {/* Bottom contact bar */}
          <div style={{ marginTop: 20, borderTop: "0.5px solid #f0f0f0", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: "#aaa" }}>{data.business_phone || ""}</div>
            <div style={{ fontSize: 11, fontStyle: "italic", color: "#ccc" }}>Let's build the future together.</div>
            <div style={{ fontSize: 10, color: "#aaa" }}>{data.business_website || ""}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
