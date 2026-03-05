"use client";

import React from "react";
import { Upload, FolderOpen } from "lucide-react";

export default function ModeToggle({
  mode,
  onChange,
}: {
  mode: "upload" | "select";
  onChange: (m: "upload" | "select") => void;
}) {
  return (
    <div className="flex gap-1.5 p-1 bg-bg-muted rounded-xl">
      {(["upload", "select"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
            mode === m
              ? "bg-surface text-text-heading shadow-card"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {m === "upload" ? (
            <Upload className="w-4 h-4" />
          ) : (
            <FolderOpen className="w-4 h-4" />
          )}
          {m === "upload" ? "Upload New" : "Select Existing"}
        </button>
      ))}
    </div>
  );
}
