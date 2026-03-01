"use client";

import React from "react";
import { Plus, Upload, Bell, ArrowUpRight } from "lucide-react";

interface QuickActionsProps {
  onAddLicense: () => void;
  onUploadDoc: () => void;
  onSetReminder: () => void;
}

export default function QuickActions({
  onAddLicense,
  onUploadDoc,
  onSetReminder,
}: QuickActionsProps) {
  return (
    <div className="bg-surface rounded-xl p-5 border border-border shadow-card">
      <h3 className="text-sm font-bold text-text-heading mb-3">
        Quick Actions
      </h3>
      <div className="space-y-2">
        <button
          onClick={onAddLicense}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand hover:bg-brand-hover text-on-brand transition-colors group"
        >
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold flex-1 text-left">
            Add License
          </span>
          <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
        <button
          onClick={onUploadDoc}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-bg-subtle hover:bg-bg-muted border border-border text-text-primary transition-colors group"
        >
          <div className="w-8 h-8 bg-secondary-light rounded-lg flex items-center justify-center">
            <Upload className="w-4 h-4 text-secondary" />
          </div>
          <span className="text-sm font-semibold flex-1 text-left">
            Upload Document
          </span>
          <ArrowUpRight className="w-4 h-4 text-text-muted opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
        <button
          onClick={onSetReminder}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-status-warning-bg hover:bg-accent-light border border-status-warning-border text-status-warning-text transition-colors group"
        >
          <div className="w-8 h-8 bg-status-warning-bg rounded-lg flex items-center justify-center border border-status-warning-border">
            <Bell className="w-4 h-4 text-status-warning" />
          </div>
          <span className="text-sm font-semibold flex-1 text-left">
            Set Reminder
          </span>
          <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
