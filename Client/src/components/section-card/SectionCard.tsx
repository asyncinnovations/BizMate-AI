import React from "react";

interface CardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<CardProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => (
  <div
    className={`bg-surface rounded-xl shadow-card border border-border p-6 hover:shadow-raised transition-all duration-300 ${className}`}
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-text-heading">{title}</h2>
      <Icon className="w-5 h-5 text-secondary" />
    </div>
    {children}
  </div>
);

export default SectionCard;