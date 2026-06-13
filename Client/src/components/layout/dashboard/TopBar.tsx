"use client";
// src/components/layout/dashboard/TopBar.tsx
// UPDATED:
// 1. Bell badge reads real unread count from GET /notifications/unread-count/:id
//    polling every 60 seconds — was hardcoded to "3"
// 2. User name and initials read from AuthContext — was hardcoded to "Farhan Amjad"
// 3. Company name reads from AuthContext — was hardcoded to "Farhan Trading LLC"
// 4. Clicking bell opens a dropdown preview of last 5 notifications
//    before navigating to /dashboard/notifications for the full list

import { Bell, Zap, Settings, CheckCheck, Loader2, X } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Sidebar         from "./Sidebar";
import { useRouter }   from "next/navigation";
import { useAuth }     from "@/context/AuthContext";
import axiosInstance   from "@/utils/axiosInstance";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NotificationPreview {
  uuid:              string;
  title:             string;
  message:           string;
  event_type:        string;
  notification_type: string;
  status:            string;
  created_at:        string;
}

// ─── Event type icon/colour map ───────────────────────────────────────────────
const EVENT_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  reminder:              { icon: "📅", color: "#2E69A4", bg: "#EFF6FF" },
  invoice_paid:          { icon: "✅", color: "#059669", bg: "#ECFDF5" },
  invoice_sent:          { icon: "📤", color: "#2E69A4", bg: "#EFF6FF" },
  quotation_accepted:    { icon: "🎉", color: "#7C3AED", bg: "#F5F3FF" },
  quotation_rejected:    { icon: "❌", color: "#DC2626", bg: "#FEF2F2" },
  quotation_sent:        { icon: "📨", color: "#2E69A4", bg: "#EFF6FF" },
  document_finalised:    { icon: "📄", color: "#0D9488", bg: "#F0FDFA" },
  subscription_expiring: { icon: "⚠️", color: "#D97706", bg: "#FFFBEB" },
  welcome:               { icon: "👋", color: "#E8690A", bg: "#FFF7ED" },
  general:               { icon: "🔔", color: "#64748B", bg: "#F8FAFC" },
};

function getEventCfg(event_type?: string) {
  return EVENT_CONFIG[event_type ?? "general"] ?? EVENT_CONFIG.general;
}

function timeAgo(dateStr: string) {
  const d     = new Date(dateStr);
  const diff  = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60)     return "Just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────
const TopBar = () => {
  const router                = useRouter();
  const { user }              = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth data
  const userData     = user?.user as any;
  const full_name    = userData?.full_name   ?? "User";
  const company_name = userData?.company_name ?? "My Business";
  const initials     = full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const userId       = userData?.user_id;

  // Unread count
  const [unreadCount, setUnreadCount] = useState(0);

  // Dropdown preview
  const [dropOpen,       setDropOpen]       = useState(false);
  const [previewNotifs,  setPreviewNotifs]  = useState<NotificationPreview[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // ── Poll unread count every 60s ───────────────────────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axiosInstance.get(`/notifications/unread-count/${userId}`);
      setUnreadCount(res.data?.count ?? 0);
    } catch { /* silent */ }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [userId, fetchUnreadCount]);

  // ── Fetch preview notifications when dropdown opens ───────────────────────
  const fetchPreview = useCallback(async () => {
    if (!userId) return;
    setPreviewLoading(true);
    try {
      const res = await axiosInstance.get(`/notifications/user/${userId}?limit=5`);
      setPreviewNotifs(res.data?.response ?? []);
    } catch { /* silent */ }
    finally { setPreviewLoading(false); }
  }, [userId]);

  const handleBellClick = () => {
    setDropOpen((prev) => !prev);
    if (!dropOpen) fetchPreview();
  };

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Mark all read ─────────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await axiosInstance.put(`/notifications/mark-all-read/${userId}`);
      setUnreadCount(0);
      setPreviewNotifs((prev) => prev.map((n) => ({ ...n, status: "sent" })));
    } catch { /* silent */ }
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="w-full min-h-[60px] flex px-4 py-3 items-center text-white justify-between bg-[#1b2a49] border-b border-[#2E69A4]">

        {/* Left: logo + sidebar toggle */}
        <div onClick={() => setIsSidebarOpen(true)} className="flex items-center cursor-pointer gap-3">
          <span className="w-12 flex items-center justify-center h-12 rounded-xl bg-gradient-to-r from-[#2E69A4] to-cyan-500 p-2 shadow-lg">
            <Zap className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">Bizmate</h1>
            <h4 className="text-gray-200 text-sm">{company_name}</h4>
          </div>
        </div>

        {/* Right: bell + settings + profile */}
        <div className="hidden lg:flex items-center gap-4">

          {/* Bell + dropdown ─────────────────────────────────────────────── */}
          <div ref={dropRef} className="relative">
            <button
              onClick={handleBellClick}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-transparent transition hover:bg-[#1f4c78] cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[20px] h-5 px-1 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold border-2 border-[#1b2a49]">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown preview ──────────────────────────────────────────── */}
            {dropOpen && (
              <div
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                style={{ minWidth: 320 }}
              >
                {/* Dropdown header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#1b2a49]">
                  <span className="text-white font-semibold text-sm">Notifications</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1 text-[10px] text-cyan-300 hover:text-white transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                    <button onClick={() => setDropOpen(false)} className="text-gray-400 hover:text-white ml-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notification list */}
                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {previewLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : previewNotifs.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No notifications yet</p>
                    </div>
                  ) : (
                    previewNotifs.map((n) => {
                      const cfg     = getEventCfg(n.event_type);
                      const isUnread = n.status === "pending";
                      return (
                        <div
                          key={n.uuid}
                          className={`flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${isUnread ? "bg-blue-50/40" : ""}`}
                          onClick={() => {
                            router.push("/dashboard/notifications");
                            setDropOpen(false);
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base mt-0.5"
                            style={{ background: cfg.bg }}
                          >
                            {cfg.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold text-gray-800 truncate ${isUnread ? "font-bold" : ""}`}>
                              {n.title}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(n.created_at)}</p>
                          </div>
                          {isUnread && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                  <button
                    onClick={() => { router.push("/dashboard/notifications"); setDropOpen(false); }}
                    className="text-xs font-semibold text-[#2E69A4] hover:text-[#E8690A] transition-colors"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent transition hover:bg-[#1f4c78] cursor-pointer"
          >
            <Settings size={22} />
          </button>

          {/* Profile */}
          <div
            onClick={() => router.push("/dashboard/profile")}
            className="flex items-center gap-3 pl-3 border-l border-[#2E69A4] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold bg-gradient-to-r from-[#2E69A4] to-cyan-500">
              {initials}
            </div>
            <div>
              <h1 className="text-md font-semibold">{full_name}</h1>
              <h2 className="text-sm text-gray-200">{userData?.role ? `${userData.role}` : "Owner"}</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
