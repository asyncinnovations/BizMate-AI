"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  loading = false,
  disabled = false,
  size = "md",
}) => {
  const isDisabled = disabled || loading;

  const track = size === "sm"
    ? "h-5 w-9"
    : "h-6 w-11";

  const thumb = size === "sm"
    ? "h-3.5 w-3.5"
    : "h-4 w-4";

  const thumbOn = size === "sm" ? "translate-x-4" : "translate-x-6";
  const thumbOff = "translate-x-1";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      disabled={isDisabled}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
        disabled:opacity-50 disabled:cursor-not-allowed
        ${track}
        ${enabled ? "bg-secondary" : "bg-border-strong"}
      `}
    >
      {loading ? (
        <Loader2
          className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 animate-spin text-surface"
        />
      ) : (
        <span
          className={`inline-block rounded-full bg-surface shadow-card transition-transform duration-200
            ${thumb}
            ${enabled ? thumbOn : thumbOff}
          `}
        />
      )}
    </button>
  );
};

export default ToggleSwitch;