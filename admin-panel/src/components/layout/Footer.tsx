"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", height: 44,
      borderTop: "1.5px solid var(--border)", background: "var(--bg-panel)",
      gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.95"/>
            <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.55"/>
            <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.55"/>
            <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.95"/>
          </svg>
        </div>
        <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          © {new Date().getFullYear()} BizMate AI · Async Innovations
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }}/>
          <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>All systems operational</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[{ label: "Docs", href: "#" }, { label: "Support", href: "/admin/support" }, { label: "Privacy", href: "#" }].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: 11.5, color: "var(--text-muted)",
              textDecoration: "none", transition: "color 0.12s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              {l.label}
            </Link>
          ))}
        </div>
        <span style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 100,
          background: "var(--bg-raised)", color: "var(--text-muted)",
          border: "1.5px solid var(--border)", fontFamily: "var(--font-body)" }}>
          v1.0.0
        </span>
      </div>
    </footer>
  );
}
