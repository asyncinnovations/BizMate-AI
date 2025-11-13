import React from "react";
import { MessageSquare, Instagram, Plus } from "lucide-react";

const SocialAccounts = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
      <h3 className="text-lg font-bold text-[#1B2A49] mb-4">
        Connected Accounts
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-green-600" />
            <div>
              <div className="text-sm font-semibold text-[#1B2A49]">
                WhatsApp Business
              </div>
              <div className="text-xs text-[#344767]">+971 50 123 4567</div>
            </div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
          <div className="flex items-center gap-3">
            <Instagram size={20} className="text-pink-600" />
            <div>
              <div className="text-sm font-semibold text-[#1B2A49]">
                Instagram Business
              </div>
              <div className="text-xs text-[#344767]">@yourbusiness</div>
            </div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      <button className="w-full mt-4 border-2 border-[#2E69A4] text-[#2E69A4] px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
        <Plus size={16} />
        Add Account
      </button>
    </div>
  );
};

export default SocialAccounts;
