import React from "react";

interface ModulePlaceholderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export function ModulePlaceholder({
  title,
  subtitle = "Wire this view to your APIs and policies. The layout, header, and sidebar are ready for your team to ship features.",
  eyebrow = "Module",
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
        <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full bg-[#1a6fff]/10 blur-3xl" />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5eb0ff]">
          {eyebrow}
        </p>
        <h1 className="font-display relative mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
          {title}
        </h1>
        <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          {subtitle}
        </p>
      </section>
    </div>
  );
}
