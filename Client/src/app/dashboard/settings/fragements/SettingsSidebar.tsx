// app/settings/components/SettingsSidebar.tsx
import React from "react";
import {
  Shield,
  CreditCard,
  Bell,
  Plug,
  Bot,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "account", label: "Account & Security", icon: Shield },
    { id: "subscription", label: "Subscription & Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "notifications", label: "Notifications & Reminders", icon: Bell },
    { id: "ai", label: "AI Assistant", icon: Bot },
    { id: "compliance", label: "Compliance & Legal", icon: FileText },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="sticky top-2 h-100 lg:col-span-1 space-y-4">
      <div className="bg-surface rounded-xl shadow-card border border-border p-6">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === tab.id
                    ? "bg-brand-light text-secondary border border-border"
                    : "text-text-primary hover:bg-bg-base"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default SettingsSidebar;