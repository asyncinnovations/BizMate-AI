"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Calendar,
  Filter,
  Sparkles,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Modal from "@/components/ui/Modal";
import ReminderCalendar from "@/components/calendar/Calendar";
import ReminderCard from "@/components/reminder-card/ReminderCard";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatDate";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import { useSubscription } from "@/context/SubscriptionContext";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";

// Type definitions (type alias)
type ReminderStatus = "pending" | "sent" | "completed" | "missed";
type ReminderType = "VAT" | "License" | "Payroll" | "Custom";

interface Reminder {
  uuid: string;
  title: string;
  description: string;
  type: ReminderType;
  reminder_date: string;
  notify_before: number;
  notify_channels: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  recurrence_rule: string;
  status: ReminderStatus;
}

interface FormData {
  user_id: string | unknown;
  title: string;
  description: string;
  type: ReminderType;
  reminder_date: string;
  notify_before: number;
  notify_channels: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  recurrence_rule: string;
}

type ViewMode = "list" | "calendar";

const AIRemindersPage = () => {
  const { currentPlan, checkUsageLimit } = useSubscription();
  const { incrementUsage } = useSubscriptionUsage();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [recurringReminders, setRecurringReminders] = useState<Reminder[]>([]);
  const [showRecurring, setShowRecurring] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { loading, user } = useAuth();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const [formData, setFormData] = useState<FormData>({
    user_id: user?.user.user_id,
    title: "",
    description: "",
    type: "Custom",
    reminder_date: "",
    notify_before: 1,
    notify_channels: {
      email: true,
      whatsapp: true,
      push: false,
    },
    recurrence_rule: "none",
  });

  const reminderTypes: ReminderType[] = ["VAT", "License", "Payroll", "Custom"];
  const notifyBeforeOptions = [
    { name: "1 day", value: 1 },
    { name: "2 days", value: 2 },
    { name: "3 days", value: 3 },
    { name: "4 days", value: 4 },
    { name: "5 days", value: 5 },
    { name: "6 days", value: 6 },
    { name: "7 days", value: 7 },
  ];
  const recurrenceOptions = ["none", "monthly", "quarterly", "yearly"];

  const typeColors: Record<ReminderType, string> = {
    VAT: "bg-brand-light text-secondary",
    License: "bg-status-info-bg text-status-info",
    Payroll: "bg-status-success-bg text-status-success",
    Custom: "bg-bg-base text-text-muted",
  };

  const statusColors: Record<ReminderStatus, string> = {
    pending: "bg-status-warning-bg text-status-warning",
    sent: "bg-status-info-bg text-status-info",
    completed: "bg-status-success-bg text-status-success",
    missed: "bg-status-error-bg text-status-error",
  };

  /////////////////////////
  // Fetch all reminders
  //////////////////////////
  const fetchAllReminders = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/ai_reminder/user/${user?.user.user_id}`,
      );
      if (response.status === 200) {
        console.log(response.data.response);
        setReminders(response.data.response);
      }
    } catch (error) {
      console.log("Error occur while getting reminders", error);
    } finally {
      setIsLoading(false);
    }
  };

  //////////////////////////
  // Fetch Recurring Reminders
  /////////////////////////
  const fetchRecurringReminders = async () => {
    try {
      const response = await axiosInstance.get(
        `/ai_reminder/recurring/${user?.user.user_id}`,
      );
      if (response.status === 200) {
        setRecurringReminders(response.data.response);
      }
    } catch (error) {
      console.log("Error occur while getting recurring reminders", error);
    }
  };

  useEffect(() => {
    if (!loading && user?.user.user_id) {
      fetchAllReminders();
      fetchRecurringReminders();
    }
  }, [loading, user]);

  //////////////////////////
  // Create reminder
  /////////////////////////
  const handleCreateReminder = async () => {
    if (!formData.title || !formData.reminder_date) {
      return toast.error("Fill all the required fields!");
    }

    const exceeded = await checkUsageLimit("ai_reminder");
    const limit: any = currentPlan?.features?.reminders;
    if (exceeded >= limit) {
      return toast.error(
        "Your Smart Reminder Limit Was exceeded. Kindly upgrade to Pro or Enterprise",
      );
    }

    try {
      const response = await axiosInstance.post(
        "/ai_reminder/create",
        formData,
      );
      if (response.status === 201) {
        toast.success("Reminder created successfully!");
        setReminders((prev) => [...prev, response.data.response]);
        fetchRecurringReminders();
        await incrementUsage({
          usageKey: "ai_reminder",
        });
        console.log(response.data);
      }
    } catch (error) {
      console.log("Error occur while creating reminder", error);
    } finally {
      setFormData({
        user_id: !loading ? user?.user.user_id : "",
        title: "",
        description: "",
        type: "Custom",
        reminder_date: "",
        notify_before: 1,
        notify_channels: { email: true, whatsapp: true, push: false },
        recurrence_rule: "none",
      });
      setShowForm(false);
    }
  };

  //////////////////////////
  // Delete reminder
  /////////////////////////
  const handleDelete = async (uuid: string) => {
    if (confirm("Are you sure you to want to delete the reminder?")) {
      try {
        const response = await axiosInstance.delete(
          `/ai_reminder/delete/${uuid}`,
        );
        if (response.status === 200) {
          toast.success("Reminder deleted!");
          fetchRecurringReminders();
          setReminders((prev) => prev.filter((r) => r.uuid !== uuid));
        }
      } catch (error) {
        console.log("Error occur while deleting reminder", error);
      } finally {
        setShowCalendarModal(false);
      }
    }
  };

  /////////////////////
  // Update Reminder
  //////////////////////
  const handleUpdateReminder = async () => {
    if (!formData.title || !formData.reminder_date) {
      return toast.error("Fill all the required fields!");
    }

    try {
      const response = await axiosInstance.put(
        `/ai_reminder/update/${editingReminder?.uuid}`,
        formData,
      );
      if (response.status === 200) {
        toast.success("Reminder updated successfully!");
        fetchRecurringReminders();
        setReminders((prev) =>
          prev.map((r) =>
            r.uuid === editingReminder?.uuid
              ? { ...r, ...response.data.response }
              : r,
          ),
        );
      }
    } catch (error) {
      console.log("Error occur while updating the reminder", error);
    } finally {
      setShowForm(false);
    }
  };

  /////////////////////////
  // Update Reminder Status
  ///////////////////////////
  const toggleStatus = async (reminder: Reminder) => {
    if (reminder.status === "sent" || reminder.status === "missed") {
      return toast.error(
        `You can't change status as its already marked as ${reminder.status}`,
      );
    }

    try {
      const updatedStatus =
        reminder.status.toLowerCase() === "pending" ? "completed" : "pending";
      const response = await axiosInstance.patch(
        `/ai_reminder/update/status/${reminder.uuid}`,
        { status: updatedStatus },
      );
      if (response.status === 200) {
        toast.success("Status updated successfully!");
        setReminders(
          reminders.map((r) =>
            r.uuid === reminder.uuid ? { ...r, status: updatedStatus } : r,
          ),
        );
      }
    } catch (error) {
      console.log("Error occur while updating reminder status", error);
    }
  };

  /////////////////////////
  // Update Reminder Modal Open
  ///////////////////////////
  const handleUpdateModalOpen = (reminder: Reminder) => {
    setShowForm(true);
    setShowCalendarModal(false);
    setEditingReminder(reminder);
    console.log(reminder);
    setFormData({
      ...formData,
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      reminder_date: new Date(reminder.reminder_date)
        .toISOString()
        .split("T")[0],
      notify_before: reminder.notify_before,
      notify_channels: reminder.notify_channels,
      recurrence_rule: reminder.recurrence_rule,
    });
  };

  /////////////////////////
  // Create Reminder Modal Open
  ///////////////////////////
  const handleCreateModalOpen = () => {
    setEditingReminder(null);
    setShowForm(true);
    setFormData({
      user_id: !loading ? user?.user.user_id : "",
      title: "",
      description: "",
      type: "Custom",
      reminder_date: "",
      notify_before: 1,
      notify_channels: { email: true, whatsapp: true, push: false },
      recurrence_rule: "none",
    });
  };

  /////////////////////////
  // Notify Channel Change
  ///////////////////////////
  const handleNotifyChannelChange = (
    channel: keyof FormData["notify_channels"],
  ) => {
    setFormData({
      ...formData,
      notify_channels: {
        ...formData.notify_channels,
        [channel]: !formData.notify_channels[channel],
      },
    });
  };

  const filteredReminders = reminders.filter((r) => {
    const typeMatch = filterType === "all" || r.type === filterType;
    const statusMatch = filterStatus === "all" || r.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen text-text-heading p-4 mb-8">
        <div className="w-full">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-text-heading flex items-center gap-3">
                  <div className="relative">
                    <Bell className="w-8 h-8" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-warning rounded-full animate-pulse"></div>
                  </div>
                  Smart Reminders
                </h1>
                <p className="text-text-secondary mt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-status-warning animate-pulse" />
                  AI-powered compliance & business automation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRecurring(true)}
                  className="relative bg-surface p-3 rounded-lg shadow-card border border-border hover:shadow-raised transition-all"
                  title="View Recurring Reminders"
                >
                  <RefreshCcw className="w-5 h-5 text-text-secondary" />
                  {recurringReminders.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-status-warning text-on-brand text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold animate-bounce">
                      {recurringReminders.length}
                    </span>
                  )}
                </button>
                <Button
                  onClick={handleCreateModalOpen}
                  startIcon={<Plus className="w-5 h-5" />}
                  className="bg-brand hover:bg-brand-hover text-on-brand"
                >
                  New Reminder
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {/* Filters and View Toggle */}
              <div className="bg-surface p-4 rounded-xl shadow-card border border-border mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm font-medium text-text-secondary">
                      Filter by:
                    </span>
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm text-text-secondary bg-bg-base focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
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
                    className="px-3 py-2 border border-border rounded-lg text-sm text-text-secondary bg-bg-base focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="sent">Sent</option>
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                  </select>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-brand text-on-brand shadow-card"
                          : "bg-bg-base text-text-secondary hover:bg-border"
                      }`}
                      title="List View"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "calendar"
                          ? "bg-brand text-on-brand shadow-card"
                          : "bg-bg-base text-text-secondary hover:bg-border"
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
                  onToggleStatus={toggleStatus}
                  onDelete={handleDelete}
                  onUpdate={handleUpdateModalOpen}
                  showCalendarModal={showCalendarModal}
                  setShowCalendarModal={setShowCalendarModal}
                />
              ) : (
                <div className="space-y-4">
                  {!isLoading ? (
                    filteredReminders.length === 0 ? (
                      <div className="bg-surface p-12 rounded-xl shadow-card border border-border text-center">
                        <Bell className="w-16 h-16 text-border mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-secondary mb-2">
                          No reminders found
                        </h3>
                        <p className="text-sm text-text-muted">
                          Create your first reminder or let AI auto-detect them
                        </p>
                      </div>
                    ) : (
                      filteredReminders.map((reminder) => (
                        <ReminderCard
                          key={reminder.uuid}
                          reminder={reminder}
                          typeColors={typeColors}
                          statusColors={statusColors}
                          onToggleStatus={toggleStatus}
                          onUpdate={handleUpdateModalOpen}
                          onDelete={handleDelete}
                          formatDate={formatDate}
                        />
                      ))
                    )
                  ) : (
                    <div className="flex items-center justify-center p-15">
                      <LoadingSpinner size="w-8 h-8" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="bg-surface p-5 rounded-xl shadow-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-text-heading">Overview</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-bg-base rounded-lg border border-border hover:shadow-card transition-shadow">
                    <span className="text-sm text-text-secondary">
                      Total Reminders
                    </span>
                    <span className="font-bold text-text-heading text-lg">
                      {reminders.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-status-warning-bg rounded-lg border border-status-warning-border hover:shadow-card transition-shadow">
                    <span className="text-sm text-text-secondary">Pending</span>
                    <span className="font-bold text-status-warning text-lg">
                      {reminders.filter((r) => r.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-status-success-bg rounded-lg border border-status-success-border hover:shadow-card transition-shadow">
                    <span className="text-sm text-text-secondary">
                      Completed
                    </span>
                    <span className="font-bold text-status-success text-lg">
                      {reminders.filter((r) => r.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-brand-light rounded-lg border border-border hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-text-secondary">
                        AI Created
                      </span>
                    </div>
                    <span className="font-bold text-secondary text-lg">0</span>
                  </div>
                </div>
              </div>

              {/* By Type */}
              <div className="bg-surface p-5 rounded-xl shadow-card border border-border">
                <h3 className="font-semibold text-text-heading mb-4">
                  By Type
                </h3>
                <div className="space-y-2">
                  {reminderTypes.map((type) => {
                    const count = reminders.filter(
                      (r) => r.type === type,
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
                          <span className="text-sm font-semibold text-text-secondary">
                            {count}
                          </span>
                        </div>
                        <div className="w-full bg-border rounded-full h-1.5">
                          <div
                            className="bg-brand h-1.5 rounded-full transition-all"
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
            size="lg"
          >
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    placeholder="Enter reminder title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary resize-none"
                    placeholder="Enter reminder description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
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
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    >
                      {reminderTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Reminder Date *
                    </label>
                    <input
                      type="date"
                      value={formData.reminder_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reminder_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Notify Before
                    </label>
                    <select
                      value={formData.notify_before}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notify_before: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    >
                      {notifyBeforeOptions.map((option) => (
                        <option key={option.name} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Recurrence
                    </label>
                    <select
                      value={formData.recurrence_rule}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recurrence_rule: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    >
                      {recurrenceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === "none"
                            ? "No Recurrence"
                            : option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Notification Channels
                  </label>
                  <div className="flex gap-4">
                    {(["email", "whatsapp", "push"] as const).map((channel) => (
                      <label
                        key={channel}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.notify_channels[channel]}
                          onChange={() => handleNotifyChannelChange(channel)}
                          className="rounded accent-secondary border-border focus:ring-1 focus:ring-secondary"
                        />
                        <span className="text-sm text-text-secondary capitalize">
                          {channel}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-status-info-bg border border-status-info-border rounded-lg p-3 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-status-info flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary">
                    <strong>Note:</strong> Set your preferred reminder date and
                    notification preferences.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="border border-border text-text-secondary hover:bg-bg-base bg-transparent flex-1"
                    onClick={() => {
                      setShowForm(false);
                      setEditingReminder(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-2"
                    onClick={
                      editingReminder
                        ? handleUpdateReminder
                        : handleCreateReminder
                    }
                  >
                    {editingReminder ? "Update" : "Create"} Reminder
                  </Button>
                </div>
              </div>
            </div>
          </Modal>

          {/* Recurring Reminders Modal */}
          <Modal
            isOpen={showRecurring}
            onClose={() => setShowRecurring(false)}
            title={"Recurring Reminders"}
            titleIcon={<Calendar className="w-5 h-5 text-white" />}
            size="lg"
          >
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {recurringReminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Calendar className="w-16 h-16 text-border mb-4" />
                  <h3 className="text-lg font-semibold text-text-heading mb-1">
                    No Recurring Reminders
                  </h3>
                  <p className="text-sm text-text-muted">
                    You haven&apos;t created any recurring reminders yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recurringReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.uuid}
                      reminder={reminder}
                      typeColors={typeColors}
                      statusColors={statusColors}
                      onToggleStatus={toggleStatus}
                      onUpdate={handleUpdateModalOpen}
                      onDelete={handleDelete}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-bg-base flex justify-between items-center">
              <span className="text-sm text-text-secondary">
                {recurringReminders.length} reminder
                {recurringReminders.length !== 1 ? "s" : ""}
              </span>
              <Button
                className="px-4 py-2"
                onClick={() => setShowRecurring(false)}
              >
                Close
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIRemindersPage;
