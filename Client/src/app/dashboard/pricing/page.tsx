"use client";

import React from "react";
import { Sparkles, Building2, Rocket } from "lucide-react";
import PlanCard from "@/components/plan-card/PlanCard";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Main Pricing Page Component
export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      icon: Sparkles,
      description: "Perfect for freelancers and solo entrepreneurs",
      price: "Free",
      period: "Forever",
      features: [
        "5 invoices per month",
        "10 AI queries per month",
        "Basic compliance reminders",
        "Email notifications",
        "PDF invoice generation",
        "Single user access",
        "Email support",
        "UAE VAT calculator",
      ],
      cta: "Current Plan",
      isPopular: false,
      isActive: true,
    },
    {
      name: "Professional",
      icon: Building2,
      description: "Ideal for growing SMEs and startups",
      price: "299",
      period: "per month",
      features: [
        "Unlimited invoices",
        "Unlimited AI queries",
        "Advanced compliance alerts",
        "WhatsApp & Email notifications",
        "Auto-reply assistant",
        "Up to 5 team members",
        "Document generator",
        "Payment tracking",
        "Priority support",
        "Multi-language support",
      ],
      cta: "Start Free Trial",
      isPopular: true,
      isActive: false,
    },
    {
      name: "Enterprise",
      icon: Rocket,
      description: "Complete solution for established businesses",
      price: "699",
      period: "per month",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Instagram auto-reply",
        "Advanced analytics",
        "API access",
        "Custom workflows",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom AI training",
        "Bank integrations",
      ],
      cta: "Contact Sales",
      isPopular: false,
      isActive: false,
    },
  ];

  return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#F4F7FA] pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center my-10">
              <h1 className="text-3xl font-semibold text-[#1B2A49]">
                Upgrade your plan
              </h1>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {plans.map((plan, index) => (
                <PlanCard
                  key={index}
                  name={plan.name}
                  icon={plan.icon}
                  description={plan.description}
                  price={plan.price}
                  period={plan.period}
                  features={plan.features}
                  cta={plan.cta}
                  isPopular={plan.isPopular}
                  isActive={plan.isActive}
                />
              ))}
            </div>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-[#344767] mb-4">
                All plans include UAE compliance updates and secure data storage
              </p>
              <p className="text-sm text-[#344767]">
                Need a custom solution?{" "}
                <a
                  href="#"
                  className="text-[#2E69A4] hover:underline font-medium"
                >
                  Contact our sales team
                </a>
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
}
