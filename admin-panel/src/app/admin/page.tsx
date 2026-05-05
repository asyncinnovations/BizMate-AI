import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "BizMate platform admin overview",
};

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#1a6fff]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-[#00c8e8]/8 blur-3xl" />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5eb0ff]">
          Overview
        </p>
        <h1 className="font-display relative mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
          Welcome to BizMate Admin
        </h1>
        <p className="relative mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Run workflows, billing, and AI from one place. Open modules from the sidebar as your team ships them.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Live operations",
            desc: "Track alerts, tickets, and system signals from Notifications & Support.",
            accent: "#00c97d",
          },
          {
            title: "Revenue & plans",
            desc: "Subscriptions & Billing centralizes MRR, invoices, and plan changes.",
            accent: "#1a6fff",
          },
          {
            title: "AI at scale",
            desc: "Tune models and usage limits from the AI control panel when enabled.",
            accent: "#00c8e8",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-5 transition-colors hover:border-[rgba(26,111,255,0.22)]"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background: card.accent,
                boxShadow: `0 0 12px ${card.accent}`,
              }}
            />
            <h2 className="font-display mt-3 text-lg font-semibold text-[var(--text-primary)]">
              {card.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
