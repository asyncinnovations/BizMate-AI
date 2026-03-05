"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Play,
  Shield,
  Star,
  ChevronDown,
  MessageSquare,
  FileText,
  Sparkles,
} from "lucide-react";
import { Stars } from "@/app/(public)/page";
import { useTypewriter } from "@/hooks/HomePage";

export default function HeroSection() {
  const typed = useTypewriter(
    ["UAE businesses.", "growing teams.", "solo founders.", "your business."],
    55,
    2000,
  );

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-24 overflow-hidden">
      {/* Background layers (same as original) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #0d1b2e 0%, #1B2A49 45%, #162038 100%)",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(46,105,164,0.6) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-32 right-0 w-80 h-80 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(246,168,33,0.8) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(46,105,164,0.8) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm mb-10"
          style={{ animation: "fadeSlideUp 0.6s ease both" }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white/80">
            Now live · UAE&apos;s #1 AI business automation platform
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-white/50" />
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-center mb-6 leading-[1.05]"
          style={{ animation: "fadeSlideUp 0.7s 0.1s ease both" }}
        >
          <span className="block text-[52px] md:text-[78px] font-normal text-white">
            Run your business
          </span>
          <span
            className="block text-[52px] md:text-[78px] font-normal"
            style={{
              background:
                "linear-gradient(120deg, #F6A821 0%, #ffd670 40%, #F6A821 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            on autopilot.
          </span>
        </h1>

        {/* Typewriter subline */}
        <p
          className="text-lg md:text-xl font-medium mb-3 h-8"
          style={{
            color: "rgba(255,255,255,0.65)",
            animation: "fadeSlideUp 0.7s 0.2s ease both",
          }}
        >
          AI-powered automation built for{" "}
          <span className="text-white font-semibold">{typed}</span>
          <span className="inline-block w-0.5 h-5 bg-[#F6A821] ml-0.5 align-middle animate-pulse" />
        </p>

        <p
          className="text-base max-w-xl mx-auto mb-12 leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.5)",
            animation: "fadeSlideUp 0.7s 0.3s ease both",
          }}
        >
          Invoicing, reminders, client management, AI reply hub, analytics, and
          documents — all in one platform designed for the UAE market.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          style={{ animation: "fadeSlideUp 0.7s 0.4s ease both" }}
        >
          <Link
            href="/register"
            className="group relative flex items-center justify-center gap-2.5 px-9 py-4 rounded-lg text-base font-bold text-[#1B2A49] transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #F6A821 0%, #ffd670 100%)",
            }}
          >
            <span className="relative z-10">Start Free — 14 Days</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="group flex items-center justify-center gap-2.5 px-9 py-4 rounded-lg text-base font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            Watch 2-min Demo
          </button>
        </div>

        {/* Social proof */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm"
          style={{ animation: "fadeSlideUp 0.7s 0.5s ease both" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {[
                ["KM", "bg-[#2E69A4]"],
                ["SH", "bg-emerald-600"],
                ["OF", "bg-[#F6A821]"],
                ["NR", "bg-violet-600"],
                ["MA", "bg-rose-600"],
              ].map(([ini, c], i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full ${c} border-2 border-[#1B2A49] flex items-center justify-center text-white text-[10px] font-bold`}
                >
                  {ini}
                </div>
              ))}
            </div>
            <span className="text-white/60">
              <strong className="text-white font-bold">2,400+</strong>{" "}
              businesses
            </span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Stars />
            <span className="text-white/60">
              <strong className="text-white font-bold">4.9</strong>/5 · 800+
              reviews
            </span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-white/60">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>UAE FTA Compliant</span>
          </div>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div
        className="relative z-10 mt-20 w-full max-w-5xl mx-auto px-4"
        style={{ animation: "fadeSlideUp 0.9s 0.6s ease both" }}
      >
        <div className="relative">
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-30 -z-10"
            style={{
              background: "linear-gradient(135deg, #2E69A4, #1B2A49)",
            }}
          />
          {/* Window */}
          <div
            className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Toolbar */}
            <div
              className="flex items-center gap-2 px-5 py-3 border-b border-white/8"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div
                className="ml-4 flex-1 max-w-xs h-6 rounded-md flex items-center px-3 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <span className="text-[10px] text-white/40">
                  app.platform.ae/dashboard
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-5 grid grid-cols-12 gap-4 bg-[#0f1827]">
              {/* Sidebar */}
              <div className="col-span-2 space-y-1">
                {[
                  ["#", "Dashboard"],
                  ["📄", "Invoices"],
                  ["🔔", "Reminders"],
                  ["💬", "Reply Hub"],
                  ["👥", "Clients"],
                  ["📊", "Analytics"],
                ].map(([ic, label], i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-medium cursor-default ${i === 0 ? "bg-[#2E69A4] text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    <span>{ic}</span>
                    {label}
                  </div>
                ))}
              </div>
              {/* Main content */}
              <div className="col-span-10 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {
                      label: "Total Revenue",
                      val: "AED 84,200",
                      delta: "+12.4%",
                      c: "text-emerald-400",
                    },
                    {
                      label: "Invoices Sent",
                      val: "142",
                      delta: "18 pending",
                      c: "text-amber-400",
                    },
                    {
                      label: "AI Replies",
                      val: "1,204",
                      delta: "This month",
                      c: "text-blue-400",
                    },
                    {
                      label: "Clients",
                      val: "312",
                      delta: "+8 this week",
                      c: "text-violet-400",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3 border border-white/8"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <p className="text-[9px] text-white/40 font-medium mb-1">
                        {s.label}
                      </p>
                      <p className="text-base font-black text-white">{s.val}</p>
                      <p className={`text-[9px] font-semibold mt-0.5 ${s.c}`}>
                        {s.delta}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Chart + reminders */}
                <div className="grid grid-cols-5 gap-3">
                  <div
                    className="col-span-3 rounded-xl p-4 border border-white/8"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <p className="text-[10px] font-bold text-white/60 mb-3">
                      Revenue — Last 6 Months
                    </p>
                    <div className="flex items-end gap-2 h-16">
                      {[38, 62, 48, 74, 68, 100].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md"
                          style={{
                            height: `${h}%`,
                            background:
                              i === 5
                                ? "linear-gradient(to top, #2E69A4, #F6A821)"
                                : "rgba(255,255,255,0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((m) => (
                        <span key={m} className="text-[8px] text-white/25">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="col-span-2 rounded-xl p-4 border border-white/8"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <p className="text-[10px] font-bold text-white/60 mb-3">
                      Upcoming Reminders
                    </p>
                    <div className="space-y-2">
                      {[
                        [
                          "VAT Filing Q1",
                          "3 days",
                          "bg-red-500/20 text-red-400",
                        ],
                        [
                          "Trade License",
                          "12 days",
                          "bg-amber-500/20 text-amber-400",
                        ],
                        [
                          "Payroll Run",
                          "5 days",
                          "bg-blue-500/20 text-blue-400",
                        ],
                      ].map(([t, d, c], i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span className="text-[10px] text-white/60">{t}</span>
                          <span
                            className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${c}`}
                          >
                            {d}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div
            className="absolute -right-6 top-16 bg-white rounded-2xl shadow-2xl border border-[#E1E8F5] p-4 w-56 hidden lg:block"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1B2A49]">
                  Ahmad Al Zaabi
                </p>
                <p className="text-[9px] text-[#6B7C93]">WhatsApp · 1m ago</p>
              </div>
            </div>
            <p className="text-[10px] text-[#344767] bg-[#F4F7FA] rounded-lg p-2 mb-2">
              &quot;When will my order be ready?&quot;
            </p>
            <div className="bg-[#1B2A49] rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-2.5 h-2.5 text-[#F6A821]" />
                <span className="text-[8px] font-bold text-[#F6A821]">
                  AI Reply Ready
                </span>
              </div>
              <p className="text-[10px] text-white leading-relaxed">
                &quot;Hi Ahmad! Ready by Thursday — we&apos;ll WhatsApp you
                😊&quot;
              </p>
            </div>
          </div>

          <div
            className="absolute -left-6 bottom-10 bg-white rounded-2xl shadow-2xl border border-[#E1E8F5] p-4 w-48 hidden lg:block"
            style={{ animation: "float 6s 1s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#2E69A4] flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1B2A49]">
                  Invoice Sent ✓
                </p>
                <p className="text-[9px] font-semibold text-emerald-600">
                  AED 12,075
                </p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[#E1E8F5] rounded-full">
              <div className="h-1.5 w-3/4 bg-gradient-to-r from-[#2E69A4] to-emerald-500 rounded-full" />
            </div>
            <p className="text-[9px] text-[#6B7C93] mt-1.5">
              Payment due in 7 days
            </p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 animate-bounce">
        <span className="text-white text-[10px]">Scroll</span>
        <ChevronDown className="w-4 h-4 text-white" />
      </div>
    </section>
  );
}
