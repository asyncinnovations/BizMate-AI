"use client";

import React from "react";
import { CheckCheck, Trash2, Clock, Mail, MessageSquare, Bell, Monitor } from "lucide-react";

// ================= ENUMS (mirrors backend exactly) =================
export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  DASHBOARD = "dashboard",
}

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
}

// ================= TYPE =================
export interface Notification {
  uuid: string;
  user_id: string;
  company_id?: string;
  reminder_id?: string;
  document_id?: string;
  notification_type: NotificationType;
  title?: string;
  message: string;
  status: NotificationStatus;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

// ================= PROPS =================
interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (uuid: string) => void;
  onDelete: (uuid: string) => void;
  markReadLoadingId: string | null;
  deleteLoadingId: string | null;
}

// ================= HELPERS =================
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Icon + colors per notification_type
const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; iconColor: string; iconBg: string }
> = {
  [NotificationType.EMAIL]: { icon: Mail, iconColor: "text-secondary", iconBg: "bg-brand-light" },
  [NotificationType.SMS]: { icon: MessageSquare, iconColor: "text-status-success", iconBg: "bg-status-success-bg" },
  [NotificationType.PUSH]: { icon: Bell, iconColor: "text-status-warning", iconBg: "bg-status-warning-bg" },
  [NotificationType.DASHBOARD]: { icon: Monitor, iconColor: "text-text-secondary", iconBg: "bg-bg-subtle" },
};

// ================= COMPONENT =================
const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
  markReadLoadingId,
  deleteLoadingId,
}) => {
  const isRead = notification.status !== NotificationStatus.PENDING;
  const isMarking = markReadLoadingId === notification.uuid;
  const isDeleting = deleteLoadingId === notification.uuid;
  const config = TYPE_CONFIG[notification.notification_type];
  const Icon = config.icon;

  return (
    <div
      className={`bg-surface rounded-lg shadow-card border transition-all hover:shadow-raised ${isRead ? "border-border" : "border-l-4 border-l-secondary border-border"
        }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">

          {/* Type icon */}
          <div className={`${config.iconBg} p-3 rounded-lg shrink-0`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-1.5">

              {/* Title + unread dot */}
              <div className="flex items-center gap-2">
                {!isRead && (
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                )}
                <h3 className={`font-semibold text-sm ${isRead ? "text-text-primary" : "text-text-heading"
                  }`}>
                  {notification.title || "Notification"}
                </h3>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!isRead && (
                  <button
                    onClick={() => onMarkRead(notification.uuid)}
                    disabled={isMarking}
                    title="Mark as read"
                    className="text-secondary hover:text-text-heading transition-colors disabled:opacity-50"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(notification.uuid)}
                  disabled={isDeleting}
                  title="Delete"
                  className="text-text-secondary hover:text-status-error transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message */}
            <p className="text-text-secondary text-sm mb-3 leading-relaxed">
              {notification.message}
            </p>

            {/* Footer — time + type badge */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(notification.created_at)}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-bg-base border border-border text-text-muted">
                {notification.notification_type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;