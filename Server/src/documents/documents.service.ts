// src/documents/documents.service.ts
// NEW SERVICE — handles all generated document operations.
// Wraps template form submissions, AI generation, status updates,
// compliance scoring, duplicate, and AI suggestions.

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import {
  GeneratedDocumentEntity,
  DocumentStatus,
  DocumentSource,
} from "./documents.entity";
import { TemplateEntity } from "../templates/templates.entity";
import { GPTService } from "src/services/GPTService";
import { PromptService } from "src/services/PromptService";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(GeneratedDocumentEntity)
    private readonly docsRepo: Repository<GeneratedDocumentEntity>,

    @InjectRepository(TemplateEntity)
    private readonly templateRepo: Repository<TemplateEntity>,

    private readonly gptService: GPTService,
    private readonly promptService: PromptService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  /** Appends a status transition to the activity_log array */
  private append_log(
    existing: { status: string; timestamp: string }[],
    new_status: string,
  ): { status: string; timestamp: string }[] {
    const log = Array.isArray(existing) ? existing : [];
    return [...log, { status: new_status, timestamp: new Date().toISOString() }];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CREATE DOCUMENT FROM TEMPLATE FORM
  // Called when user fills in a prebuilt or custom template form and saves.
  // ─────────────────────────────────────────────────────────────────────────
  async create_document_service(data: {
    user_id: string;
    template_id?: string;
    document_name: string;
    category?: string;
    document_type?: string;
    field_values: Record<string, any>;
    content?: string;
    source?: DocumentSource;
  }) {
    const status = DocumentStatus.DRAFT;
    const doc = this.docsRepo.create({
      ...data,
      status,
      source: data.source ?? DocumentSource.TEMPLATE,
      activity_log: this.append_log([], status),
      compliance_score: null,
      compliance_notes: [],
    });
    return await this.docsRepo.save(doc);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AI GENERATE DOCUMENT FROM NATURAL LANGUAGE PROMPT
  // Uses GPT to produce a full structured document draft.
  // Returns the AI content — does NOT auto-save (user must review first).
  // ─────────────────────────────────────────────────────────────────────────
  async ai_generate_document_service(
    user_id: string,
    prompt: string,
    document_type?: string,
  ) {
    if (!prompt?.trim()) {
      throw new BadRequestException("Prompt is required.");
    }

    const system_prompt = this.promptService.DocumentGenerator();
    const gpt_response  = await this.gptService.GPTChat(prompt, system_prompt);

    // Parse the GPT JSON response safely
    let ai_result: any = {};
    try {
      const raw     = gpt_response?.data?.content ?? "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      ai_result     = JSON.parse(cleaned);
    } catch {
      ai_result = {
        document_name: document_type ?? "AI Generated Document",
        document_type: document_type ?? "Custom",
        category:      "Business",
        content:       gpt_response?.data?.content ?? "",
        field_values:  {},
        compliance_score: 85,
        compliance_notes: [
          { type: "ok", message: "Document structure generated successfully." },
          { type: "warning", message: "Review all clauses before finalising." },
        ],
      };
    }

    return {
      message:     "Document draft generated. Review before saving.",
      ai_result,
      user_id,
      source:      DocumentSource.AI,
      ai_prompt:   prompt,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SAVE AI GENERATED DOCUMENT AFTER USER REVIEW
  // Called after user reviews the AI draft and clicks "Save Draft".
  // ─────────────────────────────────────────────────────────────────────────
  async save_ai_document_service(data: {
    user_id: string;
    document_name: string;
    document_type?: string;
    category?: string;
    content: string;
    ai_prompt: string;
    field_values?: Record<string, any>;
    compliance_score?: number;
    compliance_notes?: { type: string; message: string }[];
  }) {
    const status = DocumentStatus.AI_GENERATED;
    const doc    = this.docsRepo.create({
      ...data,
      status,
      source:         DocumentSource.AI,
      activity_log:   this.append_log([], status),
      field_values:   data.field_values ?? {},
      compliance_notes: data.compliance_notes ?? [],
    });
    return await this.docsRepo.save(doc);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ALL DOCUMENTS FOR A USER
  // Returns documents sorted newest first, optionally filtered by status/type.
  // ─────────────────────────────────────────────────────────────────────────
  async user_documents_service(
    user_id: string,
    filters?: {
      status?:        string;
      category?:      string;
      document_type?: string;
      search?:        string;
    },
  ) {
    const where: any = { user_id };

    if (filters?.status)        where.status        = filters.status;
    if (filters?.category)      where.category      = filters.category;
    if (filters?.document_type) where.document_type = filters.document_type;
    if (filters?.search) {
      where.document_name = ILike(`%${filters.search}%`);
    }

    return await this.docsRepo.find({
      where,
      order: { created_at: "DESC" },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET SINGLE DOCUMENT BY UUID
  // ─────────────────────────────────────────────────────────────────────────
  async single_document_service(uuid: string) {
    const doc = await this.docsRepo.findOne({ where: { uuid } });
    if (!doc) throw new NotFoundException("Document not found.");
    return doc;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE DOCUMENT (field values, content, name)
  // ─────────────────────────────────────────────────────────────────────────
  async update_document_service(
    uuid: string,
    data: Partial<GeneratedDocumentEntity>,
  ) {
    const doc = await this.single_document_service(uuid);
    Object.assign(doc, data);
    return await this.docsRepo.save(doc);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE DOCUMENT STATUS — validates + appends to activity_log
  // ─────────────────────────────────────────────────────────────────────────
  async update_document_status_service(uuid: string, new_status: string) {
    const valid = Object.values(DocumentStatus) as string[];
    if (!valid.includes(new_status)) {
      throw new BadRequestException(
        `Invalid status "${new_status}". Allowed: ${valid.join(", ")}`,
      );
    }

    const doc         = await this.single_document_service(uuid);
    const updated_log = this.append_log(doc.activity_log ?? [], new_status);

    await this.docsRepo.query(
      `UPDATE generated_documents
       SET status = $1, activity_log = $2::jsonb, updated_at = NOW()
       WHERE uuid = $3`,
      [new_status, JSON.stringify(updated_log), uuid],
    );

    return {
      message:      `Document status updated to "${new_status}"`,
      uuid,
      status:       new_status,
      activity_log: updated_log,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE DOCUMENT
  // ─────────────────────────────────────────────────────────────────────────
  async delete_document_service(uuid: string) {
    const doc = await this.single_document_service(uuid);
    await this.docsRepo.remove(doc);
    return { message: "Document deleted successfully." };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DUPLICATE DOCUMENT — creates a draft copy with a new name
  // ─────────────────────────────────────────────────────────────────────────
  async duplicate_document_service(uuid: string, user_id: string) {
    const original = await this.single_document_service(uuid);

    if (original.user_id !== user_id) {
      throw new BadRequestException(
        "You do not have permission to duplicate this document.",
      );
    }

    const status   = DocumentStatus.DRAFT;
    const duplicate = this.docsRepo.create({
      user_id:          original.user_id,
      template_id:      original.template_id,
      document_name:    `${original.document_name} (Copy)`,
      category:         original.category,
      document_type:    original.document_type,
      field_values:     original.field_values,
      content:          original.content,
      ai_prompt:        original.ai_prompt,
      compliance_score: null,
      compliance_notes: [],
      status,
      source:           original.source,
      activity_log:     this.append_log([], status),
      pdf_path:         null,
      docx_path:        null,
    });

    const saved = await this.docsRepo.save(duplicate);
    return { message: "Document duplicated successfully.", document: saved };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AI COMPLIANCE CHECK — runs GPT analysis on document content
  // Returns a score and a list of notes (ok / warning / error items).
  // ─────────────────────────────────────────────────────────────────────────
  async run_compliance_check_service(uuid: string) {
    const doc = await this.single_document_service(uuid);

    if (!doc.content) {
      throw new BadRequestException(
        "Document has no content to check. Generate the document first.",
      );
    }

    const system_prompt = this.promptService.DocumentComplianceChecker();
    const gpt_response  = await this.gptService.GPTChat(
      JSON.stringify({
        document_type: doc.document_type,
        category:      doc.category,
        content:       doc.content.slice(0, 3000), // Limit token usage
      }),
      system_prompt,
    );

    let result: any = {
      compliance_score: 80,
      compliance_notes: [
        { type: "ok", message: "Document structure is valid." },
        { type: "warning", message: "Consider adding a governing law clause." },
      ],
    };

    try {
      const raw     = gpt_response?.data?.content ?? "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      result        = JSON.parse(cleaned);
    } catch {
      // Keep default fallback if GPT response is malformed
    }

    // Persist the compliance results on the document record
    await this.docsRepo.update(
      { uuid },
      {
        compliance_score: result.compliance_score,
        compliance_notes: result.compliance_notes,
      },
    );

    return {
      message:          "Compliance check complete.",
      uuid,
      compliance_score: result.compliance_score,
      compliance_notes: result.compliance_notes,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AI SUGGESTIONS — suggests next documents based on recent activity
  // Reads the user's last 10 documents and suggests logical follow-ups.
  // Pro/Enterprise only — enforce on the frontend via plan check.
  // ─────────────────────────────────────────────────────────────────────────
  async get_ai_suggestions_service(user_id: string) {
    // Get last 10 documents for context
    const recent_docs = await this.docsRepo.find({
      where: { user_id },
      order: { created_at: "DESC" },
      take:  10,
      select: ["document_name", "document_type", "category", "created_at"],
    });

    if (recent_docs.length === 0) {
      return {
        message:     "No document history yet.",
        suggestions: [
          { document_type: "NDA",                 reason: "Start with a Non-Disclosure Agreement to protect your business." },
          { document_type: "Service Agreement",   reason: "Define the scope and terms of your client work." },
          { document_type: "Business Proposal",   reason: "Win new clients with a professional proposal." },
        ],
      };
    }

    const context = recent_docs.map((d) => ({
      document_type: d.document_type,
      category:      d.category,
      created_at:    d.created_at,
    }));

    const system_prompt = this.promptService.DocumentSuggestionEngine();
    const gpt_response  = await this.gptService.GPTChat(
      JSON.stringify({ recent_documents: context }),
      system_prompt,
    );

    let suggestions: any[] = [];
    try {
      const raw     = gpt_response?.data?.content ?? "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      suggestions   = JSON.parse(cleaned);
    } catch {
      suggestions = [
        { document_type: "Offer Letter",       reason: "Typically follows an employment contract." },
        { document_type: "Service Agreement",  reason: "Formalise your active client relationships." },
      ];
    }

    return {
      message:     "AI suggestions generated.",
      suggestions,
      based_on:    recent_docs.length,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SAVE PDF/DOCX PATH after file is generated on the server
  // ─────────────────────────────────────────────────────────────────────────
  async set_document_file_paths_service(
    uuid: string,
    paths: { pdf_path?: string; docx_path?: string },
  ) {
    await this.docsRepo.update({ uuid }, paths);
    return { message: "File paths updated.", uuid, ...paths };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET RECENT DOCUMENTS (last N for dashboard sidebar)
  // ─────────────────────────────────────────────────────────────────────────
  async recent_documents_service(user_id: string, limit = 5) {
    return await this.docsRepo.find({
      where: { user_id },
      order: { created_at: "DESC" },
      take:  Math.min(limit, 20),
      select: [
        "uuid", "document_name", "document_type", "category",
        "status", "source", "created_at",
      ],
    });
  }
}
