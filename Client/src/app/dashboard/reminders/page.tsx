"use client";

import React, { useState } from "react";
import {
  Bell,
  Plus,
  Calendar,
  Filter,
  Sparkles,
  TrendingUp,
  Brain,
} from "lucide-react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import Modal from "@/app/components/ui/Modal";
import ReminderCalendar from "@/app/components/calendar/Calendar";
import ReminderCard from "@/app/components/reminder-card/ReminderCard";

// Type definitions (type alias)
type ReminderStatus = "pending" | "completed";
type ReminderPriority = "high" | "low" | "medium";
type ReminderType = "VAT" | "License" | "Payroll" | "Custom";

interface Reminder {
  id: number;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  status: ReminderStatus;
  assignedTo: string | null;
  priority: ReminderPriority;
  aiGenerated: boolean;
  aiConfidence: number | null;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type: "warning" | "alert" | "success" | "info";
  aiGenerated: boolean;
}

interface FormData {
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  assignedTo: string;
}

type ViewMode = "list" | "calendar";

const AIRemindersPage = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: "VAT Filing Deadline Q3 2025",
      type: "VAT",
      date: "2025-10-28",
      time: "17:00",
      status: "pending",
      assignedTo: "Ahmed Khan",
      priority: "high",
      aiGenerated: true,
      aiConfidence: 95,
    },
    {
      id: 2,
      title: "Trade License Renewal",
      type: "License",
      date: "2025-11-15",
      time: "09:00",
      status: "pending",
      assignedTo: null,
      priority: "high",
      aiGenerated: true,
      aiConfidence: 98,
    },
    {
      id: 3,
      title: "Monthly Payroll Processing",
      type: "Payroll",
      date: "2025-10-05",
      time: "10:00",
      status: "completed",
      assignedTo: "Sara Ali",
      priority: "medium",
      aiGenerated: false,
      aiConfidence: null,
    },
    {
      id: 4,
      title: "Client Meeting - Contract Review",
      type: "Custom",
      date: "2025-10-03",
      time: "14:00",
      status: "pending",
      assignedTo: null,
      priority: "low",
      aiGenerated: false,
      aiConfidence: null,
    },
    {
      id: 5,
      title: "Q4 Tax Return Filing",
      type: "VAT",
      date: "2025-10-15",
      time: "16:00",
      status: "pending",
      assignedTo: "Ahmed Khan",
      priority: "high",
      aiGenerated: true,
      aiConfidence: 92,
    },
    {
      id: 6,
      title: "Insurance Policy Renewal",
      type: "Custom",
      date: "2025-10-20",
      time: "11:00",
      status: "pending",
      assignedTo: null,
      priority: "medium",
      aiGenerated: true,
      aiConfidence: 88,
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "AI detected VAT filing deadline approaching in 27 days",
      time: "2 hours ago",
      read: false,
      type: "warning",
      aiGenerated: true,
    },
    {
      id: 2,
      message: "Your Trade License expires in 45 days - Auto-reminder created",
      time: "5 hours ago",
      read: false,
      type: "alert",
      aiGenerated: true,
    },
    {
      id: 3,
      message: "Payroll reminder completed successfully",
      time: "1 day ago",
      read: true,
      type: "success",
      aiGenerated: false,
    },
    {
      id: 4,
      message: "AI suggests scheduling quarterly review meeting",
      time: "3 hours ago",
      read: false,
      type: "info",
      aiGenerated: true,
    },
  ]);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "Custom",
    date: "",
    time: "",
    assignedTo: "",
  });

  const reminderTypes: ReminderType[] = ["VAT", "License", "Payroll", "Custom"];

  const priorityColors: Record<ReminderPriority, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const typeColors: Record<ReminderType, string> = {
    VAT: "bg-purple-100 text-purple-700",
    License: "bg-blue-100 text-blue-700",
    Payroll: "bg-green-100 text-green-700",
    Custom: "bg-gray-100 text-gray-700",
  };

  const handleSubmit = (): void => {
    if (!formData.title || !formData.date || !formData.time) return;

    if (editingReminder) {
      setReminders(
        reminders.map((r) =>
          r.id === editingReminder.id
            ? {
                ...r,
                ...formData,
                assignedTo: formData.assignedTo || null,
                aiGenerated: false,
                aiConfidence: null,
              }
            : r
        )
      );

      setEditingReminder(null);
    } else {
      const newReminder: Reminder = {
        id: Date.now(),
        title: formData.title,
        date: formData.date,
        time: formData.time,
        assignedTo: formData.assignedTo || null,
        status: "pending",
        priority: "medium",
        type: formData.type,
        aiGenerated: false,
        aiConfidence: null,
      };

      setReminders([...reminders, newReminder]);
    }

    setFormData({
      title: "",
      type: "Custom",
      date: "",
      time: "",
      assignedTo: "",
    });

    setShowForm(false);
  };

  const handleEdit = (reminder: Reminder): void => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      date: reminder.date,
      time: reminder.time,
      type: reminder.type,
      assignedTo: reminder.assignedTo || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: number): void => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const toggleStatus = (id: number): void => {
    setReminders(
      reminders.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "pending" ? "completed" : "pending" }
          : r
      )
    );
  };

  const markNotificationRead = (id: number): void => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredReminders = reminders.filter((r) => {
    const typeMatch = filterType === "all" || r.type === filterType;
    const statusMatch = filterType === "all" || r.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `in ${diffDays} days`;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen text-[#1B2A49] p-6 mb-4">
        <div className="w-full">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-[#1B2A49] flex items-center gap-3">
                  <div className="relative">
                    <Bell className="w-8 h-8" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F6A821] rounded-full animate-pulse"></div>
                  </div>
                  Smart Reminders
                </h1>
                <p className="text-[#344767] mt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F6A821] animate-pulse" />
                  AI-powered compliance & business automation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative bg-white p-3 rounded-lg shadow-sm border border-[#E1E8F5] hover:shadow-md transition-all hover:scale-105"
                >
                  <Bell className="w-5 h-5 text-[#344767]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#F6A821] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingReminder(null);
                    setFormData({
                      title: "",
                      type: "Custom",
                      date: "",
                      time: "",
                      assignedTo: "",
                    });
                  }}
                  className="bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  New Reminder
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {/* Filters and View Toggle */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E1E8F5] mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#344767]" />
                    <span className="text-sm font-medium text-[#344767]">
                      Filter by:
                    </span>
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-[#E1E8F5] rounded-lg text-sm text-[#344767] focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                  >
                    <option value="all">All Types</option>
                    {reminderTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-[#E1E8F5] rounded-lg text-sm text-[#344767] focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-[#1B2A49] text-white shadow-md"
                          : "bg-gray-100 text-[#344767] hover:bg-gray-200"
                      }`}
                      title="List View"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "calendar"
                          ? "bg-[#1B2A49] text-white shadow-md"
                          : "bg-gray-100 text-[#344767] hover:bg-gray-200"
                      }`}
                      title="Calendar View"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar or List View */}
              {viewMode === "calendar" ? (
                <ReminderCalendar
                  reminders={filteredReminders}
                  typeColors={typeColors}
                />
              ) : (
                <div className="space-y-4">
                  {filteredReminders.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm border border-[#E1E8F5] text-center">
                      <Bell className="w-16 h-16 text-[#E1E8F5] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#344767] mb-2">
                        No reminders found
                      </h3>
                      <p className="text-sm text-[#344767] opacity-70">
                        Create your first reminder or let AI auto-detect them
                      </p>
                    </div>
                  ) : (
                    filteredReminders.map((reminder) => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        typeColors={typeColors}
                        priorityColors={priorityColors}
                        onToggleStatus={toggleStatus}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        formatDate={formatDate}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E1E8F5]">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#2E69A4]" />
                  <h3 className="font-semibold text-[#1B2A49]">Overview</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#F4F7FA] rounded-lg hover:shadow-sm transition-shadow">
                    <span className="text-sm text-[#344767]">
                      Total Reminders
                    </span>
                    <span className="font-bold text-[#1B2A49] text-lg">
                      {reminders.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:shadow-sm transition-shadow">
                    <span className="text-sm text-[#344767]">Pending</span>
                    <span className="font-bold text-[#F6A821] text-lg">
                      {reminders.filter((r) => r.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:shadow-sm transition-shadow">
                    <span className="text-sm text-[#344767]">Completed</span>
                    <span className="font-bold text-green-600 text-lg">
                      {reminders.filter((r) => r.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-[#344767]">AI Created</span>
                    </div>
                    <span className="font-bold text-purple-600 text-lg">
                      {reminders.filter((r) => r.aiGenerated).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-[#1B2A49] to-[#2E69A4] p-5 rounded-xl shadow-lg text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-[#F6A821]" />
                  <h3 className="font-semibold">AI Insights</h3>
                </div>
                <div className="space-y-3 text-sm text-[#1b2a49]">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm p-3 rounded-lg">
                    <p className="opacity-90">Peak reminder times: 9-11 AM</p>
                  </div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm p-3 rounded-lg">
                    <p className="opacity-90">Avg completion time: 2.5 days</p>
                  </div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm p-3 rounded-lg">
                    <p className="opacity-90">Next auto-scan: 3 hours</p>
                  </div>
                </div>
              </div>

              {/* By Type */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E1E8F5]">
                <h3 className="font-semibold text-[#1B2A49] mb-4">By Type</h3>
                <div className="space-y-2">
                  {reminderTypes.map((type) => {
                    const count = reminders.filter(
                      (r) => r.type === type
                    ).length;
                    const percentage =
                      reminders.length > 0
                        ? (count / reminders.length) * 100
                        : 0;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}
                          >
                            {type}
                          </span>
                          <span className="text-sm font-semibold text-[#344767]">
                            {count}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-[#2E69A4] to-[#1B2A49] h-1.5 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Form Modal */}
          <Modal
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
              setEditingReminder(null);
            }}
            title={editingReminder ? "Edit Reminder" : "Create New Reminder"}
            titleIcon={<Plus className="w-5 h-5 text-white" />}
            size="md"
          >
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#344767] mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767]"
                    placeholder="Enter reminder title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#344767] mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as ReminderType,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767]"
                  >
                    {reminderTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#344767] mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#344767] mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#344767] mb-2">
                    Assign to Team Member (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedTo: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#E1E8F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E69A4] text-[#344767]"
                    placeholder="Enter team member name"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#2E69A4] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#344767]">
                    <strong>AI Tip:</strong> Our AI will automatically analyze
                    this reminder and suggest optimal notification times.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingReminder(null);
                    }}
                    className="flex-1 px-4 py-2 border border-[#E1E8F5] text-[#344767] rounded-lg hover:bg-[#F4F7FA] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1B2A49] to-[#2E69A4] text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
                  >
                    {editingReminder ? "Update" : "Create"} Reminder
                  </button>
                </div>
              </div>
            </div>
          </Modal>

          {/* Notifications Modal */}
          <Modal
            isOpen={showNotifications}
            showCloseButton={true}
            onClose={() => setShowNotifications(false)}
            title="Notifications"
            titleIcon={<Bell className="w-5 h-5 text-white" />}
            size="md"
            className="max-h-[600px] flex flex-col"
          >
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 text-[#E1E8F5] mx-auto mb-4" />
                  <p className="text-[#344767]">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E1E8F5]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#F4F7FA] transition-colors cursor-pointer ${
                        notification.read
                          ? "opacity-60"
                          : "bg-blue-50 bg-opacity-30"
                      }`}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="flex items-start gap-3 ">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.type === "warning"
                              ? "bg-[#F6A821]"
                              : notification.type === "alert"
                              ? "bg-red-500"
                              : notification.type === "info"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            {notification.aiGenerated && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-[#F6A821] bg-opacity-20 text-[#F6A821] flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                AI Generated
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#344767] mb-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-[#344767] opacity-60">
                            {notification.time}
                          </span>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#2E69A4] rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-[#E1E8F5] bg-[#F4F7FA]">
              <button className="w-full text-center text-sm text-[#2E69A4] font-medium hover:underline">
                Mark all as read
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIRemindersPage;
