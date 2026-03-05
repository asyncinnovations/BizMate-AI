"use client";

import React from "react";
import Link from "next/link";
import {
  FileText, Receipt, Send, Clock, TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useInView } from "@/hooks/HomePage";
import { Chip } from "@/app/(public)/page";

export default function InvoicingSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="py-28 px-6 overflow-hidden"
      style={{ background: "#F8FAFF" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Invoice mockup */}
          <div
            className={`relative transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-[#E1E8F5] p-8 relative">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#1B2A49] flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1B2A49] tracking-tight">
                    INVOICE
                  </h3>
                  <p className="text-xs text-[#9BACC7]">#INV-2025-0184</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    PAID ✓
                  </span>
                  <p className="text-xs text-[#9BACC7] mt-2">
                    Issued: 01 Mar 2025
                  </p>
                  <p className="text-xs text-[#9BACC7]">Due: 15 Mar 2025</p>
                </div>
              </div>
              <div className="flex justify-between pb-6 mb-6 border-b border-[#F4F7FA]">
                <div>
                  <p className="text-[10px] font-bold text-[#9BACC7] uppercase mb-1">
                    From
                  </p>
                  <p className="text-sm font-bold text-[#1B2A49]">
                    AlMansoori Trading LLC
                  </p>
                  <p className="text-xs text-[#9BACC7]">Dubai, UAE</p>
                  <p className="text-xs text-[#9BACC7]">
                    TRN 100234567890003
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#9BACC7] uppercase mb-1">
                    To
                  </p>
                  <p className="text-sm font-bold text-[#1B2A49]">
                    Client FZ-LLC
                  </p>
                  <p className="text-xs text-[#9BACC7]">Abu Dhabi, UAE</p>
                </div>
              </div>
              <table className="w-full mb-6 text-xs">
                <thead>
                  <tr className="border-b border-[#F4F7FA] text-[#9BACC7] uppercase text-[10px]">
                    <th className="text-left pb-2 font-bold">
                      Description
                    </th>
                    <th className="text-right pb-2 font-bold">Qty</th>
                    <th className="text-right pb-2 font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-[#344767]">
                  {[
                    ["Consulting Services — Feb", "1", "AED 10,000"],
                    ["Software License Q1", "3", "AED 1,500"],
                  ].map(([d, q, a], i) => (
                    <tr key={i} className="border-b border-[#F4F7FA]">
                      <td className="py-2.5">{d}</td>
                      <td className="py-2.5 text-right">{q}</td>
                      <td className="py-2.5 text-right font-semibold">
                        {a}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#9BACC7]">
                  <span>Subtotal</span>
                  <span>AED 11,500</span>
                </div>
                <div className="flex justify-between text-[#9BACC7]">
                  <span>VAT 5%</span>
                  <span>AED 575</span>
                </div>
                <div className="flex justify-between text-[17px] font-black text-[#1B2A49] pt-3 border-t border-[#E1E8F5]">
                  <span>Total Due</span>
                  <span>AED 12,075</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-5 -right-5 bg-[#1B2A49] rounded-2xl px-4 py-3 shadow-xl hidden sm:block">
              <p className="text-[9px] font-bold text-[#8BA3C7] mb-0.5">
                Auto VAT Calculated
              </p>
              <p className="text-sm font-black text-white">5% · AED 575</p>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-emerald-500 rounded-2xl px-4 py-3 shadow-xl hidden sm:block">
              <p className="text-[9px] font-bold text-emerald-100 mb-0.5">
                Payment Received
              </p>
              <p className="text-sm font-black text-white">AED 12,075 ✓</p>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <Chip>Smart Invoicing</Chip>
            <h2 className="font-serif text-4xl md:text-[52px] text-[#1B2A49] mt-5 mb-6 leading-[1.08]">
              Professional invoices. Zero accounting headaches.
            </h2>
            <p className="text-lg text-[#344767] leading-relaxed mb-8">
              Generate UAE FTA-compliant invoices in 30 seconds.
              Auto-calculate VAT, send via email or WhatsApp, and let the
              system chase late payments for you.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: <Receipt className="w-4 h-4" />,
                  label: "VAT Compliant",
                  desc: "FTA-ready every time",
                },
                {
                  icon: <Send className="w-4 h-4" />,
                  label: "Auto Delivery",
                  desc: "Email & WhatsApp",
                },
                {
                  icon: <Clock className="w-4 h-4" />,
                  label: "Payment Reminders",
                  desc: "Chase late payers",
                },
                {
                  icon: <TrendingUp className="w-4 h-4" />,
                  label: "Revenue Tracking",
                  desc: "Real-time dashboard",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#E1E8F5] shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#EEF4FB] flex items-center justify-center text-[#2E69A4] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B2A49]">
                      {item.label}
                    </p>
                    <p className="text-xs text-[#9BACC7]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}