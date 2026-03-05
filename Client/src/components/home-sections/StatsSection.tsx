"use client";

import React from "react";
import { Building2, Bell, Zap, Clock } from "lucide-react";
import { useCounter, useInView } from "@/hooks/HomePage";

const STATS = [
  {
    value: 2400,
    suffix: "+",
    label: "Businesses Automated",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    value: 98,
    suffix: "%",
    label: "On-Time Reminders",
    icon: <Bell className="w-5 h-5" />,
  },
  {
    value: 3,
    suffix: "×",
    label: "Faster Invoicing",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    value: 40,
    suffix: "%",
    label: "Time Saved Weekly",
    icon: <Clock className="w-5 h-5" />,
  },
];

export default function StatsSection() {
  const { ref, inView } = useInView(0.3);
  const counters = [
    useCounter(2400, 2000, inView),
    useCounter(98, 1600, inView),
    useCounter(3, 1200, inView),
    useCounter(40, 1800, inView),
  ];

  return (
    <section
      ref={ref}
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1B2A49 0%, #162038 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(46,105,164,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(246,168,33,0.08) 0%, transparent 50%)",
        }}
      />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
          {STATS.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center text-[#F6A821] mx-auto mb-4 group-hover:bg-white/15 transition-colors border border-white/10">
                {s.icon}
              </div>
              <div className="text-5xl lg:text-6xl font-black text-white mb-2 font-serif">
                {counters[i]}
                {s.suffix}
              </div>
              <p className="text-[#8BA3C7] text-sm font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}