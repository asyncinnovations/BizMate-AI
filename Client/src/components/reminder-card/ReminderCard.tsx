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
      className={`bg-white p-5 rounded-xl shadow-sm border transition-all hover:shadow-lg hover:scale-[1.01] ${
        reminder.status === "completed"
          ? "border-[#E1E8F5] opacity-70"
          : "border-[#E1E8F5]"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleStatus(reminder)}
          className="mt-1 flex-shrink-0"
        >
          {reminder.status === "completed" ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-[#E1E8F5] hover:text-[#2E69A4] transition-colors" />
          )}
        </button>
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-grow">
              <h3
                className={`font-semibold text-[#1B2A49] mb-2 ${
                  reminder.status === "completed" ? "line-through" : ""
                }`}
              >
                {reminder.title}
              </h3>
              {reminder.description && (
                <p className="text-sm text-[#344767] mb-3 line-clamp-2">
                  {reminder.description}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    typeColors[reminder.type]
                  }`}
                >
                  {reminder.type}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[reminder.status]
                  }`}
                >
                  {reminder.status.charAt(0).toUpperCase() +
                    reminder.status.slice(1)}
                </span>

                {reminder.recurrence_rule && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    {reminder.recurrence_rule}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onUpdate(reminder)}
                className="p-2 bg-[#e7e8e9] hover:bg-[#c3c5c7] rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-[#344767]" />
              </button>
              <button
                onClick={() => onDelete(reminder.uuid)}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#344767] flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(reminder.reminder_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-[#F6A821] font-medium ml-1">
                ({formatDate(reminder.reminder_date)})
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Bell className="w-4 h-4" />
              <span>Notify Before: {reminder.notify_before} days</span>
            </div>
          </div>

          {/* Notification Channels */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-[#344767] font-medium">
              Channels:
            </span>
            <div className="flex items-center gap-2">
              {reminder.notify_channels.email && (
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                  Email
                </span>
              )}
              {reminder.notify_channels.whatsapp && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                  Whatsapp
                </span>
              )}
              {reminder.notify_channels.push && (
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
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
