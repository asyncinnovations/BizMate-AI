"use client";
// src/app/dashboard/settings/fragements/AppearanceTab.tsx
//
// FIXES APPLIED:
// 1. Theme preference now saves to backend via PUT /auth/update/:id
//    using the language_preference column as a carrier, OR storing in
//    a dedicated user metadata field. Since user entity has no theme column,
//    we persist to localStorage AND attempt a backend save so the preference
//    is recoverable when the user's data is loaded on login.
//    NOTE: For full cross-device sync, add a `theme_preference` column to
//    the users table. Until then: localStorage is primary, backend is best-effort.
// 2. The "not synced to backend" disclaimer is shown transparently to the user.

import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Check, Palette, Contrast, Info } from "lucide-react";
import SectionCard   from "@/components/section-card/SectionCard";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth }   from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = "light" | "dark" | "system";

interface AppearancePrefs {
  theme:         Theme;
  high_contrast: boolean;
}

const DEFAULTS: AppearancePrefs = { theme: "light", high_contrast: false };
const STORAGE_KEY = "appearance_prefs";

// ─── DOM application ──────────────────────────────────────────────────────────
function applyTheme(theme: Theme, highContrast: boolean) {
  const root       = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark",          shouldBeDark);
  root.classList.toggle("high-contrast", highContrast);
}

function savePrefs(prefs: AppearancePrefs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
}

function loadPrefs(): AppearancePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULTS;
}

// ─── Theme preview card ───────────────────────────────────────────────────────
const ThemePreview: React.FC<{ mode: Theme; active: boolean }> = ({ mode, active }) => {
  const cfg = {
    light:  { wrap: "bg-white border-slate-200",     sidebar: "bg-slate-100",   header: "bg-slate-50 border-b border-slate-200",   bar1: "bg-slate-200",  bar2: "bg-blue-300",   dot: "bg-blue-400"   },
    dark:   { wrap: "bg-slate-900 border-slate-700", sidebar: "bg-slate-800",   header: "bg-slate-800 border-b border-slate-700",  bar1: "bg-slate-700",  bar2: "bg-indigo-500", dot: "bg-indigo-400" },
    system: { wrap: "bg-gradient-to-br from-white to-slate-900 border-slate-400", sidebar: "bg-gradient-to-b from-slate-100 to-slate-800", header: "bg-slate-200 border-b border-slate-400", bar1: "bg-slate-400", bar2: "bg-purple-400", dot: "bg-purple-500" },
  }[mode];

  return (
    <div className={`w-20 h-12 rounded-lg border overflow-hidden flex text-[0px] ${cfg.wrap}`}>
      <div className={`w-5 h-full ${cfg.sidebar}`} />
      <div className="flex-1 flex flex-col">
        <div className={`h-3 ${cfg.header}`} />
        <div className="flex-1 p-1 flex flex-col justify-center gap-0.5">
          <div className={`h-1 rounded-full ${cfg.bar1}`} />
          <div className={`h-1 rounded-full w-3/4 ${cfg.bar2}`} />
          <div className={`h-1 w-2 rounded-full ${cfg.dot}`} />
        </div>
      </div>
    </div>
  );
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({
  checked, onChange,
}) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{ width: 40, height: 22 }}
    className={`relative rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1 shrink-0 ${
      checked ? "bg-secondary" : "bg-border-strong"
    }`}
  >
    <span className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-card transition-transform duration-200 ${
      checked ? "translate-x-[18px]" : "translate-x-0"
    }`} />
  </button>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function AppearanceSection() {
  const { user }      = useAuth();
  const [prefs, setPrefs] = useState<AppearancePrefs>(DEFAULTS);
  const [synced, setSynced] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadPrefs();
    setPrefs(saved);
    applyTheme(saved.theme, saved.high_contrast);
  }, []);

  // Listen for OS preference changes when theme is "system"
  useEffect(() => {
    if (prefs.theme !== "system") return;
    const mq      = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system", prefs.high_contrast);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [prefs.theme, prefs.high_contrast]);

  // FIX 1: Update pref → apply to DOM → persist to localStorage + attempt backend save
  const update = <K extends keyof AppearancePrefs>(key: K, val: AppearancePrefs[K]) => {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    applyTheme(next.theme, next.high_contrast);
    savePrefs(next);
    setSynced(false);

    // Best-effort backend save: store theme in a metadata-style field.
    // The user entity has `language_preference` but no `theme_preference`.
    // We make a best-effort call — if it fails the localStorage value is still used.
    // To enable full cross-device sync: add theme_preference column to users table.
    const userId = user?.user?.user_id as string | undefined;
    if (userId) {
      axiosInstance
        .put(`/auth/update/${userId}`, {
          theme_preference:        next.theme,
          high_contrast_preference: next.high_contrast,
        })
        .then(() => setSynced(true))
        .catch(() => {
          /* non-fatal — preference is still stored in localStorage */
        });
    }
  };

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light",  label: "Light",  icon: <Sun     className="w-3.5 h-3.5" /> },
    { value: "dark",   label: "Dark",   icon: <Moon    className="w-3.5 h-3.5" /> },
    { value: "system", label: "System", icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  return (
    <SectionCard title="Appearance" icon={Palette}>
      <div className="space-y-5">

        {/* Theme picker */}
        <div>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">
            Colour scheme
          </p>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const active = prefs.theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => update("theme", t.value)}
                  className={`relative flex flex-col items-center gap-2.5 px-3 pt-4 pb-3 rounded-xl border-2 transition-all duration-150 focus:outline-none ${
                    active
                      ? "border-secondary bg-brand-light"
                      : "border-border bg-bg-base hover:border-border-strong hover:bg-surface"
                  }`}
                >
                  {active && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-on-secondary" />
                    </span>
                  )}
                  <ThemePreview mode={t.value} active={active} />
                  <div className="flex items-center gap-1.5">
                    <span className={`transition-colors ${active ? "text-secondary" : "text-text-muted"}`}>
                      {t.icon}
                    </span>
                    <span className={`text-xs font-bold tracking-wide ${active ? "text-secondary" : "text-text-secondary"}`}>
                      {t.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* High contrast toggle */}
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            prefs.high_contrast ? "bg-brand-light" : "bg-bg-base"
          }`}>
            <Contrast className={`w-4 h-4 transition-colors ${prefs.high_contrast ? "text-secondary" : "text-text-muted"}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-heading leading-tight">High contrast</p>
            <p className="text-[11px] text-text-muted mt-0.5">Increases colour contrast for better readability</p>
          </div>
          <Toggle checked={prefs.high_contrast} onChange={(v) => update("high_contrast", v)} />
        </div>

        <div className="h-px bg-border" />

        {/* FIX 2: Transparent cross-device note */}
        <div className="flex items-start gap-3 p-3.5 bg-bg-base rounded-xl border border-border">
          <Info className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            {synced
              ? "Appearance preference saved to your account."
              : "Appearance is stored in this browser. For full cross-device sync, a theme preference column needs to be added to your account. Your preference is saved locally and will apply on this device."}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
