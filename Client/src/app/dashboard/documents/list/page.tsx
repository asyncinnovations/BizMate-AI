"use client";
// src/app/dashboard/documents/list/page.tsx
//
// NEW — Full document list page.
// Fixes:
//   • GET /documents/user/:id with status, category, search params
//   • Links to preview/:uuid and edit/:uuid
//   • Searchable + filterable — no more "last 5 only"

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Search, RefreshCw, Plus, Eye, Edit,
  Trash2, Sparkles, Calendar, Filter, ChevronLeft, ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader      from "@/components/page-header/PageHeader";
import EmptyState      from "@/components/empty-state/EmptyState";
import LoadingSpinner  from "@/components/loading-spinner/LoadingSpinner";
import axiosInstance   from "@/utils/axiosInstance";
import { useAuth }     from "@/context/AuthContext";
import toast           from "react-hot-toast";
import { GeneratedDocument, DOCUMENT_CATEGORIES } from "@/lib/documentTypes";

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  draft:        { label: "Draft",        bg: "rgba(148,163,184,.12)", color: "#64748B",         dot: "#94A3B8"  },
  ai_generated: { label: "AI Generated", bg: "rgba(99,102,241,.10)",  color: "#4F46E5",         dot: "#6366F1"  },
  under_review: { label: "Under Review", bg: "rgba(245,158,11,.10)",  color: "#D97706",         dot: "#F59E0B"  },
  approved:     { label: "Approved",     bg: "rgba(16,185,129,.10)",  color: "#059669",         dot: "#10B981"  },
  finalised:    { label: "Finalised",    bg: "rgba(232,105,10,.10)",  color: "var(--accent)",   dot: "var(--accent)" },
  archived:     { label: "Archived",     bg: "rgba(148,163,184,.10)", color: "#94A3B8",         dot: "#CBD5E1"  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.draft;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 100,
      fontSize: 11.5, fontWeight: 600,
      background: cfg.bg, color: cfg.color, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

const ALL_STATUSES = [
  "all", "draft", "ai_generated", "under_review",
  "approved", "finalised", "archived",
] as const;

const PAGE_SIZE = 15;

// ─── Component ────────────────────────────────────────────────────────────────
export default function DocumentsListPage() {
  const router            = useRouter();
  const { user, loading } = useAuth();
  const userId = !loading ? (user?.user?.user_id as string) : "";

  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId,setDeletingId]= useState<string | null>(null);

  // Filter state
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState<string>("all");
  const [catF,     setCatF]     = useState("All");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDocuments = useCallback(async (resetPage = false) => {
    if (!userId) return;
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        page:  currentPage,
        limit: PAGE_SIZE,
      };
      if (statusF !== "all") params.status   = statusF;
      if (catF    !== "All") params.category = catF;
      if (search.trim())     params.search   = search.trim();

      const res = await axiosInstance.get(`/documents/user/${userId}`, { params });
      const data = res.data?.data ?? res.data?.documents ?? [];
      setDocuments(data);
      // backend may return total count; fall back to array length
      setTotal(res.data?.total ?? data.length);
    } catch {
      toast.error("Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, statusF, catF, page, search]);

  // Initial load
  useEffect(() => {
    if (!loading && userId) fetchDocuments();
  }, [loading, userId]);

  // Refetch when filters change (reset to page 1)
  useEffect(() => {
    if (!loading && userId) fetchDocuments(true);
  }, [statusF, catF]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (!loading && userId) fetchDocuments(true);
    }, 380);
    return () => clearTimeout(t);
  }, [search]);

  // Pagination page change
  useEffect(() => {
    if (!loading && userId) fetchDocuments();
  }, [page]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(uuid);
    try {
      await axiosInstance.delete(`/documents/delete/${uuid}`);
      setDocuments((prev) => prev.filter((d) => d.uuid !== uuid));
      setTotal((t) => Math.max(0, t - 1));
      toast.success("Document deleted.");
    } catch {
      toast.error("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Layout helpers ─────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const inputCls    = "px-3 py-2 border border-border rounded-lg bg-bg-base text-text-heading text-sm focus:outline-none focus:ring-1 focus:ring-secondary transition-all";

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">

        <PageHeader
          title="All Documents"
          icon={<FileText size={24} />}
          description="Search, filter, and manage your generated documents"
          action={
            <button
              onClick={() => router.push("/dashboard/documents")}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-brand rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> New Document
            </button>
          }
        />

        {/* ── Filter bar ─────────────────────────────────────────────────── */}
        <div className="bg-surface border border-border rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or type…"
              className={`${inputCls} w-full pl-9`}
            />
          </div>

          <Filter className="w-4 h-4 text-text-muted flex-shrink-0" />

          {/* Status */}
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className={`${inputCls} min-w-36`}>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : STATUS_CFG[s]?.label ?? s}
              </option>
            ))}
          </select>

          {/* Category */}
          <select value={catF} onChange={(e) => setCatF(e.target.value)} className={`${inputCls} min-w-36`}>
            {DOCUMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={() => fetchDocuments(true)}
            className="p-2 bg-bg-base border border-border rounded-lg hover:bg-surface transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-text-secondary" />
          </button>

          <span className="ml-auto text-xs text-text-muted font-medium">
            {total} document{total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="w-8 h-8" />
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={search || statusF !== "all" || catF !== "All" ? "No documents match your filters" : "No documents yet"}
            description={
              search || statusF !== "all" || catF !== "All"
                ? "Try adjusting the search or filters above."
                : "Create your first document from a template or with AI generation."
            }
            ctaLabel="Create Document"
            onCTAClick={() => router.push("/dashboard/documents")}
          />
        ) : (
          <>
            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 13, borderCollapse: "collapse" }}>
                  <thead>
                    <tr className="bg-bg-base border-b border-border">
                      {["Document", "Type / Category", "Status", "Source", "Compliance", "Created", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3"
                          style={{
                            fontSize: 10.5, fontWeight: 700,
                            color: "var(--text-muted)",
                            textTransform: "uppercase", letterSpacing: "0.06em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, i) => (
                      <tr
                        key={doc.uuid}
                        className="border-b border-border transition-colors"
                        style={{ background: i % 2 === 0 ? undefined : "var(--color-background-secondary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-background-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "" : "var(--color-background-secondary)")}
                      >
                        {/* Document name */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-text-heading max-w-xs truncate" title={doc.document_name}>
                            {doc.document_name}
                          </div>
                          {doc.ai_prompt && (
                            <div className="text-xs text-text-muted mt-0.5 max-w-xs truncate" title={doc.ai_prompt}>
                              {doc.ai_prompt.slice(0, 55)}{doc.ai_prompt.length > 55 ? "…" : ""}
                            </div>
                          )}
                        </td>

                        {/* Type / Category */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-text-secondary">{doc.document_type ?? "—"}</div>
                          <div className="text-xs text-text-muted mt-0.5">{doc.category ?? "—"}</div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={doc.status ?? "draft"} />
                        </td>

                        {/* Source */}
                        <td className="px-4 py-3">
                          {doc.source === "ai" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(99,102,241,.1)", color: "#4F46E5" }}>
                              <Sparkles className="w-3 h-3" /> AI
                            </span>
                          ) : (
                            <span className="text-xs text-text-muted">
                              {doc.source === "custom" ? "Custom" : "Template"}
                            </span>
                          )}
                        </td>

                        {/* Compliance score */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {doc.compliance_score != null ? (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background:
                                  doc.compliance_score >= 90 ? "rgba(16,185,129,.1)"
                                  : doc.compliance_score >= 75 ? "rgba(245,158,11,.1)"
                                  : "rgba(239,68,68,.1)",
                                color:
                                  doc.compliance_score >= 90 ? "#059669"
                                  : doc.compliance_score >= 75 ? "#D97706"
                                  : "#DC2626",
                              }}
                            >
                              {doc.compliance_score}%
                            </span>
                          ) : (
                            <span className="text-xs text-text-muted">—</span>
                          )}
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-text-secondary">
                            <Calendar className="w-3.5 h-3.5 text-text-muted" />
                            {doc.created_at
                              ? new Date(doc.created_at).toLocaleDateString("en-AE", {
                                  day: "numeric", month: "short", year: "numeric",
                                })
                              : "—"}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => router.push(`/dashboard/documents/preview/${doc.uuid}`)}
                              className="p-1.5 rounded-lg border border-border bg-bg-base hover:border-secondary hover:bg-surface transition-all"
                              title="View document"
                            >
                              <Eye className="w-3.5 h-3.5 text-text-secondary" />
                            </button>
                            {doc.status !== "finalised" && doc.status !== "archived" && (
                              <button
                                onClick={() => router.push(`/dashboard/documents/edit/${doc.uuid}`)}
                                className="p-1.5 rounded-lg border border-border bg-bg-base hover:border-secondary hover:bg-surface transition-all"
                                title="Edit document"
                              >
                                <Edit className="w-3.5 h-3.5 text-text-secondary" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(doc.uuid!, doc.document_name)}
                              disabled={deletingId === doc.uuid}
                              className="p-1.5 rounded-lg border transition-all disabled:opacity-50"
                              style={{
                                borderColor: "rgba(239,68,68,.3)",
                                background:  "rgba(239,68,68,.06)",
                              }}
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Pagination ─────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-text-muted">
                  Page {page} of {totalPages} · {total} document{total !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-border rounded-lg bg-surface hover:bg-bg-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-text-secondary" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pg = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className="w-8 h-8 rounded-lg text-xs font-semibold border transition-all"
                        style={{
                          background: pg === page ? "var(--accent)" : "var(--bg-surface)",
                          color:      pg === page ? "#fff" : "var(--text-secondary)",
                          borderColor: pg === page ? "var(--accent)" : "var(--border)",
                        }}
                      >
                        {pg}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-border rounded-lg bg-surface hover:bg-bg-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
