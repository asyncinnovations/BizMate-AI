"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/components/invoice/InvoiceTemplatePicker.tsx
// Shown in the invoice create form sidebar (or settings).
// User picks their default template once — stored in their profile.
// NOT shown as a prerequisite to creating an invoice.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Check } from "lucide-react";

type TemplateId = "freelancer" | "startup" | "sme" | "corporate";

interface TemplateOption {
  id:          TemplateId;
  label:       string;
  badge:       string;
  description: string;
  accent:      string;
  accentBg:    string;
  bestFor:     string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id:          "freelancer",
    label:       "Freelancer",
    badge:       "Simple & Clean",
    description: "Minimal layout with personal branding. Warm coral accent.",
    accent:      "#e8533a",
    accentBg:    "#fdf0ee",
    bestFor:     "Designers, consultants, solo professionals",
  },
  {
    id:          "startup",
    label:       "Startup",
    badge:       "Modern & Minimal",
    description: "Bold green header, clean data rows, payment link footer.",
    accent:      "#16a34a",
    accentBg:    "#f0fdf4",
    bestFor:     "Tech companies, SaaS, digital agencies",
  },
  {
    id:          "sme",
    label:       "SME",
    badge:       "Professional & Structured",
    description: "Navy table header, discount column, full bank details.",
    accent:      "#1d6ab5",
    accentBg:    "#edf4fd",
    bestFor:     "Trading, manufacturing, supply chain, B2B",
  },
  {
    id:          "corporate",
    label:       "Corporate UAE",
    badge:       "Premium & Formal",
    description: "Gold accent, navy header, T&C block. UAE prestige feel.",
    accent:      "#c9973a",
    accentBg:    "#fffbeb",
    bestFor:     "Law firms, consulting, real estate, finance",
  },
];

interface Props {
  selected:  TemplateId;
  onChange:  (t: TemplateId) => void;
  compact?:  boolean;
}

export default function InvoiceTemplatePicker({ selected, onChange, compact = false }: Props) {
  return (
    <div>
      {!compact && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
            Choose a default design for your invoices. You can change this anytime from settings.
          </p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {TEMPLATES.map((t) => {
          const isSelected = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{
                width:          "100%",
                textAlign:      "left",
                padding:        compact ? "10px 12px" : "12px 14px",
                border:         isSelected ? `2px solid ${t.accent}` : "0.5px solid #e2e8f0",
                borderRadius:   8,
                background:     isSelected ? t.accentBg : "#fff",
                cursor:         "pointer",
                transition:     "all 0.15s",
                position:       "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.accent, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? t.accent : "#0f172a" }}>
                      {t.label}
                    </span>
                    <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 20, background: isSelected ? t.accent : "#f1f5f9", color: isSelected ? "#fff" : "#64748b", fontWeight: 500 }}>
                      {t.badge}
                    </span>
                  </div>
                  {!compact && (
                    <>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>{t.description}</div>
                      <div style={{ fontSize: 9, color: "#94a3b8" }}>Best for: {t.bestFor}</div>
                    </>
                  )}
                </div>
                {isSelected && (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={10} color="#fff" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
