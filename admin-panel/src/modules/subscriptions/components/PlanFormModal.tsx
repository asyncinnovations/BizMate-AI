"use client";

import React, { useState, useEffect } from "react";
import type { Plan, PlanTier, BillingCycle } from "@/modules/subscriptions/types";
import { cn } from "@/lib/cn";

interface PlanFormModalProps {
  open: boolean;
  plan?: Plan | null; // null = create new
  onClose: () => void;
  onSave: (data: Partial<Plan>) => void;
}

const EMPTY_FORM = {
  name: "",
  tier: "pro" as PlanTier,
  monthlyPrice: 0,
  annualPrice: 0,
  description: "",
  trialDays: 14,
  limits: {
    users: 10,
    aiCredits: 50000,
    documents: "unlimited" as number | "unlimited",
    businesses: 1,
    storage: "10 GB",
  },
};

export default function PlanFormModal({ open, plan, onClose, onSave }: PlanFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        name: plan.name,
        tier: plan.tier,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        description: plan.description,
        trialDays: plan.trialDays,
        limits: { ...plan.limits } as typeof EMPTY_FORM["limits"],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [plan, open]);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate API call
    onSave(form);
    setSaving(false);
    onClose();
  }

  if (!open) return null;

  const isEdit = !!plan;

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-raised)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    padding: "8px 12px",
    fontSize: "12.5px",
    fontFamily: "var(--font-body)",
    outline: "none",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    display: "block",
    marginBottom: "5px",
    fontFamily: "var(--font-body)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: "rgba(4,9,18,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {/* Slide-over panel */}
      <div
        className="ml-auto h-full w-full max-w-lg flex flex-col shadow-2xl overflow-hidden"
        style={{ background: "var(--bg-panel)", borderLeft: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2
              className="text-base font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {isEdit ? `Edit ${plan.name}` : "Create New Plan"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {isEdit ? "Update plan details and pricing." : "Configure and publish a new subscription plan."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Basic Info */}
          <div>
            <p
              className="text-xs font-semibold mb-3 uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Plan Details
            </p>
            <div className="space-y-3">
              <div>
                <label style={labelStyle}>Plan Name</label>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Pro, Enterprise, Custom"
                />
              </div>
              <div>
                <label style={labelStyle}>Tier</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.tier}
                  onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value as PlanTier }))}
                >
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: "72px" }}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief plan description shown to customers"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Pricing (USD)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Monthly Price</label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    style={{ ...inputStyle, paddingLeft: "20px" }}
                    value={form.monthlyPrice}
                    onChange={(e) => setForm((f) => ({ ...f, monthlyPrice: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Annual Price / mo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>$</span>
                  <input
                    type="number"
                    style={{ ...inputStyle, paddingLeft: "20px" }}
                    value={form.annualPrice}
                    onChange={(e) => setForm((f) => ({ ...f, annualPrice: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
            <p className="text-[10.5px] mt-1.5" style={{ color: "var(--text-muted)" }}>
              Annual price is billed as {form.annualPrice > 0 ? `$${form.annualPrice * 12}/year` : "—"}.
              {form.monthlyPrice > 0 && form.annualPrice > 0 &&
                ` Saves ${Math.round(((form.monthlyPrice - form.annualPrice) / form.monthlyPrice) * 100)}%.`}
            </p>
          </div>

          {/* Limits */}
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Plan Limits
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "users", label: "Max Users" },
                { key: "aiCredits", label: "AI Credits / mo" },
                { key: "trialDays", label: "Trial Days" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={key === "trialDays" ? form.trialDays : (form.limits as Record<string, number | string>)[key]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (key === "trialDays") {
                        setForm((f) => ({ ...f, trialDays: val }));
                      } else {
                        setForm((f) => ({
                          ...f,
                          limits: { ...f.limits, [key]: val },
                        }));
                      }
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Storage</label>
                <input
                  style={inputStyle}
                  value={form.limits.storage}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, limits: { ...f.limits, storage: e.target.value } }))
                  }
                  placeholder="e.g. 10 GB"
                />
              </div>
            </div>
          </div>

          {/* Discount info */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: "rgba(26,111,255,0.06)", border: "1px solid rgba(26,111,255,0.16)" }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
              <circle cx="10" cy="10" r="7.5" stroke="#1a6fff" strokeWidth="1.5" />
              <path d="M10 9v4M10 7v.5" stroke="#1a6fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[10.5px] leading-relaxed" style={{ color: "#6699ff" }}>
              Features and per-feature limits are configurable after saving. This form sets pricing, tier, and usage caps.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
              (saving || !form.name) && "opacity-60 cursor-not-allowed"
            )}
            style={{
              background: "linear-gradient(135deg,#1a6fff,#0f52cc)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              boxShadow: "0 4px 16px rgba(26,111,255,0.3)",
            }}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}