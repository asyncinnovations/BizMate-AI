"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  FileText,
  Paperclip,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
  FolderOpen,
  AlertTriangle,
  Activity,
  FileBadge,
  Download,
  BadgeCheck,
  Ban,
  Clock,
  Edit2,
  FileCheck,
  Bell,
  Wand2,
  Bot,
  ChevronDown,
  ChevronUp,
  Zap,
  BrainCircuit,
  RotateCcw,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/loading-spinner/LoadingSpinner";
import InputField from "@/components/ui/InputField";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import EmptyState from "@/components/empty-state/EmptyState";
import Card from "@/components/ui/Card";
import {
  ComplianceDocument,
  fmtDate,
  getDaysRemaining,
  getLicenseStatusConfig,
} from "../../page";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LicenseDetail {
  id: string;
  license_type: string;
  license_number: string;
  issue_date: string;
  expiry_date: string;
  status: "active" | "expired" | "renewal_pending" | "suspended";
  company_id: string;
  document_id?: string;
}

interface AttachedDocument {
  id: string;
  document_type: string;
  filename: string;
  file_url: string;
  is_verified?: boolean;
  is_rejected?: boolean;
  created_at: string;
  ai_summary?: string;
  attached_license?: string;
  license_id?: string;
}

interface ActivityEntry {
  uuid?: string;
  id: string;
  event_type: string;
  details: string;
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LICENSE_TYPES = [
  "Trade License",
  "VAT Registration",
  "ESR License",
  "Import/Export License",
  "Professional License",
  "Industrial License",
  "Commercial License",
  "Other",
];

const DOC_TYPES = [
  "Trade License",
  "Passport Copy",
  "Tenancy Contract",
  "Emirates ID",
  "Memorandum of Association",
  "Share Certificate",
  "VAT Certificate",
  "ESR Report",
  "AML Policy",
  "Corporate Tax Return",
  "MOA/AOA",
  "Commercial Registration",
  "Bank Statement",
  "Other",
];

const selectCls =
  "w-full border border-border text-text-primary rounded-xl px-4 py-3 text-sm bg-bg-base focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDaysLabel = (days: number) => {
  if (days < 0)
    return {
      text: `${Math.abs(days)}d overdue`,
      cls: "text-status-error-text font-bold",
      urgency: "critical",
    };
  if (days < 30)
    return {
      text: `${days}d left`,
      cls: "text-status-error font-bold",
      urgency: "high",
    };
  if (days < 60)
    return {
      text: `${days}d left`,
      cls: "text-status-warning font-semibold",
      urgency: "medium",
    };
  return {
    text: `${days}d left`,
    cls: "text-status-success-text font-semibold",
    urgency: "low",
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

const getActivityIcon = (type: string) => {
  const c = "w-3.5 h-3.5";
  switch (type) {
    case "document_uploaded":
      return <Upload className={`${c} text-status-info`} />;
    case "license_renewed":
      return <RefreshCw className={`${c} text-status-success`} />;
    case "document_verified":
      return <CheckCircle className={`${c} text-status-success`} />;
    case "reminder_triggered":
      return <Bell className={`${c} text-status-warning`} />;
    case "ai_summary_generated":
      return <Sparkles className={`${c} text-secondary`} />;
    case "document_rejected":
      return <X className={`${c} text-status-error`} />;
    default:
      return <Activity className={`${c} text-text-muted`} />;
  }
};

const getActivityBg = (type: string) => {
  switch (type) {
    case "document_uploaded":
      return "bg-status-info-bg border-status-info-border";
    case "license_renewed":
      return "bg-status-success-bg border-status-success-border";
    case "document_verified":
      return "bg-status-success-bg border-status-success-border";
    case "reminder_triggered":
      return "bg-status-warning-bg border-status-warning-border";
    case "ai_summary_generated":
      return "bg-brand-light border-secondary-light";
    case "document_rejected":
      return "bg-status-error-bg border-status-error-border";
    default:
      return "bg-bg-subtle border-border";
  }
};

const fmtDateTime = (d: string) => {
  const dt = new Date(d);
  return (
    dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) +
    " · " +
    dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

// ─── Mode Toggle ──────────────────────────────────────────────────────────────

function ModeToggle({
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

// ─── File Drop Zone ───────────────────────────────────────────────────────────

function FileDropZone({
  file,
  onFile,
  inputRef,
  compact = false,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  compact?: boolean;
}) {
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
        file
          ? "border-status-success bg-status-success-bg"
          : "border-border hover:border-border-focus hover:bg-bg-subtle"
      } ${compact ? "p-5" : "p-7"}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${file ? "bg-status-success-bg" : "bg-bg-subtle"}`}
      >
        {file ? (
          <FileCheck className="w-5 h-5 text-status-success" />
        ) : (
          <Upload className="w-5 h-5 text-text-muted" />
        )}
      </div>
      {file ? (
        <>
          <p className="text-sm font-semibold text-text-heading">{file.name}</p>
          <p className="text-xs text-text-muted mt-1">
            {(file.size / 1024).toFixed(1)} KB
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="mt-2 text-xs text-status-error hover:underline"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-text-primary">
            Drop file here or click to browse
          </p>
          <p className="text-xs text-text-muted mt-1">
            PDF, JPG, PNG up to 10 MB
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    </div>
  );
}

// ─── AI Summary Components ────────────────────────────────────────────────────

// State 1: No summary yet — invite user to generate
function AISummaryCTA({
  docId,
  onGenerate,
}: {
  docId: string;
  onGenerate: (id: string) => void;
}) {
  return (
    <div className="border-t border-border">
      <div className="px-5 py-4 bg-brand-light">
        <div className="flex items-center gap-3">
          {/* Orb */}
          <div className="shrink-0 w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-card">
            <BrainCircuit className="w-4 h-4 text-on-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-heading leading-none mb-0.5">
              AI Document Analysis
            </p>
            <p className="text-[11px] text-text-muted leading-snug">
              Let Claude read this document and extract key compliance insights
            </p>
          </div>
          <button
            onClick={() => onGenerate(docId)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-secondary text-on-brand hover:bg-secondary-hover shadow-card transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

// State 2: Generating — animated skeleton
function AISummaryGenerating() {
  return (
    <div className="border-t border-border">
      <div className="px-5 py-4 bg-brand-light">
        <div className="flex items-start gap-3">
          {/* Pulsing orb */}
          <div className="relative shrink-0 mt-0.5">
            <div className="absolute inset-0 w-9 h-9 rounded-xl bg-secondary opacity-20 animate-ping" />
            <div className="relative w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-card">
              <Wand2 className="w-4 h-4 text-on-brand animate-pulse" />
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-bold text-secondary">
                Analysing document…
              </p>
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-secondary opacity-60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1 h-1 rounded-full bg-secondary opacity-60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1 h-1 rounded-full bg-secondary opacity-60 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
            <p className="text-[11px] text-text-muted mb-3">
              Claude is reading and extracting compliance insights
            </p>
            {/* Skeleton lines */}
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-secondary-light animate-pulse w-full" />
              <div className="h-2 rounded-full bg-secondary-light animate-pulse w-4/5 [animation-delay:100ms]" />
              <div className="h-2 rounded-full bg-secondary-light animate-pulse w-5/6 [animation-delay:200ms]" />
              <div className="h-2 rounded-full bg-secondary-light animate-pulse w-3/4 [animation-delay:300ms]" />
              <div className="h-2 rounded-full bg-secondary-light animate-pulse w-2/3 [animation-delay:400ms]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// State 3: Summary ready — rich AI card with expand/collapse
function AISummaryCard({
  summary,
  docId,
  onRegenerate,
  loading,
}: {
  summary: string;
  docId: string;
  onRegenerate: (id: string) => void;
  loading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_LENGTH = 280;
  const isLong = summary.length > PREVIEW_LENGTH;
  const displayed =
    !expanded && isLong
      ? summary.slice(0, PREVIEW_LENGTH).trimEnd() + "…"
      : summary;
  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="border-t border-border overflow-hidden">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-brand-light border-b border-secondary-light">
        <div className="flex items-center gap-2.5">
          {/* Animated sparkle orb */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 w-6 h-6 rounded-full bg-secondary opacity-20 animate-ping" />
            <div className="relative w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-card">
              <Sparkles className="w-3 h-3 text-on-brand" />
            </div>
          </div>
          <div className="leading-none">
            <p className="text-[11px] font-bold text-secondary">AI Analysis</p>
            <p className="text-[10px] text-text-muted mt-0.5">
              {wordCount} words · Claude
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Regenerate */}
          <button
            onClick={() => onRegenerate(docId)}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-secondary bg-surface hover:bg-bg-subtle border border-secondary-light transition-all disabled:opacity-50"
            title="Regenerate AI summary"
          >
            {loading ? (
              <LoadingSpinner size="w-2.5 h-2.5" color="border-secondary" />
            ) : (
              <RotateCcw className="w-2.5 h-2.5" />
            )}
            {loading ? "Working…" : "Regenerate"}
          </button>
          {/* Expand / collapse */}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-secondary bg-surface hover:bg-bg-subtle border border-secondary-light transition-all"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-2.5 h-2.5" /> Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-2.5 h-2.5" /> More
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 bg-brand-light/40">
        {/* Left accent bar + text */}
        <div className="flex gap-3 mb-3">
          <div className="shrink-0 w-0.5 self-stretch rounded-full bg-secondary opacity-40" />
          <p className="text-xs text-text-primary leading-relaxed">
            {displayed}
          </p>
        </div>

        {/* Read more inline link */}
        {isLong && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-[11px] font-semibold text-secondary hover:text-secondary-hover ml-3.5 transition-colors"
          >
            Read full analysis →
          </button>
        )}

        {/* Footer meta pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-secondary-light">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-light border border-secondary-light text-[10px] font-semibold text-secondary">
            <Bot className="w-2.5 h-2.5" />
            AI Generated
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-light border border-secondary-light text-[10px] font-semibold text-secondary">
            <Zap className="w-2.5 h-2.5" />
            Document Analysis
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-light border border-secondary-light text-[10px] font-semibold text-secondary">
            <FileText className="w-2.5 h-2.5" />
            Compliance Insights
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LicenseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const licenseId = params?.licUuid as string;
  const { user } = useAuth();
  const userId = user?.user?.user_id;

  // ── Data ──
  const [license, setLicense] = useState<LicenseDetail | null>(null);
  const [allDocs, setAllDocs] = useState<AttachedDocument[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);

  // Derived: document attached to this license via license.document_id
  // Same relationship as main page getAttachedDocument()
  const attachedDocs = React.useMemo<AttachedDocument[]>(() => {
    if (!license?.document_id) return [];
    const found = allDocs.find((d) => d.id === license.document_id);
    return found ? [found] : [];
  }, [license, allDocs]);

  // ── Attach doc modal ──
  const [isAttachDocOpen, setIsAttachDocOpen] = useState(false);
  const [attachMode, setAttachMode] = useState<"upload" | "select">("upload");
  const [attachDocFile, setAttachDocFile] = useState<File | null>(null);
  const [attachDocType, setAttachDocType] = useState("");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [attachLoading, setAttachLoading] = useState(false);
  const attachFileRef = useRef<HTMLInputElement>(null!);

  // ── Edit modal ──
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    license_type: "",
    license_number: "",
    issue_date: "",
    expiry_date: "",
  });
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>(
    {},
  );
  const [editFormLoading, setEditFormLoading] = useState(false);

  // ── AI ──
  const [aiLoadingFor, setAiLoadingFor] = useState<string | null>(null);

  // ── History logger ────────────────────────────────────────────────────────
  // Fire-and-forget — called AFTER a main action succeeds.
  // Never throws; history logging must never break the UX.
  //
  // Integrated endpoints (compliance_history.controller.ts):
  //   POST /compliance-history/document-uploaded  → after attach doc in upload mode
  //   POST /compliance-history/ai-summary         → after AI summary generated
  //   POST /compliance-history/license-renewed    → after license edit saved
  //   GET  /compliance-history/document/:id       → enrich activity timeline with doc-scoped events
  //
  // NOT integrated here (not user-triggered from this page):
  //   reminder-triggered  → server-side only
  //   document-verified   → admin action
  //   document-rejected   → admin action
  //   ai-chat             → no chat feature here
  //   DELETE endpoints    → not applicable here

  const logHistory = useCallback(
    async (endpoint: string, payload: Record<string, unknown>) => {
      try {
        await axiosInstance.post(`/compliance-history/${endpoint}`, {
          user_id: userId,
          ...payload,
        });
      } catch {
        // Intentionally silent — history is non-critical
      }
    },
    [userId],
  );

  // ── Fetch license ─────────────────────────────────────────────────────────

  const fetchLicense = useCallback(async () => {
    if (!licenseId) return;
    setPageLoading(true);
    try {
      const res = await axiosInstance.get(
        `/compliance-licensing/single/${licenseId}`,
      );
      console.log("Fetch license response:", res.data);
      const data = res.data?.response || res.data;
      setLicense({ ...data, id: data.uuid ?? data.id });
    } catch (error) {
      console.error("fetchLicense error:", error);
      toast.error("Failed to load license details");
    } finally {
      setPageLoading(false);
    }
  }, [licenseId]);

  // ── Fetch documents ───────────────────────────────────────────────────────

  const fetchDocs = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axiosInstance.get(
        `/compliance-documents/user/${userId}`,
      );
      console.log("Fetch documents response:", res.data);
      const data: AttachedDocument[] = (
        res.data?.response ||
        res.data ||
        []
      ).map((x: ComplianceDocument) => ({ ...x, id: x.uuid ?? x.id }));
      setAllDocs(data);
    } catch (error) {
      console.error("fetchDocs error:", error);
    }
  }, [userId]);

  // ── Fetch activity ────────────────────────────────────────────────────────
  // Fetches user-wide history from GET /compliance-history/user.
  // After doc actions we additionally call GET /compliance-history/document/:id
  // to merge document-scoped events, giving a richer timeline for this page.

  const fetchActivity = useCallback(async () => {
    if (!licenseId) return;
    setActivityLoading(true);
    try {
      const res = await axiosInstance.get(`/compliance-history/user`);
      console.log("Fetch activity response:", res.data);
      const data: ActivityEntry[] = (res.data?.response || res.data || []).map(
        (x: ActivityEntry) => ({ ...x, id: x.uuid ?? x.id }),
      );
      setActivity(data.slice(0, 15));
    } catch (error) {
      console.error("fetchActivity error:", error);
    } finally {
      setActivityLoading(false);
    }
  }, [licenseId]);

  // Fetches doc-scoped activity via GET /compliance-history/document/:documentId
  // and merges it (deduplicated) into the timeline for richer context.
  const enrichActivityWithDoc = useCallback(async (docId: string) => {
    try {
      // GET /compliance-history/document/:documentId
      const res = await axiosInstance.get(
        `/compliance-history/document/${docId}`,
      );
      const docEvents: ActivityEntry[] = (
        res.data?.response ||
        res.data ||
        []
      ).map((x: ComplianceDocument) => ({ ...x, id: x.uuid ?? x.id }));
      if (docEvents.length === 0) return;
      setActivity((prev) => {
        const existingIds = new Set(prev.map((e) => e.id));
        const fresh = docEvents.filter((e) => !existingIds.has(e.id));
        return [...fresh, ...prev]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 15);
      });
    } catch {
      // Silent — doc-scoped enrichment is best-effort
    }
  }, []);

  useEffect(() => {
    fetchLicense();
    fetchDocs();
    fetchActivity();
  }, [fetchLicense, fetchDocs, fetchActivity]);

  // ── Generate AI Summary ───────────────────────────────────────────────────

  const handleGenerateAISummary = async (docId: string) => {
    setAiLoadingFor(docId);
    try {
      const res = await axiosInstance.patch(
        `/compliance-documents/ai_summary/${docId}`,
      );
      console.log("Generate AI summary response:", res.data);
      const updated = res.data?.response || res.data;
      toast.success("AI summary generated");
      // Update allDocs — attachedDocs is derived automatically via useMemo
      setAllDocs((list) =>
        list.map((d) =>
          d.id === docId
            ? { ...d, ai_summary: updated?.ai_summary ?? d.ai_summary }
            : d,
        ),
      );
      // POST /compliance-history/ai-summary
      logHistory("ai-summary", { document_id: docId });
      // Enrich timeline with doc-scoped events, then refresh full activity
      enrichActivityWithDoc(docId);
      fetchActivity();
    } catch (error) {
      console.error("Generate AI summary error:", error);
      toast.error("Failed to generate AI summary");
    } finally {
      setAiLoadingFor(null);
    }
  };

  // ── Delete document ───────────────────────────────────────────────────────

  const handleRemoveDoc = async (docId: string) => {
    if (!confirm("Delete this document? This action cannot be undone.")) return;
    try {
      const res = await axiosInstance.delete(
        `/compliance-documents/delete/${docId}`,
      );
      console.log("Delete document response:", res.data);
      toast.success("Document removed");
      setAllDocs((p) => p.filter((d) => d.id !== docId));
      // Re-fetch license so document_id clears if this was the attached doc
      fetchLicense();
      fetchActivity();
    } catch (error) {
      console.error("Delete document error:", error);
      toast.error("Failed to remove document");
    }
  };

  // ── Attach document ───────────────────────────────────────────────────────

  const resetAttachModal = () => {
    setIsAttachDocOpen(false);
    setAttachDocFile(null);
    setAttachDocType("");
    setSelectedDocId("");
    if (attachFileRef.current) attachFileRef.current.value = "";
  };

  const handleAttachDocument = async () => {
    if (!license) return;
    setAttachLoading(true);
    try {
      let docId = selectedDocId;
      let docFilename = allDocs.find((d) => d.id === docId)?.filename ?? "";

      if (attachMode === "upload") {
        if (!attachDocFile) {
          toast.error("Please select a file");
          setAttachLoading(false);
          return;
        }
        const fd = new FormData();
        fd.append("user_id", userId as string);
        fd.append("document_type", attachDocType || "Other");
        fd.append("filename", attachDocFile);
        const res = await axiosInstance.post(
          "/compliance-documents/create",
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        console.log("Upload document during attach response:", res.data);
        docId =
          res.data?.response?.uuid ??
          res.data?.response?.id ??
          res.data?.uuid ??
          res.data?.id;
        docFilename = attachDocFile.name;
        // POST /compliance-history/document-uploaded for the newly created doc
        logHistory("document-uploaded", {
          document_id: docId,
          filename: docFilename,
        });
      }

      if (!docId) {
        toast.error("No document selected");
        setAttachLoading(false);
        return;
      }

      const attachRes = await axiosInstance.put(
        `/compliance-licensing/${license.id}/attach-document/${docId}`,
      );
      console.log("Attach document response:", attachRes.data);
      toast.success("Document attached successfully");
      resetAttachModal();
      fetchDocs();
      fetchLicense();
      // Enrich timeline with events for this document
      enrichActivityWithDoc(docId);
      fetchActivity();
    } catch (error) {
      console.error("Attach document error:", error);
      toast.error("Failed to attach document");
    } finally {
      setAttachLoading(false);
    }
  };

  // ── Edit license ──────────────────────────────────────────────────────────

  const openEdit = () => {
    if (!license) return;
    setEditForm({
      license_type: license.license_type,
      license_number: license.license_number,
      issue_date: license.issue_date?.split("T")[0] ?? "",
      expiry_date: license.expiry_date?.split("T")[0] ?? "",
    });
    setEditFormErrors({});
    setIsEditOpen(true);
  };

  const validateEdit = () => {
    const e: Record<string, string> = {};
    if (!editForm.license_type.trim())
      e.license_type = "License type is required";
    if (!editForm.license_number.trim())
      e.license_number = "License number is required";
    if (!editForm.issue_date) e.issue_date = "Issue date is required";
    if (!editForm.expiry_date) e.expiry_date = "Expiry date is required";
    setEditFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEditLicense = async () => {
    if (!validateEdit() || !license) return;
    setEditFormLoading(true);
    try {
      const res = await axiosInstance.put(
        `/compliance-licensing/update/${license.id}`,
        editForm,
      );
      console.log("Edit license response:", res.data);
      toast.success("License updated");
      setIsEditOpen(false);
      fetchLicense();
      // POST /compliance-history/license-renewed
      // Editing license = renewal in compliance context
      logHistory("license-renewed", {
        license_id: license.id,
        license_type: editForm.license_type,
      });
      fetchActivity();
    } catch (error) {
      console.error("Edit license error:", error);
      toast.error("Failed to update license");
    } finally {
      setEditFormLoading(false);
    }
  };

  // ── Loading / not found ───────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  }

  if (!license) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <FileBadge className="w-12 h-12 text-text-muted" />
          <p className="text-text-heading font-semibold">License not found</p>
          <button
            onClick={() => router.back()}
            className="text-secondary text-sm font-semibold hover:underline"
          >
            Go back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const days = getDaysRemaining(license.expiry_date);
  const statusCfg = getLicenseStatusConfig(license.status);
  const daysLbl = getDaysLabel(days);
  const progressPct = Math.min(100, Math.max(3, ((365 - days) / 365) * 100));

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8 bg-bg-base">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-secondary hover:text-secondary-hover font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-text-muted">/</span>
          <span
            className="text-text-muted hover:text-secondary cursor-pointer transition-colors"
            onClick={() => router.push("/dashboard/compliance")}
          >
            Compliance &amp; Licensing
          </span>
          <span className="text-text-muted">/</span>
          <span className="text-text-heading font-semibold truncate max-w-[200px]">
            {license.license_type}
          </span>
        </div>

        {/* ── License Header Card ── */}
        <Card className="mb-6 relative">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            {/* Icon + name + status */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center shrink-0 shadow-card">
                <FileBadge className="w-7 h-7 text-on-brand" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-xl font-bold text-text-heading">
                    {license.license_type}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.badge}`}
                  >
                    {statusCfg.icon} {statusCfg.label}
                  </span>
                </div>
                <p className="text-text-muted text-xs font-mono">
                  {license.license_number}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={openEdit}
                className="flex items-center gap-2 px-4 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-xl hover:bg-bg-subtle transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => {
                  setAttachMode("upload");
                  setAttachDocFile(null);
                  setAttachDocType("");
                  setSelectedDocId("");
                  setIsAttachDocOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand text-on-brand text-sm font-semibold rounded-xl hover:bg-brand-hover transition-colors"
              >
                <Paperclip className="w-4 h-4" /> Attach Doc
              </button>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              {
                label: "License Number",
                value: license.license_number,
                mono: true,
              },
              { label: "Issue Date", value: fmtDate(license.issue_date) },
              { label: "Expiry Date", value: fmtDate(license.expiry_date) },
              { label: "Days Remaining", value: daysLbl.text, special: true },
            ].map((item) => (
              <div key={item.label} className="bg-bg-subtle rounded-xl p-4">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide mb-1.5">
                  {item.label}
                </p>
                <p
                  className={`text-sm font-bold leading-tight ${item.special ? daysLbl.cls : "text-text-heading"} ${item.mono ? "font-mono text-xs" : ""}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Validity progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-text-muted font-medium">
                License validity
              </span>
              <span className={daysLbl.cls}>{daysLbl.text}</span>
            </div>
            <div className={`w-full rounded-full h-1.5 ${getProgressBg(days)}`}>
              <div
                className={`h-1.5 rounded-full transition-all duration-700 ${getProgressColor(days)}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </Card>

        {/* ── Content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ════ LEFT: Attached Documents ════ */}
          <div className="lg:col-span-2">
            <Card className="p-0">
              <div className="flex items-center justify-between px-5 pt-5 pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-text-heading">
                    Attached Documents
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${attachedDocs.length > 0 ? "bg-brand text-on-brand" : "bg-bg-subtle text-text-muted"}`}
                  >
                    {attachedDocs.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setAttachMode("upload");
                    setAttachDocFile(null);
                    setAttachDocType("");
                    setSelectedDocId("");
                    setIsAttachDocOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:text-text-heading bg-bg-subtle hover:bg-bg-muted px-3 py-1.5 rounded-lg border border-border transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Attach New
                </button>
              </div>
              <div className="border-t border-border mx-5 mt-2" />

              <div className="p-5">
                {attachedDocs.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No documents attached"
                    description="Attach relevant compliance documents to this license"
                    ctaLabel="Attach Document"
                    onCTAClick={() => setIsAttachDocOpen(true)}
                  />
                ) : (
                  <div className="space-y-3">
                    {attachedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-border rounded-xl overflow-hidden hover:border-border-strong transition-colors"
                      >
                        {/* ── Doc row ── */}
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="font-semibold text-text-heading text-sm truncate">
                                {doc.filename}
                              </span>
                              {doc.is_verified && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-status-success-bg text-status-success-text text-xs rounded-full border border-status-success-border">
                                  <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                              )}
                              {doc.is_rejected && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-status-error-bg text-status-error-text text-xs rounded-full border border-status-error-border">
                                  <X className="w-3 h-3" /> Rejected
                                </span>
                              )}
                              {doc.ai_summary && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-brand-light text-secondary text-xs rounded-full border border-secondary-light">
                                  <Sparkles className="w-3 h-3" /> AI Summary
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-text-muted">
                              <span>{doc.document_type}</span>
                              <span>·</span>
                              <span>{fmtDate(doc.created_at)}</span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => window.open(doc.file_url)}
                              className="p-1.5 rounded-lg hover:bg-bg-subtle text-text-secondary transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveDoc(doc.id)}
                              className="p-1.5 rounded-lg hover:bg-status-error-bg text-text-muted hover:text-status-error transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* ── AI Summary panel — 3 states ── */}
                        {aiLoadingFor === doc.id ? (
                          <AISummaryGenerating />
                        ) : doc.ai_summary ? (
                          <AISummaryCard
                            summary={doc.ai_summary}
                            docId={doc.id}
                            onRegenerate={handleGenerateAISummary}
                            loading={aiLoadingFor === doc.id}
                          />
                        ) : (
                          <AISummaryCTA
                            docId={doc.id}
                            onGenerate={handleGenerateAISummary}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* ════ RIGHT: Activity Timeline ════ */}
          <div>
            <Card className="p-0">
              <div className="flex items-center justify-between px-5 pt-5 pb-2">
                <h3 className="text-sm font-bold text-text-heading">
                  Activity Timeline
                </h3>
                <Activity className="w-4 h-4 text-text-muted" />
              </div>
              <div className="border-t border-border mx-5 mt-0 mb-4" />
              <div className="px-5 pb-5">
                {activityLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="w-5 h-5" />
                  </div>
                ) : activity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="p-2.5 rounded-xl bg-brand-light border border-border mb-3">
                      <Activity className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="text-xs font-medium text-text-secondary">
                      No activity recorded
                    </p>
                  </div>
                ) : (
                  <div>
                    {activity.map((entry, idx) => (
                      <div key={entry.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${getActivityBg(entry.event_type)}`}
                          >
                            {getActivityIcon(entry.event_type)}
                          </div>
                          {idx < activity.length - 1 && (
                            <div className="w-px flex-1 bg-border my-1 min-h-[14px]" />
                          )}
                        </div>
                        <div className="pb-3.5">
                          <p className="text-xs text-text-primary font-medium leading-snug">
                            {entry.details}
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5">
                            {fmtDateTime(entry.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          ATTACH DOCUMENT MODAL
      ════════════════════════════════════════════════ */}
      <Modal
        isOpen={isAttachDocOpen}
        onClose={resetAttachModal}
        title="Attach Document to License"
        showCloseButton
        closeOnOverlayClick
        size="md"
      >
        <div className="p-6 space-y-4">
          <ModeToggle mode={attachMode} onChange={setAttachMode} />

          {attachMode === "upload" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Document Type
                </label>
                <select
                  className={selectCls}
                  value={attachDocType}
                  onChange={(e) => setAttachDocType(e.target.value)}
                >
                  <option value="">Select type</option>
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <FileDropZone
                file={attachDocFile}
                onFile={setAttachDocFile}
                inputRef={attachFileRef}
                compact
              />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-text-secondary mb-3">
                Select from your existing documents
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {allDocs.length === 0 ? (
                  <p className="text-xs text-text-muted text-center py-4">
                    No documents available
                  </p>
                ) : (
                  allDocs.map((doc) => (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                        selectedDocId === doc.id
                          ? "border-secondary bg-brand-light"
                          : "border-border hover:border-border-strong"
                      }`}
                    >
                      <input
                        type="radio"
                        name="existingDoc"
                        value={doc.id}
                        className="accent-secondary"
                        checked={selectedDocId === doc.id}
                        onChange={() => setSelectedDocId(doc.id)}
                      />
                      <FileText className="w-4 h-4 text-secondary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-heading truncate">
                          {doc.filename}
                        </p>
                        <p className="text-xs text-text-muted">
                          {doc.document_type}
                        </p>
                      </div>
                      {doc.is_verified && (
                        <CheckCircle className="w-4 h-4 text-status-success shrink-0" />
                      )}
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={resetAttachModal}
              className="px-5 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-xl hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAttachDocument}
              disabled={attachLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-on-brand text-sm font-semibold rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {attachLoading && (
                <LoadingSpinner size="w-4 h-4" color="border-on-brand" />
              )}
              {attachMode === "upload" ? "Upload & Attach" : "Attach Document"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ════════════════════════════════════════════════
          EDIT LICENSE MODAL
      ════════════════════════════════════════════════ */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditFormErrors({});
        }}
        title="Edit License"
        showCloseButton
        closeOnOverlayClick
        size="md"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              License Type <span className="text-status-error">*</span>
            </label>
            <select
              className={`${selectCls} ${editFormErrors.license_type ? "border-status-error" : ""}`}
              value={editForm.license_type}
              onChange={(e) =>
                setEditForm({ ...editForm, license_type: e.target.value })
              }
            >
              <option value="">Select license type</option>
              {LICENSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {editFormErrors.license_type && (
              <p className="text-status-error-text text-xs mt-1">
                {editFormErrors.license_type}
              </p>
            )}
          </div>
          <InputField
            label="License Number"
            name="license_number"
            required
            value={editForm.license_number}
            onChange={(e) =>
              setEditForm({ ...editForm, license_number: e.target.value })
            }
            error={editFormErrors.license_number}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Issue Date"
              name="issue_date"
              type="date"
              required
              value={editForm.issue_date}
              onChange={(e) =>
                setEditForm({ ...editForm, issue_date: e.target.value })
              }
              error={editFormErrors.issue_date}
            />
            <InputField
              label="Expiry Date"
              name="expiry_date"
              type="date"
              required
              value={editForm.expiry_date}
              onChange={(e) =>
                setEditForm({ ...editForm, expiry_date: e.target.value })
              }
              error={editFormErrors.expiry_date}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setIsEditOpen(false);
                setEditFormErrors({});
              }}
              className="px-5 py-2.5 border border-border text-text-primary text-sm font-semibold rounded-xl hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditLicense}
              disabled={editFormLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-on-brand text-sm font-semibold rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {editFormLoading && (
                <LoadingSpinner size="w-4 h-4" color="border-on-brand" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
