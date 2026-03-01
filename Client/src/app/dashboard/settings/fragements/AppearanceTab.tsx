"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Check, Palette, Contrast } from "lucide-react";
import SectionCard from "@/components/section-card/SectionCard";

// ─── Types ────────────────────────────────────────────────
type Theme = "light" | "dark" | "system";

interface AppearancePrefs {
  theme: Theme;
  high_contrast: boolean;
}

const DEFAULTS: AppearancePrefs = {
  theme: "light",
  high_contrast: false,
};

const STORAGE_KEY = "appearance_prefs";

// ─── Theme application ────────────────────────────────────
function applyTheme(theme: Theme, highContrast: boolean) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark);

  root.classList.toggle("dark", shouldBeDark);
  root.classList.toggle("high-contrast", highContrast);
}

// ─── Persist + read from localStorage ────────────────────
function savePrefs(prefs: AppearancePrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function loadPrefs(): AppearancePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

// ─── Mini UI preview ──────────────────────────────────────
const ThemePreview: React.FC<{ mode: Theme; active: boolean }> = ({
  mode,
  active,
}) => {
  const cfg = {
    light: {
      wrap: "bg-white border-slate-200",
      sidebar: "bg-slate-100",
      header: "bg-slate-50 border-b border-slate-200",
      bar1: "bg-slate-200",
      bar2: "bg-blue-300",
      dot: "bg-blue-400",
    },
    dark: {
      wrap: "bg-slate-800 border-slate-700",
      sidebar: "bg-slate-900",
      header: "bg-slate-700 border-b border-slate-600",
      bar1: "bg-slate-600",
      bar2: "bg-blue-500",
      dot: "bg-blue-400",
    },
    system: {
      wrap: "bg-gradient-to-br from-white to-slate-800 border-slate-400",
      sidebar: "bg-gradient-to-b from-slate-100 to-slate-900",
      header:
        "bg-gradient-to-r from-slate-50 to-slate-700 border-b border-slate-400",
      bar1: "bg-gradient-to-r from-slate-200 to-slate-600",
      bar2: "bg-blue-400",
      dot: "bg-blue-400",
    },
  }[mode];

  return (
    <div
      className={`w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
        active ? "border-secondary shadow-card" : "border-border"
      } ${cfg.wrap} flex`}
    >
      <div className={`w-3.5 h-full shrink-0 ${cfg.sidebar}`} />
      <div className="flex-1 flex flex-col">
        <div className={`h-2.5 w-full shrink-0 ${cfg.header}`} />
        <div className="flex-1 flex flex-col justify-center gap-1 px-1.5 py-1">
          <div className={`h-1 w-full rounded-full ${cfg.bar1}`} />
          <div className={`h-1 w-2/3 rounded-full ${cfg.bar2}`} />
          <div className="flex gap-1 mt-0.5">
            <div className={`w-2 h-2 rounded-sm ${cfg.dot}`} />
            <div className={`h-2 flex-1 rounded-sm ${cfg.bar1}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Toggle switch ────────────────────────────────────────
const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{ width: 40, height: 22 }}
    className={`relative rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1 shrink-0 ${
      checked ? "bg-secondary" : "bg-border-strong"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-card transition-transform duration-200 ${
        checked ? "translate-x-[18px]" : "translate-x-0"
      }`}
    />
  </button>
);

// ─── Main component ───────────────────────────────────────
export default function AppearanceSection() {
  const [prefs, setPrefs] = useState<AppearancePrefs>(DEFAULTS);

  // Hydrate from localStorage on mount and apply immediately
  useEffect(() => {
    const saved = loadPrefs();
    setPrefs(saved);
    applyTheme(saved.theme, saved.high_contrast);
  }, []);

  // Listen for OS preference changes when theme is "system"
  useEffect(() => {
    if (prefs.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system", prefs.high_contrast);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [prefs.theme, prefs.high_contrast]);

  // Update a single key, apply to DOM instantly, persist to localStorage
  const update = <K extends keyof AppearancePrefs>(
    key: K,
    val: AppearancePrefs[K],
  ) => {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    applyTheme(next.theme, next.high_contrast);
    savePrefs(next);
  };

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
    {
      value: "system",
      label: "System",
      icon: <Monitor className="w-3.5 h-3.5" />,
    },
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
                    <span
                      className={`transition-colors ${active ? "text-secondary" : "text-text-muted"}`}
                    >
                      {t.icon}
                    </span>
                    <span
                      className={`text-xs font-bold tracking-wide ${active ? "text-secondary" : "text-text-secondary"}`}
                    >
                      {t.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* High contrast toggle */}
        <div className="flex items-center gap-4">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              prefs.high_contrast ? "bg-brand-light" : "bg-bg-base"
            }`}
          >
            <Contrast
              className={`w-4 h-4 transition-colors ${
                prefs.high_contrast ? "text-secondary" : "text-text-muted"
              }`}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-heading leading-tight">
              High contrast
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Increases colour contrast for better readability
            </p>
          </div>
          <Toggle
            checked={prefs.high_contrast}
            onChange={(v) => update("high_contrast", v)}
          />
        </div>
      </div>
    </SectionCard>
  );
}
