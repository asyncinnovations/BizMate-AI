// src/lib/documentTypes.ts
// Single source of truth for all document generator TypeScript types.

export type DocumentStatus =
  | "draft"
  | "ai_generated"
  | "under_review"
  | "approved"
  | "finalised"
  | "archived";

export type DocumentSource = "template" | "ai" | "custom";

export interface ActivityEntry {
  status: DocumentStatus;
  timestamp: string;
}

export interface ComplianceNote {
  type: "ok" | "warning" | "error";
  message: string;
}

export interface GeneratedDocument {
  uuid?: string;
  user_id: string;
  template_id?: string | null;
  document_name: string;
  category?: string;
  document_type?: string;
  field_values: Record<string, any>;
  content?: string;
  ai_prompt?: string;
  compliance_score?: number | null;
  compliance_notes?: ComplianceNote[];
  status: DocumentStatus;
  source: DocumentSource;
  activity_log?: ActivityEntry[];
  pdf_path?: string | null;
  docx_path?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentTemplate {
  uuid: string;
  id?: string;
  template_name: string;
  description: string;
  category?: string;
  fields_schema: Record<string, string>;
  user_id: string | null;
  is_prebuilt: boolean;
  ai_prompt?: string;
}

export interface TemplateField {
  uuid?: string;
  id?: string;
  unique_id?: string;
  template_id: string;
  field_name: string;
  field_type: "text" | "email" | "date" | "number" | "textarea" | "select";
  placeholder: string;
  field_value?: string;
  required: boolean;
  options?: string[];
  aiSuggestion?: string;
  helpText?: string;
}

export interface AiDocumentSuggestion {
  document_type: string;
  category: string;
  reason: string;
}

export const ALL_DOCUMENT_STATUSES: DocumentStatus[] = [
  "draft", "ai_generated", "under_review", "approved", "finalised", "archived",
];

export const DOCUMENT_CATEGORIES = [
  "All", "Legal", "HR", "Finance", "Operations", "Business",
] as const;

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number];
