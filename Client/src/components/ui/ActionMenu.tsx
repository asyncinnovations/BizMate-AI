"use client";

import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

interface ActionMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export default function ActionMenu({ items }: { items: ActionMenuItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-bg-subtle text-text-muted hover:text-text-secondary transition-all duration-150"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 bg-surface-raised border border-border rounded-xl shadow-raised w-52 py-1.5 overflow-hidden">
            {items.map((item, i) =>
              item.label === "---" ? (
                <div key={i} className="border-t border-border my-1" />
              ) : (
                <button
                  key={i}
                  className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors ${
                    item.danger
                      ? "text-status-error-text hover:bg-status-error-bg"
                      : "text-text-primary hover:bg-bg-subtle"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    item.onClick();
                  }}
                >
                  <span
                    className={
                      item.danger ? "text-status-error" : "text-text-muted"
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}
