"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  // same styles you originally used
  const baseClasses =
    "w-full border text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent rounded-lg px-4 py-3 text-sm transition-all duration-200";

  const mergedClasses = twMerge(
    baseClasses,
    error ? "border-red-500" : "border-gray-300",
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-gray-700 text-sm font-medium"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={twMerge(mergedClasses, isPassword ? "pr-10" : "")}
        />

        {/* 👁 Password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E69A4] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* ⚠️ Error message */}
      {error && (
        <div className="flex items-center mt-1 space-x-1">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-500 text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;
