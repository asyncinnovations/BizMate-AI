"use client";

import React from "react";
import {
  Building,
  CheckCircle,
  Eye,
  Edit2,
  Paperclip,
  RefreshCw,
  Sparkles,
  Trash2,
  FileCheck,
  BadgeCheck,
  AlertTriangle,
  Ban,
  FileBadge,
} from "lucide-react";
import ActionMenu from "../ui/ActionMenu";

// ─── Types ────────────────────────────────────────────────────────────────────

interface License {
  id: string;
  license_type: string;
  license_number: string;
  issue_date: string;
  expiry_date: string;
  status: "active" | "expired" | "renewal_pending" | "suspended";
  document_id?: string;
}

interface ComplianceDocument {
  id: string;
  filename: string;
  document_type: string;
  is_verified?: boolean;
  ai_summary?: string;
}

// ─── Helpers (local — no import needed) ──────────────────────────────────────

const getDaysRemaining = (expiry: string) =>
  Math.floor((new Date(expiry).getTime() - Date.now()) / 86400000);

const getLicenseStatusConfig = (status: License["status"]) => {
  switch (status) {
    case "active":
      return {
        badge:
          "bg-status-success-bg text-status-success-text border border-status-success-border",
        icon: <BadgeCheck className="w-3.5 h-3.5" />,
        label: "Active",
      };
    case "expired":
      return {
        badge:
          "bg-status-error-bg text-status-error-text border border-status-error-border",
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        label: "Expired",
      };
    case "renewal_pending":
      return {
        badge:
          "bg-status-warning-bg text-status-warning-text border border-status-warning-border",
        icon: <RefreshCw className="w-3.5 h-3.5" />,
        label: "Renewal Pending",
      };
    case "suspended":
      return {
        badge: "bg-bg-muted text-text-secondary border border-border",
        icon: <Ban className="w-3.5 h-3.5" />,
        label: "Suspended",
      };
    default:
      return {
        badge:
          "bg-status-info-bg text-status-info-text border border-status-info-border",
        icon: <FileBadge className="w-3.5 h-3.5" />,
        label: status,
      };
  }
};

const getDaysLabel = (days: number) => {
  if (days < 0)
    return {
      text: `${Math.abs(days)}d overdue`,
      cls: "text-status-error-text font-bold",
    };
  if (days < 30)
    return { text: `${days}d left`, cls: "text-status-error font-bold" };
  if (days < 60)
    return { text: `${days}d left`, cls: "text-status-warning font-semibold" };
  return {
    text: `${days}d left`,
    cls: "text-status-success-text font-semibold",
  };
};

const getProgressColor = (days: number) =>
  days < 0
    ? "bg-status-error"
    : days < 30
      ? "bg-status-error"
      : days < 60
        ? "bg-status-warning"
        : "bg-status-success";

const getProgressBg = (days: number) =>
  days < 0
    ? "bg-status-error-bg"
    : days < 30
      ? "bg-status-error-bg"
      : days < 60
        ? "bg-status-warning-bg"
        : "bg-status-success-bg";

const fmtDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// ─── Component ────────────────────────────────────────────────────────────────

interface LicenseCardProps {
  license: License;
  attachedDocument?: ComplianceDocument;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAttachDocument: () => void;
  onChangeDocument: () => void;
}

export default function LicenseCard({
  license,
  attachedDocument,
  onViewDetails,
  onEdit,
  onDelete,
  onAttachDocument,
  onChangeDocument,
}: LicenseCardProps) {
  const days = getDaysRemaining(license.expiry_date);
  const statusCfg = getLicenseStatusConfig(license.status);
  const daysLbl = getDaysLabel(days);
  const progressPct = Math.min(100, Math.max(4, ((365 - days) / 365) * 100));
  const hasDoc = !!attachedDocument || !!license.document_id;

  return (
    <div className="group relative bg-surface border border-border rounded-xl p-5 hover:border-border-strong hover:shadow-raised transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 bg-brand rounded-xl flex items-center justify-center shrink-0 shadow-card">
            <Building className="w-5 h-5 text-on-brand" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-text-heading text-sm leading-tight truncate">
              {license.license_type}
            </p>
            <p className="text-xs text-text-muted font-mono mt-0.5 truncate">
              {license.license_number}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.badge}`}
          >
            {statusCfg.icon} {statusCfg.label}
          </span>
          <ActionMenu
            items={[
              {
                icon: <Eye className="w-4 h-4" />,
                label: "View Details",
                onClick: onViewDetails,
              },
              {
                icon: <Edit2 className="w-4 h-4" />,
                label: "Edit",
                onClick: onEdit,
              },
              {
                icon: <Paperclip className="w-4 h-4" />,
                label: hasDoc ? "Change Document" : "Attach Document",
                onClick: hasDoc ? onChangeDocument : onAttachDocument,
              },
              { icon: <span />, label: "---", onClick: () => {} },
              {
                icon: <Trash2 className="w-4 h-4" />,
                label: "Delete License",
                onClick: onDelete,
                danger: true,
              },
            ]}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-bg-subtle rounded-xl p-3">
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide mb-1">
            Issue Date
          </p>
          <p className="text-xs font-semibold text-text-heading">
            {fmtDate(license.issue_date)}
          </p>
        </div>
        <div className="bg-bg-subtle rounded-xl p-3">
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide mb-1">
            Expiry Date
          </p>
          <p className="text-xs font-semibold text-text-heading">
            {fmtDate(license.expiry_date)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">
            Validity
          </p>
          <span className={`text-xs ${daysLbl.cls}`}>{daysLbl.text}</span>
        </div>
        <div className={`w-full rounded-full h-1.5 ${getProgressBg(days)}`}>
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(days)}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Attached document or attach button */}
      {hasDoc ? (
        <div className="border border-dashed border-border-strong rounded-xl p-3 bg-bg-muted">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-surface border border-border rounded-lg flex items-center justify-center shrink-0 shadow-card">
                <FileCheck className="w-3.5 h-3.5 text-status-success" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide leading-none mb-0.5">
                  Attached Document
                </p>
                <p className="text-xs font-semibold text-text-heading truncate">
                  {attachedDocument?.filename ?? "Document attached"}
                </p>
              </div>
            </div>
            <button
              onClick={onChangeDocument}
              className="flex items-center gap-1 text-[10px] font-semibold text-text-secondary hover:text-text-primary bg-surface border border-border hover:border-border-strong px-2.5 py-1.5 rounded-lg transition-all shrink-0"
            >
              <RefreshCw className="w-3 h-3" /> Replace
            </button>
          </div>
          {attachedDocument?.is_verified && (
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle className="w-3 h-3 text-status-success" />
              <span className="text-[10px] text-status-success-text font-medium">
                Verified
              </span>
            </div>
          )}
          {attachedDocument?.ai_summary && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-secondary" />
                <span className="text-[10px] text-secondary font-semibold uppercase tracking-wide">
                  AI Summary
                </span>
              </div>
              <p className="text-[10px] text-text-secondary leading-relaxed line-clamp-2">
                {attachedDocument.ai_summary}
              </p>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={onAttachDocument}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-border hover:border-border-strong hover:bg-bg-subtle text-text-muted hover:text-text-secondary rounded-xl py-2.5 text-xs font-medium transition-all duration-150 group/attach"
        >
          <Paperclip className="w-3.5 h-3.5 group-hover/attach:rotate-12 transition-transform" />
          Attach a document
        </button>
      )}
    </div>
  );
}
