"use client";
import React from "react";
import { Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

interface HeaderProps {
  title: string;
  description: string;
  showAIBadge?: boolean;
  icon?: React.ReactNode;
  buttons?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
    className?: string;
  }[];
}

export default function PageHeader({
  title,
  description,
  showAIBadge = false,
  icon,
  buttons = [],
}: HeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">

        {/* LEFT SECTION */}
        <div>
          <div className="flex items-center gap-3 mb-2">

            {/* Icon bubble */}
            {icon && (
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-light border border-border shadow-card">
                {icon}
              </span>
            )}

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-text-heading">
                  {title}
                </h1>

                {/* AI badge — kept purple as it's a distinct product identity color */}
                {showAIBadge && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 rounded-full">
                    <Sparkles size={14} className="text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">
                      AI Powered
                    </span>
                  </div>
                )}
              </div>

              <p className="text-text-primary mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION — action buttons */}
        {buttons.length > 0 && (
          <div className="flex gap-3">
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                startIcon={button.icon}
                className={button.className}
              >
                {button.text}
              </Button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}