import React from "react";
import {
  Calendar,
  Clock,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";

// Type definitions
type ReminderStatus = "pending" | "completed";
type ReminderPriority = "high" | "medium" | "low";
type ReminderType = "VAT" | "License" | "Payroll" | "Custom";

interface Reminder {
  id: number;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  status: ReminderStatus;
  assignedTo: string | null;
  priority: ReminderPriority;
  aiGenerated: boolean;
  aiConfidence: number | null;
}

interface ReminderCardProps {
  reminder: Reminder;
  typeColors: Record<ReminderType, string>;
  priorityColors: Record<ReminderPriority, string>;
  onToggleStatus: (id: number) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: number) => void;
  formatDate: (dateString: string) => string;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  typeColors,
  priorityColors,
  onToggleStatus,
  onEdit,
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
          onClick={() => onToggleStatus(reminder.id)}
          className="mt-1 flex-shrink-0"
        >
          {reminder.status === "completed" ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-[#E1E8F5] hover:text-[#2E69A4] transition-colors" />
          )}
        </button>
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className={`font-semibold text-[#1B2A49] mb-1 ${
                  reminder.status === "completed" ? "line-through" : ""
                }`}
              >
                {reminder.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    typeColors[reminder.type]
                  }`}
                >
                  {reminder.type}
                </span>
                {reminder.aiGenerated && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#F6A821] to-amber-400 text-white flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    AI Generated {reminder.aiConfidence}%
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    priorityColors[reminder.priority]
                  }`}
                >
                  {reminder.priority.charAt(0).toUpperCase() +
                    reminder.priority.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(reminder)}
                className="p-2 hover:bg-[#F4F7FA] rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-[#344767]" />
              </button>
              <button
                onClick={() => onDelete(reminder.id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#344767]">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(reminder.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-[#F6A821] font-medium ml-1">
                ({formatDate(reminder.date)})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{reminder.time}</span>
            </div>
            {reminder.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{reminder.assignedTo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
