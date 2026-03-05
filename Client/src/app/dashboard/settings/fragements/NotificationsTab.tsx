// app/settings/components/NotificationsTab.tsx
"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Bell } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import NotificationPreferences from "@/components/notification-preferences/NotificationPreferences";
import ReminderSettings from "@/components/reminders-settings/ReminderSettings";

const NotificationsTab: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);

  return (
    <div className="space-y-6">
      <NotificationPreferences />
      <ReminderSettings />
      {/* <SectionCard title="Email Notifications" icon={Mail}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1B2A49]">
                Invoice Notifications
              </p>
              <p className="text-sm text-[#344767]">
                Receive updates when invoices are created or paid
              </p>
            </div>
            <ToggleSwitch enabled={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1B2A49]">
                Reminder Notifications
              </p>
              <p className="text-sm text-[#344767]">
                Get notified about upcoming deadlines
              </p>
            </div>
            <ToggleSwitch enabled={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1B2A49]">AI Updates</p>
              <p className="text-sm text-[#344767]">
                Receive notifications about AI assistant improvements
              </p>
            </div>
            <ToggleSwitch
              enabled={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="WhatsApp Notifications" icon={MessageSquare}>
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-[#1B2A49]">
                Enable WhatsApp Notifications
              </p>
              <p className="text-sm text-[#344767]">
                Receive reminders and updates via WhatsApp
              </p>
            </div>
            <ToggleSwitch
              enabled={whatsappNotifications}
              onChange={() => setWhatsappNotifications(!whatsappNotifications)}
            />
          </div>
          {whatsappNotifications && (
            <div>
              <label className="block text-sm font-medium text-[#344767] mb-2">
                WhatsApp Number
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  className="flex-1 px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]"
                  placeholder="+971 50 123 4567"
                />
                <button className="px-6 py-3 bg-[#1B2A49] text-white rounded-lg hover:bg-[#2E69A4] transition-colors">
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>
      </SectionCard> */}

      {/* <SectionCard title="Reminder Preferences" icon={Bell}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#344767] mb-2">
              Notification Frequency
            </label>
            <select className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]">
              <option>Instant Alerts</option>
              <option>Daily Summary</option>
              <option>Weekly Digest</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#344767] mb-2">
              Preferred Time for Daily Summary
            </label>
            <input
              type="time"
              className="w-full px-4 py-3 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] bg-[#F4F7FA]"
              defaultValue="09:00"
            />
          </div>
        </div>
      </SectionCard> */}
    </div>
  );
};

export default NotificationsTab;
