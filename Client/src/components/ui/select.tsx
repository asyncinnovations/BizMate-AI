// components/SelectInput.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  groupLabel?: string;
}

const Select: React.FC<SelectInputProps> = ({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  className,
  groupLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [selected, setSelected] = useState(value || "");

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (option: Option) => {
    setSelected(option.value);
    onChange && onChange(option.value);
    setIsOpen(false);
  };

  // Auto detect dropdown direction
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative w-64 text-sm", className)}>

      {/* Select Box */}
      <button
        type="button"
        className="w-full flex justify-between items-center px-4 py-3 border border-border rounded-lg bg-bg-base text-text-secondary focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary hover:border-border-strong transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selected
            ? options.find((o) => o.value === selected)?.label
            : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-muted transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          className={cn(
            "absolute z-10 w-full bg-surface border border-border rounded-lg shadow-raised max-h-60 overflow-y-auto transition-all",
            openUp ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          {groupLabel && (
            <li className="px-4 py-2 font-semibold text-text-muted text-xs uppercase tracking-wide border-b border-border">
              {groupLabel}
            </li>
          )}

          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={cn(
                "px-4 py-2 cursor-pointer text-text-secondary hover:bg-brand-light hover:text-secondary transition-colors",
                selected === option.value
                  ? "bg-brand-light text-secondary font-medium"
                  : ""
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default Select;