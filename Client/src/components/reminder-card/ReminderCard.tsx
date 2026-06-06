"use client";
// src/components/reminder-card/ReminderCard.tsx
// UPDATED — added: urgency indicator, source/AI badge, reference link,
//           overdue visual, expanded type colours for Invoice/Quotation/Document.
// All original props and structure preserved.

import React from "react";
import {
  Calendar, Edit2, Trash2, CheckCircle2, Circle,
  Repeat, Bell, Sparkles, AlertTriangle, ExternalLink,
  FileText, FileInvoice,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────
type ReminderStatus = "pending" | "sent" | "completed" | "missed";
type ReminderType   = "VAT" | "License" | "Payroll" | "Invoice" | "Quotation" | "Document" | "Custom";
type ReminderSource = "manual" | "ai" | "invoice" | "quotation" | "document" | "compliance";

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
  // NEW fields
  source?:         ReminderSource;
  reference_id?:   string | null;
  reference_type?: string | null;
  ai_prompt?:      string | null;
}

interface ReminderCardProps {
  reminder:        Reminder;
  typeColors:      Record<string, string>;
  statusColors:    Record<ReminderStatus, string>;
  onToggleStatus:  (reminder: Reminder) => void;
  onUpdate:        (reminder: Reminder) => void;
  onDelete:        (uuid: string) => void;
  formatDate:      (dateString: string) => string;
  /** Optional: called when user clicks the reference link */
  onViewReference?: (referenceId: string, referenceType: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns how many days until (positive) or since (negative) the reminder date.
 */
function getDaysUntil(dateString: string): number {
  const now    = new Date();
  const target = new Date(dateString);
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

/**
 * Returns urgency class and label based on days until reminder.
 */
function getUrgency(daysUntil: number, status: ReminderStatus): {
  label:     string;
  className: string;
  isUrgent:  boolean;
} | null {
  if (status === "completed" || status === "missed") return null;
  if (daysUntil < 0)   return { label: `Overdue by ${Math.abs(daysUntil)}d`,  className: "text-red-600 font-semibold",    isUrgent: true };
  if (daysUntil === 0) return { label: "Due today",                            className: "text-red-600 font-semibold",    isUrgent: true };
  if (daysUntil <= 3)  return { label: `Due in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`, className: "text-amber-600 font-medium", isUrgent: true };
  if (daysUntil <= 7)  return { label: `Due in ${daysUntil} days`,            className: "text-amber-500",               isUrgent: false };
  return null;
}

/** Icon for source badge */
function SourceBadge({ source }: { source?: ReminderSource }) {
  if (!source || source === "manual") return null;

  const config: Record<string, { label: string; className: string }> = {
    ai:          { label: "AI",          className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    invoice:     { label: "Invoice",     className: "bg-purple-100 text-purple-700 border-purple-200" },
    quotation:   { label: "Quotation",   className: "bg-amber-100 text-amber-700 border-amber-200"   },
    document:    { label: "Document",    className: "bg-green-100 text-green-700 border-green-200"   },
    compliance:  { label: "Compliance",  className: "bg-orange-100 text-orange-700 border-orange-200"},
  };

  const cfg = config[source];
  if (!cfg) return null;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.className}`}>
      {source === "ai" && <Sparkles className="w-2.5 h-2.5" />}
      {cfg.label}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  typeColors,
  statusColors,
  onToggleStatus,
  onUpdate,
  onDelete,
  formatDate,
  onViewReference,
}) => {
  const daysUntil = getDaysUntil(reminder.reminder_date);
  const urgency   = getUrgency(daysUntil, reminder.status);
  const isOverdue = daysUntil < 0 && reminder.status === "pending";

  return (
    <div
      className={[
        "bg-surface p-5 rounded-xl shadow-card border transition-all hover:shadow-raised hover:scale-[1.01]",
        isOverdue              ? "border-red-200 bg-red-50/30"  : "border-border",
        reminder.status === "completed" ? "opacity-70"          : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">

        {/* Toggle status button */}
        <button
          onClick={() => onToggleStatus(reminder)}
          className="mt-1 flex-shrink-0 focus:outline-none"
          title={reminder.status === "completed" ? "Mark as pending" : "Mark as completed"}
        >
          {reminder.status === "completed" ? (
            <CheckCircle2 className="w-6 h-6 text-status-success" />
          ) : isOverdue ? (
            <AlertTriangle className="w-6 h-6 text-red-500" />
          ) : (
            <Circle className="w-6 h-6 text-border hover:text-secondary transition-colors" />
          )}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-grow min-w-0">

              {/* Title */}
              <h3 className={[
                "font-semibold text-text-heading mb-1 leading-snug",
                reminder.status === "completed" ? "line-through text-text-muted" : "",
              ].join(" ")}>
                {reminder.title}
              </h3>

              {/* Description */}
              {reminder.description && (
                <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                  {reminder.description}
                </p>
              )}

              {/* Badges row — type, status, recurrence, source */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[reminder.type] ?? "bg-bg-base text-text-muted"}`}>
                  {reminder.type}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[reminder.status]}`}>
                  {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                </span>
                {reminder.recurrence_rule && reminder.recurrence_rule !== "none" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-light text-secondary border border-border flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    {reminder.recurrence_rule}
                  </span>
                )}
                {/* NEW — source badge */}
                <SourceBadge source={reminder.source as ReminderSource} />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
              <button
                onClick={() => onUpdate(reminder)}
                className="p-2 bg-bg-base hover:bg-border rounded-lg transition-colors"
                title="Edit reminder"
              >
                <Edit2 className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={() => onDelete(reminder.uuid)}
                className="p-2 bg-status-error-bg hover:bg-status-error rounded-lg transition-colors group"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4 text-status-error group-hover:text-on-brand" />
              </button>
            </div>
          </div>

          {/* Date row + urgency */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-text-muted" />
              <span>
                {new Date(reminder.reminder_date).toLocaleDateString("en-AE", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
              {/* NEW — urgency label */}
              {urgency && (
                <span className={`ml-1 text-xs ${urgency.className}`}>
                  ({urgency.label})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Bell className="w-4 h-4 text-text-muted" />
              <span>Notify {reminder.notify_before} day{reminder.notify_before !== 1 ? "s" : ""} before</span>
            </div>
          </div>

          {/* Notification channels */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-text-secondary font-medium">Channels:</span>
            {reminder.notify_channels.email && (
              <span className="px-2 py-0.5 bg-status-success-bg text-status-success text-xs rounded-full border border-status-success-border">Email</span>
            )}
            {reminder.notify_channels.whatsapp && (
              <span className="px-2 py-0.5 bg-status-info-bg text-status-info text-xs rounded-full border border-status-info-border">WhatsApp</span>
            )}
            {reminder.notify_channels.push && (
              <span className="px-2 py-0.5 bg-brand-light text-secondary text-xs rounded-full border border-border">Push</span>
            )}
          </div>

          {/* NEW — reference link (shows when this reminder came from a module) */}
          {reminder.reference_id && reminder.reference_type && onViewReference && (
            <button
              onClick={() => onViewReference(reminder.reference_id!, reminder.reference_type!)}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium group"
            >
              <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              View linked {reminder.reference_type}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
