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

  // 🟦 Auto detect dropdown direction
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
        className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-[#344767] focus:outline-none focus:ring-2 focus:ring-[#2E69A4]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selected
            ? options.find((o) => o.value === selected)?.label
            : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          className={cn(
            "absolute z-10 w-full bg-white border border-[#E1E8F5] rounded-lg shadow-lg max-h-60 overflow-y-auto transition-all",
            openUp ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          {groupLabel && (
            <li className="px-4 py-2 font-semibold text-gray-500">
              {groupLabel}
            </li>
          )}

          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={cn(
                "px-4 py-2 cursor-pointer hover:bg-gray-100",
                selected === option.value ? "bg-gray-100" : ""
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
