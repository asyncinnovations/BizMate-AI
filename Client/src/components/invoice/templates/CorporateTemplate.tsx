"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/templates/CorporateTemplate.tsx
// Template 4 — Corporate UAE: Premium & Formal
// Gold accent · navy header · DIFC/prestige feel · T&C block
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { InvoiceData, fmtAED, fmtDate, getItems, toWords } from "./invoiceHelpers";

interface Props {
  data: InvoiceData;
}

const GOLD      = "#c9973a";
const GOLD_DARK = "#92400e";
const GOLD_LIGHT = "#fffbeb";
const NAVY      = "#0f1e38";

export default function CorporateTemplate({ data }: Props) {
  const items    = getItems(data);
  const totalAmt = Number(data.total) || 0;

  return (
    <div style={{ backgroundColor: "#eff2f6", padding: "32px 20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 28px rgba(0,0,0,0.1)" }}>

        {/* Gold top bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD} 0%, #e8c073 100%)` }} />

        {/* Header */}
        <div style={{ background: "#f9f5ef", padding: "26px 36px 22px", borderBottom: `2px solid ${GOLD}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {/* Gold shield mark */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, background: NAVY, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 16, height: 16, borderRadius: 2, border: `2px solid ${GOLD}` }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, letterSpacing: -0.3 }}>
                  {data.business_name || "Emirates Corporate Group"}
                </div>
                <div style={{ fontSize: 9, color: GOLD, textTransform: "uppercase", letterSpacing: "0.09em", marginTop: 1 }}>
                  {data.business_address?.split("\n")[0] || "DIFC, Dubai, UAE"}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#888", lineHeight: 1.7 }}>
              {data.business_address && <div>{data.business_address}</div>}
              {data.business_trn && <div>VAT No: {data.business_trn}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.12em" }}>Tax Invoice</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginTop: 3 }}>{data.invoice_number}</div>
            <div style={{ marginTop: 10, fontSize: 10, color: "#777", lineHeight: 1.8 }}>
              <div>Invoice Date: <strong style={{ color: NAVY }}>{fmtDate(data.invoice_date)}</strong></div>
              <div>Due Date: <strong style={{ color: NAVY }}>{fmtDate(data.due_date)}</strong></div>
              <div>PO Number: <strong style={{ color: NAVY }}>—</strong></div>
              <div>Payment Terms: <strong style={{ color: NAVY }}>{data.payment_terms || "Net 30"}</strong></div>
            </div>
          </div>
        </div>

        {/* Gold amount bar */}
        <div style={{ background: NAVY, padding: "12px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Amount Due</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, marginTop: 1 }}>AED {fmtAED(totalAmt)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>Payment Status</div>
            <div style={{ display: "inline-block", border: `0.5px solid ${GOLD}`, color: GOLD, fontSize: 9, fontWeight: 600, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Awaiting Payment
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 36px" }}>

          {/* Bill from / to */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
            {[
              { label: "Service Provider", name: data.business_name || "Emirates Corporate Group", addr: data.business_address, email: data.business_email, trn: data.business_trn },
              { label: "Invoice To", name: data.customer_name, addr: data.customer_address, email: data.customer_email },
            ].map((b) => (
              <div key={b.label} style={{ padding: "12px 14px", borderLeft: `3px solid ${GOLD}`, background: "#fdfaf5" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: GOLD_DARK, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{b.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{b.name}</div>
                <div style={{ fontSize: 10, color: "#777", marginTop: 3, lineHeight: 1.6, whiteSpace: "pre-line" }}>{b.addr}</div>
                {b.email && <div style={{ fontSize: 10, color: GOLD, marginTop: 2 }}>{b.email}</div>}
                {b.trn && <div style={{ fontSize: 9, color: "#aaa", marginTop: 2 }}>VAT No: {b.trn}</div>}
              </div>
            ))}
          </div>

          {/* Items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${GOLD}` }}>
                {["#", "Professional Service", "Qty", "Unit Price (AED)", "Amount (AED)"].map((h, i) => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: i === 0 || i === 1 ? "left" : "right", fontSize: 9, fontWeight: 600, color: GOLD_DARK, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid #f5ede0" }}>
                  <td style={{ padding: "11px 10px", fontSize: 10, fontWeight: 600, color: GOLD }}>{String(i + 1).padStart(2, "0")}</td>
                  <td style={{ padding: "11px 10px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: "11px 10px", textAlign: "right", fontSize: 11, color: "#777" }}>{item.quantity}</td>
                  <td style={{ padding: "11px 10px", textAlign: "right", fontSize: 11, color: "#777" }}>{fmtAED(item.price)}</td>
                  <td style={{ padding: "11px 10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: NAVY }}>{fmtAED(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals + amount in words */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: GOLD_DARK, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Amount in Words</div>
              <div style={{ fontSize: 11, color: "#666", maxWidth: 320, lineHeight: 1.6 }}>{toWords(totalAmt)}</div>
            </div>
            <div style={{ width: 250 }}>
              {[["Subtotal", fmtAED(data.subtotal)], ["Discount", "0.00"], ["Total Before VAT", fmtAED(data.subtotal)], ["VAT @ 5%", fmtAED(data.vat)]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", padding: "3px 0", borderBottom: "0.5px solid #f5ede0" }}>
                  <span>{l}</span><span>AED {v}</span>
                </div>
              ))}
              <div style={{ background: GOLD_LIGHT, border: `1.5px solid ${GOLD}`, borderRadius: 5, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: GOLD_DARK }}>TOTAL DUE (AED)</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>{fmtAED(totalAmt)}</span>
              </div>
              <div style={{ fontSize: 9, color: "#aaa", marginTop: 5, textAlign: "right" }}>
                This invoice includes VAT at 5% per UAE FTA requirements
              </div>
            </div>
          </div>

          {/* Footer 3-col */}
          <div style={{ borderTop: "0.5px solid #e8dfd0", paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: GOLD_DARK, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Payment Methods</div>
              <div style={{ fontSize: 10, color: "#777", lineHeight: 1.8 }}>Bank Transfer<br />Credit Card (Online)<br />Corporate Cheque</div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: GOLD_DARK, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Bank Details</div>
              <div style={{ fontSize: 10, color: "#777", lineHeight: 1.8 }}>
                <strong>{data.business_bank || "Emirates NBD"}</strong><br />
                {data.business_iban && <>IBAN: {data.business_iban}<br /></>}
                {data.business_swift && <>SWIFT: {data.business_swift}</>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: GOLD_DARK, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Terms & Conditions</div>
              <div style={{ fontSize: 10, color: "#999", lineHeight: 1.7 }}>
                Payment is due within {data.payment_terms || "30"} days. Late payments are subject to 2% monthly charges. This invoice is valid without signature.
              </div>
            </div>
          </div>

          {/* Navy contact footer */}
          <div style={{ background: NAVY, borderRadius: 5, marginTop: 18, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{data.business_phone || "+971 4 XXX XXXX"}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{data.business_email || "finance@yourbusiness.ae"}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{data.business_website || "www.yourbusiness.ae"}</div>
          </div>

          {/* Thank you */}
          <div style={{ textAlign: "center", paddingTop: 14, marginTop: 4 }}>
            <div style={{ fontSize: 12, fontStyle: "italic", color: "#d4a855" }}>Thank You! We appreciate your business.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
