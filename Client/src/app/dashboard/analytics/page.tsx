"use client";
import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DollarSign, FileText, Clock, MessageSquare } from "lucide-react";
import StatCard from "@/app/components/stat-card/StatCard";
import DashboardLayout from "@/app/components/layout/DashboardLayout";

const AnalyticsPage = () => {
  // Dummy data for stat cards in the format expected by the reusable StatCard component
  const statCardsData = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeText: "+14.6%",
      badgeBg: "bg-green-100",
      badgeColor: "text-green-800",
      title: "My Total Revenue",
      value: "AED 85.2K",
      subtitle: "Year to date",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badgeText: "+37.5%",
      badgeBg: "bg-blue-100",
      badgeColor: "text-blue-800",
      title: "My Invoices",
      value: "48",
      subtitle: "Active invoices",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      badgeText: "-22.1%",
      badgeBg: "bg-amber-100",
      badgeColor: "text-amber-800",
      title: "Pending Payments",
      value: "AED 7.3K",
      subtitle: "Awaiting clearance",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      badgeText: "+45.8%",
      badgeBg: "bg-purple-100",
      badgeColor: "text-purple-800",
      title: "AI Queries Used",
      value: "173",
      subtitle: "This month",
    },
  ];

  // User's revenue over months
  const myRevenueData = [
    { month: "Jan", revenue: 8400, expenses: 4200 },
    { month: "Feb", revenue: 9800, expenses: 4800 },
    { month: "Mar", revenue: 12200, expenses: 5400 },
    { month: "Apr", revenue: 15100, expenses: 6200 },
    { month: "May", revenue: 18500, expenses: 7100 },
    { month: "Jun", revenue: 21200, expenses: 7800 },
  ];

  // User's invoice status
  const myInvoiceData = [
    { name: "Paid", value: 28, color: "#10b981" },
    { name: "Pending", value: 12, color: "#f59e0b" },
    { name: "Overdue", value: 3, color: "#ef4444" },
    { name: "Draft", value: 5, color: "#6b7280" },
  ];

  // User's client payment trends
  const clientPaymentData = [
    { client: "Client A", paid: 15400, pending: 2400 },
    { client: "Client B", paid: 12800, pending: 0 },
    { client: "Client C", paid: 9200, pending: 3100 },
    { client: "Client D", paid: 18600, pending: 1800 },
    { client: "Client E", paid: 6400, pending: 0 },
  ];

  // User's reminder completion
  const myReminderData = [
    { month: "Jan", completed: 8, missed: 2 },
    { month: "Feb", completed: 11, missed: 1 },
    { month: "Mar", completed: 10, missed: 2 },
    { month: "Apr", completed: 14, missed: 1 },
    { month: "May", completed: 16, missed: 0 },
    { month: "Jun", completed: 15, missed: 1 },
  ];

  // User's expense categories
  const myExpenseData = [
    { category: "Office Rent", amount: 3200, color: "#3b82f6" },
    { category: "Software & Tools", amount: 1800, color: "#8b5cf6" },
    { category: "Marketing", amount: 2400, color: "#ec4899" },
    { category: "Utilities", amount: 800, color: "#f59e0b" },
    { category: "Miscellaneous", amount: 1600, color: "#10b981" },
  ];

  // User's daily invoice creation pattern
  const invoicePatternData = [
    { day: "Mon", count: 8 },
    { day: "Tue", count: 12 },
    { day: "Wed", count: 15 },
    { day: "Thu", count: 11 },
    { day: "Fri", count: 9 },
    { day: "Sat", count: 3 },
    { day: "Sun", count: 2 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen mb-4 ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dashboard-title">
            My Business Analytics
          </h1>
          <p className="text-gray-600 mt-2 dashboard-subtitle">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid - Using reusable StatCard component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCardsData.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              iconBg={card.iconBg}
              iconColor={card.iconColor}
              badgeText={card.badgeText}
              badgeBg={card.badgeBg}
              badgeColor={card.badgeColor}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
            />
          ))}
        </div>

        {/* Two Column Charts - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue & Expenses Trend */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-0 chart-card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Revenue Growth
                </h2>
                <p className="text-gray-600 text-sm">Yearly Report</p>
              </div>
              <div className="text-end">
                <h5 className="text-lg font-bold text-gray-900 mb-1">
                  AED 85.2K
                </h5>
                <span className="badge bg-green-100 text-green-800 font-semibold text-xs">
                  +14.6%
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={myRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`AED ${value}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* My Invoice Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-0 chart-card">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                My Invoice Status
              </h2>
              <p className="text-gray-600 text-sm">
                Current status of your invoices
              </p>
            </div>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={myInvoiceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {myInvoiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3 ml-6">
                {myInvoiceData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Charts - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* My Expense Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-0 chart-card">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                My Expense Breakdown
              </h2>
              <p className="text-gray-600 text-sm">Where your money is going</p>
            </div>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={myExpenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {myExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [`AED ${value}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3 ml-6">
                {myExpenseData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      AED {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Client Payment Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-0 chart-card">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Client Payment Status
              </h2>
              <p className="text-gray-600 text-sm">
                Paid vs pending amounts by client
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientPaymentData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="client"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`AED ${value}`, ""]}
                />
                <Bar
                  dataKey="paid"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                  name="Paid"
                />
                <Bar
                  dataKey="pending"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                  name="Pending"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two Column Charts - Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* My Reminder Completion */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-0 chart-card">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                My Reminder Completion
              </h2>
              <p className="text-gray-600 text-sm">
                Track your task completion rate
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={myReminderData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                  name="Completed"
                />
                <Bar
                  dataKey="missed"
                  stackId="a"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                  name="Missed"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Invoice Creation Pattern */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-0 chart-card">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                My Invoice Creation Pattern
              </h2>
              <p className="text-gray-600 text-sm">
                When you typically create invoices during the week
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={invoicePatternData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28}>
                  {invoicePatternData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 2 ? "#8b5cf6" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
