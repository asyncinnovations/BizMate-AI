"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Mail,
  MessageSquare,
  Monitor,
  Calendar,
  FileText,
  Settings as SettingsIcon,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import EmptyState from "@/components/empty-state/EmptyState";
import toast from "react-hot-toast";
import NotificationCard, {
  Notification,
  NotificationStatus,
} from "@/components/notification-card/NotificationCard";

// ================= FILTER TABS =================
// Aligned to backend NotificationType enum values
const FILTER_TABS = [
  { id: "all", label: "All", icon: Bell },
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "push", label: "Push", icon: Bell },
  { id: "dashboard", label: "Dashboard", icon: Monitor },
];

// ================= MAIN PAGE =================
const NotificationsPage = () => {
  const { user } = useAuth();
  const userId = user?.user?.user_id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [markReadLoadingId, setMarkReadLoadingId] = useState<string | null>(
    null,
  );
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
  }, [userId]);

  /////////////////////////////////////
  // Fetch All Notifications
  ///////////////////////////////////
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/notifications/user/${userId}`);
      setNotifications(res.data?.response || []);
    } catch (error) {
      console.error("fetchNotifications failed:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////
  // Mark Notification As Read
  /////////////////////////////////////////
  const handleMarkRead = async (uuid: string) => {
    setMarkReadLoadingId(uuid);
    try {
      await axiosInstance.put(`/notifications/mark-read/${uuid}`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.uuid === uuid ? { ...n, status: NotificationStatus.SENT } : n,
        ),
      );
    } catch (error) {
      console.error("handleMarkRead failed:", error);
      toast.error("Failed to mark as read");
    } finally {
      setMarkReadLoadingId(null);
    }
  };

  // ─────────────────────────────────────────
  // API: DELETE /notifications/delete/:notification_id
  // Permanently removes a notification
  // ─────────────────────────────────────────
  const handleDelete = async (uuid: string) => {
    setDeleteLoadingId(uuid);
    try {
      await axiosInstance.delete(`/notifications/delete/${uuid}`);
      setNotifications((prev) => prev.filter((n) => n.uuid !== uuid));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("handleDelete failed:", error);
      toast.error("Failed to delete notification");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  ///////////////////////////////////////////////////////
  // Mark all unread as read — parallel calls ---> Bad Method need new api >> for mark all read
  //////////////////////////////////////////////////////
  const handleMarkAllRead = async () => {
    const unread = notifications.filter(
      (n) => n.status === NotificationStatus.PENDING,
    );
    if (!unread.length) return;
    try {
      await Promise.all(
        unread.map((n) =>
          axiosInstance.put(`/notifications/mark-read/${n.uuid}`),
        ),
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.status === NotificationStatus.PENDING
            ? { ...n, status: NotificationStatus.SENT }
            : n,
        ),
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("handleMarkAllRead failed:", error);
      toast.error("Failed to mark all as read");
    }
  };

  //////////////////////////////////////////////
  // Clear all — parallel delete calls => Bad Method --> need new apis for delete all notifications
  /////////////////////////////////////////////////
  const handleClearAll = async () => {
    if (!notifications.length) return;
    try {
      await Promise.all(
        notifications.map((n) =>
          axiosInstance.delete(`/notifications/delete/${n.uuid}`),
        ),
      );
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("handleClearAll failed:", error);
      toast.error("Failed to clear notifications");
    }
  };

  // ── Derived state ──
  const unreadCount = notifications.filter(
    (n) => n.status === NotificationStatus.PENDING,
  ).length;

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.notification_type === activeFilter);

  // ================= RENDER =================
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-bg-base p-4 mb-8">
        <div className="w-full">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {/* Title + unread badge */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-text-heading">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="bg-status-warning text-on-brand text-sm font-semibold px-3 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-2 px-4 py-2 text-secondary hover:bg-brand-light rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Mark all read</span>
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-status-error hover:bg-status-error-bg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Clear all</span>
                </button>
              </div>
            </div>
            <p className="text-text-primary">
              Stay updated with your business activities and reminders
            </p>
          </div>

          {/* Filter tabs */}
          <div className="bg-surface rounded-lg shadow-card border border-border p-2 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto">
              {FILTER_TABS.map((tab) => {
                const Icon = tab.icon;
                const count =
                  tab.id === "all"
                    ? notifications.length
                    : notifications.filter(
                        (n) => n.notification_type === tab.id,
                      ).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      activeFilter === tab.id
                        ? "bg-brand text-on-brand"
                        : "text-text-primary hover:bg-bg-base"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                    {count > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          activeFilter === tab.id
                            ? "bg-white/20 text-on-brand"
                            : "bg-bg-base border border-border text-text-secondary"
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

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="w-8 h-8" />
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredNotifications.length === 0 && (
            <EmptyState
              icon={BellOff}
              title="No notifications yet"
              description={
                activeFilter === "all"
                  ? "You're all caught up! No new notifications at the moment."
                  : `No ${FILTER_TABS.find((t) => t.id === activeFilter)?.label.toLowerCase()} notifications.`
              }
            />
          )}

          {/* Notifications list */}
          {!loading && filteredNotifications.length > 0 && (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.uuid}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                  markReadLoadingId={markReadLoadingId}
                  deleteLoadingId={deleteLoadingId}
                />
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {!loading && filteredNotifications.length > 0 && (
            <div className="mt-6 bg-surface rounded-lg shadow-card border border-border p-6">
              <h3 className="text-lg font-semibold text-text-heading mb-4">
                Quick Actions
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 p-4 bg-bg-base rounded-lg hover:bg-brand-light transition-colors text-left border border-border">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-medium text-text-heading text-sm">
                      View Calendar
                    </p>
                    <p className="text-xs text-text-secondary">
                      Check all reminders
                    </p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 bg-bg-base rounded-lg hover:bg-brand-light transition-colors text-left border border-border">
                  <SettingsIcon className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-medium text-text-heading text-sm">
                      Notification Settings
                    </p>
                    <p className="text-xs text-text-secondary">
                      Manage preferences
                    </p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 bg-bg-base rounded-lg hover:bg-brand-light transition-colors text-left border border-border">
                  <FileText className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-medium text-text-heading text-sm">
                      View All Invoices
                    </p>
                    <p className="text-xs text-text-secondary">
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
  );
};

export default NotificationsPage;
