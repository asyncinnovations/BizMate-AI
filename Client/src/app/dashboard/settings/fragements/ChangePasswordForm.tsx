// app/settings/components/ChangePasswordForm.tsx
"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import SectionCard from "@/app/components/section-card/SectionCard";

const ChangePasswordForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SectionCard title="Change Password" icon={Lock}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#344767] mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]"
                placeholder="Enter current password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344767]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344767] mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#344767] mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div>
          <button className="mt-2 px-6 py-3 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors font-medium">
            Update Password
          </button>
        </div>
      </div>
    </SectionCard>
  );
};

export default ChangePasswordForm;
