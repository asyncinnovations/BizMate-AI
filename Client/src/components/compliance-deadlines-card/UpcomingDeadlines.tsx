"use client";

import React from "react";
import { CalendarClock, Clock } from "lucide-react";

interface License {
  id: string;
  license_type: string;
  expiry_date: string;
}

const getDaysRemaining = (expiry: string) =>
  Math.floor((new Date(expiry).getTime() - Date.now()) / 86400000);

const getDaysLabel = (days: number) => {
  if (days < 0)
    return {
      text: `${Math.abs(days)}d overdue`,
      cls: "text-status-error-text font-bold",
    };
  if (days < 30)
    return { text: `${days}d left`, cls: "text-status-error font-bold" };
  if (days < 60)
    return { text: `${days}d left`, cls: "text-status-warning font-semibold" };
  return {
    text: `${days}d left`,
    cls: "text-status-success-text font-semibold",
  };
};

const getProgressColor = (days: number) =>
  days < 0
    ? "bg-status-error"
    : days < 30
      ? "bg-status-error"
      : days < 60
        ? "bg-status-warning"
        : "bg-status-success";

const getProgressBg = (days: number) =>
  days < 0
    ? "bg-status-error-bg"
    : days < 30
      ? "bg-status-error-bg"
      : days < 60
        ? "bg-status-warning-bg"
        : "bg-status-success-bg";

const fmtDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

interface UpcomingDeadlinesProps {
  licenses: License[];
  onLicenseClick: (id: string) => void;
}

export default function UpcomingDeadlines({
  licenses,
  onLicenseClick,
}: UpcomingDeadlinesProps) {
  const upcoming = [...licenses]
    .filter((l) => getDaysRemaining(l.expiry_date) > 0)
    .sort(
      (a, b) =>
        getDaysRemaining(a.expiry_date) - getDaysRemaining(b.expiry_date),
    )
    .slice(0, 3);

  return (
    <div className="bg-surface rounded-xl p-5 border border-border shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-heading">
          Upcoming Deadlines
        </h3>
        <CalendarClock className="w-4 h-4 text-text-muted" />
      </div>
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="p-2.5 rounded-xl bg-brand-light border border-border mb-3">
            <Clock className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-xs font-medium text-text-secondary">
            No upcoming deadlines
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {upcoming.map((lic) => {
            const days = getDaysRemaining(lic.expiry_date);
            const daysLbl = getDaysLabel(days);
            return (
              <div
                key={lic.id}
                className="p-3.5 border border-border rounded-xl hover:border-border-strong hover:bg-bg-subtle transition-all cursor-pointer group"
                onClick={() => onLicenseClick(lic.id)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-text-heading truncate pr-2 group-hover:text-secondary transition-colors">
                    {lic.license_type}
                  </span>
                  <span className={`text-xs flex-shrink-0 ${daysLbl.cls}`}>
                    {daysLbl.text}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mb-2">
                  Expires: {fmtDate(lic.expiry_date)}
                </p>
                <div
                  className={`w-full rounded-full h-1 ${getProgressBg(days)}`}
                >
                  <div
                    className={`h-1 rounded-full ${getProgressColor(days)}`}
                    style={{
                      width: `${Math.max(5, 100 - (days / 120) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
