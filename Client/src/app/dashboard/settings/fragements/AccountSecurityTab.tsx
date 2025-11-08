// app/settings/components/AccountSecurityTab.tsx
"use client";

import React, { useState } from "react";
import {
  Lock,
  Shield,
  Smartphone,
  Mail,
  Chrome,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import SectionCard from "@/app/components/section-card/SectionCard";
import ToggleSwitch from "@/app/components/ui/ToggleSwitch";
import ChangePasswordForm from "./ChangePasswordForm";

const AccountSecurityTab: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <ChangePasswordForm />

      <SectionCard title="Two-Factor Authentication" icon={Shield}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium text-[#1B2A49]">Enable 2FA</p>
            <p className="text-sm text-[#344767]">
              Add an extra layer of security to your account
            </p>
          </div>
          <ToggleSwitch
            enabled={twoFactorEnabled}
            onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
          />
        </div>
        {twoFactorEnabled && (
          <div className="mt-4 p-4 bg-[#F4F7FA] rounded-lg">
            <p className="text-sm text-[#344767] mb-3">
              Scan this QR code with your authenticator app
            </p>
            <div className="w-48 h-48 bg-white border-2 border-[#E1E8F5] rounded-lg flex items-center justify-center">
              <p className="text-[#344767]">QR Code Placeholder</p>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Login Methods" icon={Smartphone}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">Email</p>
                <p className="text-sm text-[#344767]">
                  ahmed.hassan@business.ae
                </p>
              </div>
            </div>
            <span className="text-sm text-[#2E69A4] font-medium">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg">
            <div className="flex items-center gap-3">
              <Chrome className="w-5 h-5 text-[#2E69A4]" />
              <div>
                <p className="font-medium text-[#1B2A49]">Google</p>
                <p className="text-sm text-[#344767]">Sign in with Google</p>
              </div>
            </div>
            <button className="text-sm text-[#2E69A4] font-medium hover:underline">
              Connect
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Active Sessions" icon={Globe}>
        <div className="space-y-3">
          <div className="flex items-start justify-between p-4 bg-[#F4F7FA] rounded-lg">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-[#2E69A4] mt-1" />
              <div>
                <p className="font-medium text-[#1B2A49]">
                  Chrome on MacBook Pro
                </p>
                <p className="text-sm text-[#344767]">
                  Dubai, UAE • Last active now
                </p>
              </div>
            </div>
            <span className="text-xs bg-[#2E69A4] text-white px-2 py-1 rounded">
              Current
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default AccountSecurityTab;
