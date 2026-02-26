"use client";

import React, { useState } from "react";
import {
  Bell,
  Clock,
  Globe,
  Trash2,
  BellOff,
} from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

// ================= TYPES =================
type AutoDeleteOption = "never" | "7days" | "30days";

interface ReminderPreferences {
  remindersEnabled: boolean;
  defaultHour: string;
  timezone: string;
  autoDelete: AutoDeleteOption;
}

// ================= STATIC OPTIONS =================
const TIMEZONES = [
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST) — Dubai" },
  { value: "Asia/Karachi", label: "Pakistan Standard Time (PKT)" },
  { value: "Asia/Riyadh", label: "Arabia Standard Time (AST) — Riyadh" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT) — London" },
  { value: "America/New_York", label: "Eastern Time (ET) — New York" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT) — Los Angeles" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Singapore", label: "Singapore Standard Time (SGT)" },
  { value: "Europe/Berlin", label: "Central European Time (CET) — Berlin" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? "AM" : "PM";
  const label = `${hour}:00 ${period}`;
  const value = `${String(i).padStart(2, "0")}:00`;
  return { value, label };
});

const AUTO_DELETE_OPTIONS: { value: AutoDeleteOption; label: string; description: string }[] = [
  { value: "never", label: "Never", description: "Keep all completed reminders" },
  { value: "7days", label: "7 Days", description: "Auto-delete after 1 week" },
  { value: "30days", label: "30 Days", description: "Auto-delete after 1 month" },
];

// ================= COMPONENT =================
const ReminderSettings: React.FC = () => {
  const [prefs, setPrefs] = useState<ReminderPreferences>({
    remindersEnabled: true,
    defaultHour: "09:00",
    timezone: "Asia/Dubai",
    autoDelete: "never",
  });

  const set = <K extends keyof ReminderPreferences>(
    key: K,
    value: ReminderPreferences[K]
  ) => setPrefs((prev) => ({ ...prev, [key]: value }));

  return (
    <SectionCard title="Reminder Preferences" icon={Bell}>
      <div className="space-y-2">

        {/* ── Enable / Disable Reminders ── */}
        <div className="flex items-start justify-between gap-4 p-4 bg-bg-base rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-light">
              {prefs.remindersEnabled
                ? <Bell className="w-4 h-4 text-secondary" />
                : <BellOff className="w-4 h-4 text-text-muted" />
              }
            </div>
            <div>
              <p className="font-medium text-text-heading text-sm">
                Enable Reminders
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Receive alerts for tasks, deadlines and important events
              </p>
            </div>
          </div>
          <ToggleSwitch
            enabled={prefs.remindersEnabled}
            onChange={() => set("remindersEnabled", !prefs.remindersEnabled)}
          />
        </div>

        {/* ── Settings below — dimmed when reminders off ── */}
        <div className={`space-y-2 transition-opacity duration-200 ${prefs.remindersEnabled ? "opacity-100" : "opacity-40 pointer-events-none"
          }`}>

          {/* Default Reminder Time */}
          <div className="flex items-start justify-between gap-4 p-4 bg-bg-base rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-light">
                <Clock className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-text-heading text-sm">
                  Default Reminder Time
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Automatically schedule new reminders at this time
                </p>
              </div>
            </div>
            <select
              value={prefs.defaultHour}
              onChange={(e) => set("defaultHour", e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-surface text-text-heading focus:outline-none focus:ring-2 focus:ring-border-focus shrink-0"
            >
              {HOURS.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Zone */}
          <div className="flex items-start justify-between gap-4 p-4 bg-bg-base rounded-lg border border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-brand-light shrink-0">
                <Globe className="w-4 h-4 text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-text-heading text-sm">
                  Time Zone
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  All reminder times will follow this zone
                </p>
              </div>
            </div>
            <select
              value={prefs.timezone}
              onChange={(e) => set("timezone", e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-surface text-text-heading focus:outline-none focus:ring-2 focus:ring-border-focus shrink-0 max-w-[220px]"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Delete Completed Reminders */}
          <div className="p-4 bg-bg-base rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-light">
                <Trash2 className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-text-heading text-sm">
                  Auto-Delete Completed Reminders
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Keep your reminder list clean by removing old completed items
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {AUTO_DELETE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("autoDelete", opt.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-center ${prefs.autoDelete === opt.value
                    ? "border-secondary bg-brand-light"
                    : "border-border bg-surface hover:border-border-strong hover:bg-bg-base"
                    }`}
                >
                  <span className={`text-sm font-semibold ${prefs.autoDelete === opt.value
                    ? "text-secondary"
                    : "text-text-heading"
                    }`}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-text-secondary leading-tight">
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Save note */}
        <p className="text-xs text-text-muted text-center">
          These preferences are saved locally. API integration coming soon.
        </p>

      </div>
    </SectionCard>
  );
};

export default ReminderSettings;