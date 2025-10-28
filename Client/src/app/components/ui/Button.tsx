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
}) => {
  // 🎯 Base shared classes
  const baseClasses =
    "px-6 py-3 rounded-lg transition-all flex items-center justify-center font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1";

  // 🎨 Variants (Primary / Secondary)
  const variantClasses =
    variant === "primary"
      ? "bg-[#1B2A49] text-white hover:bg-[#162038] focus:ring-[#1B2A49]"
      : "border border-[#2E69A4] text-[#2E69A4] bg-white hover:bg-[#F4F7FA] focus:ring-[#2E69A4]";

  // 🧩 Merge all Tailwind classes cleanly
  const mergedClasses = twMerge(
    baseClasses,
    variantClasses,
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={mergedClasses}
    >
      {loading ? (
        <LoadingSpinner size="w-5 h-5" color="border-white" />
      ) : (
        <>
          {startIcon && <span className="mr-2 flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
