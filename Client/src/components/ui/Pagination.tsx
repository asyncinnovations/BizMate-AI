"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  className,
}) => {
  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 text-sm text-gray-700 select-none",
        className
      )}
    >
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md transition-all",
          "hover:bg-gray-100 active:scale-95",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPages().map((page, idx) => (
          <React.Fragment key={idx}>
            {page === "..." ? (
              <span className="px-2 text-gray-400">…</span>
            ) : (
              <button
                onClick={() => onPageChange(Number(page))}
                className={cn(
                  "px-3 py-1 rounded-md transition-all text-gray-700",
                  "hover:bg-gray-100 active:scale-95",

                  page === currentPage &&
                    "bg-white shadow-sm border border-gray-300"
                )}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md transition-all",
          "hover:bg-gray-100 active:scale-95",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
