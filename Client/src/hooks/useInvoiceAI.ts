"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useInvoiceAI.ts
// NEW — centralises all AI API calls for the invoice feature.
//
// Used by:
//   • InvoiceCreationMethodModal  (creation method selection)
//   • AiInvoiceGeneratorModal     (prompt → draft)
//   • AiSuggestionsSidebar        (create form sidebar)
//   • AiInsightsPanel             (preview page)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { AiInsights, AiSuggestionsResponse } from "@/lib/invoiceTypes";

// ─── Generate AI invoice draft from a natural language prompt ─────────────────
export function useAiInvoiceGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string): Promise<any | null> => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/invoices/generate_invoice", { prompt });
      if (res.status === 201) {
        // Backend returns GPT JSON string inside data.response.data.content
        const rawContent = res.data.response?.data?.content ?? "";
        const cleaned    = rawContent.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
      }
      return null;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "AI generation failed. Please try again.";
      setError(msg);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generate, isGenerating, error };
}

// ─── Fetch AI insights for a specific invoice (Pro / Enterprise only) ─────────
export function useAiInsights() {
  const [insights, setInsights]   = useState<AiInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const fetch = useCallback(async (invoiceId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/invoices/ai-insights/${invoiceId}`);
      if (res.status === 200) {
        setInsights(res.data.insights);
      }
    } catch (err: any) {
      setError("Could not load AI insights.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { insights, isLoading, error, fetch };
}

// ─── Fetch AI suggestions for the create form sidebar ────────────────────────
export function useAiSuggestions() {
  const [data, setData]           = useState<AiSuggestionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const fetch = useCallback(async (userId: string, customerName: string) => {
    if (!customerName || customerName.trim().length < 3) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/invoices/ai-suggestions", {
        params: { user_id: userId, customer_name: customerName.trim() },
      });
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (err: any) {
      setError("Could not load suggestions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setData(null); setError(null); }, []);

  return { data, isLoading, error, fetch, reset };
}

// ─── Duplicate an invoice ────────────────────────────────────────────────────
export function useInvoiceDuplicate() {
  const [isDuplicating, setIsDuplicating] = useState(false);

  const duplicate = useCallback(async (invoiceId: string, userId: string) => {
    setIsDuplicating(true);
    try {
      const res = await axiosInstance.post("/invoices/duplicate", {
        invoice_id: invoiceId,
        user_id:    userId,
      });
      if (res.status === 201) {
        return res.data.invoice; // Returns the new invoice object
      }
      return null;
    } catch {
      return null;
    } finally {
      setIsDuplicating(false);
    }
  }, []);

  return { duplicate, isDuplicating };
}
