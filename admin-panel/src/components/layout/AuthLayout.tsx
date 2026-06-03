"use client";

import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-canvas)", fontFamily: "var(--font-body)" }}
    >
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-10 relative overflow-hidden"
        style={{ background: "var(--accent)" }}
      >
        {/* Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)",
        }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full" style={{
          background: "rgba(255,255,255,0.06)",
          transform: "translate(30%, 30%)",
        }} />
        <div className="absolute top-1/4 -left-16 w-48 h-48 rounded-full" style={{
          background: "rgba(255,255,255,0.05)",
        }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.95" />
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.95" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-sm" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>BizMate AI</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>Admin Panel</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Your platform.<br />Your control.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.6 }}>
            Manage users, monitor AI usage, control subscriptions and configure the entire BizMate platform from one place.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Businesses",   value: "1,840+" },
              { label: "Users",        value: "14k+"  },
              { label: "AI Tokens/mo", value: "2.7M"  },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.12)" }}>
                <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} Async Innovations · BizMate AI
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.95" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.95" />
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>BizMate AI Admin</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
