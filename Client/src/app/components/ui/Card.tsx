"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = false,
}) => {
  const baseClasses =
    "bg-white rounded-xl p-6 shadow-sm border border-[#E1E8F5] transition-all duration-300";

  const mergedClasses = twMerge(
    baseClasses,
    hoverEffect ? "hover:shadow-md hover:-translate-y-[2px]" : "",
    className
  );

  return <div className={mergedClasses}>{children}</div>;
};

export default Card;
