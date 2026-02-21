"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import Button from "../ui/Button";

interface EmptyStateProps {
  icon: LucideIcon;          // Main icon to show
  title: string;             // Title text
  description?: string;      // Optional description
  ctaLabel?: string;         // Optional CTA button label
  onCTAClick?: () => void;   // Optional CTA button action
  className?: string;        // Optional extra wrapper classes
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
      className={`flex flex-col items-center justify-center py-12 text-center space-y-2 ${className}`}
    >
      {/* ICON */}
      <div className="p-4 rounded-full bg-gray-100 mb-4">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>

      {/* TITLE */}
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>

      {/* DESCRIPTION */}
      {description && (
        <p className="text-gray-500 text-sm max-w-sm">{description}</p>
      )}

      {/* CTA BUTTON */}
      {ctaLabel && onCTAClick && (
        <Button
          onClick={onCTAClick}
          className="mt-4 py-2 px-5"
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
