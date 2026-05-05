"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Send,
  Globe,
  Shield,
  ChevronDown,
  Award,
  Users,
  Star,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

// ─── Animation CSS (only keyframes + animation classes) ─────────────────────
const ANIMATION_CSS = `
  @keyframes ctUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ctPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes ctSpin  { to { transform:rotate(360deg); } }
  .ct-u1 { animation: ctUp 0.65s 0.06s ease both; }
  .ct-u2 { animation: ctUp 0.65s 0.16s ease both; }
  .ct-u3 { animation: ctUp 0.65s 0.26s ease both; }
  .ct-u4 { animation: ctUp 0.65s 0.36s ease both; }
  .ct-u5 { animation: ctUp 0.65s 0.46s ease both; }
`;

// ─── Hooks ──────────────────────────────────────────────────────────────────
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

// ─── FAQ ───────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: `2px solid ${open ? "rgba(46,105,164,0.30)" : "#E1E8F5"}`,
        borderRadius: 16,
        background: open ? "#fafcff" : "#fff",
        overflow: "hidden",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left"
        style={{
          padding: "18px 24px",
          gap: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#1B2A49",
            lineHeight: 1.5,
          }}
        >
          {q}
        </span>
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 30,
            height: 30,
            background: open ? "#1B2A49" : "#F4F7FA",
            border: `2px solid ${open ? "#1B2A49" : "#E1E8F5"}`,
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.25s, background 0.2s",
          }}
        >
          <ChevronDown
            style={{ width: 14, height: 14, color: open ? "#fff" : "#6B7C93" }}
          />
        </div>
      </button>
      <div
        style={{
          maxHeight: open ? 220 : 0,
          overflow: "hidden",
          transition: "max-height 0.32s ease",
        }}
      >
        <p
          style={{
            padding: "0 24px 20px",
            fontSize: 14,
            color: "#344767",
            lineHeight: 1.8,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────
const CHANNELS = [
  {
    icon: <Mail style={{ width: 20, height: 20 }} />,
    color: "#2E69A4",
    bg: "#EEF4FB",
    label: "Email Us",
    value: "hello@bezmate.ai",
    sub: "Replies within 2 hours",
    href: "mailto:hello@bezmate.ai",
  },
  {
    icon: <Phone style={{ width: 20, height: 20 }} />,
    color: "#F6A821",
    bg: "#FEF6E4",
    label: "Call Us",
    value: "+971 4 123 4567",
    sub: "Sun–Thu · 9am–6pm GST",
    href: "tel:+97141234567",
  },
  {
    icon: <MessageSquare style={{ width: 20, height: 20 }} />,
    color: "#10b981",
    bg: "#ECFDF5",
    label: "WhatsApp",
    value: "+971 50 123 4567",
    sub: "Quick replies · 7 days",
    href: "https://wa.me/971501234567",
  },
  {
    icon: <MapPin style={{ width: 20, height: 20 }} />,
    color: "#7c3aed",
    bg: "#F5F3FF",
    label: "Visit Us",
    value: "Gate District 3, DIFC",
    sub: "Dubai, UAE",
    href: "#",
  },
];

const DEPTS = [
  { value: "sales", label: "Sales & Pricing" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing & Subscriptions" },
  { value: "partnership", label: "Partnerships" },
  { value: "press", label: "Press & Media" },
  { value: "other", label: "Other" },
];

const TRUST = [
  {
    icon: <Clock style={{ width: 17, height: 17 }} />,
    color: "#2E69A4",
    bg: "#EEF4FB",
    title: "2-hour response",
    desc: "Every inquiry answered within 2 business hours, guaranteed.",
  },
  {
    icon: <Globe style={{ width: 17, height: 17 }} />,
    color: "#10b981",
    bg: "#ECFDF5",
    title: "Arabic & English",
    desc: "Our team is fully bilingual — reply in whichever language you prefer.",
  },
  {
    icon: <Shield style={{ width: 17, height: 17 }} />,
    color: "#F6A821",
    bg: "#FEF6E4",
    title: "UAE-based team",
    desc: "Local timezone, local context. We understand how UAE business works.",
  },
  {
    icon: <Users style={{ width: 17, height: 17 }} />,
    color: "#7c3aed",
    bg: "#F5F3FF",
    title: "Dedicated manager",
    desc: "Growth and Enterprise plans include a dedicated account manager.",
  },
];

const FAQS = [
  {
    q: "How quickly can I get started after signing up?",
    a: "You can be fully set up in 15 minutes. Our onboarding flow guides you through connecting WhatsApp, uploading clients, and setting your first reminders step by step.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes — 14 days free on any plan, no credit card required. You get full access to every feature so you can see exactly what the platform does before committing.",
  },
  {
    q: "Is the platform available in Arabic?",
    a: "Fully. Invoices, documents, and reminders can all be generated in Arabic or English. Our support team also responds fluently in both languages.",
  },
  {
    q: "Do you offer onboarding help for new businesses?",
    a: "Every new customer gets a 30-minute onboarding call. Growth and Enterprise plans include extended sessions where our team configures the platform with you.",
  },
  {
    q: "Can I migrate my existing client data from another CRM?",
    a: "Yes — you can bulk import via CSV or JSON. For Growth and Enterprise customers we offer a free white-glove migration service where our team handles the transfer.",
  },
];

// ─── Main ───────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const formRef = useInView(0.07);
  const trustRef = useInView(0.1);
  const faqRef = useInView(0.08);
  const ctaRef = useInView(0.1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    dept: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1300));
    setSending(false);
    setSubmitted(true);
  };

  const inp = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "13px 16px",
    fontSize: 14,
    fontFamily: "inherit",
    fontWeight: 500,
    color: "#1B2A49",
    background: focused === field ? "#ffffff" : "#F8FAFF",
    border: `2px solid ${focused === field ? "#2E69A4" : "#E1E8F5"}`,
    borderRadius: 12,
    outline: "none",
    boxShadow: focused === field ? "0 0 0 4px rgba(46,105,164,0.08)" : "none",
    transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
  });

  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#344767",
    marginBottom: 7,
  };

  return (
    <PublicLayout>
      <style>{ANIMATION_CSS}</style>
      <div className="font-sans bg-white overflow-x-hidden">
        {/* ════════════════════════════════════════════════════════
            HERO — powerful, platform-feel
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
                "radial-gradient(ellipse 900px 600px at 50% -10%, rgba(46,105,164,0.50) 0%, transparent 68%)",
            }}
          />
          <div
            className="absolute top-0 right-0 rounded-full"
            style={{
              width: 500,
              height: 500,
              background:
                "radial-gradient(circle, rgba(246,168,33,0.12) 0%, transparent 65%)",
              transform: "translate(20%,-20%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 rounded-full"
            style={{
              width: 400,
              height: 400,
              background:
                "radial-gradient(circle, rgba(46,105,164,0.18) 0%, transparent 65%)",
              transform: "translate(-20%,20%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.032,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />

          {/* Top content */}
          <div
            className="relative max-w-5xl mx-auto px-6"
            style={{ paddingBottom: 72 }}
          >
            {/* Live status badge */}
            <div
              className="ct-u1 flex justify-center"
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
                    animation: "ctPulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  Our team is online · Average reply: 47 minutes
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1
              className="font-serif ct-u2 text-white text-center"
              style={{
                fontSize: "clamp(46px,7vw,72px)",
                lineHeight: 1.06,
                marginBottom: 22,
              }}
            >
              We&apos;d love to
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
                hear from you.
              </em>
            </h1>

            {/* Subtext */}
            <p
              className="ct-u3 text-center"
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.54)",
                lineHeight: 1.78,
                maxWidth: 560,
                margin: "0 auto",
                marginBottom: 40,
              }}
            >
              Whether you&apos;re ready to start, exploring the platform, or
              need a custom Enterprise quote — our UAE-based team is here to
              help.
            </p>

            {/* Trust pills */}
            <div
              className="ct-u4 flex flex-wrap items-center justify-center"
              style={{ gap: 10, marginBottom: 64 }}
            >
              {[
                {
                  icon: <Clock style={{ width: 13, height: 13 }} />,
                  text: "Replies in under 2 hours",
                },
                {
                  icon: <Globe style={{ width: 13, height: 13 }} />,
                  text: "Arabic & English support",
                },
                {
                  icon: <Shield style={{ width: 13, height: 13 }} />,
                  text: "UAE-based team",
                },
                {
                  icon: <Star style={{ width: 13, height: 13 }} />,
                  text: "4.9★ customer satisfaction",
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5"
                  style={{
                    padding: "7px 14px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.11)",
                    borderRadius: 99,
                    color: "rgba(255,255,255,0.62)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {p.icon}
                  {p.text}
                </div>
              ))}
            </div>

            {/* ── Channel cards row — embedded in hero ── */}
            <div
              className="ct-u5 grid grid-cols-2 lg:grid-cols-4"
              style={{ gap: 14 }}
            >
              {CHANNELS.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className="flex flex-col rounded-2xl no-underline group"
                  style={{
                    padding: 22,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(10px)",
                    transition:
                      "background 0.2s, border-color 0.2s, transform 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(255,255,255,0.11)";
                    el.style.borderColor = `${c.color}66`;
                    el.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(255,255,255,0.06)";
                    el.style.borderColor = "rgba(255,255,255,0.10)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 44,
                      height: 44,
                      background: `${c.color}22`,
                      color: c.color,
                      border: `1px solid ${c.color}33`,
                      marginBottom: 14,
                    }}
                  >
                    {c.icon}
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.40)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 5,
                    }}
                  >
                    {c.label}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: 3,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.value}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.40)" }}>
                    {c.sub}
                  </p>
                </a>
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
                d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
                fill="#F8FAFF"
              />
            </svg>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            FORM + SIDEBAR
        ════════════════════════════════════════════════════════ */}
        <section
          ref={formRef.ref}
          style={{ padding: "100px 24px", background: "#F8FAFF" }}
        >
          <div className="max-w-6xl mx-auto">
            <div
              className="grid grid-cols-1 lg:grid-cols-5"
              style={{ gap: 52, alignItems: "start" }}
            >
              {/* Sidebar */}
              <Reveal v={formRef.v} delay={0} className="lg:col-span-2">
                <Chip>Send a Message</Chip>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: "clamp(26px,3.5vw,42px)",
                    lineHeight: 1.1,
                    color: "#1B2A49",
                    marginTop: 18,
                    marginBottom: 16,
                  }}
                >
                  Let&apos;s start a<br />
                  <em style={{ fontStyle: "italic", color: "#2E69A4" }}>
                    conversation.
                  </em>
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: "#344767",
                    lineHeight: 1.78,
                    marginBottom: 32,
                  }}
                >
                  Fill in the form and one of our team will get back to you
                  within 2 hours — in Arabic or English, whichever you prefer.
                </p>

                {/* Response card */}
                <div
                  className="rounded-2xl"
                  style={{
                    padding: 24,
                    background: "#ffffff",
                    border: "2px solid #E1E8F5",
                    marginBottom: 28,
                  }}
                >
                  <div
                    className="flex items-center gap-3"
                    style={{ marginBottom: 18 }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        background: "#1B2A49",
                        color: "#F6A821",
                      }}
                    >
                      <Clock style={{ width: 18, height: 18 }} />
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
                        Response times
                      </p>
                      <p style={{ fontSize: 12, color: "#6B7C93" }}>
                        Business hours: Sunday – Thursday
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {[
                      ["Sales enquiries", "< 1 hour"],
                      ["Technical support", "< 2 hours"],
                      ["Billing queries", "Same day"],
                      ["General enquiries", "< 4 hours"],
                    ].map(([lbl, t], i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <span style={{ fontSize: 13, color: "#344767" }}>
                          {lbl}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 99,
                            background: "#EEF4FB",
                            color: "#2E69A4",
                            border: "1px solid rgba(46,105,164,0.15)",
                          }}
                        >
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Office details */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[
                    {
                      icon: <MapPin style={{ width: 15, height: 15 }} />,
                      text: "Gate District 3, DIFC, Dubai, UAE",
                    },
                    {
                      icon: <Mail style={{ width: 15, height: 15 }} />,
                      text: "hello@bezmate.ai",
                    },
                    {
                      icon: <Phone style={{ width: 15, height: 15 }} />,
                      text: "+971 4 123 4567",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-lg shrink-0"
                        style={{
                          width: 32,
                          height: 32,
                          background: "#F4F7FA",
                          color: "#2E69A4",
                        }}
                      >
                        {item.icon}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#344767",
                          fontWeight: 500,
                        }}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Form card */}
              <Reveal v={formRef.v} delay={160} className="lg:col-span-3">
                <div
                  className="rounded-3xl"
                  style={{
                    padding: 40,
                    background: "#ffffff",
                    border: "2px solid #E1E8F5",
                    boxShadow: "0 12px 48px rgba(27,42,73,0.07)",
                  }}
                >
                  {submitted ? (
                    <div
                      className="flex flex-col items-center text-center"
                      style={{ padding: "44px 0" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 72,
                          height: 72,
                          background: "#ECFDF5",
                          border: "3px solid #10b981",
                          marginBottom: 24,
                        }}
                      >
                        <CheckCircle2
                          style={{ width: 34, height: 34, color: "#10b981" }}
                        />
                      </div>
                      <h3
                        className="font-serif"
                        style={{
                          fontSize: 28,
                          color: "#1B2A49",
                          marginBottom: 12,
                        }}
                      >
                        Message sent!
                      </h3>
                      <p
                        style={{
                          fontSize: 15,
                          color: "#344767",
                          lineHeight: 1.75,
                          maxWidth: 360,
                          marginBottom: 32,
                        }}
                      >
                        Thanks for reaching out. We&apos;ll reply to{" "}
                        <strong>{form.email}</strong> within 2 hours.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({
                            name: "",
                            email: "",
                            company: "",
                            dept: "",
                            message: "",
                          });
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
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                      }}
                    >
                      <div style={{ marginBottom: 4 }}>
                        <h3
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#1B2A49",
                            marginBottom: 4,
                          }}
                        >
                          Get in touch
                        </h3>
                        <p style={{ fontSize: 13, color: "#9BACC7" }}>
                          Fields marked * are required.
                        </p>
                      </div>

                      {/* Row 1 */}
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2"
                        style={{ gap: 16 }}
                      >
                        <div>
                          <label style={lbl}>Full Name *</label>
                          <input
                            required
                            type="text"
                            placeholder="Ahmad Al Zaabi"
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            onFocus={() => setFocused("name")}
                            onBlur={() => setFocused(null)}
                            style={inp("name")}
                          />
                        </div>
                        <div>
                          <label style={lbl}>Email Address *</label>
                          <input
                            required
                            type="email"
                            placeholder="you@company.ae"
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            onFocus={() => setFocused("email")}
                            onBlur={() => setFocused(null)}
                            style={inp("email")}
                          />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2"
                        style={{ gap: 16 }}
                      >
                        <div>
                          <label style={lbl}>Company Name</label>
                          <input
                            type="text"
                            placeholder="Your Company LLC"
                            value={form.company}
                            onChange={(e) => set("company", e.target.value)}
                            onFocus={() => setFocused("company")}
                            onBlur={() => setFocused(null)}
                            style={inp("company")}
                          />
                        </div>
                        <div>
                          <label style={lbl}>Department *</label>
                          <select
                            required
                            value={form.dept}
                            onChange={(e) => set("dept", e.target.value)}
                            onFocus={() => setFocused("dept")}
                            onBlur={() => setFocused(null)}
                            style={{
                              ...inp("dept"),
                              appearance: "none",
                              cursor: "pointer",
                              color: form.dept ? "#1B2A49" : "#9BACC7",
                            }}
                          >
                            <option value="" disabled>
                              Select department
                            </option>
                            {DEPTS.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label style={lbl}>Your Message *</label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Tell us how we can help…"
                          value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          onFocus={() => setFocused("msg")}
                          onBlur={() => setFocused(null)}
                          style={{
                            ...inp("msg"),
                            resize: "vertical",
                            minHeight: 130,
                          }}
                        />
                      </div>

                      {/* Privacy */}
                      <p
                        style={{
                          fontSize: 12,
                          color: "#9BACC7",
                          lineHeight: 1.65,
                        }}
                      >
                        By submitting you agree to our{" "}
                        <Link
                          href="/privacy"
                          style={{
                            color: "#2E69A4",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          Privacy Policy
                        </Link>
                        . We never share your data with third parties.
                      </p>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={sending}
                        className="flex items-center justify-center gap-2 w-full rounded-xl font-bold text-white"
                        style={{
                          padding: "14px 32px",
                          fontSize: 15,
                          fontFamily: "inherit",
                          border: "none",
                          cursor: sending ? "not-allowed" : "pointer",
                          background: sending
                            ? "rgba(27,42,73,0.35)"
                            : "linear-gradient(135deg,#1B2A49 0%,#2E69A4 100%)",
                          boxShadow: sending
                            ? "none"
                            : "0 4px 20px rgba(27,42,73,0.22)",
                          opacity: sending ? 0.7 : 1,
                          transition: "opacity 0.2s, box-shadow 0.2s",
                        }}
                      >
                        {sending ? (
                          <>
                            <div
                              style={{
                                width: 17,
                                height: 17,
                                borderRadius: "50%",
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderTopColor: "#fff",
                                animation: "ctSpin 0.7s linear infinite",
                              }}
                            />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send style={{ width: 15, height: 15 }} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            TRUST SECTION
        ════════════════════════════════════════════════════════ */}
        <section
          ref={trustRef.ref}
          style={{
            padding: "100px 24px",
            background: "#ffffff",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <Reveal v={trustRef.v}>
              <div className="text-center" style={{ marginBottom: 56 }}>
                <Chip>Why Reach Out</Chip>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: "clamp(28px,4vw,46px)",
                    lineHeight: 1.1,
                    color: "#1B2A49",
                    marginTop: 20,
                    marginBottom: 16,
                  }}
                >
                  Support that actually helps
                </h2>
                <p
                  style={{
                    fontSize: 17,
                    color: "#344767",
                    maxWidth: 500,
                    margin: "0 auto",
                  }}
                >
                  Real people, real answers. No chatbots. No ticket queues. Just
                  a team that understands your business.
                </p>
              </div>
            </Reveal>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              style={{ gap: 20 }}
            >
              {TRUST.map((c, i) => (
                <Reveal key={i} v={trustRef.v} delay={i * 90}>
                  <div
                    className="bg-white rounded-2xl h-full"
                    style={{
                      padding: 28,
                      border: "2px solid #E1E8F5",
                      transition: "box-shadow 0.22s, border-color 0.22s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "0 10px 30px rgba(27,42,73,0.09)";
                      el.style.borderColor = `${c.color}44`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "none";
                      el.style.borderColor = "#E1E8F5";
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{
                        width: 44,
                        height: 44,
                        background: c.bg,
                        color: c.color,
                        marginBottom: 18,
                      }}
                    >
                      {c.icon}
                    </div>
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
                        lineHeight: 1.72,
                      }}
                    >
                      {c.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Social proof strip */}
            <Reveal v={trustRef.v} delay={300}>
              <div
                className="flex flex-wrap items-center justify-center"
                style={{
                  gap: 40,
                  marginTop: 56,
                  paddingTop: 48,
                  borderTop: "1px solid #E1E8F5",
                }}
              >
                {[
                  { value: "2,400+", label: "Businesses helped" },
                  { value: "4.9★", label: "Customer rating" },
                  { value: "47min", label: "Avg response time" },
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
            FAQ
        ════════════════════════════════════════════════════════ */}
        <section
          ref={faqRef.ref}
          style={{
            padding: "100px 24px",
            background: "#F8FAFF",
            borderTop: "1px solid #E1E8F5",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <Reveal v={faqRef.v}>
              <div className="text-center" style={{ marginBottom: 52 }}>
                <Chip>FAQ</Chip>
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
                  Common questions
                </h2>
                <p style={{ fontSize: 17, color: "#344767" }}>
                  Can&apos;t find the answer?{" "}
                  <a
                    href="mailto:hello@bezmate.ai"
                    style={{
                      color: "#2E69A4",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Email us directly.
                  </a>
                </p>
              </div>
            </Reveal>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FAQS.map((faq, i) => (
                <Reveal key={i} v={faqRef.v} delay={i * 65}>
                  <FaqItem q={faq.q} a={faq.a} />
                </Reveal>
              ))}
            </div>
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
                  Start your free trial today
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
                Not sure yet?
                <br />
                <span style={{ color: "#F6A821" }}>
                  Try it free for 14 days.
                </span>
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
                No credit card required. Full platform access. Cancel any time.
                If you have questions first, our team is one message away.
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
                  Start Free Trial{" "}
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </Link>
                <a
                  href="mailto:hello@bezmate.ai"
                  className="inline-flex items-center gap-2 rounded-2xl font-semibold text-white transition-all"
                  style={{
                    padding: "14px 36px",
                    fontSize: 16,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <Mail style={{ width: 16, height: 16 }} /> Email Us Directly
                </a>
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
