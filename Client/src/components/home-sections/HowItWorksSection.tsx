"use client";

import React from "react";
import { Building2, Bot, Zap } from "lucide-react";
import { Chip } from "@/app/(public)/page";
import { useInView } from "@/hooks/HomePage";

export default function HowItWorksSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="py-28 px-6"
      style={{
        background: "linear-gradient(180deg, #F8FAFF 0%, #ffffff 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Chip>How It Works</Chip>
          <h2 className="font-serif text-4xl md:text-[56px] text-[#1B2A49] mt-5 mb-4">
            Up and running in{" "}
            <span style={{ color: "#2E69A4" }}>15 minutes</span>
          </h2>
          <p className="text-lg text-[#344767] max-w-xl mx-auto">
            No technical setup. No lengthy onboarding. Connect, configure,
            and let the AI work.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Connector */}
          <div
            className="hidden md:block absolute top-[72px] left-[calc(16.6%+3rem)] right-[calc(16.6%+3rem)] h-px"
            style={{
              background: "linear-gradient(90deg, #2E69A4, #F6A821)",
            }}
          />

          {[
            {
              step: "01",
              icon: <Building2 className="w-7 h-7" />,
              title: "Connect your business",
              desc: "Add your company profile, upload your client list, and connect WhatsApp, email, and Instagram in minutes.",
            },
            {
              step: "02",
              icon: <Bot className="w-7 h-7" />,
              title: "AI learns your workflow",
              desc: "The AI reads your communication style, invoice patterns, and compliance calendar to build a personalised automation engine.",
            },
            {
              step: "03",
              icon: <Zap className="w-7 h-7" />,
              title: "Automate and grow",
              desc: "Invoices go out on time. Reminders fire before deadlines. AI handles routine replies. Your dashboard shows everything live.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center transition-all duration-700 delay-${i * 150} ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative mb-7">
                <div className="w-[140px] h-[140px] rounded-full bg-white border-2 border-[#E1E8F5] shadow-xl flex items-center justify-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #1B2A49, #2E69A4)",
                    }}
                  >
                    {s.icon}
                  </div>
                </div>
                <div
                  className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                  style={{ background: "#F6A821" }}
                >
                  <span className="text-[10px] font-black text-white">
                    {s.step}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1B2A49] mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-[#344767] leading-relaxed max-w-xs">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}