"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  className = "",
  required = false,
  readOnly = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  const baseClasses =
    "w-full border text-text-primary rounded-lg px-4 py-3 text-sm transition-all duration-200 bg-bg-base placeholder:text-text-muted";

  const focusClasses = readOnly
    ? "focus:outline-none"
    : "focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent";

  const readonlyClasses = readOnly
    ? "bg-bg-muted cursor-not-allowed text-text-muted border-border"
    : "";

  const mergedClasses = twMerge(
    baseClasses,
    focusClasses,
    readonlyClasses,
    error ? "border-status-error" : "border-border",
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-text-secondary text-sm font-medium"
        >
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* TEXTAREA SUPPORT */}
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={readOnly ? undefined : onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className={twMerge(mergedClasses, "min-h-[100px]")}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={isPassword && showPassword ? "text" : type}
            value={value}
            onChange={readOnly ? undefined : onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            readOnly={readOnly}
            className={twMerge(mergedClasses, isPassword ? "pr-10" : "")}
          />
        )}

        {/* PASSWORD TOGGLE */}
        {isPassword && !readOnly && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-secondary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-center mt-1 space-x-1">
          <AlertCircle className="w-4 h-4 text-status-error" />
          <span className="text-status-error text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;