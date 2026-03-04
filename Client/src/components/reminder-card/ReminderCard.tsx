import React from "react";
import {
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  Repeat,
  Bell,
} from "lucide-react";

// Type definitions
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

interface ReminderCardProps {
  reminder: Reminder;
  typeColors: Record<ReminderType, string>;
  statusColors: Record<ReminderStatus, string>;
  onToggleStatus: (reminder: Reminder) => void;
  onUpdate: (reminder: Reminder) => void;
  onDelete: (uuid: string) => void;
  formatDate: (dateString: string) => string;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  typeColors,
  statusColors,
  onToggleStatus,
  onUpdate,
  onDelete,
  formatDate,
}) => {
  return (
    <div
      className={`bg-surface p-5 rounded-xl shadow-card border border-border transition-all hover:shadow-raised hover:scale-[1.01] ${
        reminder.status === "completed" ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Toggle status button */}
        <button
          onClick={() => onToggleStatus(reminder)}
          className="mt-1 flex-shrink-0"
        >
          {reminder.status === "completed" ? (
            <CheckCircle2 className="w-6 h-6 text-status-success" />
          ) : (
            <Circle className="w-6 h-6 text-border hover:text-secondary transition-colors" />
          )}
        </button>

        <div className="flex-grow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-grow">
              {/* Title */}
              <h3
                className={`font-semibold text-text-heading mb-2 ${
                  reminder.status === "completed" ? "line-through" : ""
                }`}
              >
                {reminder.title}
              </h3>

              {/* Description */}
              {reminder.description && (
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {reminder.description}
                </p>
              )}

              {/* Type / Status / Recurrence badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[reminder.type]}`}
                >
                  {reminder.type}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[reminder.status]}`}
                >
                  {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                </span>
                {reminder.recurrence_rule && reminder.recurrence_rule !== "none" && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-light text-secondary border border-border flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    {reminder.recurrence_rule}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onUpdate(reminder)}
                className="p-2 bg-bg-base hover:bg-border rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={() => onDelete(reminder.uuid)}
                className="p-2 bg-status-error-bg hover:bg-status-error rounded-lg transition-colors group"
              >
                <Trash2 className="w-4 h-4 text-status-error group-hover:text-on-brand" />
              </button>
            </div>
          </div>

          {/* Date & Notify Before */}
          <div className="flex items-center gap-4 text-sm text-text-secondary flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-text-muted" />
              <span>
                {new Date(reminder.reminder_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-status-warning font-medium ml-1">
                ({formatDate(reminder.reminder_date)})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bell className="w-4 h-4 text-text-muted" />
              <span>Notify Before: {reminder.notify_before} days</span>
            </div>
          </div>

          {/* Notification Channels */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-text-secondary font-medium">
              Channels:
            </span>
            <div className="flex items-center gap-2">
              {reminder.notify_channels.email && (
                <span className="px-2 py-1 bg-status-success-bg text-status-success text-xs rounded-full border border-status-success-border">
                  Email
                </span>
              )}
              {reminder.notify_channels.whatsapp && (
                <span className="px-2 py-1 bg-status-info-bg text-status-info text-xs rounded-full border border-status-info-border">
                  Whatsapp
                </span>
              )}
              {reminder.notify_channels.push && (
                <span className="px-2 py-1 bg-brand-light text-secondary text-xs rounded-full border border-border">
                  Push
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;