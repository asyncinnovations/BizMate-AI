// app/settings/page.tsx
"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import PageHeader from "@/app/components/page-header/PageHeader";
import SettingsSidebar from "./fragements/SettingsSidebar";
import AccountSecurityTab from "./fragements/AccountSecurityTab";
import SubscriptionBillingTab from "./fragements/SubscriptionBillingTab";
import NotificationsTab from "./fragements/NotificationsTab";
import IntegrationsTab from "./fragements/IntegrationsTab";
import AIAssistantTab from "./fragements/AIAssistantTab";
import ComplianceLegalTab from "./fragements/ComplianceLegalTab";
import DangerZoneTab from "./fragements/DangerZoneTab";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "account":
        return <AccountSecurityTab />;
      case "subscription":
        return <SubscriptionBillingTab />;
      case "notifications":
        return <NotificationsTab />;
      case "integrations":
        return <IntegrationsTab />;
      case "ai":
        return <AIAssistantTab />;
      case "compliance":
        return <ComplianceLegalTab />;
      case "danger":
        return <DangerZoneTab />;
      default:
        return <AccountSecurityTab />;
    }
  };

  return (
      <DashboardLayout>
        <div className="min-h-screen p-4 mb-8">
          <div className="w-full">
            <PageHeader
              title="Settings"
              icon={<Settings />}
              description="Configure your platform preferences and controls"
            />

            <div className="grid lg:grid-cols-4 gap-6 relative">
              <SettingsSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <div className="lg:col-span-3 space-y-6">{renderActiveTab()}</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
};

export default SettingsPage;
