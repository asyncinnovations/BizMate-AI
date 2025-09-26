"use client";

import React from "react";
import {
  Calendar,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageCircle,
  Receipt,
  TrendingUp,
  Building2,
  Users,
  Target,
  Zap,
  Plus,
  ArrowRight,
  Wallet,
  Brain,
  Lightbulb,
  Shield,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";

const Dashboard = () => {
  // AI Insights data
  const aiInsights = [
    {
      id: 1,
      type: "compliance",
      title: "VAT Regulation Update",
      message:
        "New VAT guidelines effective next month. Update your billing system to avoid penalties.",
      confidence: 92,
      priority: "high",
    },
    {
      id: 2,
      type: "opportunity",
      title: "Growth Opportunity",
      message:
        "Based on revenue trends, consider expanding to Abu Dhabi free zone. 25% growth potential.",
      confidence: 85,
      priority: "medium",
    },
    {
      id: 3,
      type: "efficiency",
      title: "Process Optimization",
      message:
        "Automate 70% of customer queries using AI templates. Save 10+ hours weekly.",
      confidence: 78,
      priority: "medium",
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "compliance":
        return <Shield className="w-4 h-4 text-amber-600" />;
      case "opportunity":
        return <Lightbulb className="w-4 h-4 text-green-600" />;
      case "efficiency":
        return <Zap className="w-4 h-4 text-blue-600" />;
      default:
        return <Brain className="w-4 h-4 text-purple-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-amber-50 border-amber-200";
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 mb-4">
        {/* Header Section */}
        <div className="mb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Farhan!</h1>
              <p className="text-gray-600">
                Here's what's happening with your business today
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-[#1B2A49] text-white px-6 py-3 rounded-lg hover:bg-[#152238] transition-colors flex items-center font-medium shadow-sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-50 rounded-full p-2.5 shadow-sm">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-green-500 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                +12.5%
              </span>
            </div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              Total Revenue
            </h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">AED 24,500</p>
            <p className="text-gray-400 text-xs">vs last month</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-50 rounded-full p-2.5 shadow-sm">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-blue-500 text-sm font-semibold bg-blue-50 px-2 py-1 rounded-full">
                8 pending
              </span>
            </div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              Invoices
            </h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">15</p>
            <p className="text-gray-400 text-xs">7 paid this month</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-amber-50 rounded-full p-2.5 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-amber-500 text-sm font-semibold bg-amber-50 px-2 py-1 rounded-full">
                3 urgent
              </span>
            </div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              Reminders
            </h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">7</p>
            <p className="text-gray-400 text-xs">compliance tasks</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-50 rounded-full p-2.5 shadow-sm">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-purple-500 text-sm font-semibold bg-purple-50 px-2 py-1 rounded-full">
                AI Active
              </span>
            </div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              Auto Replies
            </h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">23</p>
            <p className="text-gray-400 text-xs">handled today</p>
          </div>
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
                <button className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors group">
                  <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-2 mb-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Invoice
                  </span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors group">
                  <div className="bg-green-100 group-hover:bg-green-200 rounded-full p-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Reminder
                  </span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors group">
                  <div className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-2 mb-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Document
                  </span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-[#2E69A4] hover:bg-blue-50 transition-colors group">
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Upcoming Deadlines
                </h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="bg-red-100 rounded-full p-1.5 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">VAT Filing</p>
                    <p className="text-sm text-gray-600">Due in 5 days</p>
                    <p className="text-xs text-red-600 mt-1">Q3 2025 Return</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="bg-yellow-100 rounded-full p-1.5 mt-0.5">
                    <Building2 className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Trade License Renewal
                    </p>
                    <p className="text-sm text-gray-600">Due in 23 days</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      License #123456
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Employee Insurance
                    </p>
                    <p className="text-sm text-gray-600">Due in 45 days</p>
                    <p className="text-xs text-blue-600 mt-1">Annual renewal</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-white border border-[#2E69A4] text-[#2E69A4] font-medium py-2 rounded-lg hover:bg-[#2E69A4] hover:text-white transition-colors flex items-center justify-center">
                View All Reminders <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Right Column: AI Insights */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AI Business Insights
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-[#F6A821] text-white rounded-full text-xs font-medium">
                    Live Analysis
                  </span>
                </div>
              </div>

              {/* AI Insights List */}
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(
                      insight.priority
                    )}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-white rounded-full p-1.5 mt-0.5">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-800">
                            {insight.title}
                          </h3>
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {insight.message}
                        </p>
                        <div className="flex space-x-2">
                          <button className="bg-[#1B2A49] text-white text-sm font-medium px-3 py-1 rounded hover:bg-[#152238] transition-colors">
                            View Details
                          </button>
                          <button className="border border-[#2E69A4] text-[#2E69A4] text-sm font-medium px-3 py-1 rounded hover:bg-[#2E69A4] hover:text-white transition-colors">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Invoices */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">Recent Invoices</h3>
                  <button className="text-[#2E69A4] text-sm font-medium hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-1.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">INV-001</p>
                        <p className="text-sm text-gray-600">
                          Al Manara Trading LLC
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">AED 2,500</p>
                      <p className="text-xs text-green-600">Paid</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-100 rounded-full p-1.5">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">INV-002</p>
                        <p className="text-sm text-gray-600">
                          Emirates Solutions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">AED 3,200</p>
                      <p className="text-xs text-yellow-600">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📄 Documents & 💰 Expense Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-[#E1E8F5] flex flex-col h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1B2A49]">
                Recent Documents
              </h2>
              <FileText className="w-5 h-5 text-[#344767]" />
            </div>

            {/* Scrollable List */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {[
                {
                  title: "Service Agreement - Al Manara",
                  subtitle: "Generated 2 days ago",
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                  action: "View",
                  btnClass: "text-[#2E69A4] hover:underline",
                },
                {
                  title: "NDA Template",
                  subtitle: "Created 1 week ago",
                  iconBg: "bg-green-100",
                  iconColor: "text-green-600",
                  action: "Edit",
                  btnClass: "text-[#2E69A4] hover:underline",
                },
                {
                  title: "VAT Return Q3 2025",
                  subtitle: "Due in 5 days",
                  iconBg: "bg-purple-100",
                  iconColor: "text-purple-600",
                  action: "Prepare",
                  btnClass:
                    "bg-[#1B2A49] text-white px-3 py-1 rounded hover:bg-[#152238] transition-colors",
                },
              ].map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#F4F7FA] rounded-lg border border-[#E1E8F5]"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${doc.iconBg} rounded-full p-2`}>
                      <FileText className={`w-4 h-4 ${doc.iconColor}`} />
                    </div>
                    <div>
                      <p className="font-medium text-[#344767]">{doc.title}</p>
                      <p className="text-sm text-[#6B7C93]">{doc.subtitle}</p>
                    </div>
                  </div>
                  <button className={`text-sm font-medium ${doc.btnClass}`}>
                    {doc.action}
                  </button>
                </div>
              ))}
            </div>

            {/* Button at bottom */}
            <div className="mt-4">
              <button className="w-full py-2 rounded-lg text-white font-medium flex items-center justify-center transition-all bg-gradient-to-r from-[#2E69A4] to-[#1B2A49] hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Document
              </button>
            </div>
          </div>

          {/* Expense Tracking */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-[#E1E8F5] flex flex-col h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1B2A49]">
                Expense Tracking
              </h2>
              <Wallet className="w-5 h-5 text-[#344767]" />
            </div>

            {/* Monthly Expense Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7C93]">
                  This Month Expenses
                </span>
                <span className="text-lg font-bold text-[#344767]">
                  AED 8,750
                </span>
              </div>
              <div className="w-full bg-[#E1E8F5] rounded-full h-2">
                <div className="bg-[#2E69A4] h-2 rounded-full w-3/4"></div>
              </div>
              <p className="text-xs text-[#6B7C93] mt-1">
                75% of monthly budget used
              </p>
            </div>

            {/* Scrollable Expense List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {[
                {
                  title: "Office Rent",
                  subtitle: "Monthly recurring",
                  amount: "AED 4,500",
                  bg: "bg-red-50 border border-red-100",
                  iconBg: "bg-red-100",
                  icon: <Building2 className="w-4 h-4 text-red-600" />,
                },
                {
                  title: "Marketing Ads",
                  subtitle: "Google & Social Media",
                  amount: "AED 1,250",
                  bg: "bg-yellow-50 border border-yellow-100",
                  iconBg: "bg-yellow-100",
                  icon: <Users className="w-4 h-4 text-yellow-600" />,
                },
                {
                  title: "Software Subscriptions",
                  subtitle: "AI Assistant Premium",
                  amount: "AED 299",
                  bg: "bg-blue-50 border border-blue-100",
                  iconBg: "bg-blue-100",
                  icon: <Zap className="w-4 h-4 text-blue-600" />,
                },
              ].map((expense, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg ${expense.bg}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${expense.iconBg} rounded-full p-1.5`}>
                      {expense.icon}
                    </div>
                    <div>
                      <p className="font-medium text-[#344767]">
                        {expense.title}
                      </p>
                      <p className="text-sm text-[#6B7C93]">
                        {expense.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#344767]">
                    {expense.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* Button at bottom */}
            <div className="mt-4">
              <button className="w-full py-2 rounded-lg text-white font-medium flex items-center justify-center transition-all bg-gradient-to-r from-[#2E69A4] to-[#1B2A49] hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Business Health & Client Management Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* Business Health Scorecard */}
          <div className="xl:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#1B2A49] flex items-center">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-1.5 mr-2">
                  <Target className="w-4 h-4 text-white" />
                </div>
                Business Health
              </h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Good
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Overall Score
                  </span>
                  <span className="text-green-600 text-sm font-semibold">
                    +5.2%
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-[#344767]">
                    78/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Better than last month
                </p>
              </div>

              {/* Compliance Readiness */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Compliance
                  </span>
                  <Shield className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-2xl font-bold text-[#344767]">65%</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-[#F6A821] h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">3 actions required</p>
              </div>

              {/* Risk Assessment */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Risk Level
                  </span>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-[#344767]">
                  Medium
                </span>
                <p className="text-red-600 font-semibold">
                  2 alerts – monitor closely
                </p>
              </div>
            </div>

            <button className="w-full mt-6 bg-white border border-[#2E69A4] text-[#2E69A4] font-medium py-2 rounded-lg hover:bg-[#2E69A4] hover:text-white transition-colors flex items-center justify-center">
              View Detailed Report <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Client/Customer Management */}
          <div className="xl:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#1B2A49] flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Client Management
              </h2>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  24 Active Clients
                </span>
                <button className="bg-[#1B2A49] text-white px-3 py-1 rounded text-sm hover:bg-[#152238] transition-colors">
                  + Add Client
                </button>
              </div>
            </div>

            {/* Client List */}
            <div className="space-y-4 max-h-110 overflow-y-auto pr-2">
              {[
                {
                  name: "Al Manara Trading LLC",
                  email: "contact@almanara.ae",
                  phone: "+971 50 123 4567",
                  status: "active",
                  outstanding: "AED 8,500",
                  lastContact: "2 days ago",
                  avatar: "AM",
                  color: "bg-blue-500",
                },
                {
                  name: "Emirates Solutions",
                  email: "accounts@emirates.ae",
                  phone: "+971 52 987 6543",
                  status: "overdue",
                  outstanding: "AED 12,300",
                  lastContact: "5 days ago",
                  avatar: "ES",
                  color: "bg-red-500",
                },
                {
                  name: "Emirates Solutions",
                  email: "accounts@emirates.ae",
                  phone: "+971 52 987 6543",
                  status: "overdue",
                  outstanding: "AED 12,300",
                  lastContact: "5 days ago",
                  avatar: "ES",
                  color: "bg-red-500",
                },
                {
                  name: "Dubai Tech Partners",
                  email: "info@dubaitech.ae",
                  phone: "+971 55 456 7890",
                  status: "active",
                  outstanding: "AED 3,200",
                  lastContact: "1 week ago",
                  avatar: "DT",
                  color: "bg-green-500",
                },
                {
                  name: "Abu Dhabi Holdings",
                  email: "finance@adholdings.ae",
                  phone: "+971 56 789 0123",
                  status: "pending",
                  outstanding: "AED 5,700",
                  lastContact: "3 days ago",
                  avatar: "AD",
                  color: "bg-purple-500",
                },
              ].map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-[#E1E8F5] hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`${client.color} rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold`}
                    >
                      {client.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-[#344767]">
                          {client.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            client.status === "active"
                              ? "bg-green-100 text-green-800"
                              : client.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {client.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      <p className="text-xs text-gray-500">{client.phone}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-[#344767]">
                      {client.outstanding}
                    </p>
                    <p className="text-xs text-gray-500">Outstanding</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Contact: {client.lastContact}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button className="flex items-center justify-center p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium">
                <MessageCircle className="w-3 h-3 mr-1" />
                Message All
              </button>
              <button className="flex items-center justify-center p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium">
                <FileText className="w-3 h-3 mr-1" />
                Send Invoices
              </button>
              <button className="flex items-center justify-center p-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium">
                <Calendar className="w-3 h-3 mr-1" />
                Schedule Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
