import React from "react";
import Link from "next/link";
import packageJson from "../../../package.json";
import { adminPath } from "@/constants/admin";

const FOOTER_LINKS = [
  { label: "Documentation", href: "https://bizmate.io", external: true },
  { label: "Support", href: adminPath("/support"), external: false },
  { label: "Privacy", href: "https://bizmate.io/privacy", external: true },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 border-t border-[rgba(26,111,255,0.08)] bg-[var(--bg-panel)]/90 backdrop-blur-sm">
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-6">
        {/* Brand + legal */}
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#1a6fff] shadow-[0_0_16px_rgba(26,111,255,0.35)]">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none" aria-hidden>
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.55" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]">
                BizMate Admin
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--text-muted)]">
                Intelligent business operations, one control plane.
              </p>
            </div>
          </div>
          <span className="hidden h-8 w-px bg-[var(--border)] sm:block" aria-hidden />
          <span className="text-[11px] text-[var(--text-muted)]">
            © {year} BizMate. All rights reserved.
          </span>
        </div>

        {/* Status + links + version */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2 rounded-full border border-[rgba(0,201,125,0.25)] bg-[rgba(0,201,125,0.06)] px-2.5 py-1">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#00c97d]"
              style={{ boxShadow: "0 0 8px #00c97d" }}
            />
            <span className="text-[11px] font-medium text-[#8aa4c4]">
              All systems operational
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-4" aria-label="Footer links">
            {FOOTER_LINKS.map((l) =>
              l.external ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[11px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          <span
            className="rounded-full border border-[var(--border)] bg-[var(--bg-raised)] px-2.5 py-0.5 text-[10px] font-medium tabular-nums text-[var(--text-muted)]"
            title="App version"
          >
            v{packageJson.version}
          </span>
        </div>
      </div>
    </footer>
  );
}
