"use client";
// src/app/dashboard/notifications/page.tsx
// UPDATED:
// 1. handleMarkAllRead now calls PUT /notifications/mark-all-read/:user_id (single API call)
// 2. Event type icons and colours from event_type field
// 3. Filter by event_type (not just notification_type)
// 4. "Clear all" calls delete one by one (no bulk delete API yet — TODO V1.1)
// 5. Auto-refresh when page regains focus

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell, BellOff, CheckCheck, Trash2, Mail, Clock,
  FileText, CreditCard, FileCheck, RefreshCw, Filter,
} from "lucide-react";
import DashboardLayout  from "@/components/layout/DashboardLayout";
import axiosInstance    from "@/utils/axiosInstance";
import { useAuth }      from "@/context/AuthContext";
import LoadingSpinner   from "@/components/loading-spinner/LoadingSpinner";
import EmptyState       from "@/components/empty-state/EmptyState";
import toast            from "react-hot-toast";
import PageHeader       from "@/components/page-header/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Notification {
  uuid:              string;
  user_id:           string;
  title:             string;
  message:           string;
  event_type:        string;
  notification_type: string;
  status:            "pending" | "sent" | "read" | "failed";
  is_read:           boolean;
  created_at:        string;
  sent_at?:          string;
  reference_id?:     string;
  reminder_id?:      string;
  document_id?:      string;
}

// ─── Event config ─────────────────────────────────────────────────────────────
const EVENT_CFG: Record<string, { label: string; icon: React.ReactNode; bg: string; color: string }> = {
  reminder:              { label: "Reminder",           icon: <Clock className="w-4 h-4"/>,     bg: "#EFF6FF", color: "#1D4ED8" },
  invoice_paid:          { label: "Invoice Paid",       icon: <CreditCard className="w-4 h-4"/>, bg: "#ECFDF5", color: "#059669" },
  invoice_sent:          { label: "Invoice Sent",       icon: <Mail className="w-4 h-4"/>,       bg: "#EFF6FF", color: "#2563EB" },
  quotation_accepted:    { label: "Quotation Accepted", icon: <FileCheck className="w-4 h-4"/>,  bg: "#F5F3FF", color: "#7C3AED" },
  quotation_rejected:    { label: "Quotation Rejected", icon: <FileText className="w-4 h-4"/>,   bg: "#FEF2F2", color: "#DC2626" },
  quotation_sent:        { label: "Quotation Sent",     icon: <Mail className="w-4 h-4"/>,       bg: "#EFF6FF", color: "#2563EB" },
  document_finalised:    { label: "Document Finalised", icon: <FileText className="w-4 h-4"/>,   bg: "#F0FDFA", color: "#0D9488" },
  subscription_expiring: { label: "Subscription",       icon: <Bell className="w-4 h-4"/>,       bg: "#FFFBEB", color: "#D97706" },
  welcome:               { label: "Welcome",            icon: <Bell className="w-4 h-4"/>,       bg: "#FFF7ED", color: "#E8690A" },
  general:               { label: "General",            icon: <Bell className="w-4 h-4"/>,       bg: "#F8FAFC", color: "#64748B" },
};

function getCfg(event_type?: string) {
  return EVENT_CFG[event_type ?? "general"] ?? EVENT_CFG.general;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return new Date(dateStr).toLocaleDateString("en-AE", { day: "numeric", month: "short" });
}

const FILTER_TABS = [
  { id: "all",                   label: "All"        },
  { id: "reminder",              label: "Reminders"  },
  { id: "invoice_paid",          label: "Invoices"   },
  { id: "quotation_accepted",    label: "Quotations" },
  { id: "document_finalised",    label: "Documents"  },
  { id: "subscription_expiring", label: "Account"    },
];

// ─── Component ────────────────────────────────────────────────────────────────
const NotificationsPage = () => {
  const { user }   = useAuth();
  const userId     = user?.user?.user_id as string | undefined;

  const [notifications,      setNotifications]      = useState<Notification[]>([]);
  const [activeFilter,       setActiveFilter]       = useState("all");
  const [loading,            setLoading]            = useState(false);
  const [markReadLoadingId,  setMarkReadLoadingId]  = useState<string | null>(null);
  const [deleteLoadingId,    setDeleteLoadingId]    = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/notifications/user/${userId}`);
      setNotifications(res.data?.response ?? []);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId, fetchNotifications]);

  // Refresh on window focus
  useEffect(() => {
    const handler = () => { if (userId) fetchNotifications(); };
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [userId, fetchNotifications]);

  // ── Mark single as read ────────────────────────────────────────────────────
  const handleMarkRead = async (uuid: string) => {
    setMarkReadLoadingId(uuid);
    try {
      await axiosInstance.put(`/notifications/mark-read/${uuid}`);
      setNotifications((prev) =>
        prev.map((n) => n.uuid === uuid ? { ...n, status: "sent", is_read: true } : n)
      );
    } catch { toast.error("Failed to mark as read"); }
    finally  { setMarkReadLoadingId(null); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (uuid: string) => {
    setDeleteLoadingId(uuid);
    try {
      await axiosInstance.delete(`/notifications/delete/${uuid}`);
      setNotifications((prev) => prev.filter((n) => n.uuid !== uuid));
    } catch { toast.error("Failed to delete"); }
    finally  { setDeleteLoadingId(null); }
  };

  // ── Mark ALL read — single API call (new endpoint) ────────────────────────
  const handleMarkAllRead = async () => {
    if (!userId) return;
    const unread = notifications.filter((n) => n.status === "pending");
    if (!unread.length) return;
    try {
      await axiosInstance.put(`/notifications/mark-all-read/${userId}`);
      setNotifications((prev) =>
        prev.map((n) => n.status === "pending" ? { ...n, status: "sent", is_read: true } : n)
      );
      toast.success("All notifications marked as read");
    } catch { toast.error("Failed to mark all as read"); }
  };

  // ── Clear all ──────────────────────────────────────────────────────────────
  const handleClearAll = async () => {
    if (!notifications.length || !confirm("Delete all notifications?")) return;
    try {
      await Promise.all(
        notifications.map((n) => axiosInstance.delete(`/notifications/delete/${n.uuid}`))
      );
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch { toast.error("Failed to clear notifications"); }
  };

  // ── Derived state ──────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => n.status === "pending").length;

  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter((n) => n.event_type === activeFilter);

  const tabCls = (id: string) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
      activeFilter === id
        ? "bg-secondary text-on-brand"
        : "text-text-secondary hover:bg-bg-base"
    }`;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-bg-base p-4 mb-8">
        <div className="w-full">

          <PageHeader
            title="Notifications"
            icon={<Bell size={24} />}
            description="Alerts, reminders, and system events"
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1.5 px-4 py-2 text-secondary hover:bg-brand-light rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCheck className="w-4 h-4" /> Mark all read
                </button>
                <button
                  onClick={() => fetchNotifications()}
                  className="flex items-center gap-1.5 px-3 py-2 text-text-secondary border border-border bg-surface hover:bg-bg-base rounded-lg text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 text-status-error hover:bg-status-error-bg rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Clear all
                </button>
              </div>
            }
          />

          {/* Filter tabs */}
          <div className="flex gap-1 flex-wrap mb-5 bg-surface border border-border rounded-xl p-1.5">
            {FILTER_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveFilter(tab.id)} className={tabCls(tab.id)}>
                {tab.label}
                {tab.id !== "all" && (
                  <span className="ml-1.5 text-[10px] font-bold bg-black/10 px-1.5 py-0.5 rounded-full">
                    {notifications.filter((n) => n.event_type === tab.id).length}
                  </span>
                )}
                {tab.id === "all" && unreadCount > 0 && (
                  <span className="ml-1.5 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-24"><LoadingSpinner size="w-8 h-8" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title={activeFilter === "all" ? "No notifications yet" : `No ${activeFilter.replace("_", " ")} notifications`}
              description="Notifications appear here when invoices are paid, quotations are responded to, reminders fire, and more."
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => {
                const cfg    = getCfg(n.event_type);
                const unread = n.status === "pending";
                return (
                  <div
                    key={n.uuid}
                    className={`flex gap-4 p-4 rounded-xl border transition-all ${
                      unread
                        ? "bg-blue-50/30 border-blue-200/50 shadow-card"
                        : "bg-surface border-border"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-semibold text-text-heading ${unread ? "font-bold" : ""}`}>
                            {n.title}
                          </p>
                          <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                        {unread && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-xs text-text-muted">{timeAgo(n.created_at)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-start gap-1.5 flex-shrink-0">
                      {unread && (
                        <button
                          onClick={() => handleMarkRead(n.uuid)}
                          disabled={markReadLoadingId === n.uuid}
                          className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-brand-light transition-colors disabled:opacity-50"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n.uuid)}
                        disabled={deleteLoadingId === n.uuid}
                        className="p-1.5 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error-bg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
