"use client";
// src/hooks/useDocumentAI.ts
// Centralises all AI-related document API calls.
// Used by: document dashboard, DocumentForm, preview page.

import { useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { AiDocumentSuggestion, ComplianceNote } from "@/lib/documentTypes";

// ─── Generate full document from prompt (does NOT save) ─────────────────────
export function useAiDocumentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const generate = useCallback(
    async (userId: string, prompt: string, documentType?: string) => {
      setIsGenerating(true);
      setError(null);
      try {
        const res = await axiosInstance.post("/documents/ai-generate", {
          user_id:       userId,
          prompt,
          document_type: documentType,
        });
        if (res.status === 201) return res.data; // { ai_result, user_id, source, ai_prompt }
        return null;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "AI generation failed. Please try again.";
        setError(msg);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [],
  );

  return { generate, isGenerating, error };
}

// ─── Generate template fields from prompt (POST /templates/ai-generate) ──────
export function useAiTemplateGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const generate = useCallback(
    async (userId: string, prompt: string, templateName?: string) => {
      setIsGenerating(true);
      setError(null);
      try {
        const res = await axiosInstance.post("/templates/ai-generate", {
          user_id:       userId,
          prompt,
          template_name: templateName,
        });
        if (res.status === 201) return res.data; // { template, fields }
        return null;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Template generation failed.";
        setError(msg);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [],
  );

  return { generate, isGenerating, error };
}

// ─── Run AI compliance check on an existing document ─────────────────────────
export function useDocumentCompliance() {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult]         = useState<{
    compliance_score: number;
    compliance_notes: ComplianceNote[];
  } | null>(null);

  const check = useCallback(async (documentUuid: string) => {
    setIsChecking(true);
    try {
      const res = await axiosInstance.post(
        `/documents/compliance-check/${documentUuid}`,
      );
      if (res.status === 200) {
        setResult({
          compliance_score: res.data.compliance_score,
          compliance_notes: res.data.compliance_notes,
        });
        return res.data;
      }
      return null;
    } catch {
      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { check, isChecking, result };
}

// ─── Fetch AI document suggestions for the sidebar ───────────────────────────
export function useDocumentSuggestions() {
  const [suggestions, setSuggestions] = useState<AiDocumentSuggestion[]>([]);
  const [isLoading, setIsLoading]     = useState(false);

  const fetch = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/documents/ai-suggestions/${userId}`);
      if (res.status === 200) setSuggestions(res.data.suggestions ?? []);
    } catch {
      // Non-fatal — sidebar just stays empty
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { suggestions, isLoading, fetch };
}

// ─── Duplicate a document ────────────────────────────────────────────────────
export function useDocumentDuplicate() {
  const [isDuplicating, setIsDuplicating] = useState(false);

  const duplicate = useCallback(
    async (documentUuid: string, userId: string) => {
      setIsDuplicating(true);
      try {
        const res = await axiosInstance.post("/documents/duplicate", {
          document_uuid: documentUuid,
          user_id:       userId,
        });
        if (res.status === 201) return res.data.document;
        return null;
      } catch {
        return null;
      } finally {
        setIsDuplicating(false);
      }
    },
    [],
  );

  return { duplicate, isDuplicating };
}
