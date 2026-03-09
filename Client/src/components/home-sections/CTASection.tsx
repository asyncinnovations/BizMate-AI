"use client";

import React from "react";
import Link from "next/link";
import { Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { useInView } from "@/hooks/HomePage";

export default function CTASection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="py-32 px-6 relative overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, #0d1b2e 0%, #1B2A49 50%, #1a3060 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 25% 50%, rgba(46,105,164,0.35) 0%, transparent 55%), radial-gradient(ellipse at 75% 50%, rgba(246,168,33,0.12) 0%, transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className={`relative z-10 max-w-3xl mx-auto text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/8 mb-10">
          <Award className="w-3.5 h-3.5 text-[#F6A821]" />
          <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
            Start your free trial today
          </span>
        </div>
        <h2 className="font-serif text-5xl md:text-[68px] text-white mb-6 leading-[1.05]">
          Your business deserves
          <br />
          <span style={{ color: "#F6A821" }}>smarter automation.</span>
        </h2>
        <p
          className="text-lg mb-12 max-w-xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Join 2,400+ UAE businesses already running on autopilot. Set up in
          15 minutes. No credit card needed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2.5 px-10 py-4 rounded-lg text-lg font-black text-[#1B2A49] transition-all hover:scale-[1.02] hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, #F6A821 0%, #ffd670 100%)",
            }}
          >
            Start Free — 14 Days
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2.5 px-10 py-4 rounded-lg text-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-all"
          >
            Talk to Sales
          </Link>
        </div>
        <div
          className="flex flex-wrap items-center justify-center gap-6 text-sm"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {[
            "14-day free trial",
            "No credit card required",
            "UAE data residency",
            "Cancel anytime",
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}