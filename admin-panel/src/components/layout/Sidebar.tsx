"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/constants/admin";
import { NAV_GROUPS } from "@/constants/nav";
import { useUIStore } from "@/store/ui.store";
import NavIcon from "@/components/ui/NavIcon";
import { cn } from "@/lib/cn";

// ─── Badge ────────────────────────────────────────────────────────────
function Badge({
  value,
  variant = "default",
  collapsed,
}: {
  value: string | number;
  variant?: "default" | "alert" | "info";
  collapsed: boolean;
}) {
  const colors = {
    default: { bg: "rgba(26,111,255,0.15)", color: "#6699ff", border: "rgba(26,111,255,0.25)" },
    alert: { bg: "rgba(255,69,96,0.13)", color: "#ff6b80", border: "rgba(255,69,96,0.3)" },
    info: { bg: "rgba(0,200,232,0.13)", color: "#00c8e8", border: "rgba(0,200,232,0.3)" },
  };
  const c = colors[variant];

  if (collapsed) {
    return (
      <span
        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
        style={{ background: c.color }}
      />
    );
  }

  return (
    <span
      className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none"
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontFamily: "var(--font-body)",
      }}
    >
      {value}
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const isActive = (href: string) => {
    if (href === ADMIN_BASE_PATH) {
      return pathname === ADMIN_BASE_PATH || pathname === `${ADMIN_BASE_PATH}/`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className="relative flex h-screen flex-shrink-0 flex-col border-r border-[rgba(26,111,255,0.08)] bg-[var(--bg-panel)] shadow-[4px_0_32px_rgba(0,0,0,0.2)] transition-[width] duration-300 ease-in-out sticky top-0"
      style={{
        width: sidebarCollapsed ? "68px" : "260px",
        zIndex: 40,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-[#1a6fff]/25 via-transparent to-[#00c8e8]/15"
        aria-hidden
      />

      {/* ── Logo ── */}
      <div
        className="flex h-16 flex-shrink-0 items-center gap-3 overflow-hidden border-b border-[var(--border)] px-4"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#1a6fff]">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
            <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
            <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
            <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
            <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
          </svg>
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <span className="font-display block truncate text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
              BIZMATE
            </span>
            <span className="mt-0.5 block truncate text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Admin Console
            </span>
          </div>
        )}
      </div>

      {/* ── Nav Groups ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-5 scrollbar-none">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            {/* Group label */}
            {!sidebarCollapsed && (
              <p
                className="px-4 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)", letterSpacing: "0.14em" }}
              >
                {group.group}
              </p>
            )}
            {sidebarCollapsed && (
              <div
                className="mx-auto mb-1.5"
                style={{
                  width: "28px",
                  height: "1px",
                  background: "var(--border)",
                }}
              />
            )}

            {/* Nav items */}
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group",
                        "text-sm font-medium select-none"
                      )}
                      style={{
                        color: active ? "#eef4ff" : "var(--text-secondary)",
                        background: active
                          ? "rgba(26,111,255,0.12)"
                          : "transparent",
                        border: `1px solid ${active ? "rgba(26,111,255,0.2)" : "transparent"}`,
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.04)";
                          e.currentTarget.style.color = "#c8d8f0";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "var(--text-secondary)";
                        }
                      }}
                    >
                      {/* Active left-bar indicator */}
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                          style={{ background: "#1a6fff" }}
                        />
                      )}

                      {/* Icon */}
                      <NavIcon
                        name={item.icon}
                        size={18}
                        style={{
                          color: active ? "#1a6fff" : "currentColor",
                          flexShrink: 0,
                        }}
                      />

                      {/* Label */}
                      {!sidebarCollapsed && (
                        <span
                          className="truncate"
                          style={{ fontFamily: "var(--font-body)", fontSize: "13px" }}
                        >
                          {item.label}
                        </span>
                      )}

                      {/* Badge */}
                      {item.badge !== undefined &&
                        (sidebarCollapsed ? (
                          <Badge
                            value={item.badge}
                            variant={item.badgeVariant}
                            collapsed
                          />
                        ) : (
                          <Badge
                            value={item.badge}
                            variant={item.badgeVariant}
                            collapsed={false}
                          />
                        ))}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Collapse Toggle ── */}
      <div
        className="flex-shrink-0 px-2 py-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={toggleSidebar}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-sm transition-all duration-150"
          )}
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <NavIcon
            name={sidebarCollapsed ? "expand" : "collapse"}
            size={17}
            style={{ flexShrink: 0 }}
          />
          {!sidebarCollapsed && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px" }}>
              Collapse
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}