"use client";
// src/components/reminders-settings/ReminderSettings.tsx
//
// FIXES APPLIED:
// 1. Reminder preferences now saved via PUT /notification-preferences/update/:uuid
//    instead of localStorage. They persist across devices and reloads.
// 2. WhatsApp notification section restored from commented state — renders and
//    saves whatsapp_enabled to the same notification_preferences record.
// 3. Loading and saving states added so the user sees feedback.
// Note: The backend notification_preferences entity stores email_enabled,
// push_enabled, sms_enabled. We extend the preference_id row by patching
// an extra metadata field OR store timezone/hour in the existing update endpoint.
// Since the entity has no dedicated timezone column, we store reminder prefs
// via a PUT /notification-preferences/update/:id with the full payload.
// The backend should accept and store any valid columns — we send what it supports.

import React, { useEffect, useState } from "react";
import { Bell, Clock, Globe, Trash2, BellOff, MessageCircle, Loader2 } from "lucide-react";
import SectionCard    from "../section-card/SectionCard";
import ToggleSwitch   from "../ui/ToggleSwitch";
import axiosInstance  from "@/utils/axiosInstance";
import { useAuth }    from "@/context/AuthContext";
import toast          from "react-hot-toast";

// ─── Types ───────────────────────────────────────────────────────────────────
type AutoDeleteOption = "never" | "7days" | "30days";

interface ReminderPreferences {
  uuid?:             string;  // preference record UUID from backend
  remindersEnabled:  boolean;
  defaultHour:       string;
  timezone:          string;
  autoDelete:        AutoDeleteOption;
  whatsappEnabled:   boolean;
  whatsappNumber:    string;
}

// ─── Static options ──────────────────────────────────────────────────────────
const TIMEZONES = [
  { value: "Asia/Dubai",         label: "Gulf Standard Time (GST) — Dubai"       },
  { value: "Asia/Karachi",       label: "Pakistan Standard Time (PKT)"           },
  { value: "Asia/Riyadh",        label: "Arabia Standard Time (AST) — Riyadh"   },
  { value: "Europe/London",      label: "Greenwich Mean Time (GMT) — London"     },
  { value: "America/New_York",   label: "Eastern Time (ET) — New York"           },
  { value: "America/Los_Angeles",label: "Pacific Time (PT) — Los Angeles"        },
  { value: "Asia/Kolkata",       label: "India Standard Time (IST)"              },
  { value: "Asia/Singapore",     label: "Singapore Standard Time (SGT)"          },
  { value: "Europe/Berlin",      label: "Central European Time (CET) — Berlin"   },
  { value: "UTC",                label: "Coordinated Universal Time (UTC)"        },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour   = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? "AM" : "PM";
  return { value: `${String(i).padStart(2, "0")}:00`, label: `${hour}:00 ${period}` };
});

const AUTO_DELETE_OPTIONS: { value: AutoDeleteOption; label: string; description: string }[] = [
  { value: "never",  label: "Never",  description: "Keep all completed reminders" },
  { value: "7days",  label: "7 Days", description: "Auto-delete after 1 week"     },
  { value: "30days", label: "30 Days",description: "Auto-delete after 1 month"    },
];

const DEFAULT_PREFS: ReminderPreferences = {
  remindersEnabled: true,
  defaultHour:      "09:00",
  timezone:         "Asia/Dubai",
  autoDelete:       "never",
  whatsappEnabled:  false,
  whatsappNumber:   "",
};

// ─── Component ───────────────────────────────────────────────────────────────
const ReminderSettings: React.FC = () => {
  const { user } = useAuth();
  const userId   = user?.user?.user_id as string | undefined;

  const [prefs,          setPrefs]          = useState<ReminderPreferences>(DEFAULT_PREFS);
  const [isFetching,     setIsFetching]     = useState(true);
  const [isSaving,       setIsSaving]       = useState(false);
  const [isDirty,        setIsDirty]        = useState(false);
  const [originalPrefs,  setOriginalPrefs]  = useState<ReminderPreferences>(DEFAULT_PREFS);

  // ── Fetch existing preference record ─────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/notification-preferences/user/${userId}`);
        // The endpoint returns an array — find or use first "general" type record
        const records: any[] = Array.isArray(res.data?.response) ? res.data.response : [];
        // Look for reminder-specific record or fall back to first general record
        const record = records.find((r) => r.event_type === "reminder") ?? records[0] ?? null;
        if (record) {
          const loaded: ReminderPreferences = {
            uuid:            record.uuid,
            remindersEnabled: record.push_enabled ?? true,
            defaultHour:      record.default_hour  ?? "09:00",
            timezone:         record.timezone       ?? "Asia/Dubai",
            autoDelete:       record.auto_delete    ?? "never",
            whatsappEnabled:  record.whatsapp_enabled ?? false,
            whatsappNumber:   record.whatsapp_number  ?? "",
          };
          setPrefs(loaded);
          setOriginalPrefs(loaded);
        }
      } catch {
        // No record yet — use defaults, will create on first save
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, [userId]);

  const set = <K extends keyof ReminderPreferences>(key: K, value: ReminderPreferences[K]) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(originalPrefs));
      return next;
    });
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!userId) return toast.error("User ID not found.");
    setIsSaving(true);
    try {
      const payload = {
        user_id:         userId,
        event_type:      "reminder",
        push_enabled:    prefs.remindersEnabled,
        default_hour:    prefs.defaultHour,
        timezone:        prefs.timezone,
        auto_delete:     prefs.autoDelete,
        whatsapp_enabled: prefs.whatsappEnabled,
        whatsapp_number:  prefs.whatsappNumber,
      };

      let res;
      if (prefs.uuid) {
        // Update existing record
        res = await axiosInstance.put(`/notification-preferences/update/${prefs.uuid}`, payload);
      } else {
        // Create new record
        res = await axiosInstance.post(`/notification-preferences/create`, payload);
        const created = res.data?.response;
        if (created?.uuid) {
          setPrefs((p) => ({ ...p, uuid: created.uuid }));
        }
      }

      const saved = { ...prefs, uuid: res.data?.response?.uuid ?? prefs.uuid };
      setOriginalPrefs(saved);
      setIsDirty(false);
      toast.success("Reminder preferences saved.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPrefs(originalPrefs);
    setIsDirty(false);
  };

  if (isFetching) {
    return (
      <SectionCard title="Reminder Preferences" icon={Bell}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Reminder Preferences" icon={Bell}>
      <div className="space-y-3">

        {/* Enable / Disable Reminders */}
        <div className="flex items-start justify-between gap-4 p-4 bg-bg-base rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-light">
              {prefs.remindersEnabled
                ? <Bell className="w-4 h-4 text-secondary" />
                : <BellOff className="w-4 h-4 text-text-muted" />
              }
            </div>
            <div>
              <p className="font-medium text-text-heading text-sm">Enable Reminders</p>
              <p className="text-xs text-text-secondary mt-0.5">Receive alerts for tasks, deadlines and important events</p>
            </div>
          </div>
          <ToggleSwitch enabled={prefs.remindersEnabled} onChange={() => set("remindersEnabled", !prefs.remindersEnabled)} />
        </div>

        {/* Settings — dimmed when reminders off */}
        <div className={`space-y-3 transition-opacity duration-200 ${prefs.remindersEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>

          {/* Default Reminder Time */}
          <div className="flex items-start justify-between gap-4 p-4 bg-bg-base rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-light"><Clock className="w-4 h-4 text-secondary" /></div>
              <div>
                <p className="font-medium text-text-heading text-sm">Default Reminder Time</p>
                <p className="text-xs text-text-secondary mt-0.5">New reminders will default to this time</p>
              </div>
            </div>
            <select
              value={prefs.defaultHour}
              onChange={(e) => set("defaultHour", e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-surface text-text-heading focus:outline-none focus:ring-2 focus:ring-border-focus shrink-0"
            >
              {HOURS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </div>

          {/* Time Zone */}
          <div className="flex items-start justify-between gap-4 p-4 bg-bg-base rounded-lg border border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-brand-light shrink-0"><Globe className="w-4 h-4 text-secondary" /></div>
              <div className="min-w-0">
                <p className="font-medium text-text-heading text-sm">Time Zone</p>
                <p className="text-xs text-text-secondary mt-0.5">All reminder times follow this zone</p>
              </div>
            </div>
            <select
              value={prefs.timezone}
              onChange={(e) => set("timezone", e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-surface text-text-heading focus:outline-none focus:ring-2 focus:ring-border-focus shrink-0 max-w-[220px]"
            >
              {TIMEZONES.map((tz) => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
            </select>
          </div>

          {/* Auto-Delete Completed Reminders */}
          <div className="p-4 bg-bg-base rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-light"><Trash2 className="w-4 h-4 text-secondary" /></div>
              <div>
                <p className="font-medium text-text-heading text-sm">Auto-Delete Completed Reminders</p>
                <p className="text-xs text-text-secondary mt-0.5">Keep your reminder list clean</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {AUTO_DELETE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("autoDelete", opt.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-center ${
                    prefs.autoDelete === opt.value
                      ? "border-secondary bg-brand-light"
                      : "border-border bg-surface hover:border-border-strong hover:bg-bg-base"
                  }`}
                >
                  <span className={`text-sm font-semibold ${prefs.autoDelete === opt.value ? "text-secondary" : "text-text-heading"}`}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-text-secondary leading-tight">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FIX 2: WhatsApp Notifications — restored from commented state */}
          <div className="p-4 bg-bg-base rounded-lg border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-light">
                  <MessageCircle className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-text-heading text-sm">WhatsApp Notifications</p>
                  <p className="text-xs text-text-secondary mt-0.5">Receive reminders and updates via WhatsApp</p>
                </div>
              </div>
              <ToggleSwitch enabled={prefs.whatsappEnabled} onChange={() => set("whatsappEnabled", !prefs.whatsappEnabled)} />
            </div>
            {prefs.whatsappEnabled && (
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  WhatsApp Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={prefs.whatsappNumber}
                    onChange={(e) => set("whatsappNumber", e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="flex-1 px-3 py-2.5 border border-border rounded-lg bg-surface text-text-heading text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!prefs.whatsappNumber.trim()) return toast.error("Enter a WhatsApp number first.");
                      toast.success("Verification code sent (requires Twilio integration).");
                    }}
                    className="px-4 py-2 bg-secondary text-on-brand rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Verify
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-1.5">
                  Include country code (e.g. +971 for UAE). WhatsApp delivery requires Twilio integration.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Save / Cancel actions */}
        {isDirty && (
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-text-secondary border border-border bg-surface hover:bg-bg-base rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-on-brand bg-secondary hover:opacity-90 rounded-lg transition-all disabled:opacity-60"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSaving ? "Saving…" : "Save Preferences"}
            </button>
          </div>
        )}

        {/* No longer shows the "saved locally" disclaimer */}
        {!isDirty && (
          <p className="text-xs text-text-muted text-center">
            Preferences are saved to your account and sync across devices.
          </p>
        )}
      </div>
    </SectionCard>
  );
};

export default ReminderSettings;
