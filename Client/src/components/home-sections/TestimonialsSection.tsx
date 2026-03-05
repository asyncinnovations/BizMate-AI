"use client";

import React from "react";
import { Star } from "lucide-react";
import { Chip, Stars } from "@/app/(public)/page";
import { useInView } from "@/hooks/HomePage";

const TESTIMONIALS = [
  {
    name: "Khalid Al Mansoori",
    role: "CEO, AlMansoori Trading LLC",
    city: "Dubai",
    avatar: "KM",
    color: "bg-[#2E69A4]",
    stars: 5,
    text: "We used to spend hours every week chasing invoices and compliance deadlines manually. This platform automated everything. Our team now focuses on actual business growth, not admin work.",
  },
  {
    name: "Sara Hassan",
    role: "Owner, Bloom Boutique",
    city: "Abu Dhabi",
    avatar: "SH",
    color: "bg-emerald-600",
    stars: 5,
    text: "The AI Reply Hub is incredible. We handle 200+ WhatsApp messages a day — the AI suggestions save us at least 3 hours daily. Our clients say we respond faster than any business they deal with.",
  },
  {
    name: "Omar Farooq",
    role: "Finance Manager, Farooq & Sons",
    city: "Sharjah",
    avatar: "OF",
    color: "bg-[#F6A821]",
    stars: 5,
    text: "VAT deadlines used to stress me out every quarter. Now I get reminders a week before, across email and WhatsApp. Zero missed deadlines since we switched. The FTA compliance features alone are worth it.",
  },
  {
    name: "Nour Al Rashidi",
    role: "Co-Founder, Nour Events",
    city: "Ajman",
    avatar: "NR",
    color: "bg-violet-600",
    stars: 5,
    text: "Client management was scattered across Excel, WhatsApp, and email. Having everything unified with the AI auto-reply has transformed how our team works. I genuinely can't imagine going back.",
  },
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Chip>Customer Stories</Chip>
          <h2 className="font-serif text-4xl md:text-[56px] text-[#1B2A49] mt-5 mb-4">
            Trusted from{" "}
            <span style={{ color: "#2E69A4" }}>Dubai to Fujairah</span>
          </h2>
          <p className="text-lg text-[#344767]">
            Real results from real UAE businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`group p-8 rounded-2xl border-2 border-[#E1E8F5] hover:border-[#2E69A4]/30 hover:shadow-xl transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                transitionDelay: `${i * 100}ms`,
                background: "linear-gradient(135deg, #fafcff 0%, #ffffff 100%)",
              }}
            >
              <Stars n={t.stars} />
              <p className="text-[#344767] text-base leading-relaxed my-6 italic">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-[#F4F7FA]">
                <div
                  className={`w-12 h-12 rounded-full ${t.color} text-white text-sm font-bold flex items-center justify-center shadow-md`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#1B2A49]">{t.name}</p>
                  <p className="text-xs text-[#9BACC7]">
                    {t.role} · {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
