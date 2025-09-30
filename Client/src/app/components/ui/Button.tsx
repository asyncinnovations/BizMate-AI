import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseClasses = `bg-[#1B2A49] text-white px-6 py-3 rounded-lg transition-colors flex justify-center items-center font-medium shadow-sm`;

  const mergedCLasses = twMerge(
    baseClasses,
    disabled
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-[#152238] cursor-pointer",
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${mergedCLasses}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
