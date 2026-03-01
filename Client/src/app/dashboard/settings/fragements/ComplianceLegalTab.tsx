// app/settings/components/ComplianceLegalTab.tsx
import React from "react";
import { FileText, Check, ChevronRight } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";

const ComplianceLegalTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* ── Regional Compliance ─────────────────────────────── */}
      <SectionCard title="Regional Compliance" icon={FileText}>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
              Business Region
            </label>
            <select className="w-full px-3 py-2.5 bg-bg-base border border-border rounded-lg text-sm text-text-heading focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all">
              <option value="uae">United Arab Emirates (UAE)</option>
              <option value="saudi">Saudi Arabia</option>
              <option value="qatar">Qatar</option>
              <option value="kuwait">Kuwait</option>
              <option value="bahrain">Bahrain</option>
              <option value="oman">Oman</option>
            </select>
            <p className="text-xs text-text-muted mt-2">
              This setting determines which compliance rules and reminders apply
              to your business
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
              Compliance Framework
            </label>
            <select className="w-full px-3 py-2.5 bg-bg-base border border-border rounded-lg text-sm text-text-heading focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all">
              <option value="mainland">UAE Mainland</option>
              <option value="freezone">Free Zone</option>
              <option value="offshore">Offshore</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* ── Legal Documents ─────────────────────────────────── */}
      <SectionCard title="Legal Documents" icon={FileText}>
        <div className="space-y-2">
          {[
            { label: "Privacy Policy", date: "Oct 1, 2024" },
            { label: "Terms of Service", date: "Oct 1, 2024" },
            { label: "Data Processing Agreement", date: "Oct 1, 2024" },
          ].map((doc) => (
            <button
              key={doc.label}
              className="flex items-center justify-between w-full p-4 bg-bg-base border border-border rounded-xl hover:border-border-strong hover:bg-surface hover:shadow-card transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-light rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-heading">
                    {doc.label}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Last updated: {doc.date}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-heading transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── Compliance Updates ──────────────────────────────── */}
      <SectionCard title="Compliance Updates" icon={Check}>
        <div className="flex items-start gap-3 p-4 bg-status-success-bg border border-status-success-border rounded-xl">
          <div className="w-8 h-8 bg-status-success-bg border border-status-success-border rounded-lg flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-status-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-status-success">
              Your compliance is up to date
            </p>
            <p className="text-xs text-text-secondary mt-1">
              All regulations and reminders are current for UAE businesses
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default ComplianceLegalTab;
