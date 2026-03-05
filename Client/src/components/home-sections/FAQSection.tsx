"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useInView } from "@/hooks/HomePage";
import { Chip } from "@/app/(public)/page";

const FAQS = [
  {
    q: "Is this platform built specifically for UAE businesses?",
    a: "Yes — designed from the ground up for UAE and GCC businesses. VAT calculations use UAE FTA rates (5%), invoices support AED, and compliance reminders cover UAE-specific obligations like trade license renewals, Ejari, and FTA quarterly filings.",
  },
  {
    q: "How does the AI Reply Hub connect to WhatsApp?",
    a: "You connect your WhatsApp Business number via the official WhatsApp Business API. Once connected, all messages route to your Reply Hub inbox. The AI reads each conversation and generates contextual reply suggestions instantly.",
  },
  {
    q: "Can I import my existing clients?",
    a: "Yes — the Client Management module supports bulk import via CSV or JSON. The system automatically detects duplicates before importing so your data stays clean. You can also add clients one by one with full multi-channel contact profiles.",
  },
  {
    q: "How many team members can I add?",
    a: "Growth plan includes 5 seats with full role-based access control — Admin, Manager, Member, and Viewer roles. Enterprise plans support unlimited seats. You can invite members via email directly from the Team Management page.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can export all your data at any time — invoices, clients, documents, and messages. We retain your data for 30 days after cancellation before permanent deletion, giving you plenty of time to migrate. Your data is always yours.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — 14 days free on any plan, no credit card required. You get full access to every feature during the trial so you can see exactly what the platform does before committing.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${open ? "border-[#2E69A4]/40 shadow-lg" : "border-[#E1E8F5] hover:border-[#2E69A4]/25"}`}
      style={{
        background: open
          ? "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)"
          : "#ffffff",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-7 py-5 text-left gap-4"
      >
        <span className="font-semibold text-[#1B2A49] text-[15px] leading-snug">
          {q}
        </span>
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${open ? "bg-[#1B2A49] border-[#1B2A49] rotate-180" : "border-[#DDE6F5]"}`}
        >
          <ChevronDown
            className={`w-4 h-4 ${open ? "text-white" : "text-[#6B7C93]"}`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ${open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
      >
        <p className="px-7 pb-6 text-[#344767] text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="py-28 px-6"
      style={{ background: "#F8FAFF" }}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Chip>FAQ</Chip>
          <h2 className="font-serif text-4xl md:text-[52px] text-[#1B2A49] mt-5">
            Common questions
          </h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}