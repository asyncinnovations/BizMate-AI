"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Clock,
  Search,
  X,
  Tag,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Award,
  FileText,
  Bell,
  MessageSquare,
  Users,
  ChevronRight,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

// ─── Animation CSS (keyframes + .bl-u classes) ─────────────────────────
const ANIMATION_CSS = `
  @keyframes blUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes blPulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
  .bl-u1 { animation: blUp 0.65s 0.06s ease both; }
  .bl-u2 { animation: blUp 0.65s 0.16s ease both; }
  .bl-u3 { animation: blUp 0.65s 0.26s ease both; }
  .bl-u4 { animation: blUp 0.65s 0.36s ease both; }
  .bl-u5 { animation: blUp 0.65s 0.46s ease both; }
`;

// ─── useInView ────────────────────────────────────────────────────────
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

// ─── Reveal ───────────────────────────────────────────────────────────
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
        transform: v ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.6s ${delay}ms ease, transform 0.6s ${delay}ms ease`,
        willChange: "opacity,transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────
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
        color: dark ? "#fff" : "#2E69A4",
      }}
    >
      <Sparkles style={{ width: 11, height: 11 }} />
      {children}
    </span>
  );
}

// ─── Category pill ───────────────────────────────────────────────────
function CatPill({
  label,
  color,
  bg,
  active,
  onClick,
}: {
  label: string;
  color: string;
  bg: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: 99,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: "pointer",
        border: `2px solid ${active ? color : "#E1E8F5"}`,
        background: active ? bg : "#ffffff",
        color: active ? color : "#6B7C93",
        transition: "all 0.18s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = color;
          (e.currentTarget as HTMLButtonElement).style.color = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#E1E8F5";
          (e.currentTarget as HTMLButtonElement).style.color = "#6B7C93";
        }
      }}
    >
      {label}
    </button>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All", value: "all", color: "#2E69A4", bg: "#EEF4FB" },
  { label: "VAT & Tax", value: "vat", color: "#10b981", bg: "#ECFDF5" },
  { label: "AI & Automation", value: "ai", color: "#7c3aed", bg: "#F5F3FF" },
  { label: "Invoicing", value: "invoicing", color: "#F6A821", bg: "#FEF6E4" },
  { label: "Business Tips", value: "tips", color: "#e11d48", bg: "#FFF1F2" },
  { label: "WhatsApp", value: "whatsapp", color: "#0ea5e9", bg: "#F0F9FF" },
];

type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  catLabel: string;
  catColor: string;
  catBg: string;
  readTime: string;
  date: string;
  icon: React.ReactNode;
  gradient: string;
};

const BLOGS: Blog[] = [
  {
    slug: "uae-vat-filing-guide-2025",
    title: "The Complete UAE VAT Filing Guide for SMEs in 2025",
    excerpt:
      "Everything you need to know about filing VAT returns with the FTA — deadlines, common mistakes, and how automation saves hours of manual work every quarter.",
    category: "vat",
    catLabel: "VAT & Tax",
    catColor: "#10b981",
    catBg: "#ECFDF5",
    readTime: "8 min read",
    date: "Feb 28, 2025",
    icon: <FileText style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#0d9488,#10b981)",
  },
  {
    slug: "whatsapp-business-ai-replies",
    title: "How AI Reply Suggestions Are Changing WhatsApp for UAE Businesses",
    excerpt:
      "Discover how AI-drafted replies are helping UAE business owners respond to 3× more client messages without spending extra hours on their phones.",
    category: "whatsapp",
    catLabel: "WhatsApp",
    catColor: "#0ea5e9",
    catBg: "#F0F9FF",
    readTime: "6 min read",
    date: "Feb 14, 2025",
    icon: <MessageSquare style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#0369a1,#0ea5e9)",
  },
  {
    slug: "invoice-payment-automation-uae",
    title:
      "Stop Chasing Late Payments: Automating Invoice Follow-Ups on WhatsApp",
    excerpt:
      "Late payments cost UAE SMEs an average of AED 28,000 per year. Here's how automated WhatsApp reminders cut that number dramatically.",
    category: "invoicing",
    catLabel: "Invoicing",
    catColor: "#F6A821",
    catBg: "#FEF6E4",
    readTime: "5 min read",
    date: "Jan 30, 2025",
    icon: <FileText style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#d97706,#F6A821)",
  },
  {
    slug: "corporate-tax-uae-sme-checklist",
    title: "UAE Corporate Tax 2025: A Practical Checklist for Small Businesses",
    excerpt:
      "The 9% corporate tax is now fully in effect. Here's a plain-English checklist of what every UAE SME needs to have in place before the deadline.",
    category: "vat",
    catLabel: "VAT & Tax",
    catColor: "#10b981",
    catBg: "#ECFDF5",
    readTime: "7 min read",
    date: "Jan 18, 2025",
    icon: <CheckCircle2 style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#065f46,#10b981)",
  },
  {
    slug: "ai-automation-small-business-uae",
    title:
      "5 Business Tasks You Should Automate Right Now (If You're in the UAE)",
    excerpt:
      "From VAT reminders to client follow-ups — these five automation wins save the average UAE business owner 6 hours per week.",
    category: "ai",
    catLabel: "AI & Automation",
    catColor: "#7c3aed",
    catBg: "#F5F3FF",
    readTime: "4 min read",
    date: "Jan 5, 2025",
    icon: <TrendingUp style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#5b21b6,#7c3aed)",
  },
  {
    slug: "trade-license-renewal-dubai-guide",
    title: "Trade License Renewal in Dubai: Dates, Fees & What to Prepare",
    excerpt:
      "DED and free zone trade license renewals — a detailed breakdown of timelines, required documents, and how to avoid costly late penalties.",
    category: "tips",
    catLabel: "Business Tips",
    catColor: "#e11d48",
    catBg: "#FFF1F2",
    readTime: "6 min read",
    date: "Dec 22, 2024",
    icon: <Award style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#9f1239,#e11d48)",
  },
  {
    slug: "crm-whatsapp-instagram-unified-inbox",
    title:
      "Why UAE Businesses Are Switching to a Unified WhatsApp + Instagram Inbox",
    excerpt:
      "Managing clients across multiple channels is exhausting. Here's why a unified AI inbox is becoming the new standard for GCC businesses.",
    category: "whatsapp",
    catLabel: "WhatsApp",
    catColor: "#0ea5e9",
    catBg: "#F0F9FF",
    readTime: "5 min read",
    date: "Dec 10, 2024",
    icon: <Users style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#075985,#0ea5e9)",
  },
  {
    slug: "arabic-invoice-uae-requirements",
    title: "Arabic Invoices in the UAE: What the FTA Actually Requires",
    excerpt:
      "Not all invoices need to be in Arabic — but some do. A clear breakdown of when Arabic is required, what format to use, and how to stay compliant.",
    category: "invoicing",
    catLabel: "Invoicing",
    catColor: "#F6A821",
    catBg: "#FEF6E4",
    readTime: "4 min read",
    date: "Nov 28, 2024",
    icon: <FileText style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#92400e,#F6A821)",
  },
  {
    slug: "ai-reminders-vat-compliance",
    title: "How Smart Reminders Are Eliminating VAT Penalties for UAE SMEs",
    excerpt:
      "FTA penalties for late VAT filing start at AED 1,000. See how AI-powered reminders sent 30, 14, and 3 days before deadlines are changing this.",
    category: "ai",
    catLabel: "AI & Automation",
    catColor: "#7c3aed",
    catBg: "#F5F3FF",
    readTime: "5 min read",
    date: "Nov 15, 2024",
    icon: <Bell style={{ width: 22, height: 22 }} />,
    gradient: "linear-gradient(135deg,#4c1d95,#7c3aed)",
  },
];

const TOPICS = [
  {
    icon: <FileText style={{ width: 16, height: 16 }} />,
    color: "#F6A821",
    bg: "#FEF6E4",
    label: "Invoicing & Payments",
    count: 12,
  },
  {
    icon: <CheckCircle2 style={{ width: 16, height: 16 }} />,
    color: "#10b981",
    bg: "#ECFDF5",
    label: "VAT & Compliance",
    count: 18,
  },
  {
    icon: <MessageSquare style={{ width: 16, height: 16 }} />,
    color: "#0ea5e9",
    bg: "#F0F9FF",
    label: "WhatsApp for Business",
    count: 9,
  },
  {
    icon: <TrendingUp style={{ width: 16, height: 16 }} />,
    color: "#7c3aed",
    bg: "#F5F3FF",
    label: "AI & Automation",
    count: 14,
  },
  {
    icon: <Users style={{ width: 16, height: 16 }} />,
    color: "#e11d48",
    bg: "#FFF1F2",
    label: "Client Management",
    count: 7,
  },
  {
    icon: <Award style={{ width: 16, height: 16 }} />,
    color: "#2E69A4",
    bg: "#EEF4FB",
    label: "Business Growth",
    count: 11,
  },
];

// ─── Blog Card ────────────────────────────────────────────────────────
function BlogCard({
  blog,
  delay,
  v,
}: {
  blog: Blog;
  delay: number;
  v: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal v={v} delay={delay} style={{ height: "100%" }}>
      <Link
        href={`/blogs/${blog.slug}`}
        style={{ textDecoration: "none", display: "flex", height: "100%" }}
      >
        <article
          className="flex flex-col w-full"
          style={{
            borderRadius: 14,
            border: "1px solid #E8EDF5",
            background: "#fff",
            overflow: "hidden",
            cursor: "pointer",
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            boxShadow: hov ? "0 6px 24px rgba(27,42,73,0.10)" : "none",
            transform: hov ? "translateY(-2px)" : "translateY(0)",
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
        >
          {/* Thumbnail */}
          <div
            style={{
              height: 168,
              flexShrink: 0,
              background: "#F4F6FA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #EEF1F8",
            }}
          >
            <div style={{ color: "#C8D2E0" }}>{blog.icon}</div>
          </div>

          {/* Text body */}
          <div
            className="flex flex-col"
            style={{ padding: "18px 20px 20px", flex: 1 }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                fontSize: 11,
                fontWeight: 600,
                color: blog.catColor,
                background: blog.catBg,
                padding: "2px 9px",
                borderRadius: 6,
                marginBottom: 10,
              }}
            >
              {blog.catLabel}
            </span>

            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: hov ? "#2E69A4" : "#111827",
                lineHeight: 1.46,
                marginBottom: 8,
                transition: "color 0.18s",
              }}
            >
              {blog.title}
            </h3>

            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                lineHeight: 1.68,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
                marginBottom: 16,
              }}
            >
              {blog.excerpt}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: "#9CA3AF",
              }}
            >
              <span>{blog.date}</span>
              <span>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Clock style={{ width: 11, height: 11 }} />
                {blog.readTime}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </Reveal>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────
export default function BlogsPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const gridRef = useInView(0.05);
  const topicsRef = useInView(0.1);
  const newsletterRef = useInView(0.1);
  const ctaRef = useInView(0.1);

  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);
  const [subFocus, setSubFocus] = useState(false);

  const filtered = BLOGS.filter((b) => {
    const matchCat = activeCat === "all" || b.category === activeCat;
    const matchSearch =
      searchQuery === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.catLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PublicLayout>
      {/* Only animation styles now — fonts are global */}
      <style>{ANIMATION_CSS}</style>

      {/* Main container: use Tailwind font-sans */}
      <div className="font-sans bg-white overflow-x-hidden">
        {/* ════════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{ paddingTop: 96, paddingBottom: 0 }}
        >
          {/* BG layers — identical to original */}
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
              width: 500,
              height: 500,
              background:
                "radial-gradient(circle, rgba(246,168,33,0.12) 0%, transparent 65%)",
              transform: "translate(22%,-18%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 rounded-full"
            style={{
              width: 380,
              height: 380,
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
            {/* Live badge */}
            <div
              className="bl-u1 flex justify-center"
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
                    background: "#F6A821",
                    display: "inline-block",
                    animation: "blPulse 2.2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  UAE business insights · Updated weekly
                </span>
              </div>
            </div>

            {/* Headline — now using font-serif */}
            <h1
              className="font-serif bl-u2 text-white text-center"
              style={{
                fontSize: "clamp(44px,7vw,70px)",
                lineHeight: 1.07,
                marginBottom: 20,
              }}
            >
              Insights for the
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
                modern UAE business.
              </em>
            </h1>

            {/* Sub */}
            <p
              className="bl-u3 text-center"
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.54)",
                lineHeight: 1.78,
                maxWidth: 560,
                margin: "0 auto",
                marginBottom: 40,
              }}
            >
              VAT guides, AI automation tips, WhatsApp best practices, and
              everything else a UAE business owner needs to stay ahead.
            </p>

            {/* Search bar */}
            <div
              className="bl-u4 flex justify-center"
              style={{ marginBottom: 52 }}
            >
              <div className="relative w-full" style={{ maxWidth: 520 }}>
                <Search
                  style={{
                    width: 17,
                    height: 17,
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: searchFocus ? "#2E69A4" : "rgba(255,255,255,0.35)",
                    transition: "color 0.2s",
                    zIndex: 1,
                  }}
                />
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  style={{
                    width: "100%",
                    padding: "14px 44px 14px 46px",
                    fontSize: 15,
                    fontFamily: "inherit",
                    fontWeight: 500,
                    background: searchFocus
                      ? "#ffffff"
                      : "rgba(255,255,255,0.10)",
                    border: `2px solid ${searchFocus ? "#2E69A4" : "rgba(255,255,255,0.16)"}`,
                    borderRadius: 14,
                    outline: "none",
                    color: searchFocus ? "#1B2A49" : "#ffffff",
                    boxShadow: searchFocus
                      ? "0 0 0 4px rgba(46,105,164,0.15)"
                      : "none",
                    transition: "all 0.22s ease",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: searchFocus ? "#6B7C93" : "rgba(255,255,255,0.5)",
                      padding: 2,
                    }}
                  >
                    <X style={{ width: 15, height: 15 }} />
                  </button>
                )}
              </div>
            </div>

            {/* Category chips grid */}
            <div className="bl-u5">
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: 10 }}
              >
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCat(cat.value)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 99,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      border: `1.5px solid ${activeCat === cat.value ? cat.color : "rgba(255,255,255,0.18)"}`,
                      background:
                        activeCat === cat.value
                          ? cat.color
                          : "rgba(255,255,255,0.07)",
                      color:
                        activeCat === cat.value
                          ? "#fff"
                          : "rgba(255,255,255,0.65)",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.18s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (activeCat !== cat.value)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.13)";
                    }}
                    onMouseLeave={(e) => {
                      if (activeCat !== cat.value)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.07)";
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
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
                d="M0,20 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
                fill="#F8FAFF"
              />
            </svg>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ALL POSTS GRID
        ════════════════════════════════════════════════════════ */}
        <section
          ref={gridRef.ref}
          style={{
            padding: "100px 24px",
            background: "#ffffff",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Section header row */}
            <div
              className="flex items-center justify-between flex-wrap"
              style={{ marginBottom: 40, gap: 16 }}
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    width: 4,
                    height: 28,
                    borderRadius: 99,
                    background: "linear-gradient(to bottom,#2E69A4,#F6A821)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1B2A49" }}>
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : activeCat === "all"
                      ? "All Articles"
                      : CATEGORIES.find((c) => c.value === activeCat)?.label}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#9BACC7",
                      marginLeft: 10,
                    }}
                  >
                    ({filtered.length})
                  </span>
                </h2>
              </div>

              {/* Light category filter row */}
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {CATEGORIES.map((cat, i) => (
                  <CatPill
                    key={i}
                    label={cat.label}
                    color={cat.color}
                    bg={cat.bg}
                    active={activeCat === cat.value}
                    onClick={() => setActiveCat(cat.value)}
                  />
                ))}
              </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                style={{ gap: 24 }}
              >
                {filtered.map((blog, i) => (
                  <BlogCard
                    key={blog.slug}
                    blog={blog}
                    delay={i * 70}
                    v={gridRef.v}
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center text-center"
                style={{ padding: "80px 24px" }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 72,
                    height: 72,
                    background: "#F4F7FA",
                    marginBottom: 20,
                  }}
                >
                  <BookOpen
                    style={{ width: 30, height: 30, color: "#9BACC7" }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1B2A49",
                    marginBottom: 8,
                  }}
                >
                  No articles found
                </h3>
                <p style={{ fontSize: 15, color: "#6B7C93", marginBottom: 24 }}>
                  Try a different search term or browse all categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCat("all");
                  }}
                  style={{
                    padding: "11px 28px",
                    background: "linear-gradient(135deg,#1B2A49,#2E69A4)",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                  }}
                >
                  Show all articles
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            TOPICS BROWSE
        ════════════════════════════════════════════════════════ */}
        <section
          ref={topicsRef.ref}
          style={{
            padding: "100px 24px",
            background: "#F8FAFF",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <Reveal v={topicsRef.v}>
              <div className="text-center" style={{ marginBottom: 56 }}>
                <Chip>Browse by Topic</Chip>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: "clamp(28px,4vw,46px)",
                    lineHeight: 1.1,
                    color: "#1B2A49",
                    marginTop: 20,
                    marginBottom: 14,
                  }}
                >
                  Find exactly what
                  <br />
                  <em style={{ color: "#2E69A4", fontStyle: "italic" }}>
                    you&apos;re looking for.
                  </em>
                </h2>
                <p
                  style={{
                    fontSize: 17,
                    color: "#344767",
                    maxWidth: 480,
                    margin: "0 auto",
                  }}
                >
                  Practical guides and insights organised by the topics that
                  matter most to UAE business owners.
                </p>
              </div>
            </Reveal>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: 20 }}
            >
              {TOPICS.map((t, i) => (
                <Reveal key={i} v={topicsRef.v} delay={i * 80}>
                  <button
                    onClick={() => {
                      const cat = CATEGORIES.find(
                        (c) =>
                          c.label === t.label ||
                          t.label.includes(c.label.split(" ")[0]),
                      );
                      if (cat) setActiveCat(cat.value);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-4 w-full text-left bg-white rounded-2xl"
                    style={{
                      padding: 24,
                      border: "2px solid #E1E8F5",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition:
                        "box-shadow 0.22s, border-color 0.22s, transform 0.22s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.boxShadow = "0 10px 28px rgba(27,42,73,0.09)";
                      el.style.borderColor = `${t.color}44`;
                      el.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.boxShadow = "none";
                      el.style.borderColor = "#E1E8F5";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl shrink-0"
                      style={{
                        width: 46,
                        height: 46,
                        background: t.bg,
                        color: t.color,
                      }}
                    >
                      {t.icon}
                    </div>
                    <div className="flex-1">
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1B2A49",
                          marginBottom: 3,
                        }}
                      >
                        {t.label}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#9BACC7",
                          fontWeight: 500,
                        }}
                      >
                        {t.count} articles
                      </p>
                    </div>
                    <ChevronRight
                      style={{
                        width: 18,
                        height: 18,
                        color: "#C5D0E0",
                        flexShrink: 0,
                      }}
                    />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            NEWSLETTER
        ════════════════════════════════════════════════════════ */}
        <section
          ref={newsletterRef.ref}
          style={{
            padding: "100px 24px",
            background: "#ffffff",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <Reveal v={newsletterRef.v}>
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,#1B2A49 0%,#2E69A4 100%)",
                  padding: "64px 48px",
                  position: "relative",
                }}
              >
                {/* BG texture */}
                <div
                  className="absolute inset-0"
                  style={{
                    opacity: 0.05,
                    backgroundImage:
                      "radial-gradient(circle,rgba(255,255,255,1) 1px,transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div
                  className="absolute top-0 right-0 rounded-full"
                  style={{
                    width: 320,
                    height: 320,
                    background:
                      "radial-gradient(circle,rgba(246,168,33,0.15) 0%,transparent 70%)",
                    transform: "translate(20%,-20%)",
                  }}
                />

                <div
                  className="relative grid grid-cols-1 lg:grid-cols-2"
                  style={{ gap: 48, alignItems: "center" }}
                >
                  {/* Left */}
                  <div>
                    <div
                      className="inline-flex items-center gap-2 rounded-full"
                      style={{
                        padding: "7px 16px",
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        marginBottom: 20,
                      }}
                    >
                      <Bell
                        style={{ width: 13, height: 13, color: "#F6A821" }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.75)",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        Weekly Newsletter
                      </span>
                    </div>
                    <h2
                      className="font-serif text-white"
                      style={{
                        fontSize: "clamp(26px,3.5vw,40px)",
                        lineHeight: 1.12,
                        marginBottom: 16,
                      }}
                    >
                      Stay ahead of every
                      <br />
                      <span style={{ color: "#F6A821" }}>UAE deadline.</span>
                    </h2>
                    <p
                      style={{
                        fontSize: 15,
                        color: "rgba(255,255,255,0.58)",
                        lineHeight: 1.75,
                        marginBottom: 24,
                      }}
                    >
                      One email every week. VAT reminders, platform updates, and
                      practical guides for UAE business owners. No spam.
                      Unsubscribe any time.
                    </p>
                    <div className="flex flex-wrap" style={{ gap: 16 }}>
                      {[
                        "1,200+ subscribers",
                        "Weekly, every Tuesday",
                        "Arabic & English",
                      ].map((t, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5"
                          style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.50)",
                            fontWeight: 500,
                          }}
                        >
                          <CheckCircle2
                            style={{ width: 14, height: 14, color: "#10b981" }}
                          />
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — subscribe form */}
                  <div>
                    {subbed ? (
                      <div
                        className="flex flex-col items-center text-center rounded-2xl"
                        style={{
                          padding: 40,
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.14)",
                        }}
                      >
                        <div
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: 56,
                            height: 56,
                            background: "rgba(16,185,129,0.2)",
                            border: "2px solid #10b981",
                            marginBottom: 16,
                          }}
                        >
                          <CheckCircle2
                            style={{ width: 26, height: 26, color: "#10b981" }}
                          />
                        </div>
                        <p
                          style={{
                            fontSize: 17,
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: 8,
                          }}
                        >
                          You&apos;re subscribed!
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.55)",
                          }}
                        >
                          First issue lands in your inbox next Tuesday.
                        </p>
                      </div>
                    ) : (
                      <div
                        className="rounded-2xl"
                        style={{
                          padding: 32,
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.14)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: 20,
                          }}
                        >
                          Subscribe to the weekly digest
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 14,
                          }}
                        >
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setSubFocus(true)}
                            onBlur={() => setSubFocus(false)}
                            style={{
                              width: "100%",
                              padding: "13px 16px",
                              fontSize: 14,
                              fontFamily: "inherit",
                              fontWeight: 500,
                              background: subFocus
                                ? "#fff"
                                : "rgba(255,255,255,0.10)",
                              border: `2px solid ${subFocus ? "#F6A821" : "rgba(255,255,255,0.18)"}`,
                              borderRadius: 12,
                              outline: "none",
                              color: subFocus ? "#1B2A49" : "#fff",
                              transition: "all 0.2s",
                              boxShadow: subFocus
                                ? "0 0 0 4px rgba(246,168,33,0.15)"
                                : "none",
                            }}
                          />
                          <button
                            onClick={() => {
                              if (email) setSubbed(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl font-bold"
                            style={{
                              padding: "13px 24px",
                              background:
                                "linear-gradient(135deg,#F6A821,#d48b0e)",
                              color: "#1B2A49",
                              fontSize: 14,
                              fontFamily: "inherit",
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 4px 16px rgba(246,168,33,0.35)",
                            }}
                          >
                            Subscribe — It&apos;s Free{" "}
                            <ArrowRight style={{ width: 15, height: 15 }} />
                          </button>
                        </div>
                        <p
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.35)",
                            marginTop: 12,
                            lineHeight: 1.6,
                          }}
                        >
                          By subscribing you agree to our{" "}
                          <Link
                            href="/privacy"
                            style={{
                              color: "rgba(255,255,255,0.55)",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            Privacy Policy
                          </Link>
                          . One-click unsubscribe.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
                  Ready to automate your business?
                </span>
              </div>
              <h2
                className="font-serif text-white"
                style={{
                  fontSize: "clamp(34px,6vw,60px)",
                  lineHeight: 1.07,
                  marginBottom: 20,
                }}
              >
                Put it all into
                <br />
                <span style={{ color: "#F6A821" }}>practice today.</span>
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.50)",
                  lineHeight: 1.78,
                  maxWidth: 480,
                  margin: "0 auto",
                  marginBottom: 44,
                }}
              >
                Everything you read about here — VAT automation, AI replies,
                smart invoicing — is live inside BezMate.ai right now.
              </p>
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: 16, marginBottom: 32 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl font-black transition-all hover:opacity-90"
                  style={{
                    padding: "14px 36px",
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
                    padding: "14px 36px",
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