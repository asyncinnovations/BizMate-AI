"use client";
import React from "react";
import { Sparkles } from "lucide-react";
import Button from "@/app/components/ui/Button";

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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#1B2A49]">
              {icon && (
                <span className="inline-flex items-center mr-2 p-2 rounded-full bg-gradient-to-br from-green-400/20 to-blue-500/20 border border-green-400/30 shadow-lg shadow-green-500/10">
                  {icon}
                </span>
              )}
              {title}
            </h1>
            {showAIBadge && (
              <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 rounded-full">
                <Sparkles size={14} className="text-purple-600" />
                <span className="text-xs font-semibold text-purple-600">
                  AI Powered
                </span>
              </div>
            )}
          </div>
          <p className="text-[#344767]">{description}</p>
        </div>
        <div className="flex gap-3">
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              icon={button.icon}
              className={button.className}
            >
              {button.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
