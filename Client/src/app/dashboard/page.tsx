"use client";

import React from "react";
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
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import StatCard from "../components/stat-card/StatCard";
import UpcomingDeadlines from "./components/upcoming-deadlines/UpcomingDeadlines";
import RecentDocuments from "./components/recent-documents/RecentDocuments";
import ExpenseTracking from "./components/expense-tracking/ExpenseTracking";
import BusinessHealth from "./components/business-health/BusinessHealth";
import ClientManagement from "./components/client-management/ClientManagement";
import AiInsights from "./components/ai-insights/AiInsights";
import { useRouter } from "next/navigation";
import PageHeader from "../components/page-header/PageHeader";

const Dashboard = () => {
  const router = useRouter();
  const statsData = [
    {
      icon: <DollarSign />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeText: "+12.5%",
      badgeBg: "bg-green-50",
      badgeColor: "text-green-500",
      title: "Total Revenue",
      value: "AED 24,500",
      subtitle: "vs last month",
    },
    {
      icon: <Receipt />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badgeText: "8 pending",
      badgeBg: "bg-blue-50",
      badgeColor: "text-blue-500",
      title: "Invoices",
      value: "15",
      subtitle: "7 paid this month",
    },
    {
      icon: <AlertTriangle />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      badgeText: "3 urgent",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-500",
      title: "Reminders",
      value: "7",
      subtitle: "compliance tasks",
    },
    {
      icon: <MessageCircle />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      badgeText: "AI Active",
      badgeBg: "bg-purple-50",
      badgeColor: "text-purple-500",
      title: "Auto Replies",
      value: "23",
      subtitle: "handled today",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-scree p-6 mb-4">
        {/* Header */}
        <PageHeader
          title="Welcome back, Farhan!"
          description="Here's what's happening with your business today"
          buttons={[
            {
              text: "Ask AI Assistant",
              onClick: () => router.push("/dashboard/ai-chat"),
              icon: <MessageCircle size={20} />,
            },
          ]}
        />

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsData.map((item, index) => (
            <StatCard key={index} {...item} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column with Quick Actions + Upcoming Deadlines */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/dashboard/invoicing")}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-2 mb-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Invoice
                  </span>
                </button>

                <button
                  onClick={() => router.push("/dashboard/reminders")}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <div className="bg-green-100 group-hover:bg-green-200 rounded-full p-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Reminder
                  </span>
                </button>

                <button
                  onClick={() => router.push("/dashboard/documents")}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <div className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-2 mb-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Document
                  </span>
                </button>

                <button
                  onClick={() => router.push("/dashboard/ai-chat")}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <div className="bg-indigo-100 group-hover:bg-indigo-200 rounded-full p-2 mb-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Compliance
                  </span>
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <UpcomingDeadlines />
          </div>

          {/* Right Column: AI Insights */}
          <AiInsights />
        </div>

        {/* 📄 Documents & 💰 Expense Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <RecentDocuments />

          {/* Expense Tracking */}
          <ExpenseTracking />
        </div>

        {/* Business Health & Client Management Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* Business Health Scorecard */}
          <BusinessHealth />

          {/* Client/Customer Management */}
          <ClientManagement />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
