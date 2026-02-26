"use client";

import React from "react";
import {
  Activity,
  Upload,
  RefreshCw,
  CheckCircle,
  Bell,
  Sparkles,
  X,
} from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";

interface ActivityEntry {
  id: string;
  event_type: string;
  details: string;
  created_at: string;
}

const getActivityIcon = (type: string) => {
  const cls = "w-3.5 h-3.5";
  switch (type) {
    case "document_uploaded":
      return <Upload className={`${cls} text-status-info`} />;
    case "license_renewed":
      return <RefreshCw className={`${cls} text-status-success`} />;
    case "document_verified":
      return <CheckCircle className={`${cls} text-status-success`} />;
    case "reminder_triggered":
      return <Bell className={`${cls} text-status-warning`} />;
    case "ai_summary_generated":
      return <Sparkles className={`${cls} text-secondary`} />;
    case "document_rejected":
      return <X className={`${cls} text-status-error`} />;
    default:
      return <Activity className={`${cls} text-text-muted`} />;
  }
};

const getActivityBg = (type: string) => {
  switch (type) {
    case "document_uploaded":
      return "bg-status-info-bg border-status-info-border";
    case "license_renewed":
      return "bg-status-success-bg border-status-success-border";
    case "document_verified":
      return "bg-status-success-bg border-status-success-border";
    case "reminder_triggered":
      return "bg-status-warning-bg border-status-warning-border";
    case "ai_summary_generated":
      return "bg-brand-light border-border";
    case "document_rejected":
      return "bg-status-error-bg border-status-error-border";
    default:
      return "bg-bg-subtle border-border";
  }
};

const formatTimeAgo = (dateStr: string) => {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

interface ActivityTimelineProps {
  activity: ActivityEntry[];
  loading: boolean;
}

export default function ActivityTimeline({
  activity,
  loading,
}: ActivityTimelineProps) {
  return (
    <div className="bg-surface rounded-xl p-5 border border-border shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-heading">
          Activity Timeline
        </h3>
        <Activity className="w-4 h-4 text-text-muted" />
      </div>
      {loading ? (
        <div className="flex justify-center py-6">
          <LoadingSpinner size="w-5 h-5" />
        </div>
      ) : activity.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="p-2.5 rounded-xl bg-brand-light border border-border mb-3">
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-xs font-medium text-text-secondary">
            No activity yet
          </p>
        </div>
      ) : (
        <div>
          {activity.map((entry, index) => (
            <div key={entry.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${getActivityBg(entry.event_type)}`}
                >
                  {getActivityIcon(entry.event_type)}
                </div>
                {index < activity.length - 1 && (
                  <div className="w-px flex-1 bg-border my-1 min-h-[12px]" />
                )}
              </div>
              <div className="pb-3.5">
                <p className="text-xs text-text-primary font-medium leading-snug">
                  {entry.details}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {formatTimeAgo(entry.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
