// app/settings/components/ComplianceLegalTab.tsx
import React from "react";
import { FileText, Check, ChevronRight } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";

const ComplianceLegalTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <SectionCard title="Regional Compliance" icon={FileText}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#344767] mb-2">
              Business Region
            </label>
            <select className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]">
              <option value="uae">United Arab Emirates (UAE)</option>
              <option value="saudi">Saudi Arabia</option>
              <option value="qatar">Qatar</option>
              <option value="kuwait">Kuwait</option>
              <option value="bahrain">Bahrain</option>
              <option value="oman">Oman</option>
            </select>
            <p className="text-sm text-[#344767] mt-2">
              This setting determines which compliance rules and reminders apply
              to your business
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#344767] mb-2">
              Compliance Framework
            </label>
            <select className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]">
              <option value="mainland">UAE Mainland</option>
              <option value="freezone">Free Zone</option>
              <option value="offshore">Offshore</option>
            </select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Legal Documents" icon={FileText}>
        <div className="space-y-3">
          <button className="flex items-center justify-between w-full p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors text-left group">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">Privacy Policy</p>
                <p className="text-sm text-[#344767]">
                  Last updated: Oct 1, 2024
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#344767] group-hover:text-[#1B2A49]" />
          </button>
          <button className="flex items-center justify-between w-full p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors text-left group">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">Terms of Service</p>
                <p className="text-sm text-[#344767]">
                  Last updated: Oct 1, 2024
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#344767] group-hover:text-[#1B2A49]" />
          </button>
          <button className="flex items-center justify-between w-full p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors text-left group">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">
                  Data Processing Agreement
                </p>
                <p className="text-sm text-[#344767]">
                  Last updated: Oct 1, 2024
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#344767] group-hover:text-[#1B2A49]" />
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Compliance Updates" icon={Check}>
        <div className="space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">
                  Your compliance is up to date
                </p>
                <p className="text-sm text-green-700 mt-1">
                  All regulations and reminders are current for UAE businesses
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default ComplianceLegalTab;
