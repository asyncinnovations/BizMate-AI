"use client";
// src/components/legal-modal/LegalDocumentModal.tsx
// Reusable modal that renders any legal document from legalContent.ts.
// Features: section TOC sidebar, smooth scroll, print/download, last-updated badge.

import React, { useEffect, useRef, useState } from "react";
import { X, FileText, Download, Printer, ChevronRight, Calendar, Shield } from "lucide-react";
import { type LegalDocument } from "./legalContent";

interface Props {
  document: LegalDocument | null;
  onClose:  () => void;
}

export const LegalDocumentModal: React.FC<Props> = ({ document: doc, onClose }) => {
  const contentRef  = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = doc ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [doc]);

  // Track which section is in view
  useEffect(() => {
    if (!contentRef.current || !doc) return;
    const sections = contentRef.current.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveIdx(Number(visible.target.getAttribute("data-section")));
      },
      { root: contentRef.current, threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [doc]);

  if (!doc) return null;

  const scrollToSection = (idx: number) => {
    const el = contentRef.current?.querySelector(`[data-section="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrint = () => window.print();

  // Build plain-text for download
  const handleDownload = () => {
    const text = [
      doc.title,
      `Version: ${doc.version} | Effective: ${doc.effectiveDate} | Last updated: ${doc.lastUpdated}`,
      "",
      ...doc.sections.flatMap((s) => [s.title, s.content, ""]),
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: `${doc.id}.txt` });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
    >
      <div
        className="w-full max-w-4xl bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
      >

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 px-7 py-5 border-b border-border bg-bg-base flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-heading leading-tight">{doc.title}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                  <Calendar className="w-3 h-3" />
                  Effective {doc.effectiveDate}
                </span>
                <span className="text-text-muted text-xs">·</span>
                <span className="text-xs text-text-muted">Last updated {doc.lastUpdated}</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-brand-light text-secondary rounded-full border border-border">
                  v{doc.version}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-bg-base transition-colors"
              title="Download as text"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-bg-base transition-colors"
              title="Print"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text-heading hover:bg-bg-base transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Body: sidebar TOC + scrollable content ───────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar TOC */}
          <div className="w-52 flex-shrink-0 border-r border-border bg-bg-base overflow-y-auto p-4 hidden md:block">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Contents</p>
            <nav className="space-y-0.5">
              {doc.sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSection(idx)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all leading-snug ${
                    activeIdx === idx
                      ? "bg-brand-light text-secondary font-semibold"
                      : "text-text-secondary hover:bg-surface hover:text-text-heading"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Document content */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto px-7 py-6"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="max-w-2xl mx-auto space-y-8">
              {doc.sections.map((section, idx) => (
                <div key={idx} data-section={idx} className="scroll-mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-brand-light flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-3 h-3 text-secondary" />
                    </div>
                    <h3 className="text-sm font-bold text-text-heading">{section.title}</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-7 pl-7">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Footer note */}
              <div className="pt-6 border-t border-border">
                <p className="text-xs text-text-muted text-center leading-relaxed">
                  This document is effective as of {doc.effectiveDate}. For questions, contact{" "}
                  <a href="mailto:legal@bizmate.ai" className="text-secondary hover:underline font-medium">
                    legal@bizmate.ai
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="px-7 py-4 border-t border-border bg-bg-base flex-shrink-0 flex items-center justify-between">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Async Innovations FZ-LLC · BizMate AI · All rights reserved
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-secondary text-on-brand rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`@media print { body * { visibility: hidden; } .modal-print, .modal-print * { visibility: visible; } }`}</style>
    </div>
  );
};

export default LegalDocumentModal;
