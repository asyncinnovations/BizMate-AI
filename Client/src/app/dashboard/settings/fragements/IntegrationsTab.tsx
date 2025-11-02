// app/settings/components/IntegrationsTab.tsx
import React from "react";
import { Plug, Wallet, Calendar, MessageSquare, Instagram } from "lucide-react";
import SectionCard from "@/app/components/section-card/SectionCard";

const IntegrationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <SectionCard title="Business Platforms" icon={Plug}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-[#1B2A49]">WhatsApp Business</p>
                <p className="text-sm text-[#344767]">Connect for automated customer replies</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors text-sm">
              Connect
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors">
            <div className="flex items-center gap-3">
              <Instagram className="w-6 h-6 text-pink-600" />
              <div>
                <p className="font-medium text-[#1B2A49]">Instagram Business</p>
                <p className="text-sm text-[#344767]">Sync your Instagram business account</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors text-sm">
              Connect
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Payment Gateways" icon={Wallet}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">Stripe</p>
                <p className="text-sm text-[#344767]">Accept online payments</p>
              </div>
            </div>
            <span className="text-sm text-[#2E69A4] font-medium">Connected</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">PayPal</p>
                <p className="text-sm text-[#344767]">Accept PayPal payments</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors text-sm">
              Connect
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Calendar Sync" icon={Calendar}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">Google Calendar</p>
                <p className="text-sm text-[#344767]">Sync reminders with Google Calendar</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors text-sm">
              Connect
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">Outlook</p>
                <p className="text-sm text-[#344767]">Sync with Microsoft Outlook</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors text-sm">
              Connect
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default IntegrationsTab;