"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ADMIN_BASE_PATH } from "@/constants/admin";
import { NAV_FLAT } from "@/constants/nav";
import { useAuth } from "@/hooks/useAuth";
import NavIcon from "@/components/ui/NavIcon";
import { cn } from "@/lib/cn";

// ─── Breadcrumb logic ─────────────────────────────────────────────────
function useBreadcrumb() {
  const pathname = usePathname();
  const crumbs: { label: string; href: string }[] = [
    { label: "Admin", href: ADMIN_BASE_PATH },
  ];

  if (!pathname.startsWith(ADMIN_BASE_PATH)) {
    return crumbs;
  }

  const rest = pathname.slice(ADMIN_BASE_PATH.length) || "/";
  const segments = rest.split("/").filter(Boolean);

  if (segments.length === 0) {
    crumbs.push({ label: "Dashboard", href: ADMIN_BASE_PATH });
    return crumbs;
  }

  let path = ADMIN_BASE_PATH;
  segments.forEach((seg) => {
    path += `/${seg}`;
    const nav = NAV_FLAT.find((n) => n.href === path);
    crumbs.push({ label: nav?.label ?? capitalize(seg), href: path });
  });

  return crumbs;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

// ─── Notification Dropdown ────────────────────────────────────────────
const MOCK_ALERTS = [
  {
    id: 1,
    type: "alert",
    title: "AI credit limit warning",
    desc: "Business #2041 at 92% usage",
    time: "2m ago",
  },
  {
    id: 2,
    type: "info",
    title: "New support ticket",
    desc: "User reported invoice sync error",
    time: "14m ago",
  },
  {
    id: 3,
    type: "alert",
    title: "Failed workflow process",
    desc: "Document generation timeout × 3",
    time: "1h ago",
  },
];

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden shadow-2xl"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
        >
          Notifications
        </span>
        <button
          className="text-xs"
          style={{ color: "#1a6fff" }}
          onClick={onClose}
        >
          Mark all read
        </button>
      </div>
      {/* Items */}
      {MOCK_ALERTS.map((a) => (
        <div
          key={a.id}
          className="flex gap-3 px-4 py-3 cursor-pointer"
          style={{ borderBottom: "1px solid var(--border)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span
            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
            style={{
              background: a.type === "alert" ? "#ff4560" : "#00c8e8",
              boxShadow: `0 0 6px ${a.type === "alert" ? "#ff4560" : "#00c8e8"}`,
            }}
          />
          <div>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {a.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {a.desc}
            </p>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
              {a.time}
            </p>
          </div>
        </div>
      ))}
      {/* Footer */}
      <Link
        href={`${ADMIN_BASE_PATH}/notifications`}
        onClick={onClose}
        className="flex items-center justify-center py-3 text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        View all notifications →
      </Link>
    </div>
  );
}

// ─── User Menu Dropdown ───────────────────────────────────────────────
function UserMenu({ user, onClose }: { user: { name: string; role: string; email: string }; onClose: () => void }) {
  const { signOut } = useAuth();
  return (
    <div
      className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden shadow-2xl"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        zIndex: 100,
      }}
    >
      {/* User info */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {user.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {user.email}
        </p>
        <span
          className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{
            background: "rgba(26,111,255,0.12)",
            color: "#6699ff",
            border: "1px solid rgba(26,111,255,0.2)",
          }}
        >
          {user.role.replace("_", " ").toUpperCase()}
        </span>
      </div>
      {/* Actions */}
      {[
        { label: "Profile Settings", href: `${ADMIN_BASE_PATH}/settings` },
        { label: "Admin Roles", href: `${ADMIN_BASE_PATH}/roles` },
      ].map((m) => (
        <Link
          key={m.href}
          href={m.href}
          onClick={onClose}
          className="flex items-center px-4 py-2.5 text-sm transition-all"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          {m.label}
        </Link>
      ))}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => { signOut(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-all"
          style={{ color: "#ff6b80" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,69,96,0.07)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <NavIcon name="logout" size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────
export default function Header() {
  const crumbs = useBreadcrumb();
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const notifsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node))
        setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setShowUser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayUser = user ?? {
    name: "Admin User",
    role: "super_admin",
    email: "admin@bizmate.io",
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between gap-4 border-b border-[rgba(26,111,255,0.1)] bg-[var(--bg-panel)]/95 px-4 backdrop-blur-md sm:px-6"
    >
      {/* ── Left: Breadcrumb ── */}
      <nav
        className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden"
        aria-label="Breadcrumb"
      >
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            {i > 0 && (
              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                /
              </span>
            )}
            {i === crumbs.length - 1 ? (
              <span
                className="truncate text-sm font-medium text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* ── Center: Search ── */}
      <div className="relative mx-4 hidden max-w-md flex-1 items-center md:flex">
        <NavIcon
          name="search"
          size={15}
          style={{
            position: "absolute",
            left: "12px",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        />
        <input
          type="search"
          placeholder="Search users, businesses, modules…"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-9 pr-14 text-sm text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-muted)]"
          style={{
            fontFamily: "var(--font-body)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid var(--border-focus)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-dim)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <kbd
          className="hidden lg:flex items-center gap-1 px-1.5 rounded text-[10px] select-none"
          style={{
            position: "absolute",
            right: "10px",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex flex-shrink-0 items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => {
              setShowNotifs((v) => !v);
              setShowUser(false);
            }}
            className={cn(
              "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all"
            )}
            style={{
              background: showNotifs ? "rgba(26,111,255,0.1)" : "transparent",
              border: `1px solid ${showNotifs ? "rgba(26,111,255,0.25)" : "transparent"}`,
              color: showNotifs ? "#1a6fff" : "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              if (!showNotifs) {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "var(--text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!showNotifs) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
              }
            }}
            aria-label="Notifications"
          >
            <NavIcon name="bell" size={17} />
            {/* Alert dot */}
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{
                background: "#ff4560",
                border: "1.5px solid var(--bg-panel)",
                boxShadow: "0 0 6px #ff4560",
              }}
            />
          </button>
          {showNotifs && (
            <NotificationDropdown onClose={() => setShowNotifs(false)} />
          )}
        </div>

        {/* Divider */}
        <div
          className="w-px h-6 mx-1"
          style={{ background: "var(--border)" }}
        />

        {/* User Avatar */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUser((v) => !v);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all"
            style={{
              border: `1px solid ${showUser ? "rgba(26,111,255,0.25)" : "transparent"}`,
              background: showUser ? "rgba(26,111,255,0.08)" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!showUser) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              if (!showUser) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #1a6fff 0%, #00c8e8 100%)",
                color: "#fff",
                fontFamily: "var(--font-display)",
              }}
            >
              {displayUser.name
                .split(" ")
                .map((part: string) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col items-start">
              <span
                className="text-xs font-semibold leading-tight"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
              >
                {displayUser.name}
              </span>
              <span
                className="text-[10px] leading-tight capitalize"
                style={{ color: "var(--text-muted)" }}
              >
                {displayUser.role.replace("_", " ")}
              </span>
            </div>
            <NavIcon
              name="chevronDown"
              size={13}
              style={{ color: "var(--text-muted)", marginLeft: "2px" }}
            />
          </button>
          {showUser && (
            <UserMenu
              user={displayUser}
              onClose={() => setShowUser(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}