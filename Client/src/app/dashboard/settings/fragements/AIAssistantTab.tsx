// app/settings/components/AIAssistantTab.tsx
"use client";

import React, { useState } from "react";
import { Globe, Bot, Database, Shield } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const AIAssistantTab: React.FC = () => {
  const [smartSuggestions, setSmartSuggestions] = useState(true);
  const [activeTone, setActiveTone] = useState("Friendly");

  return (
    <div className="space-y-6">
      {/* ── Language Settings ─────────────────────────── */}
      <SectionCard title="Language Settings" icon={Globe}>
        <div>
          <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
            Default AI Language
          </label>
          <select className="w-full px-3 py-2.5 bg-bg-base border border-border rounded-lg text-sm text-text-heading focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all">
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="ur">Urdu</option>
          </select>
        </div>
      </SectionCard>

      {/* ── AI Personality ────────────────────────────── */}
      <SectionCard title="AI Personality" icon={Bot}>
        <div>
          <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-3">
            AI Tone
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Formal", "Friendly", "Neutral"].map((tone) => {
              const active = tone === activeTone;
              return (
                <button
                  key={tone}
                  onClick={() => setActiveTone(tone)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                    active
                      ? "border-secondary bg-brand text-on-brand shadow-card"
                      : "border-border bg-bg-base text-text-secondary hover:border-border-strong hover:bg-surface"
                  }`}
                >
                  {tone}
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* ── Smart Features ────────────────────────────── */}
      <SectionCard title="Smart Features" icon={Database}>
        <div className="space-y-0 -mt-1">
          <div className="flex items-center justify-between py-3.5 border-b border-border">
            <div>
              <p className="text-sm font-semibold text-text-heading">
                Enable Smart Suggestions
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                AI provides proactive business suggestions
              </p>
            </div>
            <ToggleSwitch
              enabled={smartSuggestions}
              onChange={() => setSmartSuggestions(!smartSuggestions)}
            />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-text-heading">
                Auto-Complete Forms
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                AI helps fill out invoices and documents
              </p>
            </div>
            <ToggleSwitch enabled={true} onChange={() => {}} />
          </div>
        </div>
      </SectionCard>

      {/* ── Data Privacy ──────────────────────────────── */}
      <SectionCard title="Data Privacy" icon={Shield}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-heading">
                Allow Training on Your Data
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Help improve AI by analyzing your chat interactions
              </p>
            </div>
            <ToggleSwitch enabled={false} onChange={() => {}} />
          </div>
          <div className="p-4 bg-bg-base border border-border rounded-xl">
            <p className="text-xs text-text-secondary leading-relaxed">
              Your business data is encrypted and secure. Disabling training
              means AI won&apos;t learn from your specific interactions, but
              core features remain functional.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default AIAssistantTab;
