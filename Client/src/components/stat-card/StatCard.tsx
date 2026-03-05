import React from "react";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badgeText: string;
  badgeBg: string;
  badgeColor: string;
  title: string;
  value: string | number;
  subtitle: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBg,
  iconColor,
  badgeText,
  badgeBg,
  badgeColor,
  title,
  value,
  subtitle,
  className = "",
}) => {
  const baseClasses =
    "bg-surface rounded-xl p-5 shadow-card border border-border hover:shadow-raised transition-shadow duration-200";

  return (
    <div className={twMerge(baseClasses, className)}>

      {/* Header — icon + badge */}
      <div className="flex items-center justify-between mb-3">
        <div className={twMerge("rounded-full p-2.5 shadow-card", iconBg)}>
          <div className={iconColor}>{icon}</div>
        </div>
        <span
          className={twMerge(
            "text-sm font-semibold px-2 py-1 rounded-full",
            badgeBg,
            badgeColor
          )}
        >
          {badgeText}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-text-heading mb-1">{value}</p>
      <p className="text-text-muted text-xs">{subtitle}</p>
    </div>
  );
};

export default StatCard;