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
    "bg-surface rounded-xl p-6 shadow-card border border-border transition-all duration-300";

  const mergedClasses = twMerge(
    baseClasses,
    hoverEffect ? "hover:shadow-raised hover:-translate-y-[2px]" : "",
    className
  );

  return <div className={mergedClasses}>{children}</div>;
};

export default Card;