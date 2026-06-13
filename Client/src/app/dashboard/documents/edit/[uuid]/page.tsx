"use client";
// src/app/dashboard/documents/edit/[uuid]/page.tsx
//
// NEW — Edit a saved document's field values and content.
// Fixes the broken "Edit document" button on the preview page.
// Calls:
//   GET /documents/single/:uuid  — load
//   PUT /documents/update/:uuid  — save
//   PATCH /documents/status/:uuid (status: "draft") — revert to draft if editing an approved doc

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter }  from "next/navigation";
import {
  FileText, Save, ArrowLeft, Loader2, AlertTriangle, RefreshCw,
} from "lucide-react";
import DashboardLayout  from "@/components/layout/DashboardLayout";
import PageHeader       from "@/components/page-header/PageHeader";
import LoadingSpinner   from "@/components/loading-spinner/LoadingSpinner";
import Button           from "@/components/ui/Button";
import axiosInstance    from "@/utils/axiosInstance";
import toast            from "react-hot-toast";
import { GeneratedDocument } from "@/lib/documentTypes";

// ─── Flatten nested JSONB field_values for editing ───────────────────────────
function flattenObject(obj: any, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(result, flattenObject(v, key));
    } else {
      result[key] = String(v ?? "");
    }
  }
  return result;
}

// ─── Re-nest flattened fields back to JSONB-compatible shape ─────────────────
function nestObject(flat: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split(".");
    let cursor  = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") {
        cursor[parts[i]] = {};
      }
      cursor = cursor[parts[i]];
    }
    cursor[parts[parts.length - 1]] = value;
  }
  return result;
}

// ─── Friendly label from field key ───────────────────────────────────────────
function fieldLabel(key: string): string {
  return key
    .replace(/^(header\.|main\.|footer\.)/, "")
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Inner component (needs useParams) ───────────────────────────────────────
function EditDocumentInner() {
  const params = useParams();
  const router = useRouter();
  const uuid   = params?.uuid as string;

  const [doc,         setDoc]         = useState<GeneratedDocument | null>(null);
  const [fields,      setFields]      = useState<Record<string, string>>({});
  const [content,     setContent]     = useState("");
  const [name,        setName]        = useState("");
  const [isLoading,   setIsLoading]   = useState(true);
  const [isSaving,    setIsSaving]    = useState(false);
  const [isDirty,     setIsDirty]     = useState(false);
  const [showRevertWarning, setShowRevertWarning] = useState(false);

  // ── Load document ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!uuid) return;
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/documents/single/${uuid}`);
        const d: GeneratedDocument = res.data?.data ?? res.data;
        setDoc(d);
        setName(d.document_name ?? "");
        setContent(d.content ?? "");
        setFields(flattenObject(d.field_values ?? {}));
      } catch {
        toast.error("Could not load document.");
        router.push("/dashboard/documents/list");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [uuid]);

  // Warn if user tries to edit an approved/finalised doc
  useEffect(() => {
    if (doc && (doc.status === "approved" || doc.status === "finalised")) {
      setShowRevertWarning(true);
    }
  }, [doc]);

  // ── Track changes ─────────────────────────────────────────────────────────
  const setField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };
  const setNameDirty = (v: string) => { setName(v); setIsDirty(true); };
  const setContentDirty = (v: string) => { setContent(v); setIsDirty(true); };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!uuid || !name.trim()) return toast.error("Document name is required.");
    setIsSaving(true);
    try {
      // If doc was approved/finalised, revert to draft first
      if (doc?.status === "approved" || doc?.status === "finalised") {
        await axiosInstance.patch(`/documents/status/${uuid}`, { status: "draft" });
      }

      await axiosInstance.put(`/documents/update/${uuid}`, {
        document_name: name.trim(),
        content,
        field_values:  nestObject(fields),
      });

      toast.success("Document saved. Status reset to Draft for re-review.");
      setIsDirty(false);
      router.push(`/dashboard/documents/preview/${uuid}`);
    } catch {
      toast.error("Failed to save document. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && !confirm("Discard unsaved changes?")) return;
    router.push(`/dashboard/documents/preview/${uuid}`);
  };

  const inputCls  = "w-full px-3 py-2.5 border border-border rounded-lg bg-bg-base text-text-heading text-sm focus:outline-none focus:ring-1 focus:ring-secondary transition-all";
  const sectionCls= "bg-surface border border-border rounded-xl p-5 space-y-4";

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="w-8 h-8" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 mb-8">

        <PageHeader
          title="Edit Document"
          icon={<FileText size={24} />}
          description={name}
          action={
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleCancel}
                className="bg-surface border border-border text-text-secondary hover:bg-bg-base"
                startIcon={<ArrowLeft className="w-4 h-4" />}
              >
                {isDirty ? "Discard" : "Back"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                startIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          }
        />

        <div className="max-w-3xl mx-auto space-y-5">

          {/* Warning for approved/finalised docs */}
          {showRevertWarning && (
            <div className="flex items-start gap-3 p-4 rounded-xl border"
              style={{ background: "rgba(245,158,11,.06)", borderColor: "rgba(245,158,11,.25)" }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#D97706" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#D97706" }}>
                  This document is {doc?.status}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  Saving changes will reset the status back to <strong>Draft</strong> so it can go through review again. The activity log will record this change.
                </p>
              </div>
              <button onClick={() => setShowRevertWarning(false)} className="ml-auto text-text-muted hover:text-text-heading flex-shrink-0">×</button>
            </div>
          )}

          {/* Document name */}
          <div className={sectionCls}>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                Document Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setNameDirty(e.target.value)}
                className={inputCls}
                placeholder="e.g. NDA — Tech Solutions LLC"
              />
            </div>
          </div>

          {/* Field values */}
          {Object.keys(fields).length > 0 && (
            <div className={sectionCls}>
              <h3 className="text-sm font-semibold text-text-heading flex items-center gap-2">
                <FileText className="w-4 h-4 text-text-muted" />
                Document Fields
                <span className="text-xs text-text-muted font-normal ml-auto">
                  {Object.keys(fields).length} field{Object.keys(fields).length !== 1 ? "s" : ""}
                </span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(fields).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      {fieldLabel(key)}
                    </label>
                    {val.length > 80 ? (
                      <textarea
                        value={val}
                        onChange={(e) => setField(key, e.target.value)}
                        className={`${inputCls} resize-none`}
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setField(key, e.target.value)}
                        className={inputCls}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document content — editable for AI-generated and custom docs */}
          {(doc?.source === "ai" || doc?.source === "custom" || content) && (
            <div className={sectionCls}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-heading flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-text-muted" />
                  Document Content
                </h3>
                {doc?.source === "ai" && (
                  <span className="text-xs text-indigo-600 font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(99,102,241,.1)" }}>
                    AI Generated
                  </span>
                )}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContentDirty(e.target.value)}
                className={`${inputCls} resize-y font-mono text-xs`}
                rows={20}
                placeholder="Document content will appear here…"
              />
              <p className="text-xs text-text-muted">
                This is the raw content used when generating the PDF. For AI documents, edit the prose here directly.
              </p>
            </div>
          )}

          {/* Bottom save bar */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={handleCancel}
              className="bg-surface border border-border text-text-secondary hover:bg-bg-base"
            >
              {isDirty ? "Discard Changes" : "Back"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              startIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Suspense wrapper (required for useParams in Next.js 15) ─────────────────
export default function EditDocumentPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner size="w-8 h-8" />
        </div>
      </DashboardLayout>
    }>
      <EditDocumentInner />
    </Suspense>
  );
}
