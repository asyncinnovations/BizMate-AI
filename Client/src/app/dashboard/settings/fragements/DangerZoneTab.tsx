// app/settings/components/DangerZoneTab.tsx
import React from "react";
import { AlertTriangle, Download } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";

const DangerZoneTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Danger Zone
            </h2>
            <p className="text-[#344767]">
              These actions are permanent and cannot be undone. Please proceed
              with caution.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[#1B2A49] mb-1">
                  Transfer Business Ownership
                </h3>
                <p className="text-sm text-[#344767] mb-3">
                  Transfer your business account to another team member. You
                  will lose access to all data and settings.
                </p>
                <button className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-medium">
                  Transfer Ownership
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[#1B2A49] mb-1">
                  Delete Business Account
                </h3>
                <p className="text-sm text-[#344767] mb-3">
                  Permanently delete your business account, including all
                  invoices, documents, and AI chat history. This action cannot
                  be reversed.
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#1B2A49] mb-1">
                  Before You Delete
                </h3>
                <ul className="text-sm text-[#344767] space-y-1 list-disc list-inside">
                  <li>Download all invoices and documents you need</li>
                  <li>Export your financial data and reports</li>
                  <li>Cancel any active subscriptions</li>
                  <li>Notify team members about the account closure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionCard title="Export Your Data" icon={Download}>
        <p className="text-[#344767] mb-4">
          Download a complete copy of your business data before making any
          permanent changes.
        </p>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors font-medium">
          <Download className="w-4 h-4" />
          Export All Data
        </button>
      </SectionCard>
    </div>
  );
};

export default DangerZoneTab;
