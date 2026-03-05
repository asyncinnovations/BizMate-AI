"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText, Bell, MessageSquare, Users, BarChart3, Check, ArrowRight, Sparkles,
  Receipt, Send, Clock, TrendingUp,
} from "lucide-react";
import { Chip } from "@/app/(public)/page";
import { useInView } from "@/hooks/HomePage";

const FEATURES = [
  {
    id: "invoicing",
    icon: <FileText className="w-5 h-5" />,
    gradient: "from-[#2E69A4] to-[#1B2A49]",
    accent: "#2E69A4",
    lightBg: "#EEF4FB",
    title: "Smart Invoicing",
    tagline: "Get paid faster. Every time.",
    desc: "Create VAT-compliant invoices in under 30 seconds. Auto-calculate UAE VAT, send via email or WhatsApp, and chase late payments automatically.",
    bullets: [
      "UAE FTA-compliant VAT",
      "Auto payment reminders",
      "AED multi-currency",
      "PDF & WhatsApp delivery",
    ],
  },
  {
    id: "reminders",
    icon: <Bell className="w-5 h-5" />,
    gradient: "from-[#F6A821] to-[#e08c10]",
    accent: "#F6A821",
    lightBg: "#FEF6E4",
    title: "AI Reminders",
    tagline: "Never miss a deadline again.",
    desc: "AI monitors your compliance calendar — VAT filings, trade license renewals, payroll dates — and sends intelligent alerts before it's too late.",
    bullets: [
      "UAE VAT & FTA deadlines",
      "Trade license renewals",
      "WhatsApp + email alerts",
      "Smart recurring schedules",
    ],
  },
  {
    id: "replyhub",
    icon: <MessageSquare className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-700",
    accent: "#10b981",
    lightBg: "#ECFDF5",
    title: "AI Reply Hub",
    tagline: "One inbox. All your channels.",
    desc: "WhatsApp, Instagram, and Email — unified in one smart inbox. AI reads every conversation and drafts personalised replies in your business tone.",
    bullets: [
      "WhatsApp Business API",
      "Instagram DMs",
      "Email integration",
      "AI per-client toggle",
    ],
  },
  {
    id: "clients",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-800",
    accent: "#7c3aed",
    lightBg: "#F5F3FF",
    title: "Client Management",
    tagline: "Your entire CRM in one view.",
    desc: "A clean, powerful CRM for UAE businesses. Store contacts, track communication history across all platforms, and import bulk client lists in seconds.",
    bullets: [
      "Multi-channel contact profiles",
      "Bulk CSV/JSON import",
      "Duplicate detection",
      "Full message history",
    ],
  },
  {
    id: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    gradient: "from-rose-500 to-pink-700",
    accent: "#f43f5e",
    lightBg: "#FFF1F2",
    title: "Business Analytics",
    tagline: "Know your numbers. Always.",
    desc: "Live revenue dashboards, invoice performance charts, reminder completion rates, and team activity — all in one place with exportable reports.",
    bullets: [
      "Real-time revenue charts",
      "Invoice analytics",
      "Team performance",
      "Export to PDF/Excel",
    ],
  },
  {
    id: "documents",
    icon: <FileText className="w-5 h-5" />,
    gradient: "from-sky-500 to-cyan-700",
    accent: "#0ea5e9",
    lightBg: "#F0F9FF",
    title: "Document Center",
    tagline: "AI writes it. You sign it.",
    desc: "Generate contracts, proposals, and official business documents with AI. Store everything in the cloud and share with clients in one click.",
    bullets: [
      "AI document generation",
      "Contract templates",
      "Cloud file storage",
      "One-click sharing",
    ],
  },
];

export default function FeaturesSection() {
  const { ref, inView } = useInView(0.1);
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    const iv = setInterval(
      () => setActiveTab((t) => (t + 1) % FEATURES.length),
      4000,
    );
    return () => clearInterval(iv);
  }, []);

  const af = FEATURES[activeTab];

  return (
    <section ref={ref} className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Chip>Platform Features</Chip>
          <h2 className="font-serif text-4xl md:text-[56px] text-[#1B2A49] mt-5 mb-5 leading-[1.08]">
            Everything your business
            <br />
            <em
              style={{
                background: "linear-gradient(120deg,#2E69A4,#F6A821)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              needs. In one place.
            </em>
          </h2>
          <p className="text-lg text-[#344767] max-w-2xl mx-auto">
            Six powerful modules designed to work together — built
            specifically for UAE and GCC businesses.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FEATURES.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                activeTab === i
                  ? "border-[#1B2A49] bg-[#1B2A49] text-white shadow-lg"
                  : "border-[#E1E8F5] text-[#344767] hover:border-[#2E69A4]/40"
              }`}
            >
              {f.icon}
              {f.title}
            </button>
          ))}
        </div>

        {/* Feature panel */}
        <div className="rounded-3xl border-2 border-[#E1E8F5] overflow-hidden shadow-xl transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — content */}
            <div
              className="p-10 lg:p-14 flex flex-col justify-center"
              style={{ background: af.lightBg }}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br ${af.gradient} shadow-lg`}
              >
                {af.icon}
              </div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: af.accent }}
              >
                {af.tagline}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-[#1B2A49] mb-4">
                {af.title}
              </h3>
              <p className="text-[#344767] leading-relaxed mb-8 text-base">
                {af.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {af.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: af.accent }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#344767]">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg w-fit"
                style={{
                  background: `linear-gradient(135deg, ${af.accent}, #1B2A49)`,
                }}
              >
                Explore {af.title} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Right — feature illustration */}
            <div className="bg-[#F8FAFC] p-10 flex items-center justify-center border-l border-[#E1E8F5]">
              <FeatureIllustration id={af.id} accent={af.accent} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureIllustration({ id, accent }: { id: string; accent: string }) {
  if (id === "invoicing")
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-[#E1E8F5] p-6 w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold text-[#9BACC7] uppercase">
              Invoice
            </p>
            <p className="text-lg font-black text-[#1B2A49]">#INV-2025-0184</p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
            PAID
          </span>
        </div>
        <div className="space-y-2 mb-5">
          {[
            ["Consulting Services", "AED 10,000"],
            ["Software License", "AED 1,500"],
          ].map(([d, a], i) => (
            <div
              key={i}
              className="flex justify-between text-xs border-b border-[#F4F7FA] pb-2"
            >
              <span className="text-[#344767]">{d}</span>
              <span className="font-semibold text-[#1B2A49]">{a}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs text-[#9BACC7]">
            <span>VAT 5%</span>
            <span>AED 575</span>
          </div>
        </div>
        <div className="flex justify-between text-base font-black text-[#1B2A49] border-t-2 border-[#1B2A49] pt-3">
          <span>Total</span>
          <span>AED 12,075</span>
        </div>
      </div>
    );

  if (id === "reminders")
    return (
      <div className="w-full max-w-sm mx-auto space-y-3">
        {[
          {
            title: "VAT Filing Q1 2025",
            date: "Due in 3 days",
            urgent: true,
            type: "🏦",
          },
          {
            title: "Trade License Renewal",
            date: "Due in 12 days",
            urgent: false,
            type: "📋",
          },
          {
            title: "Monthly Payroll",
            date: "Due in 5 days",
            urgent: false,
            type: "💰",
          },
          {
            title: "Ejari Registration",
            date: "Due in 20 days",
            urgent: false,
            type: "🏠",
          },
        ].map((r, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 bg-white ${r.urgent ? "border-red-200 shadow-md" : "border-[#E1E8F5]"}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${r.urgent ? "bg-red-50" : "bg-amber-50"}`}
            >
              {r.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1B2A49] truncate">
                {r.title}
              </p>
              <p
                className={`text-xs font-semibold ${r.urgent ? "text-red-500" : "text-[#9BACC7]"}`}
              >
                {r.date}
              </p>
            </div>
            <Bell
              className={`w-4 h-4 shrink-0 ${r.urgent ? "text-red-500" : "text-[#9BACC7]"}`}
            />
          </div>
        ))}
      </div>
    );

  if (id === "clients")
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-[#E1E8F5] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E1E8F5] flex items-center justify-between">
            <p className="text-sm font-bold text-[#1B2A49]">Clients</p>
            <span className="px-2 py-0.5 bg-[#EEF4FB] text-[#2E69A4] text-[10px] font-bold rounded-full">
              312 total
            </span>
          </div>
          {[
            {
              name: "Ahmad Al Zaabi",
              company: "AlZaabi Holdings",
              channels: ["WA", "IG", "EM"],
              color: "bg-[#2E69A4]",
            },
            {
              name: "Fatima Al Hassan",
              company: "Bloom Boutique LLC",
              channels: ["WA", "EM"],
              color: "bg-emerald-500",
            },
            {
              name: "Mohammed K.",
              company: "Gulf Trading Co.",
              channels: ["WA"],
              color: "bg-amber-500",
            },
            {
              name: "Sara Al Rashidi",
              company: "Nour Events",
              channels: ["IG", "EM"],
              color: "bg-violet-600",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 border-b border-[#F4F7FA] hover:bg-[#FAFBFF]"
            >
              <div
                className={`w-9 h-9 rounded-full ${c.color} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
              >
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1B2A49] truncate">
                  {c.name}
                </p>
                <p className="text-[10px] text-[#9BACC7] truncate">
                  {c.company}
                </p>
              </div>
              <div className="flex gap-1">
                {c.channels.map((ch, j) => (
                  <span
                    key={j}
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#EEF4FB] text-[#2E69A4]"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (id === "analytics")
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-[#E1E8F5] p-5">
        <p className="text-sm font-bold text-[#1B2A49] mb-4">
          Revenue Overview
        </p>
        <div className="flex items-end gap-2 h-28 mb-3">
          {[45, 70, 55, 88, 75, 100, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg transition-all"
              style={{
                height: `${h}%`,
                background:
                  i === 5
                    ? `linear-gradient(to top, ${accent}, #1B2A49)`
                    : "#F0F4FF",
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mb-4">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span
              key={i}
              className="text-[9px] text-[#9BACC7] flex-1 text-center"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Total Revenue", "AED 84,200", "↑ 12%"],
            ["Invoices Paid", "38 / 42", "90%"],
          ].map(([l, v, d], i) => (
            <div key={i} className="bg-[#F8FAFF] rounded-xl p-3">
              <p className="text-[9px] text-[#9BACC7] font-medium">{l}</p>
              <p className="text-sm font-black text-[#1B2A49]">{v}</p>
              <p className="text-[9px] text-emerald-500 font-bold">{d}</p>
            </div>
          ))}
        </div>
      </div>
    );

  if (id === "documents")
    return (
      <div className="w-full max-w-sm mx-auto space-y-3">
        {[
          {
            icon: "📄",
            name: "Service Agreement — AlZaabi",
            type: "Contract",
            date: "01 Mar 2025",
          },
          {
            icon: "📋",
            name: "Project Proposal — Bloom Co.",
            type: "Proposal",
            date: "27 Feb 2025",
          },
          {
            icon: "🤝",
            name: "NDA — Gulf Trading LLC",
            type: "NDA",
            date: "22 Feb 2025",
          },
        ].map((doc, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E1E8F5] shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-[#EEF4FB] rounded-xl flex items-center justify-center text-lg shrink-0">
              {doc.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1B2A49] truncate">
                {doc.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#EEF4FB] text-[#2E69A4]">
                  {doc.type}
                </span>
                <span className="text-[9px] text-[#9BACC7]">{doc.date}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-[#E1E8F5] bg-[#FAFBFF]">
          <Sparkles className="w-4 h-4 text-[#2E69A4]" />
          <span className="text-xs text-[#2E69A4] font-semibold">
            Generate new document with AI…
          </span>
        </div>
      </div>
    );

  // replyhub — default
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-[#E1E8F5] overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-[#E1E8F5]">
        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
          AZ
        </div>
        <div>
          <p className="text-xs font-bold text-[#1B2A49]">Ahmad Al Zaabi</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-[9px] text-[#9BACC7]">WhatsApp</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3 bg-[#F8FAFC]">
        <div className="flex justify-start">
          <div className="bg-white border border-[#E1E8F5] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%] shadow-sm">
            <p className="text-[11px] text-[#1B2A49]">
              When will my order be ready?
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-[#1B2A49] rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
            <p className="text-[11px] text-white">
              Ready Thursday — we&apos;ll let you know! 😊
            </p>
          </div>
        </div>
      </div>
      <div className="p-3 bg-white border-t border-[#E1E8F5]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3 h-3 text-[#2E69A4]" />
          <span className="text-[9px] font-bold text-[#2E69A4]">
            AI Suggestion
          </span>
        </div>
        <div className="bg-[#EEF4FB] rounded-lg px-2.5 py-2 flex items-center justify-between gap-2">
          <p className="text-[9px] text-[#344767] flex-1">
            &quot;Happy to help with anything else! 😊&quot;
          </p>
          <button className="px-2 py-1 bg-[#1B2A49] text-white text-[8px] font-bold rounded-md">
            Use
          </button>
        </div>
      </div>
    </div>
  );
}