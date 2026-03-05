"use client";

import React from "react";
import { Shield, Lock, Globe } from "lucide-react";

export default function TrustBadgesSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Shield className="w-8 h-8" />,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
            title: "UAE FTA Compliant",
            desc: "All invoices meet Federal Tax Authority requirements with correct VAT (5%) and proper TRN formatting for every emirate.",
          },
          {
            icon: <Lock className="w-8 h-8" />,
            bg: "bg-blue-50",
            color: "text-blue-600",
            title: "Enterprise Security",
            desc: "Data encrypted at rest and in transit. Fully compliant with UAE data protection and privacy regulations.",
          },
          {
            icon: <Globe className="w-8 h-8" />,
            bg: "bg-violet-50",
            color: "text-violet-600",
            title: "Arabic & English",
            desc: "Full bilingual support across the platform — invoices, reminders, and documents in Arabic and English.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#E1E8F5] hover:shadow-lg transition-all"
          >
            <div
              className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5`}
            >
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-[#1B2A49] mb-3">
              {item.title}
            </h3>
            <p className="text-sm text-[#344767] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}