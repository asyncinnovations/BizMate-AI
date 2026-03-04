import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Calendar } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ReminderCard from "../reminder-card/ReminderCard";
import { formatDate } from "@/utils/formatDate";

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

interface ReminderCalendarProps {
  reminders: Reminder[];
  typeColors: Record<ReminderType, string>;
  onDelete: (uuid: string) => void;
  onUpdate: (reminder: Reminder) => void;
  onToggleStatus: (reminder: Reminder) => void;
  showCalendarModal: boolean;
  setShowCalendarModal: (state: boolean) => void;
}

const ReminderCalendar = ({
  reminders,
  typeColors,
  onDelete,
  onUpdate,
  onToggleStatus,
  showCalendarModal,
  setShowCalendarModal,
}: ReminderCalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateReminders, setSelectedDateReminders] = useState<
    Reminder[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const statusColors: Record<ReminderStatus, string> = {
    pending: "bg-status-warning-bg text-status-warning",
    sent: "bg-status-info-bg text-status-info",
    completed: "bg-status-success-bg text-status-success",
    missed: "bg-status-error-bg text-status-error",
  };

  const getDaysInMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getRemindersForDate = (
    year: number,
    month: number,
    day: number,
  ): Reminder[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    console.log(dateStr);
    return reminders.filter((r) => r.reminder_date.split("T")[0] === dateStr);
  };

  const isToday = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const handleDateClick = (year: number, month: number, day: number): void => {
    const dateReminders = getRemindersForDate(year, month, day);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDateReminders(dateReminders);
    setSelectedDate(dateStr);
    setShowCalendarModal(true);
  };

  const previousMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const goToToday = (): void => {
    setCurrentDate(new Date());
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="min-h-[100px] bg-bg-base rounded-xl border border-border opacity-40"
        ></div>,
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayReminders = getRemindersForDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const today = isToday(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const hasMissedReminders = dayReminders.some(
        (r) => r.status === "missed",
      );

      days.push(
        <div
          key={day}
          onClick={() =>
            handleDateClick(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day,
            )
          }
          className={`min-h-[100px] bg-surface rounded-xl border-2 transition-all duration-300 hover:shadow-raised hover:scale-[1.02] cursor-pointer group ${
            today
              ? "border-secondary shadow-card ring-2 ring-secondary ring-opacity-30"
              : hasMissedReminders
                ? "border-status-error-border hover:border-status-error"
                : "border-border hover:border-secondary"
          } ${dayReminders.length > 0 ? "hover:bg-brand-light/30" : ""}`}
        >
          <div className="p-3 h-full flex flex-col">
            {/* Day header */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-bold transition-all ${
                  today
                    ? "text-secondary text-lg"
                    : hasMissedReminders
                      ? "text-status-error"
                      : "text-text-secondary group-hover:text-secondary"
                }`}
              >
                {day}
              </span>
              <div className="flex items-center gap-1">
                {today && (
                  <span className="text-xs bg-brand text-on-brand px-2 py-1 rounded-full font-semibold shadow-card animate-pulse">
                    Today
                  </span>
                )}
                {dayReminders.length > 0 && !today && (
                  <span className="text-xs bg-brand-light text-secondary px-2 py-1 rounded-full font-semibold border border-border">
                    {dayReminders.length}
                  </span>
                )}
              </div>
            </div>

            {/* Reminders list */}
            <div className="flex-grow overflow-hidden space-y-1.5">
              {dayReminders.slice(0, 1).map((reminder) => (
                <div
                  key={reminder.uuid}
                  className={`text-xs p-2 rounded-lg ${typeColors[reminder.type]} truncate flex items-center gap-1.5 shadow-card hover:shadow-raised transition-all transform hover:scale-105 ${
                    reminder.status === "completed" ? "opacity-50" : ""
                  }`}
                  title={reminder.title}
                >
                  {reminder.status === "completed" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success flex-shrink-0"></span>
                  )}
                  <span className="truncate font-medium">{reminder.title}</span>
                </div>
              ))}
              {dayReminders.length > 1 && (
                <div className="text-xs text-secondary font-bold bg-brand-light px-2 py-1 rounded-lg text-center hover:bg-brand hover:text-on-brand transition-colors">
                  +{dayReminders.length - 1} more
                </div>
              )}
            </div>
          </div>
        </div>,
      );
    }

    return days;
  };

  const totalRemindersThisMonth = reminders.filter((r) => {
    const reminderDate = new Date(r.reminder_date);
    return (
      reminderDate.getMonth() === currentDate.getMonth() &&
      reminderDate.getFullYear() === currentDate.getFullYear()
    );
  }).length;

  const formatModalDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="bg-surface rounded-2xl shadow-card border border-border p-6 hover:shadow-raised transition-shadow">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-text-heading mb-1">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-sm text-text-secondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              {totalRemindersThisMonth} reminder
              {totalRemindersThisMonth !== 1 ? "s" : ""} this month
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-secondary hover:bg-brand-light rounded-lg transition-all hover:scale-105"
            >
              Today
            </button>
            <div className="flex gap-1 bg-bg-base rounded-lg p-1 border border-border">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-surface rounded-lg transition-all hover:shadow-card group"
                title="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-text-secondary group-hover:text-secondary transition-colors" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-surface rounded-lg transition-all hover:shadow-card group"
                title="Next month"
              >
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-secondary transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-bold text-text-secondary py-3 bg-bg-base rounded-lg border border-border"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-3">{renderCalendar()}</div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span className="text-text-secondary">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-error"></div>
            <span className="text-text-secondary">Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-success"></div>
            <span className="text-text-secondary">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-status-warning" />
            <span className="text-text-secondary">AI Generated</span>
          </div>
        </div>
      </div>

      {/* Reminders Modal */}
      <Modal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        title={`Reminders for ${formatModalDate(selectedDate)}`}
        titleIcon={<Calendar className="w-5 h-5 text-white" />}
        size="lg"
      >
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {selectedDateReminders.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-border mx-auto mb-4" />
              <p className="text-text-secondary">No reminders for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.uuid}
                  reminder={reminder}
                  typeColors={typeColors}
                  statusColors={statusColors}
                  onToggleStatus={onToggleStatus}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border bg-bg-base flex justify-between items-center">
          <span className="text-sm text-text-secondary">
            {selectedDateReminders.length} reminder
            {selectedDateReminders.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setShowCalendarModal(false)}
            className="px-4 py-2 bg-brand text-on-brand rounded-lg hover:bg-brand-hover transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ReminderCalendar;
