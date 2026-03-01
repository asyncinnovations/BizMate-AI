"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  FileText,
  DollarSign,
  AlertTriangle,
  MessageCircle,
  Receipt,
  Target,
  Plus,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "../../components/ui/Button";
import StatCard from "../../components/stat-card/StatCard";
import UpcomingDeadlines from "./components/upcoming-deadlines/UpcomingDeadlines";
import RecentDocuments from "./components/recent-documents/RecentDocuments";
import ExpenseTracking from "./components/expense-tracking/ExpenseTracking";
import BusinessHealth from "./components/business-health/BusinessHealth";
import ClientManagement from "./components/client-management/ClientManagement";
import AiInsights from "./components/ai-insights/AiInsights";
import { useRouter } from "next/navigation";
import PageHeader from "../../components/page-header/PageHeader";
import Card from "../../components/ui/Card";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

// TypeScript interfaces
interface Invoice {
  uuid: string;
  status: "paid" | "unpaid" | "draft" | "saved";
  total: number;
}

interface Reminder {
  uuid: string;
  status: string; // e.g. "pending", "completed", "urgent"
  type: string;
}

const Dashboard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  /////////////////////////////////////
  // Invoice stats state
  /////////////////////////////////////
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  /////////////////////////////////////
  // Reminder stats state
  /////////////////////////////////////
  const [reminders, setReminders] = useState<Reminder[]>([]);

  /////////////////////////////////////
  // Fetch user invoices for stats
  // API returns response.data as a plain array
  /////////////////////////////////////
  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(
        `/invoices/user/${user?.user.user_id}`,
      );
      if (response.status === 200) {
        const data = response.data;
        setInvoices(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.log("Error fetching invoices for dashboard stats", error);
    }
  };

  /////////////////////////////////////
  // Fetch user reminders for stats
  // API returns response.data.response as the array (same as AIRemindersPage)
  /////////////////////////////////////
  const fetchReminders = async () => {
    try {
      const response = await axiosInstance.get(
        `/ai_reminder/user/${user?.user.user_id}`,
      );
      if (response.status === 200) {
        const data = response.data.response;
        setReminders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.log("Error fetching reminders for dashboard stats", error);
    }
  };

  useEffect(() => {
    if (!loading && user?.user.user_id) {
      fetchInvoices();
      fetchReminders();
    }
  }, [loading, user?.user.user_id]);

  /////////////////////////////////////
  // Computed invoice stats
  /////////////////////////////////////
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  const unpaidInvoices = invoices.filter((inv) => inv.status === "unpaid");
  const totalRevenue = paidInvoices.reduce(
    (sum, inv) => sum + Number(inv.total || 0),
    0,
  );

  /////////////////////////////////////
  // Computed reminder stats
  /////////////////////////////////////
  const urgentReminders = reminders.filter(
    (r) => r.status?.toLowerCase() === "urgent",
  );

  /////////////////////////////////////
  // Stats cards — first 3 are dynamic, 4th (Auto Replies) stays static
  /////////////////////////////////////
  const statsData = [
    {
      icon: <DollarSign />,
      iconBg: "bg-status-success-bg",
      iconColor: "text-status-success",
      badgeText: `${paidInvoices.length} paid`,
      badgeBg: "bg-status-success-bg",
      badgeColor: "text-status-success",
      title: "Total Revenue",
      value: `AED ${totalRevenue.toLocaleString()}`,
      subtitle: "from paid invoices",
    },
    {
      icon: <Receipt />,
      iconBg: "bg-brand-light",
      iconColor: "text-secondary",
      badgeText: `${unpaidInvoices.length} pending`,
      badgeBg: "bg-brand-light",
      badgeColor: "text-secondary",
      title: "Invoices",
      value: String(invoices.length),
      subtitle: `${paidInvoices.length} paid this month`,
    },
    {
      icon: <AlertTriangle />,
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning",
      badgeText: `${urgentReminders.length} urgent`,
      badgeBg: "bg-status-warning-bg",
      badgeColor: "text-status-warning",
      title: "Reminders",
      value: String(reminders.length),
      subtitle: "compliance tasks",
    },
    {
      icon: <MessageCircle />,
      iconBg: "bg-status-info-bg",
      iconColor: "text-status-info",
      badgeText: "AI Active",
      badgeBg: "bg-status-info-bg",
      badgeColor: "text-status-info",
      title: "Auto Replies",
      value: "23",
      subtitle: "handled today",
    },
  ];

  // ── Quick action buttons config ──
  const quickActions = [
    {
      label: "Invoice",
      route: "/dashboard/invoicing",
      iconBg: "bg-brand-light group-hover:bg-secondary/20",
      icon: <Plus className="w-4 h-4 text-secondary" />,
    },
    {
      label: "Reminder",
      route: "/dashboard/reminders",
      iconBg: "bg-status-success-bg group-hover:bg-status-success/20",
      icon: <Calendar className="w-4 h-4 text-status-success" />,
    },
    {
      label: "Document",
      route: "/dashboard/documents",
      iconBg: "bg-status-warning-bg group-hover:bg-status-warning/20",
      icon: <FileText className="w-4 h-4 text-status-warning" />,
    },
    {
      label: "Compliance",
      route: "/dashboard/ai-chat",
      iconBg: "bg-status-info-bg group-hover:bg-status-info/20",
      icon: <Target className="w-4 h-4 text-status-info" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">
        {/* Header */}
        <PageHeader
          title="Welcome back, Farhan 👋!"
          description="Here's what's happening with your business today"
          buttons={[
            {
              text: "Ask AI Assistant",
              onClick: () => router.push("/dashboard/ai-chat"),
              icon: <MessageCircle size={20} />,
            },
          ]}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsData.map((item, index) => (
            <StatCard key={index} {...item} />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left column — Quick Actions + Upcoming Deadlines */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Quick Actions */}
            <Card>
              <h3 className="font-semibold text-text-heading mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => router.push(action.route)}
                    className="flex flex-col items-center justify-center p-3 border border-border rounded-lg hover:border-secondary hover:bg-brand-light transition-colors cursor-pointer group"
                  >
                    <div
                      className={`rounded-full p-2 mb-2 transition-colors ${action.iconBg}`}
                    >
                      {action.icon}
                    </div>
                    <span className="text-xs font-medium text-text-primary">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Upcoming Deadlines */}
            <UpcomingDeadlines />
          </div>

          {/* Right column — AI Insights */}
          <AiInsights />
        </div>

        {/* Documents & Expense Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentDocuments />
          <ExpenseTracking />
        </div>

        {/* Business Health & Client Management */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          <BusinessHealth />
          <ClientManagement />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
