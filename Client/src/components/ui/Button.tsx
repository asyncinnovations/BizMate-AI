"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

interface ButtonProps {
  variant?: "primary" | "secondary";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  startIcon,
  endIcon,
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  loading = false,
  style,
}) => {
  const baseClasses =
    "px-6 py-3 rounded-lg transition-all flex items-center justify-center font-medium shadow-card focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variantClasses =
    variant === "primary"
      ? "bg-brand text-on-brand hover:bg-brand-hover focus:ring-border-focus"
      : "border border-secondary text-secondary bg-surface hover:bg-bg-base focus:ring-border-focus";

  const mergedClasses = twMerge(
    baseClasses,
    variantClasses,
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className,
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={mergedClasses}
      style={style}
    >
      {loading ? (
        <LoadingSpinner size="w-5 h-5" color="border-on-brand" />
      ) : (
        <>
          {startIcon && (
            <span className="mr-2 flex items-center">{startIcon}</span>
          )}
          {children}
          {endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
