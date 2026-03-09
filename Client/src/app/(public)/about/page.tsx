"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Target,
  Heart,
  Globe,
  Shield,
  Users,
  Sparkles,
  CheckCircle2,
  Building2,
  Award,
  Star,
  Calendar,
  MapPin,
  MessageSquare,
  Bell,
  FileText,
  TrendingUp,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

// ─── Animation CSS (only keyframes + animation classes) ─────────────────────
const ANIMATION_CSS = `
  @keyframes abUp    { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:translateY(0); } }
  @keyframes abPulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
  @keyframes abFloatA { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
  @keyframes abFloatB { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px);  } }
  .ab-u1 { animation: abUp 0.65s 0.06s ease both; }
  .ab-u2 { animation: abUp 0.65s 0.16s ease both; }
  .ab-u3 { animation: abUp 0.65s 0.26s ease both; }
  .ab-u4 { animation: abUp 0.65s 0.36s ease both; }
  .ab-u5 { animation: abUp 0.65s 0.46s ease both; }
  .ab-float-a { animation: abFloatA 4s ease-in-out infinite; }
  .ab-float-b { animation: abFloatB 6s 1s ease-in-out infinite; }
`;

// ─── useInView ──────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, v };
}

// ─── Reveal ─────────────────────────────────────────────────────────────────
function Reveal({
  children,
  v,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  v: boolean;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s ${delay}ms ease, transform 0.65s ${delay}ms ease`,
        willChange: "opacity,transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Chip ───────────────────────────────────────────────────────────────────
function Chip({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full"
      style={{
        background: dark ? "rgba(255,255,255,0.10)" : "rgba(27,42,73,0.06)",
        border: dark
          ? "1px solid rgba(255,255,255,0.18)"
          : "1px solid rgba(46,105,164,0.20)",
        color: dark ? "#ffffff" : "#2E69A4",
      }}
    >
      <Sparkles style={{ width: 11, height: 11 }} />
      {children}
    </span>
  );
}

// ─── SectionHead ───────────────────────────────────────────────────────────
function SectionHead({
  chip,
  title,
  sub,
  dark = false,
}: {
  chip: string;
  title: React.ReactNode;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center" style={{ marginBottom: 56 }}>
      <Chip dark={dark}>{chip}</Chip>
      <h2
        className="font-serif"
        style={{
          fontSize: "clamp(30px,4vw,50px)",
          lineHeight: 1.1,
          color: dark ? "#ffffff" : "#1B2A49",
          marginTop: 20,
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontSize: 17,
            color: dark ? "rgba(255,255,255,0.55)" : "#344767",
            maxWidth: 540,
            margin: "0 auto",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────
const HERO_STATS = [
  {
    icon: <Building2 style={{ width: 15, height: 15 }} />,
    value: "2,400+",
    label: "Active businesses",
  },
  {
    icon: <Globe style={{ width: 15, height: 15 }} />,
    value: "6",
    label: "GCC countries",
  },
  {
    icon: <Users style={{ width: 15, height: 15 }} />,
    value: "40+",
    label: "Team members",
  },
  {
    icon: <Star style={{ width: 15, height: 15 }} />,
    value: "4.9★",
    label: "Customer rating",
  },
];

const PILLARS = [
  {
    icon: <Target style={{ width: 24, height: 24 }} />,
    grad: ["#2E69A4", "#1B2A49"],
    title: "Our Mission",
    desc: "To give every UAE business owner — from the solopreneur in Sharjah to the growing SME in Dubai — the same intelligent automation tools that enterprises have, at a fraction of the cost.",
  },
  {
    icon: <Heart style={{ width: 24, height: 24 }} />,
    grad: ["#F6A821", "#d48b0e"],
    title: "Our Values",
    desc: "We build with honesty, ship with care, and listen to every piece of feedback. Your trust is our foundation — and we protect it by never compromising on security or product quality.",
  },
  {
    icon: <Globe style={{ width: 24, height: 24 }} />,
    grad: ["#10b981", "#047857"],
    title: "Our Vision",
    desc: "A UAE where no business misses a VAT deadline, loses a client message, or struggles with paperwork — because intelligent automation handles it all, in Arabic and English, around the clock.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "BezMate.ai cut our invoice collection time from two weeks to three days. The WhatsApp reminders do the chasing for us — we just collect the money.",
    name: "Ahmad Al Zaabi",
    role: "Owner",
    company: "Al Zaabi Trading LLC, Dubai",
    avatar: "AZ",
    color: "#2E69A4",
    tag: "Invoicing",
    tagBg: "#EEF4FB",
    tagColor: "#2E69A4",
  },
  {
    quote:
      "We haven't missed a single VAT deadline since we signed up. The AI reminders come 30 days early, then 7 days, then the day before. It's like having a compliance officer.",
    name: "Fatima Al Rashidi",
    role: "Finance Manager",
    company: "Gulf Design Studio, Sharjah",
    avatar: "FR",
    color: "#10b981",
    tag: "VAT Compliance",
    tagBg: "#ECFDF5",
    tagColor: "#10b981",
  },
  {
    quote:
      "Our response rate on WhatsApp went from 40% to 94% after turning on AI Reply Hub. The suggested replies are so natural — clients think I'm always available.",
    name: "Khalid Hassan",
    role: "Founder",
    company: "Hassan Consulting, Abu Dhabi",
    avatar: "KH",
    color: "#F6A821",
    tag: "AI Reply Hub",
    tagBg: "#FEF6E4",
    tagColor: "#d48b0e",
  },
];

const COMPLIANCE_ITEMS = [
  {
    icon: <Shield style={{ width: 16, height: 16 }} />,
    color: "#10b981",
    bg: "#ECFDF5",
    title: "UAE FTA Certified",
    desc: "Invoices and reports are fully compliant with Federal Tax Authority requirements.",
  },
  {
    icon: <FileText style={{ width: 16, height: 16 }} />,
    color: "#2E69A4",
    bg: "#EEF4FB",
    title: "VAT & Corporate Tax Ready",
    desc: "5% VAT and 9% corporate tax auto-applied on invoices and flagged on reminders.",
  },
  {
    icon: <Bell style={{ width: 16, height: 16 }} />,
    color: "#F6A821",
    bg: "#FEF6E4",
    title: "Trade License Renewal Alerts",
    desc: "Never miss a DED or free zone renewal — automated reminders 60, 30, and 7 days out.",
  },
  {
    icon: <MapPin style={{ width: 16, height: 16 }} />,
    color: "#7c3aed",
    bg: "#F5F3FF",
    title: "UAE Data Residency",
    desc: "All business data is stored exclusively on servers within the United Arab Emirates.",
  },
];

const PRESS = [
  {
    outlet: "Gulf News",
    quote: "The platform UAE businesses have been waiting for.",
    date: "Mar 2025",
  },
  {
    outlet: "Khaleej Times",
    quote: "Redefining how SMEs handle compliance and communication.",
    date: "Jan 2025",
  },
  {
    outlet: "Arabian Business",
    quote: "One of the most promising B2B SaaS startups in the region.",
    date: "Nov 2024",
  },
];

const CULTURE_CARDS = [
  {
    emoji: "🇦🇪",
    title: "UAE First",
    desc: "Everything we build starts with the UAE context — AED, Arabic, FTA rules, WhatsApp-first culture.",
  },
  {
    emoji: "⚡",
    title: "Ship Fast",
    desc: "We release every two weeks. Customer feedback shapes every sprint, not corporate roadmaps.",
  },
  {
    emoji: "🔒",
    title: "Security Obsessed",
    desc: "Your business data never leaves UAE servers. We treat it the way you'd want us to.",
  },
  {
    emoji: "🤝",
    title: "Customer First",
    desc: "Our support team speaks Arabic and English and responds within 2 hours — guaranteed.",
  },
];

const PLATFORM_TOOLS = [
  {
    icon: <FileText style={{ width: 19, height: 19 }} />,
    color: "#2E69A4",
    bg: "#EEF4FB",
    title: "Smart Invoicing",
    desc: "VAT-compliant invoices in 30 seconds. Auto-chase late payments via WhatsApp.",
  },
  {
    icon: <Bell style={{ width: 19, height: 19 }} />,
    color: "#F6A821",
    bg: "#FEF6E4",
    title: "AI Reminders",
    desc: "Never miss a VAT filing, trade license renewal, or payroll date again.",
  },
  {
    icon: <MessageSquare style={{ width: 19, height: 19 }} />,
    color: "#10b981",
    bg: "#ECFDF5",
    title: "AI Reply Hub",
    desc: "Unified WhatsApp, Instagram & Email inbox with AI-drafted reply suggestions.",
  },
  {
    icon: <Users style={{ width: 19, height: 19 }} />,
    color: "#7c3aed",
    bg: "#F5F3FF",
    title: "Client Management",
    desc: "One CRM for all contacts, communication history, and multi-channel profiles.",
  },
  {
    icon: <TrendingUp style={{ width: 19, height: 19 }} />,
    color: "#e11d48",
    bg: "#FFF1F2",
    title: "Analytics",
    desc: "Real-time revenue charts, invoice performance, and team activity dashboards.",
  },
  {
    icon: <FileText style={{ width: 19, height: 19 }} />,
    color: "#0ea5e9",
    bg: "#F0F9FF",
    title: "Document Center",
    desc: "AI-generated contracts and proposals. Store, organise, and share in one click.",
  },
];

// ─── Main ───────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const storyRef = useInView(0.1);
  const pillarRef = useInView(0.1);
  const platformRef = useInView(0.08);
  const cultureRef = useInView(0.1);
  const testimonialsRef = useInView(0.08);
  const complianceRef = useInView(0.1);
  const pressRef = useInView(0.1);
  const ctaRef = useInView(0.1);

  const hov = (
    el: HTMLElement,
    enter: boolean,
    shadow = "0 12px 32px rgba(27,42,73,0.10)",
    border = "rgba(46,105,164,0.28)",
  ) => {
    el.style.boxShadow = enter ? shadow : "none";
    el.style.borderColor = enter ? border : "#E1E8F5";
  };

  return (
    <PublicLayout>
      <style>{ANIMATION_CSS}</style>
      <div className="font-sans bg-white overflow-x-hidden">
        {/* ════════════════════════════════════════════════════════
            HERO — powerful, stat chips embedded, wave divider
        ════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{ paddingTop: 96, paddingBottom: 0 }}
        >
          {/* BG layers */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(158deg,#0d1b2e 0%,#1B2A49 52%,#162038 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 900px 600px at 50% -8%, rgba(46,105,164,0.52) 0%, transparent 68%)",
            }}
          />
          <div
            className="absolute top-0 right-0 rounded-full"
            style={{
              width: 520,
              height: 520,
              background:
                "radial-gradient(circle, rgba(246,168,33,0.12) 0%, transparent 65%)",
              transform: "translate(22%,-20%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 rounded-full"
            style={{
              width: 400,
              height: 400,
              background:
                "radial-gradient(circle, rgba(46,105,164,0.16) 0%, transparent 65%)",
              transform: "translate(-20%,20%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.028,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />

          <div
            className="relative max-w-5xl mx-auto px-6"
            style={{ paddingBottom: 72 }}
          >
            {/* DIFC badge */}
            <div
              className="ab-u1 flex justify-center"
              style={{ marginBottom: 28 }}
            >
              <div
                className="inline-flex items-center gap-2.5 rounded-full"
                style={{
                  padding: "9px 20px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.13)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "inline-block",
                    animation: "abPulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  DIFC Registered · Dubai, UAE · Founded 2022
                </span>
              </div>
            </div>

            {/* Headline — now using font-serif */}
            <h1
              className="font-serif ab-u2 text-white text-center"
              style={{
                fontSize: "clamp(46px,7vw,74px)",
                lineHeight: 1.06,
                marginBottom: 22,
              }}
            >
              Built in Dubai,
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  background:
                    "linear-gradient(120deg,#F6A821,#ffd670 60%,#F6A821)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                for the UAE.
              </em>
            </h1>

            {/* Sub */}
            <p
              className="ab-u3 text-center"
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.54)",
                lineHeight: 1.78,
                maxWidth: 580,
                margin: "0 auto",
                marginBottom: 40,
              }}
            >
              We started BezMate.ai because we watched smart, hardworking UAE
              business owners drown in invoices, miss VAT deadlines, and lose
              clients to slow replies — all problems technology should already
              solve.
            </p>

            {/* CTAs */}
            <div
              className="ab-u4 flex flex-wrap items-center justify-center"
              style={{ gap: 14, marginBottom: 64 }}
            >
              <Link
                href="/register"
                className="flex items-center gap-2 text-sm font-bold rounded-xl transition-all hover:opacity-90"
                style={{
                  padding: "13px 28px",
                  background: "linear-gradient(135deg,#F6A821,#d48b0e)",
                  boxShadow: "0 4px 20px rgba(246,168,33,0.38)",
                  color: "#1B2A49",
                }}
              >
                Start Free Trial{" "}
                <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 text-sm font-semibold rounded-xl"
                style={{
                  padding: "13px 28px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#ffffff",
                }}
              >
                Talk to Us
              </Link>
            </div>

            {/* ── Stat chips — embedded in hero bottom ── */}
            <div
              className="ab-u5 grid grid-cols-2 lg:grid-cols-4"
              style={{ gap: 14 }}
            >
              {HERO_STATS.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center rounded-2xl"
                  style={{
                    padding: 22,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 40,
                      height: 40,
                      background: "rgba(46,105,164,0.25)",
                      color: "#93b8e0",
                      border: "1px solid rgba(46,105,164,0.25)",
                      marginBottom: 12,
                    }}
                  >
                    {s.icon}
                  </div>
                  <span
                    className="font-serif"
                    style={{ fontSize: 32, color: "#ffffff", lineHeight: 1 }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.46)",
                      fontWeight: 500,
                      marginTop: 5,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Wave divider */}
          <div className="relative" style={{ height: 60, marginBottom: -2 }}>
            <svg
              viewBox="0 0 1440 60"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <path
                d="M0,20 C480,60 960,0 1440,30 L1440,60 L0,60 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            OUR STORY
        ════════════════════════════════════════════════════════ */}
        <section
          ref={storyRef.ref}
          style={{ padding: "100px 24px", background: "#ffffff" }}
        >
          <div className="max-w-6xl mx-auto">
            <div
              className="grid grid-cols-1 lg:grid-cols-2"
              style={{ gap: 64, alignItems: "center" }}
            >
              {/* Text */}
              <Reveal v={storyRef.v} delay={0}>
                <Chip>The Story</Chip>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: "clamp(30px,4vw,48px)",
                    lineHeight: 1.08,
                    color: "#1B2A49",
                    marginTop: 20,
                    marginBottom: 24,
                  }}
                >
                  We built the platform
                  <br />
                  <em style={{ color: "#2E69A4", fontStyle: "italic" }}>
                    we wished existed.
                  </em>
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    color: "#344767",
                    fontSize: 16,
                    lineHeight: 1.78,
                  }}
                >
                  <p>
                    In 2022, our founders were running their own businesses in
                    Dubai and Sharjah. Between chasing unpaid invoices, manually
                    setting VAT reminders in WhatsApp groups, and juggling
                    client messages across three platforms — they were
                    exhausted.
                  </p>
                  <p>
                    The tools that existed were either built for Western markets
                    (wrong currency, no Arabic, no FTA compliance), too complex
                    for a small team, or so expensive that only enterprises
                    could afford them.
                  </p>
                  <p>
                    So we built BezMate.ai — a platform that speaks UAE. AED,
                    Arabic, FTA deadlines, WhatsApp-first communication —
                    wrapped in AI that works quietly in the background.
                  </p>
                </div>
                {/* Founder quote */}
                <div
                  className="flex items-start gap-4 rounded-2xl"
                  style={{
                    marginTop: 32,
                    padding: 20,
                    background: "#EEF4FB",
                    border: "1px solid rgba(46,105,164,0.15)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full shrink-0 text-white font-bold"
                    style={{
                      width: 44,
                      height: 44,
                      background: "#2E69A4",
                      fontSize: 13,
                    }}
                  >
                    FM
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1B2A49",
                        lineHeight: 1.65,
                      }}
                    >
                      &quot;Every UAE business owner deserves enterprise-grade
                      tools — not just the big corporations.&quot;
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7C93", marginTop: 6 }}>
                      Farhan Al Maktoum, Co-Founder & CEO
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Visual card */}
              <Reveal
                v={storyRef.v}
                delay={180}
                className="relative"
                style={{ paddingBottom: 28, paddingRight: 28 }}
              >
                <div
                  className="rounded-3xl relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg,#1B2A49 0%,#2E69A4 100%)",
                    padding: 40,
                    minHeight: 340,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: 0.04,
                      backgroundImage:
                        "radial-gradient(circle,rgba(255,255,255,1) 1px,transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <div className="relative">
                    <div
                      className="flex items-center gap-2"
                      style={{ marginBottom: 32 }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg"
                        style={{ width: 34, height: 34, background: "#F6A821" }}
                      >
                        <Zap
                          style={{
                            width: 16,
                            height: 16,
                            color: "#fff",
                            fill: "#fff",
                          }}
                        />
                      </div>
                      <span
                        style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}
                      >
                        BezMate<span style={{ color: "#F6A821" }}>.</span>ai
                      </span>
                    </div>
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: 32,
                        color: "#fff",
                        lineHeight: 1.25,
                        marginBottom: 16,
                      }}
                    >
                      2 years.
                      <br />
                      2,400 businesses.
                      <br />
                      <span style={{ color: "#F6A821" }}>Counting.</span>
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.72,
                      }}
                    >
                      From a 2-person founding team in a DIFC co-working space
                      to a 40-person company serving 6 GCC countries.
                    </p>
                  </div>
                </div>
                {/* Floating — FTA */}
                <div
                  className="ab-float-b absolute bg-white rounded-2xl shadow-xl"
                  style={{
                    bottom: 0,
                    left: -20,
                    padding: "14px 18px",
                    border: "1px solid #E1E8F5",
                    minWidth: 168,
                  }}
                >
                  <div
                    className="flex items-center gap-2"
                    style={{ marginBottom: 4 }}
                  >
                    <Shield
                      style={{ width: 14, height: 14, color: "#10b981" }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1B2A49",
                      }}
                    >
                      FTA Certified
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "#6B7C93" }}>
                    UAE VAT compliance built-in
                  </p>
                </div>
                {/* Floating — Rating */}
                <div
                  className="ab-float-a absolute bg-white rounded-2xl shadow-xl"
                  style={{
                    top: -20,
                    right: 0,
                    padding: "14px 18px",
                    border: "1px solid #E1E8F5",
                  }}
                >
                  <div
                    className="flex items-center gap-0.5"
                    style={{ marginBottom: 4 }}
                  >
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        style={{
                          width: 12,
                          height: 12,
                          fill: "#F6A821",
                          color: "#F6A821",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    style={{ fontSize: 13, fontWeight: 700, color: "#1B2A49" }}
                  >
                    4.9 / 5
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7C93" }}>800+ reviews</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            MISSION / VALUES / VISION
        ════════════════════════════════════════════════════════ */}
        <section
          ref={pillarRef.ref}
          style={{
            padding: "100px 24px",
            background: "#F8FAFF",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <Reveal v={pillarRef.v}>
              <SectionHead
                chip="What Drives Us"
                title="Mission, Values & Vision"
                sub="Three principles that guide every decision — from how we write code to how we answer support tickets."
              />
            </Reveal>
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ gap: 24 }}
            >
              {PILLARS.map((p, i) => (
                <Reveal key={i} v={pillarRef.v} delay={i * 120}>
                  <div
                    className="bg-white rounded-2xl h-full"
                    style={{
                      padding: 32,
                      border: "2px solid #E1E8F5",
                      transition: "box-shadow 0.22s, border-color 0.22s",
                    }}
                    onMouseEnter={(e) =>
                      hov(e.currentTarget as HTMLElement, true)
                    }
                    onMouseLeave={(e) =>
                      hov(e.currentTarget as HTMLElement, false)
                    }
                  >
                    <div
                      className="flex items-center justify-center rounded-2xl text-white"
                      style={{
                        width: 56,
                        height: 56,
                        marginBottom: 24,
                        background: `linear-gradient(135deg,${p.grad[0]},${p.grad[1]})`,
                        boxShadow: `0 6px 16px ${p.grad[0]}44`,
                      }}
                    >
                      {p.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#1B2A49",
                        marginBottom: 12,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.78,
                        color: "#344767",
                      }}
                    >
                      {p.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            PLATFORM OVERVIEW
        ════════════════════════════════════════════════════════ */}
        <section
          ref={platformRef.ref}
          style={{
            padding: "100px 24px",
            background: "#ffffff",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <Reveal v={platformRef.v}>
              <SectionHead
                chip="The Platform"
                title={
                  <>
                    Six tools.
                    <br />
                    <em style={{ color: "#2E69A4", fontStyle: "italic" }}>
                      One platform.
                    </em>
                  </>
                }
                sub="Everything a UAE business needs to automate operations — built as a single, connected system."
              />
            </Reveal>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: 20 }}
            >
              {PLATFORM_TOOLS.map((item, i) => (
                <Reveal key={i} v={platformRef.v} delay={i * 80}>
                  <div
                    className="flex items-start gap-4 rounded-2xl h-full"
                    style={{
                      padding: 24,
                      border: "2px solid #E1E8F5",
                      background: "#ffffff",
                      transition: "box-shadow 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "0 8px 24px rgba(27,42,73,0.08)";
                      el.style.borderColor = `${item.color}44`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "none";
                      el.style.borderColor = "#E1E8F5";
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl shrink-0"
                      style={{
                        width: 44,
                        height: 44,
                        background: item.bg,
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1B2A49",
                          marginBottom: 6,
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 13,
                          lineHeight: 1.68,
                          color: "#344767",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal v={platformRef.v} delay={360}>
              <div className="text-center" style={{ marginTop: 40 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl font-bold text-white transition-all hover:opacity-90"
                  style={{
                    padding: "13px 32px",
                    background: "linear-gradient(135deg,#1B2A49,#2E69A4)",
                    boxShadow: "0 4px 16px rgba(27,42,73,0.25)",
                    fontSize: 14,
                  }}
                >
                  Explore All Features{" "}
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CULTURE
        ════════════════════════════════════════════════════════ */}
        <section
          ref={cultureRef.ref}
          style={{
            padding: "100px 24px",
            background: "#F8FAFF",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div
              className="grid grid-cols-1 lg:grid-cols-2"
              style={{ gap: 64, alignItems: "center" }}
            >
              <Reveal v={cultureRef.v} delay={0}>
                <Chip>Our Culture</Chip>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: "clamp(30px,4vw,48px)",
                    lineHeight: 1.08,
                    color: "#1B2A49",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  How we work,
                  <br />
                  <em style={{ color: "#2E69A4", fontStyle: "italic" }}>
                    every single day.
                  </em>
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    color: "#344767",
                    lineHeight: 1.78,
                    marginBottom: 32,
                  }}
                >
                  A remote-friendly team spread across Dubai and Riyadh — united
                  by a shared obsession with building products UAE businesses
                  actually love.
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[
                    "We ship updates every two weeks",
                    "Arabic-first support team",
                    "All data stays in UAE servers",
                    "Quarterly customer feedback sessions",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2
                        style={{
                          width: 18,
                          height: 18,
                          color: "#10b981",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 15,
                          color: "#344767",
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <div className="grid grid-cols-2" style={{ gap: 16 }}>
                {CULTURE_CARDS.map((c, i) => (
                  <Reveal key={i} v={cultureRef.v} delay={i * 90}>
                    <div
                      className="bg-white rounded-2xl h-full"
                      style={{
                        padding: 24,
                        border: "2px solid #E1E8F5",
                        transition: "box-shadow 0.22s, border-color 0.22s",
                      }}
                      onMouseEnter={(e) =>
                        hov(e.currentTarget as HTMLElement, true)
                      }
                      onMouseLeave={(e) =>
                        hov(e.currentTarget as HTMLElement, false)
                      }
                    >
                      <span
                        style={{
                          fontSize: 28,
                          display: "block",
                          marginBottom: 12,
                        }}
                      >
                        {c.emoji}
                      </span>
                      <h4
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1B2A49",
                          marginBottom: 8,
                        }}
                      >
                        {c.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#344767",
                          lineHeight: 1.68,
                        }}
                      >
                        {c.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CUSTOMER TESTIMONIALS
        ════════════════════════════════════════════════════════ */}
        <section
          ref={testimonialsRef.ref}
          style={{
            padding: "100px 24px",
            background: "#ffffff",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <Reveal v={testimonialsRef.v}>
              <SectionHead
                chip="Customer Stories"
                title={
                  <>
                    Trusted by UAE businesses
                    <br />
                    <em style={{ color: "#2E69A4", fontStyle: "italic" }}>
                      just like yours.
                    </em>
                  </>
                }
                sub="From solo consultants in Sharjah to growing agencies in Dubai — here's what our customers say."
              />
            </Reveal>

            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ gap: 24, marginBottom: 56 }}
            >
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={i} v={testimonialsRef.v} delay={i * 100}>
                  <div
                    className="rounded-2xl h-full flex flex-col"
                    style={{
                      padding: 32,
                      border: "2px solid #E1E8F5",
                      background: "#ffffff",
                      transition: "box-shadow 0.22s, border-color 0.22s",
                    }}
                    onMouseEnter={(e) =>
                      hov(
                        e.currentTarget as HTMLElement,
                        true,
                        "0 12px 32px rgba(27,42,73,0.08)",
                      )
                    }
                    onMouseLeave={(e) =>
                      hov(e.currentTarget as HTMLElement, false)
                    }
                  >
                    {/* Stars */}
                    <div
                      className="flex items-center gap-0.5"
                      style={{ marginBottom: 16 }}
                    >
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          style={{
                            width: 14,
                            height: 14,
                            fill: "#F6A821",
                            color: "#F6A821",
                          }}
                        />
                      ))}
                    </div>
                    {/* Quote */}
                    <p
                      style={{
                        fontSize: 15,
                        color: "#1B2A49",
                        lineHeight: 1.72,
                        fontStyle: "italic",
                        marginBottom: 24,
                        flex: 1,
                      }}
                    >
                      &quot;{t.quote}&quot;
                    </p>
                    {/* Author */}
                    <div
                      className="flex items-center gap-3"
                      style={{ paddingTop: 20, borderTop: "1px solid #F4F7FA" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full text-white font-bold shrink-0"
                        style={{
                          width: 40,
                          height: 40,
                          background: t.color,
                          fontSize: 13,
                        }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1B2A49",
                            marginBottom: 2,
                          }}
                        >
                          {t.name}
                        </p>
                        <p style={{ fontSize: 12, color: "#6B7C93" }}>
                          {t.role} · {t.company}
                        </p>
                      </div>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 99,
                          background: t.tagBg,
                          color: t.tagColor,
                        }}
                      >
                        {t.tag}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Outcome metrics strip */}
            <Reveal v={testimonialsRef.v} delay={280}>
              <div
                className="grid grid-cols-2 md:grid-cols-4 rounded-3xl overflow-hidden"
                style={{ border: "2px solid #E1E8F5" }}
              >
                {[
                  {
                    value: "3×",
                    label: "Faster invoice collection",
                    color: "#2E69A4",
                    bg: "#EEF4FB",
                  },
                  {
                    value: "98%",
                    label: "On-time VAT submissions",
                    color: "#10b981",
                    bg: "#ECFDF5",
                  },
                  {
                    value: "40%",
                    label: "Time saved per week",
                    color: "#F6A821",
                    bg: "#FEF6E4",
                  },
                  {
                    value: "< 2hr",
                    label: "Average reply time saved",
                    color: "#7c3aed",
                    bg: "#F5F3FF",
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="text-center"
                    style={{
                      padding: "28px 20px",
                      background: m.bg,
                      borderRight: i < 3 ? "2px solid #E1E8F5" : "none",
                    }}
                  >
                    <p
                      className="font-serif"
                      style={{
                        fontSize: 36,
                        color: m.color,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {m.value}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#344767",
                        fontWeight: 500,
                      }}
                    >
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            UAE COMPLIANCE BUILT-IN
        ════════════════════════════════════════════════════════ */}
        <section
          ref={complianceRef.ref}
          style={{
            padding: "100px 24px",
            background: "#F8FAFF",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div
              className="grid grid-cols-1 lg:grid-cols-2"
              style={{ gap: 64, alignItems: "center" }}
            >
              {/* Left — text */}
              <Reveal v={complianceRef.v} delay={0}>
                <Chip>Compliance</Chip>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: "clamp(30px,4vw,48px)",
                    lineHeight: 1.08,
                    color: "#1B2A49",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  UAE compliance,
                  <br />
                  <em style={{ color: "#2E69A4", fontStyle: "italic" }}>
                    handled for you.
                  </em>
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    color: "#344767",
                    lineHeight: 1.78,
                    marginBottom: 32,
                  }}
                >
                  Every part of BezMate.ai is built around UAE regulations — not
                  bolted on as an afterthought. FTA rules, VAT rates, trade
                  license cycles, and corporate tax deadlines are wired directly
                  into the platform.
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {COMPLIANCE_ITEMS.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-xl"
                      style={{
                        padding: "14px 18px",
                        background: "#ffffff",
                        border: "2px solid #E1E8F5",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          `${item.color}44`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "#E1E8F5";
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          background: item.bg,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1B2A49",
                            marginBottom: 3,
                          }}
                        >
                          {item.title}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#344767",
                            lineHeight: 1.6,
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Right — compliance visual card */}
              <Reveal v={complianceRef.v} delay={180}>
                <div
                  className="rounded-3xl relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg,#0d1b2e 0%,#1B2A49 100%)",
                    padding: 36,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: 0.04,
                      backgroundImage:
                        "radial-gradient(circle,rgba(255,255,255,1) 1px,transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative">
                    <div
                      className="flex items-center gap-2"
                      style={{ marginBottom: 28 }}
                    >
                      <Shield
                        style={{ width: 18, height: 18, color: "#10b981" }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#10b981",
                        }}
                      >
                        UAE FTA Certified
                      </span>
                    </div>
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: 26,
                        color: "#fff",
                        lineHeight: 1.25,
                        marginBottom: 24,
                      }}
                    >
                      Every deadline.
                      <br />
                      Every regulation.
                      <br />
                      <span style={{ color: "#F6A821" }}>Covered.</span>
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {[
                        {
                          label: "VAT Filing (5%)",
                          status: "Auto-reminded",
                          ok: true,
                        },
                        {
                          label: "Corporate Tax (9%)",
                          status: "Auto-reminded",
                          ok: true,
                        },
                        {
                          label: "Trade License Renewal",
                          status: "Auto-reminded",
                          ok: true,
                        },
                        {
                          label: "Invoice VAT Calculation",
                          status: "Auto-applied",
                          ok: true,
                        },
                        {
                          label: "Arabic Invoice Support",
                          status: "Built-in",
                          ok: true,
                        },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-xl"
                          style={{
                            padding: "11px 16px",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: "rgba(255,255,255,0.75)",
                              fontWeight: 500,
                            }}
                          >
                            {row.label}
                          </span>
                          <span
                            className="flex items-center gap-1.5"
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#10b981",
                              padding: "3px 10px",
                              borderRadius: 99,
                              background: "rgba(16,185,129,0.15)",
                              border: "1px solid rgba(16,185,129,0.25)",
                            }}
                          >
                            <CheckCircle2 style={{ width: 11, height: 11 }} />
                            {row.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            PRESS
        ════════════════════════════════════════════════════════ */}
        <section
          ref={pressRef.ref}
          style={{
            padding: "100px 24px",
            background: "#ffffff",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <Reveal v={pressRef.v}>
              <SectionHead
                chip="In The Press"
                title="What people are saying"
                sub="Coverage from leading UAE and regional business publications."
              />
            </Reveal>
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ gap: 24 }}
            >
              {PRESS.map((p, i) => (
                <Reveal key={i} v={pressRef.v} delay={i * 100}>
                  <div
                    className="rounded-2xl h-full"
                    style={{
                      padding: 32,
                      border: "2px solid #E1E8F5",
                      background: "linear-gradient(135deg,#fafcff,#ffffff)",
                      transition: "box-shadow 0.22s, border-color 0.22s",
                    }}
                    onMouseEnter={(e) =>
                      hov(
                        e.currentTarget as HTMLElement,
                        true,
                        "0 12px 32px rgba(27,42,73,0.08)",
                      )
                    }
                    onMouseLeave={(e) =>
                      hov(e.currentTarget as HTMLElement, false)
                    }
                  >
                    <div
                      className="flex items-center gap-0.5"
                      style={{ marginBottom: 16 }}
                    >
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          style={{
                            width: 14,
                            height: 14,
                            fill: "#F6A821",
                            color: "#F6A821",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        fontStyle: "italic",
                        color: "#1B2A49",
                        lineHeight: 1.62,
                        marginBottom: 20,
                      }}
                    >
                      &quot;{p.quote}&quot;
                    </p>
                    <div
                      className="flex items-center justify-between"
                      style={{ paddingTop: 16, borderTop: "1px solid #F4F7FA" }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#2E69A4",
                        }}
                      >
                        {p.outlet}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        style={{ fontSize: 12, color: "#6B7C93" }}
                      >
                        <Calendar style={{ width: 12, height: 12 }} /> {p.date}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Social proof strip */}
            <Reveal v={pressRef.v} delay={260}>
              <div
                className="flex flex-wrap items-center justify-center"
                style={{
                  gap: 48,
                  marginTop: 56,
                  paddingTop: 48,
                  borderTop: "1px solid #E1E8F5",
                }}
              >
                {[
                  { value: "2,400+", label: "Businesses using BezMate" },
                  { value: "4.9★", label: "Average customer rating" },
                  { value: "AED 18M", label: "Raised in Series A" },
                  { value: "6", label: "GCC countries served" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p
                      className="font-serif"
                      style={{ fontSize: 36, color: "#1B2A49", lineHeight: 1 }}
                    >
                      {s.value}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#6B7C93",
                        fontWeight: 500,
                        marginTop: 6,
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CTA
        ════════════════════════════════════════════════════════ */}
        <section
          ref={ctaRef.ref}
          className="relative overflow-hidden"
          style={{ padding: "112px 24px" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(155deg,#0d1b2e 0%,#1B2A49 55%,#162038 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 25% 50%,rgba(46,105,164,0.35) 0%,transparent 55%),radial-gradient(ellipse at 75% 50%,rgba(246,168,33,0.10) 0%,transparent 55%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.03,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <Reveal v={ctaRef.v}>
            <div className="relative max-w-3xl mx-auto text-center">
              <div
                className="inline-flex items-center gap-2 rounded-full"
                style={{
                  padding: "8px 20px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  marginBottom: 32,
                }}
              >
                <Award style={{ width: 14, height: 14, color: "#F6A821" }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.70)",
                  }}
                >
                  Trusted by 2,400+ UAE businesses
                </span>
              </div>
              <h2
                className="font-serif text-white"
                style={{
                  fontSize: "clamp(36px,6vw,64px)",
                  lineHeight: 1.06,
                  marginBottom: 20,
                }}
              >
                Ready to automate
                <br />
                <span style={{ color: "#F6A821" }}>your business?</span>
              </h2>
              <p
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.50)",
                  lineHeight: 1.78,
                  maxWidth: 520,
                  margin: "0 auto",
                  marginBottom: 44,
                }}
              >
                Join thousands of UAE businesses running on autopilot. Set up in
                15 minutes. No credit card needed.
              </p>
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: 16, marginBottom: 32 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl font-black transition-all hover:opacity-90"
                  style={{
                    padding: "15px 36px",
                    fontSize: 16,
                    background: "linear-gradient(135deg,#F6A821,#d48b0e)",
                    boxShadow: "0 4px 24px rgba(246,168,33,0.38)",
                    color: "#1B2A49",
                  }}
                >
                  Start Free — 14 Days{" "}
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl font-semibold text-white"
                  style={{
                    padding: "15px 36px",
                    fontSize: 16,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  Talk to Our Team
                </Link>
              </div>
              <div
                className="flex flex-wrap items-center justify-center"
                style={{ gap: 24 }}
              >
                {[
                  "14-day free trial",
                  "No credit card",
                  "UAE data residency",
                  "Cancel anytime",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5"
                    style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}
                  >
                    <CheckCircle2
                      style={{ width: 14, height: 14, color: "#10b981" }}
                    />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </PublicLayout>
  );
}
