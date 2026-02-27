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
    className={`bg-white rounded-xl shadow-sm border border-[#E1E8F5] p-6 hover:shadow-md transition-all duration-300 ${className}`}
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-[#1B2A49]">{title}</h2>
      <Icon className="w-5 h-5 text-[#2E69A4]" />
    </div>
    {children}
  </div>
);

export default SectionCard;
