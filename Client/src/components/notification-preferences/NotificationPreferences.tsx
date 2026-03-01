"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  MonitorSmartphone,
  LayoutDashboard,
} from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

// ================= TYPES =================
interface NotificationPreference {
  uuid: string;
  user_id: string;
  company_id?: string | null;
  event_type: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  dashboard_enabled: boolean;
  updated_at?: string;
}

type Channel = "email" | "sms" | "push" | "dashboard";

const GENERAL_EVENT_TYPE = "general";

// Match entity column defaults exactly
const DEFAULTS: Record<Channel, boolean> = {
  email: true,
  sms: false,
  push: true,
  dashboard: true,
};

const CHANNELS: {
  key: Channel;
  label: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
    {
      key: "email",
      label: "Email Notifications",
      description: "Receive updates and alerts directly to your email address",
      icon: Mail,
    },
    {
      key: "sms",
      label: "SMS Notifications",
      description: "Get important alerts sent as text messages to your phone",
      icon: Smartphone,
    },
    {
      key: "push",
      label: "Push Notifications",
      description: "Browser and mobile push alerts for real-time updates",
      icon: MonitorSmartphone,
    },
    {
      key: "dashboard",
      label: "Dashboard Notifications",
      description: "In-app notifications shown inside your BizMate dashboard",
      icon: LayoutDashboard,
    },
  ];

const CHANNEL_FIELD: Record<Channel, keyof NotificationPreference> = {
  email: "email_enabled",
  sms: "sms_enabled",
  push: "push_enabled",
  dashboard: "dashboard_enabled",
};

// ================= MAIN COMPONENT =================
const NotificationPreferences: React.FC = () => {
  const { user } = useAuth();
  const userId = (user?.user as { user_id?: string })?.user_id;

  const [pref, setPref] = useState<NotificationPreference | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [toggling, setToggling] = useState<Record<Channel, boolean>>({
    email: false, sms: false, push: false, dashboard: false,
  });

  // ─────────────────────────────────────────
  // API: GET /notification-preferences/user/:user_id
  // Returns: { message, response: NotificationPreference[] }
  // Picks most recently updated "general" row to avoid duplicate row issues.
  // ─────────────────────────────────────────
  const fetchPreference = async (): Promise<NotificationPreference | null> => {
    try {
      const res = await axiosInstance.get(`/notification-preferences/user/${userId}`);

      const rows: NotificationPreference[] = Array.isArray(res.data?.response)
        ? res.data.response
        : Array.isArray(res.data)
          ? res.data
          : [];

      const generalRows = rows.filter((r) => r.event_type === GENERAL_EVENT_TYPE);
      if (generalRows.length === 0) return null;

      // If duplicates exist, always pick the most recently updated one
      return generalRows.sort(
        (a, b) =>
          new Date(b.updated_at ?? 0).getTime() -
          new Date(a.updated_at ?? 0).getTime()
      )[0];
    } catch {
      toast.error("Failed to load notification preferences");
      return null;
    }
  };

  // ─────────────────────────────────────────
  // API: POST /notification-preferences/create
  // Body: { user_id, event_type, ...defaults }
  // Only called once on first ever visit — never if row already exists.
  // company_id omitted intentionally (not in user object).
  // ─────────────────────────────────────────
  const createPreference = async (): Promise<NotificationPreference | null> => {
    try {
      const res = await axiosInstance.post(`/notification-preferences/create`, {
        user_id: userId,
        event_type: GENERAL_EVENT_TYPE,
        email_enabled: DEFAULTS.email,
        sms_enabled: DEFAULTS.sms,
        push_enabled: DEFAULTS.push,
        dashboard_enabled: DEFAULTS.dashboard,
      });
      return res.data?.response ?? null;
    } catch {
      toast.error("Failed to initialize notification preferences");
      return null;
    }
  };

  // ─────────────────────────────────────────
  // API: PUT /notification-preferences/toggle-channel/:preference_id
  // Body: { channel, enabled }
  // Optimistic update + sync from API response on success.
  // ─────────────────────────────────────────
  const handleToggle = async (channel: Channel) => {
    if (!pref) return;

    const currentValue = pref[CHANNEL_FIELD[channel]] as boolean;
    const newValue = !currentValue;

    // Optimistic update
    setPref((prev) => prev ? { ...prev, [CHANNEL_FIELD[channel]]: newValue } : prev);
    setToggling((prev) => ({ ...prev, [channel]: true }));

    try {
      const res = await axiosInstance.put(
        `/notification-preferences/toggle-channel/${pref.uuid}`,
        { channel, enabled: newValue }
      );
      // Sync from DB response — source of truth
      const updated: NotificationPreference | null = res.data?.response ?? null;
      if (updated) setPref(updated);
    } catch {
      // Rollback on failure
      setPref((prev) => prev ? { ...prev, [CHANNEL_FIELD[channel]]: currentValue } : prev);
      toast.error("Failed to update preference. Please try again.");
    } finally {
      setToggling((prev) => ({ ...prev, [channel]: false }));
    }
  };

  // Boot: fetch → create only if truly missing
  useEffect(() => {
    if (!userId) return;
    const init = async () => {
      const existing = await fetchPreference();
      if (existing) {
        setPref(existing);
      } else {
        const created = await createPreference();
        setPref(created);
      }
      setPageLoading(false);
    };
    init();
  }, [userId]);

  // ================= RENDER =================
  return (
    <SectionCard title="Notification Preferences" icon={Bell}>
      {pageLoading ? (
        <div className="p-20 flex items-center justify-center">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      ) : (
        <div className="space-y-2">
          {CHANNELS.map(({ key, label, description, icon: Icon }) => {
            const enabled = pref
              ? (pref[CHANNEL_FIELD[key]] as boolean)
              : DEFAULTS[key];

            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-lg bg-bg-base hover:bg-bg-subtle transition-colors border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-surface rounded-lg border border-border shrink-0">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-heading">{label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{description}</p>
                  </div>
                </div>

                <ToggleSwitch
                  enabled={enabled}
                  loading={toggling[key]}
                  onChange={() => handleToggle(key)}
                />
              </div>
            );
          })}

          <p className="text-xs text-text-muted pt-3">
            Changes are saved automatically. SMS notifications require a verified
            phone number. Push notifications require browser or device permissions.
          </p>
        </div>
      )}
    </SectionCard>
  );
};

export default NotificationPreferences;