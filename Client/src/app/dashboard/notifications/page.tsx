"use client";
import React, { useState } from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Filter,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  CreditCard,
  User,
  Settings as SettingsIcon,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import ProtectedRoute from "@/app/components/protected-route/ProtectedRoute";
import DashboardLayout from "@/app/components/layout/DashboardLayout";

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 9,
      type: "ai",
      icon: TrendingUp,
      iconColor: "text-[#2E69A4]",
      iconBg: "bg-blue-100",
      title: "Business Insights Ready",
      message:
        "Your monthly business report is ready. Revenue increased by 12% this month.",
      time: "5 days ago",
      read: true,
      category: "ai",
      action: "View Report",
    },
    {
      id: 10,
      type: "alert",
      icon: ShieldAlert,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      title: "Security Alert",
      message:
        "New login detected from Chrome on Windows. If this wasn't you, secure your account.",
      time: "1 week ago",
      read: true,
      category: "account",
      action: "Review Activity",
    },
  ]);

  const filterCategories = [
    { id: "all", label: "All", icon: Bell },
    { id: "compliance", label: "Compliance", icon: AlertCircle },
    { id: "invoice", label: "Invoices", icon: FileText },
    { id: "ai", label: "AI Insights", icon: Sparkles },
    { id: "communication", label: "Messages", icon: MessageSquare },
    { id: "account", label: "Account", icon: User },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeFilter);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-[#F4F7FA] p-4 mb-8">
          <div className="w-full">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#1B2A49]">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="bg-[#F6A821] text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex items-center gap-2 px-4 py-2 text-[#2E69A4] hover:bg-[#E1E8F5] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span className="text-sm font-medium">Mark all read</span>
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Clear all</span>
                  </button>
                </div>
              </div>
              <p className="text-[#344767]">
                Stay updated with your business activities and reminders
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E1E8F5] p-2 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto">
                {filterCategories.map((category) => {
                  const Icon = category.icon;
                  const count =
                    category.id === "all"
                      ? notifications.length
                      : notifications.filter((n) => n.category === category.id)
                          .length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        activeFilter === category.id
                          ? "bg-[#1B2A49] text-white"
                          : "text-[#344767] hover:bg-[#F4F7FA]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                      {count > 0 && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            activeFilter === category.id
                              ? "bg-white/20 text-white"
                              : "bg-[#E1E8F5] text-[#344767]"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-[#E1E8F5] p-12 text-center">
                  <BellOff className="w-16 h-16 text-[#E1E8F5] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#1B2A49] mb-2">
                    No notifications
                  </h3>
                  <p className="text-[#344767]">
                    {activeFilter === "all"
                      ? "You're all caught up! No new notifications at the moment."
                      : `No ${filterCategories
                          .find((c) => c.id === activeFilter)
                          ?.label.toLowerCase()} notifications.`}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                        notification.read
                          ? "border-[#E1E8F5]"
                          : "border-[#2E69A4] border-l-4"
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`${notification.iconBg} p-3 rounded-lg shrink-0`}
                          >
                            <Icon
                              className={`w-5 h-5 ${notification.iconColor}`}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3
                                className={`font-semibold ${
                                  notification.read
                                    ? "text-[#344767]"
                                    : "text-[#1B2A49]"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-2 shrink-0">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-[#2E69A4] hover:text-[#1B2A49] transition-colors"
                                    title="Mark as read"
                                  >
                                    <CheckCheck className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    deleteNotification(notification.id)
                                  }
                                  className="text-[#344767] hover:text-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <p className="text-[#344767] text-sm mb-3">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[#344767] text-sm">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{notification.time}</span>
                              </div>

                              {notification.action && (
                                <button className="text-[#2E69A4] hover:text-[#1B2A49] font-medium text-sm transition-colors">
                                  {notification.action} →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Actions Card */}
            {filteredNotifications.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#E1E8F5] p-6">
                <h3 className="text-lg font-semibold text-[#1B2A49] mb-4">
                  Quick Actions
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <button className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors text-left">
                    <Calendar className="w-5 h-5 text-[#2E69A4]" />
                    <div>
                      <p className="font-medium text-[#1B2A49] text-sm">
                        View Calendar
                      </p>
                      <p className="text-xs text-[#344767]">
                        Check all reminders
                      </p>
                    </div>
                  </button>

                  <button className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors text-left">
                    <SettingsIcon className="w-5 h-5 text-[#2E69A4]" />
                    <div>
                      <p className="font-medium text-[#1B2A49] text-sm">
                        Notification Settings
                      </p>
                      <p className="text-xs text-[#344767]">
                        Manage preferences
                      </p>
                    </div>
                  </button>

                  <button className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-lg hover:bg-[#E1E8F5] transition-colors text-left">
                    <FileText className="w-5 h-5 text-[#2E69A4]" />
                    <div>
                      <p className="font-medium text-[#1B2A49] text-sm">
                        View All Invoices
                      </p>
                      <p className="text-xs text-[#344767]">
                        Check payment status
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
