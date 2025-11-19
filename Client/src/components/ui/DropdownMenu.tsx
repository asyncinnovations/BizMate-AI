"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  triggerClassName?: string;
  align?: "left" | "right";
  triggerLabel?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  triggerClassName = "",
  align = "right",
  triggerLabel = "More Actions",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: DropdownMenuItem) => {
    item.onClick();
    setIsOpen(false);
  };

  const getItemStyles = (
    variant: "default" | "destructive" | "success" = "default"
  ) => {
    const baseStyles =
      "flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors duration-200";
    switch (variant) {
      case "destructive":
        return twMerge(
          baseStyles,
          "text-gray-700 hover:bg-red-50 hover:text-red-600"
        );
      case "success":
        return twMerge(
          baseStyles,
          "text-gray-700 hover:bg-green-50 hover:text-green-600"
        );
      default:
        return twMerge(
          baseStyles,
          "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        );
    }
  };

  // Merge trigger classes
  const triggerClasses = twMerge(
    "p-2 text-gray-600 hover:text-[#1B2A49] hover:bg-blue-50 rounded-lg transition-all duration-200",
    triggerClassName
  );

  // Merge dropdown container classes
  const dropdownContainerClasses = twMerge(
    "fixed z-50 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2",
    align === "right" ? "right-4" : "left-4"
  );

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={triggerClasses}
        title={triggerLabel}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className={dropdownContainerClasses}
          style={{
            position: "fixed",
            top: dropdownRef.current!.getBoundingClientRect().bottom + 4,
            [align as keyof React.CSSProperties]: "16px",
          }}
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
            {triggerLabel}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={getItemStyles(item.variant)}
              >
                <div
                  className={twMerge(
                    "flex-shrink-0",
                    item.variant === "destructive"
                      ? "text-red-500"
                      : item.variant === "success"
                      ? "text-green-600"
                      : "text-blue-500"
                  )}
                >
                  {item.icon}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
