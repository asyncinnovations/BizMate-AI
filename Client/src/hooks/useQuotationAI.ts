"use client";
// src/hooks/useQuotationAI.ts

import { useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { AiQuotationSuggestion } from "@/lib/quotationTypes";

/** AI generate quotation from prompt — does NOT save, returns draft for review */
export function useAiQuotationGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const generate = useCallback(async (userId: string, prompt: string) => {
    setIsGenerating(true); setError(null);
    try {
      const res = await axiosInstance.post("/quotations/ai-generate", { user_id: userId, prompt });
      if (res.status === 201) return res.data;
      return null;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "AI generation failed. Please try again.");
      return null;
    } finally { setIsGenerating(false); }
  }, []);

  return { generate, isGenerating, error };
}

/** Fetch AI suggestions for the Pro sidebar */
export function useQuotationSuggestions() {
  const [suggestions, setSuggestions] = useState<AiQuotationSuggestion[]>([]);
  const [isLoading, setIsLoading]     = useState(false);

  const fetch = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/quotations/ai-suggestions/${userId}`);
      if (res.status === 200) setSuggestions(res.data.suggestions ?? []);
    } catch { /* non-fatal */ }
    finally { setIsLoading(false); }
  }, []);

  return { suggestions, isLoading, fetch };
}

/** Duplicate a quotation */
export function useQuotationDuplicate() {
  const [isDuplicating, setIsDuplicating] = useState(false);

  const duplicate = useCallback(async (quotationUuid: string, userId: string) => {
    setIsDuplicating(true);
    try {
      const res = await axiosInstance.post("/quotations/duplicate", {
        quotation_uuid: quotationUuid, user_id: userId,
      });
      if (res.status === 201) return res.data.quotation;
      return null;
    } catch { return null; }
    finally { setIsDuplicating(false); }
  }, []);

  return { duplicate, isDuplicating };
}
