"use client";

import React from "react";
import {
  Phone,
  Instagram,
  Mail,
  Shield,
  Receipt,
  FileText,
  Cpu,
} from "lucide-react";

export default function IntegrationsStrip() {
  return (
    <section className="py-10 border-y border-[#E1E8F5] bg-[#FAFBFF]">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-[11px] font-bold text-[#9BACC7] uppercase tracking-widest mb-7">
          Connects with the tools your business already uses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            {
              label: "WhatsApp Business",
              icon: <Phone className="w-4 h-4" />,
              color: "bg-emerald-500",
            },
            {
              label: "Instagram",
              icon: <Instagram className="w-4 h-4" />,
              color: "bg-gradient-to-br from-pink-500 to-violet-600",
            },
            {
              label: "Email",
              icon: <Mail className="w-4 h-4" />,
              color: "bg-blue-500",
            },
            {
              label: "UAE FTA Portal",
              icon: <Shield className="w-4 h-4" />,
              color: "bg-red-600",
            },
            {
              label: "VAT Invoicing",
              icon: <Receipt className="w-4 h-4" />,
              color: "bg-amber-500",
            },
            {
              label: "PDF Export",
              icon: <FileText className="w-4 h-4" />,
              color: "bg-violet-600",
            },
            {
              label: "AI Models",
              icon: <Cpu className="w-4 h-4" />,
              color: "bg-[#1B2A49]",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-xl border border-[#E1E8F5] shadow-sm hover:shadow-md hover:border-[#2E69A4]/30 transition-all cursor-default"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${item.color}`}
              >
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-[#1B2A49]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
