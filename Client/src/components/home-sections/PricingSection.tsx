"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useInView } from "@/hooks/HomePage";
import { Chip } from "@/app/(public)/page";

const PRICING = [
  {
    name: "Starter",
    price: "149",
    tag: "",
    highlight: false,
    desc: "For solo entrepreneurs and small teams just getting started with automation.",
    cta: "Start Free Trial",
    features: [
      "Up to 50 invoices/month",
      "AI Reminders (5 active)",
      "100 client contacts",
      "Email support",
      "Basic analytics dashboard",
    ],
  },
  {
    name: "Growth",
    price: "349",
    tag: "Most Popular",
    highlight: true,
    desc: "Full automation for growing UAE businesses. Everything you need, unlimited.",
    cta: "Start Free Trial",
    features: [
      "Unlimited invoices",
      "Unlimited AI Reminders",
      "Unlimited client contacts",
      "AI Reply Hub (WhatsApp + Instagram + Email)",
      "Advanced analytics & reports",
      "Document Center with AI generation",
      "Team Management (5 seats)",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: null,
    tag: "",
    highlight: false,
    desc: "For large teams needing custom integrations, SLAs, and dedicated support.",
    cta: "Contact Sales",
    features: [
      "Everything in Growth",
      "Custom AI model training",
      "API access & webhooks",
      "Dedicated account manager",
      "SLA guarantee",
      "Unlimited team seats",
      "Custom onboarding & training",
    ],
  },
];

export default function PricingSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="py-28 px-6"
      style={{ background: "#F8FAFF" }}
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Chip>Pricing</Chip>
          <h2 className="font-serif text-4xl md:text-[56px] text-[#1B2A49] mt-5 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-[#344767] max-w-lg mx-auto">
            No hidden fees. No annual lock-in. All prices in AED. Cancel
            anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PRICING.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-2xl flex flex-col transition-all duration-300 ${
                p.highlight
                  ? "bg-[#1B2A49] text-white shadow-2xl scale-[1.04] border-2 border-[#2E69A4]"
                  : "bg-white border-2 border-[#E1E8F5] hover:border-[#2E69A4]/40 hover:shadow-xl"
              }`}
              style={{ padding: "2rem" }}
            >
              {p.tag && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-white"
                  style={{ background: "#F6A821" }}
                >
                  {p.tag}
                </div>
              )}
              <div className="mb-7">
                <h3
                  className={`text-xl font-bold mb-1 ${p.highlight ? "text-white" : "text-[#1B2A49]"}`}
                >
                  {p.name}
                </h3>
                <p
                  className={`text-xs mb-5 ${p.highlight ? "text-[#8BA3C7]" : "text-[#9BACC7]"}`}
                >
                  {p.desc}
                </p>
                {p.price ? (
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-sm font-bold ${p.highlight ? "text-[#8BA3C7]" : "text-[#9BACC7]"}`}
                    >
                      AED
                    </span>
                    <span
                      className={`font-serif text-5xl ${p.highlight ? "text-white" : "text-[#1B2A49]"}`}
                    >
                      {p.price}
                    </span>
                    <span
                      className={`text-sm ${p.highlight ? "text-[#8BA3C7]" : "text-[#9BACC7]"}`}
                    >
                      /mo
                    </span>
                  </div>
                ) : (
                  <div
                    className={`font-serif text-4xl ${p.highlight ? "text-white" : "text-[#1B2A49]"}`}
                  >
                    Custom
                  </div>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${p.highlight ? "text-[#F6A821]" : "text-emerald-500"}`}
                    />
                    <span
                      className={`text-sm ${p.highlight ? "text-[#C8D8F0]" : "text-[#344767]"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.price ? "/register" : "/contact"}
                className={`w-full py-3.5 rounded-xl font-bold text-center text-sm transition-all block ${
                  p.highlight
                    ? "bg-[#F6A821] text-white hover:bg-[#e09a1e]"
                    : !p.price
                      ? "border-2 border-[#1B2A49] text-[#1B2A49] hover:bg-[#1B2A49] hover:text-white"
                      : "bg-[#1B2A49] text-white hover:bg-[#2E69A4]"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-[#9BACC7] mt-8">
          14-day free trial · No credit card required · UAE data residency
        </p>
      </div>
    </section>
  );
}