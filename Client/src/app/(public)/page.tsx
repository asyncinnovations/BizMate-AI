"use client";

import React from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Sparkles, Star } from "lucide-react";
import HeroSection from "@/components/home-sections/HeroSection";
import IntegrationsStrip from "@/components/home-sections/IntegrationStripes";
import StatsSection from "@/components/home-sections/StatsSection";
import FeaturesSection from "@/components/home-sections/FeaturesSection";
import HowItWorksSection from "@/components/home-sections/HowItWorksSection";
import AIReplyHubSection from "@/components/home-sections/AIReplyHubSection";
import InvoicingSection from "@/components/home-sections/InvoicingSection";
import TestimonialsSection from "@/components/home-sections/TestimonialsSection";
import TrustBadgesSection from "@/components/home-sections/TrustBadgeSection";
import PricingSection from "@/components/home-sections/PricingSection";
import FAQSection from "@/components/home-sections/FAQSection";
import CTASection from "@/components/home-sections/CTASection";

export const Stars = ({ n = 5 }: { n?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-[#F6A821] text-[#F6A821]" />
    ))}
  </div>
);

export const Chip = ({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border ${
      dark
        ? "bg-white/10 border-white/20 text-white"
        : "bg-[#1B2A49]/6 border-[#2E69A4]/20 text-[#2E69A4]"
    }`}
  >
    <Sparkles className="w-3 h-3" />
    {children}
  </span>
);

export default function HomePage() {
  return (
    <PublicLayout>
      <div className="bg-white overflow-x-hidden">
        <HeroSection />
        <IntegrationsStrip />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AIReplyHubSection />
        <InvoicingSection />
        <TestimonialsSection />
        <PricingSection />
        <TrustBadgesSection />
        <FAQSection />
        <CTASection />

        {/* Global animation styles */}
        <style jsx global>{`
          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  );
}
