"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare, Sparkles, Zap, RefreshCcw, Users,
  ArrowRight, CheckCheck, Send,
} from "lucide-react";
import { useInView } from "@/hooks/HomePage";
import { Chip } from "@/app/(public)/page";

export default function AIReplyHubSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="py-28 px-6 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <Chip>AI Reply Hub</Chip>
            <h2 className="font-serif text-4xl md:text-[52px] text-[#1B2A49] mt-5 mb-6 leading-[1.08]">
              Never let a customer message go unanswered.
            </h2>
            <p className="text-lg text-[#344767] leading-relaxed mb-8">
              Your clients message you on WhatsApp, Instagram, and email
              simultaneously. The AI Reply Hub unifies every conversation
              and drafts smart, on-brand replies so you respond in seconds —
              not hours.
            </p>
            <div className="space-y-4 mb-10">
              {[
                {
                  icon: <MessageSquare className="w-4 h-4" />,
                  text: "Unified inbox — WhatsApp, Instagram & Email",
                },
                {
                  icon: <Sparkles className="w-4 h-4" />,
                  text: "AI drafts context-aware replies instantly",
                },
                {
                  icon: <Zap className="w-4 h-4" />,
                  text: "One-click insert and send — zero friction",
                },
                {
                  icon: <RefreshCcw className="w-4 h-4" />,
                  text: "Per-client AI toggle — full control",
                },
                {
                  icon: <Users className="w-4 h-4" />,
                  text: "Unread badge counts per conversation",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#1B2A49] text-white flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-[#344767] font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1B2A49] hover:bg-[#2E69A4] text-white font-bold rounded-xl transition-colors shadow-lg text-sm"
            >
              Try AI Reply Hub Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Chat mockup */}
          <div
            className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div
              className="rounded-2xl overflow-hidden border-2 border-[#E1E8F5] shadow-2xl"
              style={{ height: 520 }}
            >
              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-48 border-r border-[#E1E8F5] bg-white flex flex-col shrink-0">
                  <div className="p-3 border-b border-[#E1E8F5]">
                    <p className="text-xs font-bold text-[#1B2A49] mb-2">
                      Conversations
                    </p>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#F4F7FA] rounded-lg">
                      <span className="text-[9px] text-[#9BACC7]">
                        🔍 Search…
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {[
                      {
                        name: "Ahmad Al Zaabi",
                        msg: "When will my order...",
                        t: "2m",
                        badge: 1,
                        c: "bg-[#2E69A4]",
                        active: true,
                      },
                      {
                        name: "Fatima Rashid",
                        msg: "Thank you so much!",
                        t: "15m",
                        badge: 0,
                        c: "bg-emerald-600",
                        active: false,
                      },
                      {
                        name: "Mohammed K.",
                        msg: "Can I get a quote?",
                        t: "1h",
                        badge: 2,
                        c: "bg-amber-500",
                        active: false,
                      },
                      {
                        name: "Sara Al Nasser",
                        msg: "Invoice received ✓",
                        t: "3h",
                        badge: 0,
                        c: "bg-violet-600",
                        active: false,
                      },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className={`px-3 py-2.5 border-b border-[#F4F7FA] flex items-start gap-2 cursor-default ${c.active ? "bg-[#EEF4FB] border-l-2 border-l-[#2E69A4]" : ""}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full ${c.c} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}
                        >
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[10px] font-bold text-[#1B2A49] truncate">
                              {c.name}
                            </p>
                            <span className="text-[8px] text-[#9BACC7] shrink-0">
                              {c.t}
                            </span>
                          </div>
                          <p className="text-[9px] text-[#9BACC7] truncate">
                            {c.msg}
                          </p>
                        </div>
                        {c.badge > 0 && (
                          <div className="w-4 h-4 rounded-full bg-[#2E69A4] text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                            {c.badge}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Chat */}
                <div className="flex-1 flex flex-col bg-[#F8FAFC]">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-[#E1E8F5]">
                    <div className="w-8 h-8 rounded-full bg-[#2E69A4] text-white text-[10px] font-bold flex items-center justify-center">
                      AZ
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#1B2A49]">
                        Ahmad Al Zaabi
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <p className="text-[9px] text-[#9BACC7]">
                          WhatsApp
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 space-y-3 overflow-hidden">
                    <div className="flex justify-start">
                      <div className="bg-white border border-[#E1E8F5] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] shadow-sm">
                        <p className="text-[11px] text-[#1B2A49]">
                          When will my order be ready? I need it by Thursday 🙏
                        </p>
                        <p className="text-[8px] text-[#9BACC7] mt-1">
                          2:14 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#1B2A49] rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                        <p className="text-[11px] text-white leading-relaxed">
                          Hi Ahmad! Your order is on track — ready Thursday
                          afternoon. We&apos;ll WhatsApp you once dispatched 😊
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <p className="text-[8px] text-white/50">
                            2:16 PM
                          </p>
                          <CheckCheck className="w-3 h-3 text-[#2E69A4]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white border border-[#E1E8F5] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%] shadow-sm">
                        <p className="text-[11px] text-[#1B2A49]">
                          Perfect, thank you! 🙌
                        </p>
                        <p className="text-[8px] text-[#9BACC7] mt-1">
                          2:17 PM
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* AI strip */}
                  <div className="bg-white border-t border-[#E1E8F5] px-3 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3 h-3 text-[#2E69A4]" />
                      <span className="text-[9px] font-bold text-[#2E69A4]">
                        AI Suggestion
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 bg-[#EEF4FB] rounded-lg px-2.5 py-2">
                      <p className="text-[9px] text-[#344767] flex-1">
                        &quot;Happy to help! Let us know if you need anything
                        else 😊&quot;
                      </p>
                      <button className="shrink-0 px-2 py-1 bg-[#1B2A49] text-white text-[8px] font-bold rounded-md">
                        Use
                      </button>
                    </div>
                  </div>
                  <div className="bg-white px-3 py-2 border-t border-[#E1E8F5] flex items-center gap-2">
                    <div className="flex-1 bg-[#F4F7FA] rounded-lg px-3 py-2">
                      <p className="text-[9px] text-[#9BACC7]">
                        Message via WhatsApp…
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-[#1B2A49] flex items-center justify-center">
                      <Send className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}