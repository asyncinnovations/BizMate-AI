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
<<<<<<< HEAD
  readOnly?: boolean;
=======
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
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
<<<<<<< HEAD
  readOnly = false,
=======
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  const baseClasses =
<<<<<<< HEAD
    "w-full border text-[#344767] rounded-lg px-4 py-3 text-sm transition-all duration-200";

  const focusClasses = readOnly
    ? "focus:outline-none"
    : "focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent";

  const readonlyClasses = readOnly
    ? "bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200"
    : "";

  const mergedClasses = twMerge(
    baseClasses,
    focusClasses,
    readonlyClasses,
=======
    "w-full border text-[#344767] focus:outline-none focus:ring-2 focus:ring-[#2E69A4] focus:border-transparent rounded-lg px-4 py-3 text-sm transition-all duration-200";

  const mergedClasses = twMerge(
    baseClasses,
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
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
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* TEXTAREA SUPPORT */}
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
<<<<<<< HEAD
            onChange={readOnly ? undefined : onChange}
            placeholder={placeholder}
            readOnly={readOnly}
=======
            onChange={onChange}
            placeholder={placeholder}
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
            className={twMerge(mergedClasses, "min-h-[100px]")}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={isPassword && showPassword ? "text" : type}
            value={value}
<<<<<<< HEAD
            onChange={readOnly ? undefined : onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            readOnly={readOnly}
            className={twMerge(
              mergedClasses,
              isPassword ? "pr-10" : ""
            )}
          />
        )}

        {/* PASSWORD TOGGLE (disabled if readonly) */}
        {isPassword && !readOnly && (
=======
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={twMerge(mergedClasses, isPassword ? "pr-10" : "")}
          />
        )}

        {/* PASSWORD TOGGLE (only for input) */}
        {isPassword && (
>>>>>>> a4b01ef75c9113507dfa5fa1e5f3c8f4030c34fc
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E69A4] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* ERROR MESSAGE */}
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
