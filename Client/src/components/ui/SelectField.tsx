"use client";

import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { AlertCircle, ChevronDown, Check } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  className = "",
  required = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    // Simulate a native ChangeEvent<HTMLSelectElement>
    const syntheticEvent = {
      target: { name, value: optionValue },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setOpen(false);
  };

  const triggerClasses = twMerge(
    "w-full border text-sm rounded-lg px-4 py-3 transition-all duration-200 bg-bg-base flex items-center justify-between cursor-pointer select-none",
    error ? "border-status-error" : "border-border",
    open ? "ring-2 ring-border-focus border-transparent" : "",
    disabled ? "bg-bg-muted cursor-not-allowed text-text-muted" : "text-text-primary",
    className
  );

  return (
    <div className="w-full" ref={containerRef}>
      {/* Label */}
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
        {/* Trigger Button */}
        <div
          id={name}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={triggerClasses}
        >
          <span className={selectedOption ? "text-text-primary" : "text-text-muted"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={twMerge(
              "text-text-muted transition-transform duration-200 flex-shrink-0",
              open ? "rotate-180" : ""
            )}
          />
        </div>

        {/* Dropdown */}
        {open && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1 w-full bg-bg-base border border-border rounded-lg shadow-lg max-h-56 overflow-y-auto py-1"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={twMerge(
                    "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150",
                    isSelected
                      ? "bg-blue-50 text-[#2E69A4] font-medium"
                      : "text-text-primary hover:bg-bg-muted"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check size={14} className="text-[#2E69A4] flex-shrink-0" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center mt-1 space-x-1">
          <AlertCircle className="w-4 h-4 text-status-error" />
          <span className="text-status-error text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

export default SelectField;