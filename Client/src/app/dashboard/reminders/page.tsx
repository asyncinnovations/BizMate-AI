"use client";
// src/app/dashboard/reminders/page.tsx
// UPDATED — complete overhaul with:
//   1. AI prompt box in create modal (POST /ai_reminder/ai-generate)
//   2. AI Detected suggestions sidebar (GET /ai_reminder/suggestions/:id)
//   3. Invoice + Quotation + Document as reminder types
//   4. notify_before extended to 1/2/3/5/7/14/30 days
//   5. AI Created count reads from real source field
//   6. Urgency indicators on overdue reminders
//   7. onViewReference navigates to source record
//   8. Source + reference passed when creating from module suggestion

import React, { useEffect, useRef, useState } from "react";
import {
  Bell, Plus, Calendar, Filter, Sparkles,
  TrendingUp, RefreshCcw, Brain, Zap, AlertTriangle,
  AlertCircle, X, CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout      from "@/components/layout/DashboardLayout";
import Modal                from "@/components/ui/Modal";
import ReminderCalendar     from "@/components/calendar/Calendar";
import ReminderCard         from "@/components/reminder-card/ReminderCard";
import axiosInstance        from "@/utils/axiosInstance";
import toast                from "react-hot-toast";
import { useAuth }          from "@/context/AuthContext";
import { formatDate }       from "@/utils/formatDate";
import Button               from "@/components/ui/Button";
import LoadingSpinner        from "@/components/loading-spinner/LoadingSpinner";
import { useSubscription }      from "@/context/SubscriptionContext";
import { useSubscriptionGuard } from "@/hooks/useSubscriptionGuard";

// ── Types ────────────────────────────────────────────────────────────────────
type ReminderStatus = "pending" | "sent" | "completed" | "missed";
type ReminderType   = "VAT" | "License" | "Payroll" | "Invoice" | "Quotation" | "Document" | "Custom";
type ReminderSource = "manual" | "ai" | "invoice" | "quotation" | "document" | "compliance";
type ViewMode       = "list" | "calendar";

interface Reminder {
  uuid:           string;
  title:          string;
  description?:   string;
  type:           ReminderType;
  reminder_date:  string;
  notify_before:  number;
  notify_channels: { email: boolean; whatsapp: boolean; push: boolean };
  recurrence_rule: string;
  status:          ReminderStatus;
  source?:         ReminderSource;
  reference_id?:   string | null;
  reference_type?: string | null;
}

interface ModuleSuggestion {
  type:           string;
  source:         string;
  reference_id:   string;
  reference_type: string;
  title:          string;
  description:    string;
  suggested_date: string;
  notify_before:  number;
  priority:       "high" | "medium" | "low";
}

interface FormData {
  user_id:         string | unknown;
  title:           string;
  description:     string;
  type:            ReminderType;
  reminder_date:   string;
  notify_before:   number;
  notify_channels: { email: boolean; whatsapp: boolean; push: boolean };
  recurrence_rule: string;
  source:          ReminderSource;
  reference_id:    string | null;
  reference_type:  string | null;
  ai_prompt:       string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const REMINDER_TYPES: ReminderType[] = [
  "VAT", "License", "Payroll", "Invoice", "Quotation", "Document", "Custom",
];

const NOTIFY_BEFORE_OPTIONS = [
  { name: "1 day",   value: 1  },
  { name: "2 days",  value: 2  },
  { name: "3 days",  value: 3  },
  { name: "5 days",  value: 5  },
  { name: "7 days",  value: 7  },
  { name: "14 days", value: 14 },
  { name: "30 days", value: 30 },
];

const RECURRENCE_OPTIONS = ["none", "monthly", "quarterly", "yearly"];

const TYPE_COLORS: Record<string, string> = {
  VAT:        "bg-brand-light text-secondary",
  License:    "bg-status-info-bg text-status-info",
  Payroll:    "bg-status-success-bg text-status-success",
  Invoice:    "bg-indigo-100 text-indigo-700",
  Quotation:  "bg-amber-100 text-amber-700",
  Document:   "bg-green-100 text-green-700",
  Custom:     "bg-bg-base text-text-muted",
};

const STATUS_COLORS: Record<ReminderStatus, string> = {
  pending:   "bg-status-warning-bg text-status-warning",
  sent:      "bg-status-info-bg text-status-info",
  completed: "bg-status-success-bg text-status-success",
  missed:    "bg-status-error-bg text-status-error",
};

const PRIORITY_STYLES = {
  high:   "bg-red-50 border-red-200 text-red-700",
  medium: "bg-amber-50 border-amber-200 text-amber-700",
  low:    "bg-blue-50 border-blue-200 text-blue-700",
};

const EMPTY_FORM = (userId: any): FormData => ({
  user_id:         userId ?? "",
  title:           "",
  description:     "",
  type:            "Custom",
  reminder_date:   "",
  notify_before:   3,
  notify_channels: { email: true, whatsapp: true, push: false },
  recurrence_rule: "none",
  source:          "manual",
  reference_id:    null,
  reference_type:  null,
  ai_prompt:       null,
});

// ── Page component ────────────────────────────────────────────────────────────
const AIRemindersPage = () => {
  const router = useRouter();
  const { currentPlan, features }                              = useSubscription();
  const { isPlanCapable, incrementOnly, enforceAndIncrement } = useSubscriptionGuard();
  const { loading, user }                = useAuth();

  const userId = !loading ? user?.user.user_id : null;
  // FIX 2: capability-based check — survives plan renames.
  // Old: currentPlan?.name === "Pro" || "Enterprise" — "Enterprise" is always truthy in JS.
  const isPro = isPlanCapable("reminders");

  // ── Data state ─────────────────────────────────────────────────────────────
  const [reminders,          setReminders]          = useState<Reminder[]>([]);
  const [recurringReminders, setRecurringReminders] = useState<Reminder[]>([]);
  const [suggestions,        setSuggestions]        = useState<ModuleSuggestion[]>([]);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isSuggestLoading,   setIsSuggestLoading]   = useState(false);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [showForm,          setShowForm]          = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showRecurring,     setShowRecurring]     = useState(false);
  const [viewMode,          setViewMode]          = useState<ViewMode>("list");
  const [filterType,        setFilterType]        = useState("all");
  const [filterStatus,      setFilterStatus]      = useState("all");
  const [editingReminder,   setEditingReminder]   = useState<Reminder | null>(null);
  const [formData,          setFormData]          = useState<FormData>(EMPTY_FORM(userId));

  // ── Usage meter state ─────────────────────────────────────────────────────
  // FIX: reads from features.quota.reminders.limit (nested) not flat field
  const reminderLimit = (features as any)?.quota?.reminders?.limit ?? -1;

  // ── Search state ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  // ── AI prompt modal state ──────────────────────────────────────────────────
  const [aiPrompt,      setAiPrompt]      = useState("");
  const [isAiLoading,   setIsAiLoading]   = useState(false);
  const [aiPromptError, setAiPromptError] = useState("");
  const [isCreating,    setIsCreating]    = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAllReminders = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/ai_reminder/user/${userId}`);
      if (res.status === 200) setReminders(res.data.response);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const fetchRecurringReminders = async () => {
    if (!userId) return;
    try {
      const res = await axiosInstance.get(`/ai_reminder/recurring/${userId}`);
      if (res.status === 200) setRecurringReminders(res.data.response);
    } catch (e) { console.error(e); }
  };

  const fetchSuggestions = async () => {
    if (!userId) return;
    setIsSuggestLoading(true);
    try {
      const res = await axiosInstance.get(`/ai_reminder/suggestions/${userId}`);
      if (res.status === 200) setSuggestions(res.data.suggestions ?? []);
    } catch (e) { console.error(e); }
    finally { setIsSuggestLoading(false); }
  };

  useEffect(() => {
    if (!loading && userId) {
      fetchAllReminders();
      fetchRecurringReminders();
      fetchSuggestions();
    }
  }, [loading, userId]);

  // ── KPI derivations ────────────────────────────────────────────────────────
  const aiCreatedCount = reminders.filter(
    (r) => r.source && r.source !== "manual"
  ).length;

  const overdueCount = reminders.filter((r) => {
    if (r.status !== "pending") return false;
    return new Date(r.reminder_date) < new Date();
  }).length;

  // ── AI prompt → pre-fill form ──────────────────────────────────────────────
  const handleAiPromptGenerate = async () => {
    if (!aiPrompt.trim()) { setAiPromptError("Please describe your reminder."); return; }
    setAiPromptError("");
    setIsAiLoading(true);
    try {
      const res = await axiosInstance.post("/ai_reminder/ai-generate", {
        user_id: userId, prompt: aiPrompt,
      });
      if (res.status === 201 && res.data?.ai_result) {
        const ai = res.data.ai_result;
        setFormData((prev) => ({
          ...prev,
          title:           ai.title          ?? prev.title,
          description:     ai.description    ?? prev.description,
          type:            ai.type           ?? "Custom",
          reminder_date:   ai.reminder_date  ?? prev.reminder_date,
          notify_before:   ai.notify_before  ?? 3,
          recurrence_rule: ai.recurrence_rule ?? "none",
          notify_channels: ai.notify_channels ?? prev.notify_channels,
          source:          "ai",
          ai_prompt:       aiPrompt,
        }));
        toast.success("AI filled the form. Review and save.");
        setAiPrompt("");
      }
    } catch (e: any) {
      setAiPromptError(e?.response?.data?.message ?? "AI generation failed. Please try again.");
    } finally { setIsAiLoading(false); }
  };

  // ── Create reminder ────────────────────────────────────────────────────────
  const handleCreateReminder = async () => {
    if (!formData.title || !formData.reminder_date) {
      return toast.error("Title and reminder date are required.");
    }
    setIsCreating(true);
    try {
      // FIX 3: enforceAndIncrement reads features.quota.reminders.limit via
      // nested path resolver in useSubscriptionGuard. Old code read
      // currentPlan?.features?.reminders (flat, always undefined → NaN → never blocked).
      const { allowed, reason } = await enforceAndIncrement(
        "reminders",
        () => axiosInstance.post("/ai_reminder/create", { ...formData, user_id: userId }),
      );
      if (!allowed) {
        return toast.error(reason ?? "Reminder limit reached. Upgrade to continue.");
      }
      toast.success("Reminder created successfully!");
      // enforceAndIncrement already incremented usage — no separate call needed
      setReminders((prev) => [...prev, (allowed as any)?.data?.response ?? formData]);
      fetchAllReminders();
      fetchRecurringReminders();
      resetForm();
    } catch (e) { console.error(e); }
    finally { setIsCreating(false); }
  };

  // ── Create from module suggestion (one-click) ──────────────────────────────
  const handleCreateFromSuggestion = async (s: ModuleSuggestion) => {
    try {
      const res = await axiosInstance.post("/ai_reminder/from-module", {
        user_id:        userId,
        type:           s.type,
        source:         s.source,
        reference_id:   s.reference_id,
        reference_type: s.reference_type,
        title:          s.title,
        description:    s.description,
        reminder_date:  s.suggested_date,
        notify_before:  s.notify_before,
        notify_channels: { email: true, whatsapp: false, push: true },
        recurrence_rule: "none",
      });
      if (res.data?.duplicate) {
        toast("A reminder for this item already exists.", { icon: "ℹ️" });
        return;
      }
      toast.success("Reminder created from suggestion!");
      setReminders((prev) => [...prev, res.data.reminder]);
      // Remove from suggestions list
      setSuggestions((prev) => prev.filter((x) => x.reference_id !== s.reference_id));
    } catch (e) { toast.error("Failed to create reminder."); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete this reminder?")) return;
    try {
      const res = await axiosInstance.delete(`/ai_reminder/delete/${uuid}`);
      if (res.status === 200) {
        toast.success("Reminder deleted.");
        fetchRecurringReminders();
        setReminders((prev) => prev.filter((r) => r.uuid !== uuid));
      }
    } catch (e) { console.error(e); }
    finally { setShowCalendarModal(false); }
  };

  // ── Update ─────────────────────────────────────────────────────────────────
  const handleUpdateReminder = async () => {
    if (!formData.title || !formData.reminder_date) {
      return toast.error("Title and date are required.");
    }
    try {
      const res = await axiosInstance.put(
        `/ai_reminder/update/${editingReminder?.uuid}`,
        formData,
      );
      if (res.status === 200) {
        toast.success("Reminder updated.");
        fetchRecurringReminders();
        setReminders((prev) =>
          prev.map((r) => r.uuid === editingReminder?.uuid ? { ...r, ...res.data.response } : r)
        );
        resetForm();
      }
    } catch (e) { console.error(e); }
  };

  // ── Status toggle ──────────────────────────────────────────────────────────
  const toggleStatus = async (reminder: Reminder) => {
    if (reminder.status === "sent" || reminder.status === "missed") {
      return toast.error(`Status is already "${reminder.status}" — cannot change.`);
    }
    const next = reminder.status === "pending" ? "completed" : "pending";
    try {
      const res = await axiosInstance.patch(
        `/ai_reminder/update/status/${reminder.uuid}`,
        { status: next },
      );
      if (res.status === 200) {
        toast.success("Status updated.");
        setReminders(reminders.map((r) =>
          r.uuid === reminder.uuid ? { ...r, status: next as ReminderStatus } : r
        ));
      }
    } catch (e) { console.error(e); }
  };

  // ── Navigate to source record ──────────────────────────────────────────────
  const handleViewReference = (referenceId: string, referenceType: string) => {
    const routes: Record<string, string> = {
      Invoice:    `/dashboard/invoicing/preview/${referenceId}`,
      Quotation:  `/dashboard/quotations/${referenceId}`,
      Document:   `/dashboard/documents/preview/${referenceId}`,
    };
    const route = routes[referenceType];
    if (route) router.push(route);
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const handleCreateModalOpen = () => {
    setEditingReminder(null);
    setFormData(EMPTY_FORM(userId));
    setAiPrompt("");
    setAiPromptError("");
    setShowForm(true);
  };

  const handleUpdateModalOpen = (reminder: Reminder) => {
    setShowForm(true);
    setShowCalendarModal(false);
    setEditingReminder(reminder);
    setFormData({
      user_id:         userId,
      title:           reminder.title,
      description:     reminder.description  ?? "",
      type:            reminder.type,
      reminder_date:   new Date(reminder.reminder_date).toISOString().split("T")[0],
      notify_before:   reminder.notify_before,
      notify_channels: reminder.notify_channels,
      recurrence_rule: reminder.recurrence_rule,
      source:          reminder.source         ?? "manual",
      reference_id:    reminder.reference_id   ?? null,
      reference_type:  reminder.reference_type ?? null,
      ai_prompt:       null,
    });
  };

  const handleNotifyChannelChange = (channel: keyof FormData["notify_channels"]) => {
    setFormData((prev) => ({
      ...prev,
      notify_channels: {
        ...prev.notify_channels,
        [channel]: !prev.notify_channels[channel],
      },
    }));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingReminder(null);
    setFormData(EMPTY_FORM(userId));
    setAiPrompt("");
    setAiPromptError("");
  };

  const filteredReminders = reminders.filter((r) => {
    const typeMatch   = filterType   === "all" || r.type   === filterType;
    const statusMatch = filterStatus === "all" || r.status === filterStatus;
    // FIX 5: client-side search (title + description)
    const q = searchQuery.toLowerCase().trim();
    const searchMatch = !q ||
      r.title.toLowerCase().includes(q) ||
      (r.description ?? "").toLowerCase().includes(q);
    return typeMatch && statusMatch && searchMatch;
  });

  // Shared input class
  const inputCls = "w-full px-3 py-2 border border-border rounded-lg bg-bg-base text-text-secondary text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary";

  return (
    <DashboardLayout>
      <div className="min-h-screen text-text-heading p-4 mb-8">
        <div className="w-full">

          {/* ── Page header ──────────────────────────────────────────────── */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-heading flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-8 h-8" />
                  {overdueCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                Smart Reminders
              </h1>
              <p className="text-text-secondary mt-2 flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-status-warning animate-pulse" />
                AI-powered compliance and business automation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRecurring(true)}
                className="relative bg-surface p-3 rounded-lg shadow-card border border-border hover:shadow-raised transition-all"
                title="Recurring reminders"
              >
                <RefreshCcw className="w-5 h-5 text-text-secondary" />
                {recurringReminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-status-warning text-on-brand text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                    {recurringReminders.length}
                  </span>
                )}
              </button>
              <Button onClick={handleCreateModalOpen} startIcon={<Plus className="w-5 h-5" />}>
                New Reminder
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Main content (2/3) ───────────────────────────────────── */}
            <div className="lg:col-span-2">

              {/* Overdue alert banner */}
              {overdueCount > 0 && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-5">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-red-700">
                    {overdueCount} reminder{overdueCount > 1 ? "s are" : " is"} overdue and need{overdueCount === 1 ? "s" : ""} your attention.
                  </p>
                </div>
              )}

              {/* Filters + view toggle */}
              <div className="bg-surface p-4 rounded-xl shadow-card border border-border mb-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Filter className="w-4 h-4 text-text-secondary flex-shrink-0" />
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputCls} style={{ width: "auto" }}>
                    <option value="all">All Types</option>
                    {REMINDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputCls} style={{ width: "auto" }}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="sent">Sent</option>
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                  </select>
                  <button onClick={() => { fetchAllReminders(); fetchSuggestions(); }} className="p-2 bg-bg-base hover:bg-border rounded-lg transition-colors" title="Refresh">
                    <RefreshCcw className="w-4 h-4 text-text-secondary" />
                  </button>
                  <div className="ml-auto flex gap-1.5">
                    {(["list", "calendar"] as ViewMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setViewMode(m)}
                        className={`p-2 rounded-lg transition-all ${viewMode === m ? "bg-brand text-on-brand shadow-card" : "bg-bg-base text-text-secondary hover:bg-border"}`}
                        title={`${m} view`}
                      >
                        {m === "list" ? <Bell className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calendar or list */}
              {viewMode === "calendar" ? (
                <ReminderCalendar
                  reminders={filteredReminders}
                  typeColors={TYPE_COLORS}
                  onToggleStatus={toggleStatus}
                  onDelete={handleDelete}
                  onUpdate={handleUpdateModalOpen}
                  showCalendarModal={showCalendarModal}
                  setShowCalendarModal={setShowCalendarModal}
                />
              ) : (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-16"><LoadingSpinner size="w-8 h-8" /></div>
                  ) : filteredReminders.length === 0 ? (
                    <div className="bg-surface p-12 rounded-xl shadow-card border border-border text-center">
                      <Bell className="w-16 h-16 text-border mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-text-secondary mb-2">No reminders found</h3>
                      <p className="text-sm text-text-muted mb-4">Create your first reminder or let AI detect them from your invoices and quotations.</p>
                      <Button onClick={handleCreateModalOpen} startIcon={<Plus className="w-4 h-4" />}>New Reminder</Button>
                    </div>
                  ) : (
                    filteredReminders.map((reminder) => (
                      <ReminderCard
                        key={reminder.uuid}
                        reminder={reminder}
                        typeColors={TYPE_COLORS}
                        statusColors={STATUS_COLORS}
                        onToggleStatus={toggleStatus}
                        onUpdate={handleUpdateModalOpen}
                        onDelete={handleDelete}
                        formatDate={formatDate}
                        onViewReference={handleViewReference}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* ── Sidebar (1/3) ────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Overview stats */}
              <div className="bg-surface p-5 rounded-xl shadow-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-text-heading">Overview</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Total",      value: reminders.length,                                    bg: "bg-bg-base border-border",                 vColor: "" },
                    { label: "Pending",    value: reminders.filter(r=>r.status==="pending").length,    bg: "bg-status-warning-bg border-status-warning-border", vColor: "text-status-warning" },
                    { label: "Completed",  value: reminders.filter(r=>r.status==="completed").length,  bg: "bg-status-success-bg border-status-success-border", vColor: "text-status-success" },
                    { label: "Overdue",    value: overdueCount,                                        bg: overdueCount>0?"bg-red-50 border-red-200":"bg-bg-base border-border", vColor: overdueCount>0?"text-red-600":"" },
                  ].map(({ label, value, bg, vColor }) => (
                    <div key={label} className={`flex items-center justify-between p-3 rounded-lg border hover:shadow-card transition-shadow ${bg}`}>
                      <span className="text-sm text-text-secondary">{label}</span>
                      <span className={`font-bold text-lg ${vColor || "text-text-heading"}`}>{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200 hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-text-secondary">AI Created</span>
                    </div>
                    <span className="font-bold text-lg text-indigo-600">{aiCreatedCount}</span>
                  </div>
                  {/* FIX 6: usage meter — only shown when there's a real limit */}
                  {reminderLimit > 0 && (
                    <div className="p-3 bg-bg-base rounded-lg border border-border">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-text-secondary font-medium">Reminders used</span>
                        <span className="text-xs font-semibold text-text-heading">
                          {reminders.length} / {reminderLimit}
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (reminders.length / reminderLimit) * 100)}%`,
                            background: reminders.length >= reminderLimit ? "var(--status-error)" : "var(--accent)",
                          }}
                        />
                      </div>
                      {reminders.length >= reminderLimit && (
                        <a href="/dashboard/pricing" className="block mt-2 text-xs text-secondary font-semibold hover:underline">
                          Upgrade for unlimited →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* By type breakdown */}
              <div className="bg-surface p-5 rounded-xl shadow-card border border-border">
                <h3 className="font-semibold text-text-heading mb-4">By Type</h3>
                <div className="space-y-2.5">
                  {REMINDER_TYPES.map((type) => {
                    const count      = reminders.filter((r) => r.type === type).length;
                    const percentage = reminders.length > 0 ? (count / reminders.length) * 100 : 0;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[type]}`}>{type}</span>
                          <span className="text-sm font-semibold text-text-secondary">{count}</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-1.5">
                          <div className="bg-brand h-1.5 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Detected suggestions — NEW */}
              <div className="bg-indigo-50/40 rounded-xl border border-indigo-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">AI Detected</span>
                  {suggestions.length > 0 && (
                    <span className="ml-auto text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">
                      {suggestions.length} new
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  {isSuggestLoading ? (
                    <div className="flex items-center justify-center py-4"><LoadingSpinner size="w-5 h-5" /></div>
                  ) : suggestions.length === 0 ? (
                    <p className="text-xs text-indigo-400 text-center py-3">
                      No suggestions right now. AI monitors your invoices and quotations automatically.
                    </p>
                  ) : (
                    suggestions.slice(0, 4).map((s, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs leading-relaxed ${PRIORITY_STYLES[s.priority]}`}
                      >
                        <div className="font-semibold mb-1 truncate">{s.title}</div>
                        <div className="opacity-80 mb-2">{s.description}</div>
                        <button
                          onClick={() => handleCreateFromSuggestion(s)}
                          className="text-[10px] font-semibold bg-white/60 hover:bg-white/90 border border-current/20 px-2.5 py-1 rounded-full transition-colors"
                        >
                          + Create Reminder
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Create / Edit Reminder Modal ─────────────────────────── */}
          <Modal
            isOpen={showForm}
            onClose={resetForm}
            title={editingReminder ? "Edit Reminder" : "Create New Reminder"}
            titleIcon={<Bell className="w-5 h-5 text-white" />}
            size="lg"
          >
            <div className="p-6 space-y-4">

              {/* FIX 4: AI prompt box — only shown when creating AND on Growth/Enterprise */}
              {!editingReminder && isPro && (
                <>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-700">AI-Assisted Creation</span>
                    </div>
                    <p className="text-xs text-indigo-500 mb-3">Describe in plain English — AI fills the form for you.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => { setAiPrompt(e.target.value); setAiPromptError(""); }}
                        placeholder="e.g. Remind me to renew trade license in 30 days..."
                        className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg bg-white text-sm text-text-secondary focus:outline-none focus:ring-1 focus:ring-indigo-300"
                        onKeyDown={(e) => { if (e.key === "Enter" && !isAiLoading) handleAiPromptGenerate(); }}
                      />
                      <button
                        onClick={handleAiPromptGenerate}
                        disabled={isAiLoading || !aiPrompt.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {isAiLoading ? "Generating…" : "Fill Form"}
                      </button>
                    </div>
                    {aiPromptError && (
                      <p className="flex items-center gap-1 mt-2 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />{aiPromptError}
                      </p>
                    )}
                    {formData.source === "ai" && (
                      <p className="flex items-center gap-1 mt-2 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />AI pre-filled the form below. Review and adjust before saving.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-text-muted">or fill manually</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                </>
              )}
              {/* FIX 4: locked AI prompt for Free/Starter users */}
              {!editingReminder && !isPro && (
                <div className="flex items-start gap-3 p-3.5 bg-bg-base rounded-xl border border-border mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-heading">AI Reminder Creation</p>
                    <p className="text-xs text-text-muted mt-0.5">Describe your reminder in plain English and AI fills the form. Available on Growth and Enterprise plans.</p>
                    <a href="/dashboard/pricing" className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-secondary hover:underline">
                      Upgrade to Growth →
                    </a>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputCls} placeholder="e.g. VAT Return — Q3 2026" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="Optional notes…" rows={2} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as ReminderType })} className={inputCls}>
                    {REMINDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Reminder Date *</label>
                  <input type="date" value={formData.reminder_date} onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })} className={inputCls} />
                </div>
                {/* Notify before */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Notify Before</label>
                  <select value={formData.notify_before} onChange={(e) => setFormData({ ...formData, notify_before: Number(e.target.value) })} className={inputCls}>
                    {NOTIFY_BEFORE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.name}</option>)}
                  </select>
                </div>
                {/* Recurrence */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Recurrence</label>
                  <select value={formData.recurrence_rule} onChange={(e) => setFormData({ ...formData, recurrence_rule: e.target.value })} className={inputCls}>
                    {RECURRENCE_OPTIONS.map((o) => <option key={o} value={o}>{o === "none" ? "No Recurrence" : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Notification Channels</label>
                <div className="flex gap-5">
                  {(["email", "whatsapp", "push"] as const).map((ch) => (
                    <label key={ch} className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
                      <input type="checkbox" checked={formData.notify_channels[ch]} onChange={() => handleNotifyChannelChange(ch)} className="rounded accent-secondary border-border" />
                      <span className="capitalize">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Info note */}
              <div className="bg-status-info-bg border border-status-info-border rounded-lg p-3 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-status-info flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary">
                  <strong>Tip:</strong> Use the AI prompt above to auto-fill this form from a natural language description.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button className="border border-border text-text-secondary hover:bg-bg-base bg-transparent flex-1" onClick={resetForm}>Cancel</Button>
                <Button className="flex-[2]" onClick={editingReminder ? handleUpdateReminder : handleCreateReminder} disabled={isCreating}>
                  {isCreating ? "Saving…" : `${editingReminder ? "Update" : "Create"} Reminder`}
                </Button>
              </div>
            </div>
          </Modal>

          {/* ── Recurring Reminders Modal ────────────────────────────── */}
          <Modal isOpen={showRecurring} onClose={() => setShowRecurring(false)} title="Recurring Reminders" titleIcon={<RefreshCcw className="w-5 h-5 text-white" />} size="lg">
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {recurringReminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Calendar className="w-16 h-16 text-border mb-4" />
                  <h3 className="text-lg font-semibold text-text-heading mb-1">No Recurring Reminders</h3>
                  <p className="text-sm text-text-muted">Set a recurrence when creating a reminder.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recurringReminders.map((r) => (
                    <ReminderCard key={r.uuid} reminder={r} typeColors={TYPE_COLORS} statusColors={STATUS_COLORS} onToggleStatus={toggleStatus} onUpdate={handleUpdateModalOpen} onDelete={handleDelete} formatDate={formatDate} onViewReference={handleViewReference} />
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border bg-bg-base flex justify-between items-center">
              <span className="text-sm text-text-secondary">{recurringReminders.length} reminder{recurringReminders.length !== 1 ? "s" : ""}</span>
              <Button className="px-4 py-2" onClick={() => setShowRecurring(false)}>Close</Button>
            </div>
          </Modal>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIRemindersPage;
