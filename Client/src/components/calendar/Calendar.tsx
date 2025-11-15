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
    pending: "bg-yellow-100 text-yellow-700",
    sent: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    missed: "bg-red-100 text-red-700",
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
    day: number
  ): Reminder[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
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
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setSelectedDateReminders(dateReminders);
    setSelectedDate(dateStr);
    setShowCalendarModal(true);
  };

  const previousMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
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
          className="min-h-[100px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-[#E1E8F5] opacity-40"
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayReminders = getRemindersForDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      // Fixed: Dynamic today check
      const today = isToday(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      // const hasPendingReminders = dayReminders.some(
      //   (r) => r.status === "pending"
      // );

      const hasMissedReminders = dayReminders.some(
        (r) => r.status === "missed"
      );

      days.push(
        <div
          key={day}
          onClick={() =>
            handleDateClick(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            )
          }
          className={`min-h-[100px] bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group ${
            today
              ? "border-[#2E69A4] shadow-lg ring-2 ring-[#2E69A4] ring-opacity-30"
              : hasMissedReminders
              ? "border-red-200 hover:border-red-300"
              : "border-[#E1E8F5] hover:border-[#2E69A4]"
          } ${dayReminders.length > 0 ? "hover:bg-blue-50" : ""}`}
        >
          <div className="p-3 h-full flex flex-col">
            {/* Day header */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-bold transition-all ${
                  today
                    ? "text-[#2E69A4] text-lg"
                    : hasMissedReminders
                    ? "text-red-600"
                    : "text-[#344767] group-hover:text-[#2E69A4]"
                }`}
              >
                {day}
              </span>
              <div className="flex items-center gap-1">
                {today && (
                  <span className="text-xs bg-gradient-to-r from-[#2E69A4] to-[#1B2A49] text-white px-2 py-1 rounded-full font-semibold shadow-sm animate-pulse">
                    Today
                  </span>
                )}
                {dayReminders.length > 0 && !today && (
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded-full font-semibold shadow-sm">
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
                  className={`text-xs p-2 rounded-lg ${
                    typeColors[reminder.type]
                  } truncate flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all transform hover:scale-105 ${
                    reminder.status === "completed" ? "opacity-50" : ""
                  }`}
                  title={reminder.title}
                >
                  {reminder.status === "completed" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                  )}
                  <span className="truncate font-medium">{reminder.title}</span>
                </div>
              ))}
              {dayReminders.length > 1 && (
                <div className="text-xs text-[#2E69A4] font-bold bg-blue-50 px-2 py-1 rounded-lg text-center hover:bg-blue-100 transition-colors">
                  +{dayReminders.length - 1} more
                </div>
              )}
            </div>
          </div>
        </div>
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
      <div className="bg-white rounded-2xl shadow-lg border border-[#E1E8F5] p-6 hover:shadow-xl transition-shadow">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E1E8F5]">
          <div>
            <h2 className="text-2xl font-bold text-[#1B2A49] mb-1">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-sm text-[#344767] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2E69A4] animate-pulse"></span>
              {totalRemindersThisMonth} reminder
              {totalRemindersThisMonth !== 1 ? "s" : ""} this month
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-[#2E69A4] hover:bg-blue-50 rounded-lg transition-all hover:scale-105"
            >
              Today
            </button>
            <div className="flex gap-1 bg-[#F4F7FA] rounded-lg p-1">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-white rounded-lg transition-all hover:shadow-sm group"
                title="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-[#344767] group-hover:text-[#2E69A4] transition-colors" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white rounded-lg transition-all hover:shadow-sm group"
                title="Next month"
              >
                <ChevronRight className="w-5 h-5 text-[#344767] group-hover:text-[#2E69A4] transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-bold text-[#344767] py-3 bg-gradient-to-br from-[#F4F7FA] to-[#E1E8F5] rounded-lg"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-3">{renderCalendar()}</div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-[#E1E8F5] flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2E69A4]"></div>
            <span className="text-[#344767]">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-[#344767]">Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-[#344767]">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#F6A821]" />
            <span className="text-[#344767]">AI Generated</span>
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
              <Calendar className="w-16 h-16 text-[#E1E8F5] mx-auto mb-4" />
              <p className="text-[#344767]">No reminders for this date</p>
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
        <div className="p-4 border-t border-[#E1E8F5] bg-[#F4F7FA] flex justify-between items-center">
          <span className="text-sm text-[#344767]">
            {selectedDateReminders.length} reminder
            {selectedDateReminders.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setShowCalendarModal(false)}
            className="px-4 py-2 bg-[#2E69A4] text-white rounded-lg hover:bg-[#1B2A49] transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ReminderCalendar;
