import React from "react";
import { Check, Sparkles, Building2, Rocket, LucideIcon } from "lucide-react";

// Reusable PlanCard Component
interface PlanCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
  isActive?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  icon: Icon,
  description,
  price,
  period,
  features,
  cta,
  isPopular = false,
  isActive = false,
}) => {
  return (
    <div className="relative">
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-[#1B2A49] text-white text-[10px] font-semibold py-1 px-3 rounded-full">
            POPULAR
          </div>
        </div>
      )}

      <div
        className={`bg-white rounded-xl overflow-hidden transition-shadow hover:shadow-lg ${
          isPopular
            ? "shadow-lg border-2 border-[#2E69A4]"
            : "shadow-md border border-[#E1E8F5]"
        }`}
      >
        <div className="p-6">
          {/* Icon */}
          <div
            className={`inline-flex p-2.5 rounded-md mb-4 ${
              isPopular ? "bg-[#2E69A4]" : "bg-[#E1E8F5]"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isPopular ? "text-white" : "text-[#1B2A49]"
              }`}
            />
          </div>

          {/* Plan Name */}
          <h3 className="text-xl font-semibold text-[#1B2A49] mb-1">{name}</h3>

          {/* Description */}
          <p className="text-[#344767] mb-4 text-sm leading-snug h-10">
            {description}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              {price !== "Free" && (
                <span className="text-sm text-[#344767] font-medium">AED</span>
              )}
              <span className="text-4xl font-bold text-[#1B2A49]">{price}</span>
            </div>
            <p className="text-[#344767] text-sm mt-0.5">{period}</p>
          </div>

          {/* CTA Button */}
          <button
            className={`w-full py-2.5 px-5 rounded-md font-semibold transition-colors mb-6 text-sm ${
              isActive
                ? "bg-[#E1E8F5] text-[#1B2A49] hover:bg-[#1B2A49] hover:text-white"
                : "bg-[#1B2A49] text-white hover:bg-[#2E69A4]"
            }`}
          >
            {cta}
          </button>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#2E69A4] flex-shrink-0 mt-0.5" />
                <span className="text-[#344767] text-sm leading-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
