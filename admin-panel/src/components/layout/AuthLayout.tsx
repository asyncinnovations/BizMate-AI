"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

// ─── Orbital SVG Background Component ─────────────────────────────────
function OrbitalBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 600 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ── Outer orbit ring ── */}
      <g
        style={{
          transformOrigin: "300px 350px",
          animation: "orbit-spin 28s linear infinite",
        }}
      >
        <ellipse
          cx="300" cy="350" rx="210" ry="210"
          stroke="rgba(26,111,255,0.12)" strokeWidth="1"
          strokeDasharray="4 10"
        />
        {/* Marker dots on outer ring */}
        <circle cx="300" cy="140" r="3.5" fill="#1a6fff" opacity="0.7"
          style={{ animation: "pulse-node 3.2s ease-in-out infinite" }} />
        <circle cx="510" cy="350" r="2.5" fill="#00c8e8" opacity="0.5"
          style={{ animation: "pulse-node 2.8s ease-in-out 0.6s infinite" }} />
        <circle cx="90"  cy="350" r="2"   fill="#1a6fff" opacity="0.4"
          style={{ animation: "pulse-node 3.6s ease-in-out 1.2s infinite" }} />
      </g>

      {/* ── Middle orbit ring ── */}
      <g
        style={{
          transformOrigin: "300px 350px",
          animation: "orbit-spin-reverse 18s linear infinite",
        }}
      >
        <ellipse
          cx="300" cy="350" rx="140" ry="140"
          stroke="rgba(0,200,232,0.10)" strokeWidth="1"
          strokeDasharray="2 14"
        />
        <circle cx="300" cy="210" r="4" fill="#00c8e8" opacity="0.8"
          style={{ animation: "pulse-node 2.4s ease-in-out 0.3s infinite" }} />
        <circle cx="440" cy="350" r="3" fill="#1a6fff" opacity="0.6"
          style={{ animation: "pulse-node 3s ease-in-out 0.9s infinite" }} />
        <circle cx="160" cy="430" r="2.5" fill="#00c8e8" opacity="0.4"
          style={{ animation: "pulse-node 2.6s ease-in-out 1.5s infinite" }} />
      </g>

      {/* ── Inner orbit ring ── */}
      <g
        style={{
          transformOrigin: "300px 350px",
          animation: "orbit-spin 11s linear infinite",
        }}
      >
        <ellipse
          cx="300" cy="350" rx="72" ry="72"
          stroke="rgba(26,111,255,0.18)" strokeWidth="1.5"
        />
        <circle cx="300" cy="278" r="5" fill="#1a6fff" opacity="0.9"
          style={{ animation: "pulse-node 1.8s ease-in-out infinite" }} />
        <circle cx="372" cy="350" r="3.5" fill="#00c8e8" opacity="0.7"
          style={{ animation: "pulse-node 2s ease-in-out 0.5s infinite" }} />
      </g>

      {/* ── Central core ── */}
      <circle cx="300" cy="350" r="18" fill="rgba(26,111,255,0.15)"
        stroke="rgba(26,111,255,0.35)" strokeWidth="1.5" />
      <circle cx="300" cy="350" r="8"  fill="#1a6fff" opacity="0.9" />
      <circle cx="300" cy="350" r="3"  fill="#ffffff" opacity="0.95" />

      {/* ── Connector lines (network edges) ── */}
      <line x1="300" y1="140" x2="440" y2="350"
        stroke="rgba(26,111,255,0.08)" strokeWidth="1" />
      <line x1="510" y1="350" x2="300" y2="210"
        stroke="rgba(0,200,232,0.06)" strokeWidth="1" />
      <line x1="90"  y1="350" x2="300" y2="560"
        stroke="rgba(26,111,255,0.07)" strokeWidth="1" />
      <line x1="300" y1="210" x2="160" y2="430"
        stroke="rgba(0,200,232,0.07)" strokeWidth="1" />

      {/* ── Floating peripheral nodes ── */}
      {[
        { cx: 80,  cy: 160, r: 2,   opacity: 0.3, delay: "0s",    dur: "4s"   },
        { cx: 520, cy: 200, r: 1.5, opacity: 0.25, delay: "0.8s", dur: "5s"   },
        { cx: 60,  cy: 520, r: 2.5, opacity: 0.3, delay: "1.6s",  dur: "3.8s" },
        { cx: 540, cy: 510, r: 2,   opacity: 0.2, delay: "0.4s",  dur: "4.5s" },
        { cx: 150, cy: 100, r: 1.5, opacity: 0.2, delay: "2s",    dur: "4.2s" },
        { cx: 460, cy: 620, r: 2,   opacity: 0.25, delay: "1.2s", dur: "3.6s" },
      ].map((node, i) => (
        <circle
          key={i}
          cx={node.cx} cy={node.cy} r={node.r}
          fill="#1a6fff" opacity={node.opacity}
          style={{
            animation: `pulse-node ${node.dur} ease-in-out ${node.delay} infinite`,
          }}
        />
      ))}
    </svg>
  );
}

// ─── Feature Chip ──────────────────────────────────────────────────────
interface FeatureChipProps {
  icon: React.ReactNode;
  label: string;
  delay: string;
}

function FeatureChip({ icon, label, delay }: FeatureChipProps) {
  return (
    <div
      className="animate-in flex items-center gap-2.5 px-4 py-2.5 rounded-full"
      style={{
        animationDelay: delay,
        background: "rgba(26, 111, 255, 0.08)",
        border: "1px solid rgba(26, 111, 255, 0.18)",
      }}
    >
      <span style={{ color: "#00c8e8" }}>{icon}</span>
      <span
        className="text-sm font-medium tracking-wide"
        style={{ color: "rgba(238, 244, 255, 0.75)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Stat Badge ────────────────────────────────────────────────────────
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="text-xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: "#eef4ff" }}
      >
        {value}
      </div>
      <div className="text-xs mt-0.5" style={{ color: "rgba(120,152,184,0.8)" }}>
        {label}
      </div>
    </div>
  );
}

// ─── Auth Layout ───────────────────────────────────────────────────────
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-canvas)", fontFamily: "var(--font-body)" }}
    >
      {/* ──────────── LEFT BRAND PANEL ──────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col overflow-hidden"
        style={{ background: "var(--bg-panel)" }}
      >
        {/* Dot-grid overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-50" />

        {/* Bottom-left corner gradient bleed */}
        <div
          className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at bottom left, rgba(0,200,232,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Top-right gradient bleed */}
        <div
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(26,111,255,0.08) 0%, transparent 65%)",
          }}
        />

        {/* Border right */}
        <div
          className="absolute right-0 inset-y-0 w-px"
          style={{ background: "var(--border)" }}
        />

        {/* ── Logo ── */}
        <div className="relative z-10 px-12 pt-12">
          <div className="flex items-center gap-3 animate-in">
            {/* Logo mark */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "#1a6fff" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span
              className="text-xl font-bold tracking-widest uppercase"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "0.18em" }}
            >
              Bizmate
            </span>
          </div>
        </div>

        {/* ── Orbital Visual ── */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* Central glow orb */}
          <div
            className="absolute w-72 h-72 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(26,111,255,0.22) 0%, transparent 70%)",
              animation: "orb-breathe 5s ease-in-out infinite",
            }}
          />
          {/* Orbital SVG */}
          <div className="relative w-full h-full max-w-md max-h-96">
            <OrbitalBackground />
          </div>
        </div>

        {/* ── Copy block ── */}
        <div className="relative z-10 px-12 pb-6">
          <h1
            className="animate-in delay-100 text-4xl xl:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Intelligent Business
            <br />
            <span style={{ color: "#1a6fff" }}>at Scale.</span>
          </h1>
          <p
            className="animate-in delay-200 text-base leading-relaxed mb-8 max-w-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            One operating system for workflow automation, compliance management,
            and AI-powered advisory — built for enterprises that don&apos;t stand still.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            <FeatureChip
              delay="300ms"
              label="Workflow Automation"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h3l2-4 2 8 2-4h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <FeatureChip
              delay="400ms"
              label="Compliance Engine"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5L2 3.5v4c0 2.5 2.2 4.5 5 5 2.8-.5 5-2.5 5-5v-4L7 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            />
            <FeatureChip
              delay="500ms"
              label="AI Advisory"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 6c0-1.1.9-2 2-2s2 .9 2 2c0 .8-.4 1.4-1 1.7V9H7v-1.3c-.6-.3-2-1-2-1.7z" fill="currentColor" opacity="0.7" />
                  <circle cx="7" cy="11" r="0.8" fill="currentColor" opacity="0.7" />
                </svg>
              }
            />
          </div>

          {/* Stats row */}
          <div
            className="animate-in delay-600 flex items-center gap-8 pt-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <StatBadge value="12k+" label="Businesses" />
            <div className="w-px h-8" style={{ background: "var(--border)" }} />
            <StatBadge value="99.9%" label="Uptime SLA" />
            <div className="w-px h-8" style={{ background: "var(--border)" }} />
            <StatBadge value="SOC 2" label="Certified" />
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-10" />
      </div>

      {/* ──────────── RIGHT FORM PANEL ──────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 py-12 relative"
        style={{ background: "var(--bg-canvas)" }}
      >
        {/* Mobile logo — only visible below lg */}
        <div className="lg:hidden flex items-center gap-3 mb-12 animate-in">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#1a6fff" }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
            </svg>
          </div>
          <span
            className="text-lg font-bold tracking-widest uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "0.18em" }}
          >
            Bizmate
          </span>
        </div>

        {/* Form slot */}
        <div className="w-full max-w-[400px]">{children}</div>

        {/* Footer */}
        <p
          className="absolute bottom-8 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          © {new Date().getFullYear()} Bizmate. All rights reserved.
        </p>
      </div>
    </div>
  );
}
