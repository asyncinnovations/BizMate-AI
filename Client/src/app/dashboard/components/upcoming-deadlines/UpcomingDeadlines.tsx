import React, { useEffect, useState } from "react";
import {
  Calendar,
  AlertTriangle,
  Building2,
  Users,
  FileText,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import SectionCard from "@/components/section-card/SectionCard";
import { formatDate } from "@/utils/formatDate";

// Type definitions (type alias)
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
    email?: boolean;
    whatsapp?: boolean;
    push?: boolean;
  };
  recurrence_rule: string;
  status: ReminderStatus;
}

const UpcomingDeadlines = () => {
  const router = useRouter();
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);

  const fetchUpcomingReminders = async () => {
    try {
      const response = await axiosInstance.get("/ai_reminder/upcoming");
      if (response.status === 200) {
        setUpcomingReminders(response.data.response);
        console.log(response.data.response);
      }
    } catch (error) {
      console.log("Error occur while getting upcoming reminders", error);
    }
  };

  useEffect(() => {
    fetchUpcomingReminders();
  }, []);

  // Function to calculate days until due date
  const getDaysUntilDue = (reminderDate: string): number => {
    const today = new Date();
    const dueDate = new Date(reminderDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Function to get styling based on days until due
  const getReminderStyle = (daysUntilDue: number) => {
    if (daysUntilDue <= 1) {
      // 1 day or less - Danger
      return {
        bgColor: "bg-red-50",
        borderColor: "border-red-100",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        textColor: "text-red-600",
      };
    } else if (daysUntilDue === 2) {
      // 2 days - Warning
      return {
        bgColor: "bg-orange-50",
        borderColor: "border-orange-100",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        textColor: "text-orange-600",
      };
    } else {
      // 3 days - Info
      return {
        bgColor: "bg-blue-50",
        borderColor: "border-blue-100",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        textColor: "text-blue-600",
      };
    }
  };

  // Function to get appropriate icon based on reminder type
  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case "VAT":
        return AlertTriangle;
      case "License":
        return Building2;
      case "Payroll":
        return Users;
      default:
        return FileText;
    }
  };

  return (
    <SectionCard
      className="h-full flex flex-col"
      title="Upcoming Reminders"
      icon={Calendar}
    >
      <div className="space-y-4 flex-1">
        {upcomingReminders.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No upcoming reminders
          </div>
        ) : (
          upcomingReminders.slice(0, 3).map((reminder) => {
            const IconComponent = getReminderIcon(reminder.type);
            const daysUntilDue = getDaysUntilDue(reminder.reminder_date);
            const style = getReminderStyle(daysUntilDue);

            return (
              <div
                key={reminder.uuid}
                className={`flex items-start space-x-3 p-3 ${style.bgColor} rounded-lg border ${style.borderColor}`}
              >
                <div className={`${style.iconBg} rounded-full p-1.5 mt-0.5`}>
                  <IconComponent className={`w-4 h-4 ${style.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium capitalize text-gray-800 truncate">
                    {reminder.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(reminder.reminder_date)}
                  </p>
                  {reminder.description && (
                    <p className={`text-xs ${style.textColor} mt-1 truncate`}>
                      {reminder.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {upcomingReminders.length > 3 && (
        <Button
          onClick={() => router.push("/dashboard/reminders")}
          className="w-full mt-6 py-2"
        >
          View All Reminders
        </Button>
      )}
    </SectionCard>
  );
};

export default UpcomingDeadlines;
