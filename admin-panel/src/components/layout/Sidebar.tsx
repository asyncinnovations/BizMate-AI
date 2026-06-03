"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/constants/nav";
import { useUIStore } from "@/store/ui.store";
import NavIcon from "@/components/ui/NavIcon";

/* ─── Nav Badge ───────────────────────────────────────────────── */
function NavBadge({ value, variant = "default", dot }: {
  value: string | number;
  variant?: "default" | "alert" | "info" | "warning";
  dot?: boolean;
}) {
  const map = {
    default: { bg: "rgba(59,130,246,0.12)", color: "#3B82F6" },
    alert:   { bg: "rgba(239,68,68,0.12)",  color: "#EF4444" },
    info:    { bg: "rgba(6,182,212,0.12)",   color: "#06B6D4" },
    warning: { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B" },
  };
  const c = map[variant];
  if (dot) return <span style={{ width:6, height:6, borderRadius:"50%", background:c.color, flexShrink:0 }} />;
  return (
    <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, fontFamily:"var(--font-body)", lineHeight:1.2,
      padding:"2px 6px", borderRadius:100, background:c.bg, color:c.color, flexShrink:0 }}>
      {value}
    </span>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const isActive = (href: string) =>
    href === "/admin" ? (pathname === "/admin" || pathname === "/") : pathname.startsWith(href);

  const W = sidebarCollapsed ? "var(--sidebar-sm)" : "var(--sidebar-w)";

  return (
    <aside style={{
      width: W, minWidth: W, maxWidth: W,
      height: "100vh", position: "sticky", top: 0,
      background: "var(--bg-panel)",
      borderRight: "1.5px solid var(--border)",
      display: "flex", flexDirection: "column",
      transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1), max-width 0.25s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden", flexShrink: 0, zIndex: 40,
    }}>

      {/* ── Logo ── */}
      <div style={{
        height: "var(--header-h)", display: "flex", alignItems: "center",
        padding: "0 14px", borderBottom: "1.5px solid var(--border)",
        gap: 10, overflow: "hidden", flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "0 2px 8px rgba(232,105,10,0.30)",
        }}>
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.8" fill="white" opacity="0.95"/>
            <rect x="10" y="2" width="6" height="6" rx="1.8" fill="white" opacity="0.55"/>
            <rect x="2" y="10" width="6" height="6" rx="1.8" fill="white" opacity="0.55"/>
            <rect x="10" y="10" width="6" height="6" rx="1.8" fill="white" opacity="0.95"/>
          </svg>
        </div>
        {!sidebarCollapsed && (
          <div style={{ overflow: "hidden", lineHeight: 1.2 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
              color: "var(--text-primary)", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
              BizMate AI
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10.5, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              Admin Panel
            </div>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "10px 0" }}
        className="scrollbar-none">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} style={{ marginBottom: 4 }}>
            {/* Group header */}
            {sidebarCollapsed
              ? <div style={{ height: 1, background: "var(--border)", margin: "8px 14px" }} />
              : <div style={{ padding: "6px 16px 4px", fontSize: 9.5, fontWeight: 700,
                  color: "var(--text-faint)", letterSpacing: "0.12em", textTransform: "uppercase",
                  fontFamily: "var(--font-body)" }}>
                  {group.group}
                </div>
            }

            {/* Items — plain div loop, no ul/li bullets */}
            <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 1 }}>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.key} href={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    style={{
                      display: "flex", alignItems: "center",
                      gap: 9, padding: "7px 10px",
                      borderRadius: 8, position: "relative",
                      textDecoration: "none", userSelect: "none",
                      background: active ? "var(--accent-dim)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                      border: `1.5px solid ${active ? "var(--accent-border)" : "transparent"}`,
                      fontFamily: "var(--font-body)", fontSize: 13, fontWeight: active ? 600 : 500,
                      transition: "background 0.12s, color 0.12s, border-color 0.12s",
                      whiteSpace: "nowrap", overflow: "hidden",
                      minWidth: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "var(--bg-hover)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }
                    }}
                  >
                    {/* Active pill */}
                    {active && (
                      <span style={{
                        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                        width: 3, height: 18, borderRadius: "0 3px 3px 0",
                        background: "var(--accent)",
                      }} />
                    )}

                    <NavIcon name={item.icon} size={15}
                      style={{ flexShrink: 0, color: "currentColor", opacity: active ? 1 : 0.75 }} />

                    {!sidebarCollapsed && (
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.label}
                      </span>
                    )}

                    {item.badge !== undefined && (
                      <NavBadge value={item.badge} variant={item.badgeVariant}
                        dot={sidebarCollapsed} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Collapse toggle ── */}
      <div style={{ borderTop: "1.5px solid var(--border)", padding: "8px" }}>
        <button onClick={toggleSidebar}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 9,
            padding: "7px 10px", borderRadius: 8, border: "none", background: "transparent",
            cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
            color: "var(--text-muted)", transition: "background 0.12s, color 0.12s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          title={sidebarCollapsed ? "Expand" : "Collapse"}
        >
          <NavIcon name={sidebarCollapsed ? "expand" : "collapse"} size={15}
            style={{ flexShrink: 0, opacity: 0.65 }} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
