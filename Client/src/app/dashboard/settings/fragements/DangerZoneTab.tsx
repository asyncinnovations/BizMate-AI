// app/settings/components/DangerZoneTab.tsx
import React from "react";
import { AlertTriangle, Download } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";

const DangerZoneTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* ── Danger Zone ─────────────────────────────────────── */}
      <SectionCard title="Danger Zone" icon={AlertTriangle}>
        <div className="space-y-3">
          {/* Warning banner */}
          <p className="text-sm text-text-secondary -mt-2 mb-2">
            These actions are permanent and cannot be undone. Please proceed
            with caution.
          </p>

          {/* Transfer Ownership */}
          <div className="p-4 bg-status-error-bg border border-status-error-border rounded-xl">
            <h3 className="text-sm font-semibold text-text-heading mb-1">
              Transfer Business Ownership
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              Transfer your business account to another team member. You will
              lose access to all data and settings.
            </p>
            <button className="px-4 py-2 border-2 border-status-error text-status-error rounded-lg hover:bg-status-error hover:text-on-brand transition-all text-sm font-semibold">
              Transfer Ownership
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-4 bg-status-error-bg border border-status-error-border rounded-xl">
            <h3 className="text-sm font-semibold text-text-heading mb-1">
              Delete Business Account
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              Permanently delete your business account, including all invoices,
              documents, and AI chat history. This action cannot be reversed.
            </p>
            <button className="px-4 py-2 bg-status-error text-on-brand rounded-lg hover:opacity-90 transition-all text-sm font-semibold">
              Delete Account
            </button>
          </div>

          {/* Before You Delete */}
          <div className="flex items-start gap-3 p-4 bg-status-warning-bg border border-status-warning-border rounded-xl">
            <div className="w-8 h-8 bg-status-warning-bg border border-status-warning-border rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-status-warning" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-heading mb-1.5">
                Before You Delete
              </h3>
              <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                <li>Download all invoices and documents you need</li>
                <li>Export your financial data and reports</li>
                <li>Cancel any active subscriptions</li>
                <li>Notify team members about the account closure</li>
              </ul>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Export Data ─────────────────────────────────────── */}
      <SectionCard title="Export Your Data" icon={Download}>
        <p className="text-sm text-text-secondary mb-4">
          Download a complete copy of your business data before making any
          permanent changes.
        </p>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-on-brand rounded-lg transition-all text-sm font-semibold shadow-card">
          <Download className="w-4 h-4" />
          Export All Data
        </button>
      </SectionCard>
    </div>
  );
};

export default DangerZoneTab;
