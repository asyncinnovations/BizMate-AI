"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import Button from "../ui/Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCTAClick?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCTAClick,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center space-y-2 bg-bg-base rounded-xl border border-border ${className}`}
    >
      {/* Icon container */}
      <div className="p-4 rounded-2xl bg-brand-light border border-border shadow-card mb-4">
        <Icon className="w-10 h-10 text-secondary" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-heading">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-text-secondary text-sm max-w-sm">{description}</p>
      )}

      {/* CTA button */}
      {ctaLabel && onCTAClick && (
        <Button onClick={onCTAClick} className="mt-4 py-2 px-5">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;