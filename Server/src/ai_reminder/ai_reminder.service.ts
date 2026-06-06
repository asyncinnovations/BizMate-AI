// src/ai_reminder/ai_reminder.service.ts
// UPDATED — 3 new service methods added at the bottom.
// All existing methods preserved exactly.

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, In } from "typeorm";
import { AiReminder } from "./ai_reminder.entity";
import { GPTService } from "src/services/GPTService";
import { PromptService } from "src/services/PromptService";

@Injectable()
export class AiReminderService {
  constructor(
    @InjectRepository(AiReminder)
    private readonly aiReminderRepo: Repository<AiReminder>,
    private readonly gptService: GPTService,
    private readonly promptService: PromptService,
  ) {}

  //////////////////////////////////////////////////////
  // CREATE REMINDER
  //////////////////////////////////////////////////////
  async create_reminder_service(data: Partial<AiReminder>) {
    const reminder = this.aiReminderRepo.create(data);
    return await this.aiReminderRepo.save(reminder);
  }

  //////////////////////////////////////////////////////
  // GET ALL REMINDERS
  //////////////////////////////////////////////////////
  async all_reminders_service(user_id?: string, filters?: any) {
    const where: any = {};
    if (user_id) where.user_id = user_id;
    if (filters?.status) where.status = filters.status;
    if (filters?.type)   where.type   = filters.type;
    if (filters?.from && filters?.to)
      where.reminder_date = Between(filters.from, filters.to);

    return await this.aiReminderRepo.find({
      where,
      order: { reminder_date: "ASC" },
    });
  }

  //////////////////////////////////////////////////////
  // GET REMINDER BY UUID
  //////////////////////////////////////////////////////
  async single_reminder_service(uuid: string) {
    const reminder = await this.aiReminderRepo.findOne({ where: { uuid } });
    if (!reminder) throw new NotFoundException("Reminder not found");
    return reminder;
  }

  //////////////////////////////////////////////////////
  // USER REMINDER BY USER ID
  //////////////////////////////////////////////////////
  async user_reminder_service(user_id: string) {
    const reminder = await this.aiReminderRepo.query(
      `SELECT ar.*, u.full_name, u.email
       FROM ai_reminders AS ar
       JOIN users AS u ON ar.user_id = u.uuid
       WHERE ar.user_id = $1`,
      [user_id],
    );
    if (!reminder || reminder.length === 0)
      throw new NotFoundException("No reminders found for this user");
    return reminder;
  }

  //////////////////////////////////////////////////////
  // UPDATE REMINDER
  //////////////////////////////////////////////////////
  async update_reminder_service(uuid: string, data: Partial<AiReminder>) {
    const reminder = await this.single_reminder_service(uuid);
    Object.assign(reminder, data);
    return await this.aiReminderRepo.save(reminder);
  }

  //////////////////////////////////////////////////////
  // DELETE REMINDER
  //////////////////////////////////////////////////////
  async delete_reminder_service(uuid: string) {
    const reminder = await this.single_reminder_service(uuid);
    return await this.aiReminderRepo.remove(reminder);
  }

  //////////////////////////////////////////////////////
  // MARK REMINDER STATUS
  //////////////////////////////////////////////////////
  async update_reminder_status_service(
    uuid:   string,
    status: AiReminder["status"],
  ) {
    const reminder = await this.single_reminder_service(uuid);
    reminder.status = status;
    return await this.aiReminderRepo.save(reminder);
  }

  //////////////////////////////////////////////////////
  // GET RECURRING REMINDERS
  //////////////////////////////////////////////////////
  async recurring_reminder_servcie(user_id: string) {
    return await this.aiReminderRepo.find({
      where: {
        user_id,
        recurrence_rule: In(["monthly", "quarterly", "yearly"]),
      },
    });
  }

  //////////////////////////////////////////////////////
  // FIND UPCOMING REMINDERS — for notification jobs
  //////////////////////////////////////////////////////
  async upcoming_reminder_service(daysAhead = 3) {
    const now    = new Date();
    const future = new Date();
    future.setDate(now.getDate() + daysAhead);

    return await this.aiReminderRepo.find({
      where: { reminder_date: Between(now, future), status: "pending" },
    });
  }

  //////////////////////////////////////////////////////
  // BULK CREATE — e.g. import from AI assistant
  //////////////////////////////////////////////////////
  async create_bulk_reminders_service(reminders: Partial<AiReminder>[]) {
    const created = this.aiReminderRepo.create(reminders);
    return await this.aiReminderRepo.save(created);
  }

  //////////////////////////////////////////////////////
  // CREATE AI-GENERATED REMINDER (legacy endpoint)
  //////////////////////////////////////////////////////
  async generate_ai_reminder_service(data: Partial<AiReminder>) {
    data.status = "pending";
    const reminder = this.aiReminderRepo.create({
      ...data,
      notify_channels: data.notify_channels || {
        email:    true,
        whatsapp: false,
        push:     true,
      },
    });
    return await this.aiReminderRepo.save(reminder);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW METHODS — added for cross-module intelligence
  // ═══════════════════════════════════════════════════════════════════════════

  //////////////////////////////////////////////////////
  // NEW: AI GENERATE FROM PROMPT
  // Calls GPT to fill reminder fields from plain English.
  // Returns the structured data for the frontend to show
  // in the form — does NOT save until user confirms.
  //////////////////////////////////////////////////////
  async ai_generate_from_prompt_service(user_id: string, prompt: string) {
    if (!prompt?.trim()) {
      throw new BadRequestException("Prompt is required.");
    }

    // Use the existing ComplianceAIPrompt which already handles reminder JSON
    const system_prompt = this.promptService.ComplianceAIPrompt();
    const gpt_response  = await this.gptService.GPTChat(prompt, system_prompt);

    let ai_result: any = {};
    try {
      const raw     = gpt_response?.data?.content ?? "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      ai_result     = JSON.parse(cleaned);
    } catch {
      // GPT returned a non-JSON response — wrap it as a custom reminder
      ai_result = {
        type:        "Custom",
        title:       prompt.slice(0, 80),
        description: gpt_response?.data?.content ?? "",
        reminder_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        notify_before: 3,
        recurrence_rule: "none",
        notify_channels: { email: true, whatsapp: false, push: true },
      };
    }

    // Normalise: if GPT returned the ComplianceAIPrompt reminder shape, flatten it
    const normalised = {
      type:            ai_result.reminder_type ?? ai_result.type ?? "Custom",
      title:           ai_result.title ?? prompt.slice(0, 80),
      description:     ai_result.description ?? "",
      reminder_date:   ai_result.reminder_date
                         ? ai_result.reminder_date.split(" ")[0]
                         : new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      notify_before:   Number(ai_result.notify_before ?? 3),
      recurrence_rule: ai_result.recurrence_rule ?? "none",
      notify_channels: ai_result.notify_channels ?? {
        email: true, whatsapp: false, push: true,
      },
      ai_prompt:       prompt,
      source:          "ai",
    };

    return {
      message:    "Reminder draft generated. Review before saving.",
      ai_result:  normalised,
      user_id,
    };
  }

  //////////////////////////////////////////////////////
  // NEW: GET AI SUGGESTIONS FROM CONNECTED MODULES
  // Reads recent invoices, quotations, and documents for
  // this user and returns suggested reminders.
  // These are suggestions only — nothing is saved.
  //////////////////////////////////////////////////////
  async get_module_suggestions_service(user_id: string) {
    // Check for existing reminders so we don't duplicate
    const existing = await this.aiReminderRepo.find({
      where:  { user_id, status: "pending" },
      select: ["reference_id"],
    });
    const existing_refs = new Set(existing.map((r) => r.reference_id).filter(Boolean));

    // Query overdue invoices
    const overdue_invoices: any[] = await this.aiReminderRepo.query(
      `SELECT uuid, invoice_number, customer_name, due_date, status
       FROM invoices
       WHERE user_id = $1
         AND status IN ('unpaid', 'overdue')
         AND due_date < NOW()
       ORDER BY due_date ASC
       LIMIT 5`,
      [user_id],
    ).catch(() => []);

    // Query expiring quotations (next 7 days)
    const expiring_quotations: any[] = await this.aiReminderRepo.query(
      `SELECT uuid, quotation_number, project_title, client_name, expiry_date, status
       FROM quotations
       WHERE user_id = $1
         AND status IN ('sent', 'viewed')
         AND expiry_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
       ORDER BY expiry_date ASC
       LIMIT 5`,
      [user_id],
    ).catch(() => []);

    // Query documents pending review (last 7 days, still in draft/under_review)
    const pending_documents: any[] = await this.aiReminderRepo.query(
      `SELECT uuid, document_name, document_type, status, created_at
       FROM generated_documents
       WHERE user_id = $1
         AND status IN ('draft', 'ai_generated', 'under_review')
         AND created_at > NOW() - INTERVAL '7 days'
       ORDER BY created_at DESC
       LIMIT 3`,
      [user_id],
    ).catch(() => []);

    const suggestions: any[] = [];

    // Build invoice suggestions
    for (const inv of overdue_invoices) {
      if (existing_refs.has(inv.uuid)) continue;
      const days_overdue = Math.floor(
        (Date.now() - new Date(inv.due_date).getTime()) / 86400000,
      );
      suggestions.push({
        type:          "Invoice",
        source:        "invoice",
        reference_id:  inv.uuid,
        reference_type: "Invoice",
        title:         `Follow up: ${inv.invoice_number} — ${inv.customer_name}`,
        description:   `Invoice is ${days_overdue} day${days_overdue !== 1 ? "s" : ""} overdue. Send a payment reminder.`,
        suggested_date: new Date().toISOString().split("T")[0],
        notify_before:  1,
        priority:       "high",
      });
    }

    // Build quotation suggestions
    for (const qt of expiring_quotations) {
      if (existing_refs.has(qt.uuid)) continue;
      const days_left = Math.ceil(
        (new Date(qt.expiry_date).getTime() - Date.now()) / 86400000,
      );
      suggestions.push({
        type:          "Quotation",
        source:        "quotation",
        reference_id:  qt.uuid,
        reference_type: "Quotation",
        title:         `${qt.quotation_number} expires in ${days_left} day${days_left !== 1 ? "s" : ""}`,
        description:   `Quotation for ${qt.client_name} (${qt.project_title ?? ""}) is expiring soon.`,
        suggested_date: new Date(qt.expiry_date).toISOString().split("T")[0],
        notify_before:  days_left > 3 ? 3 : 1,
        priority:       days_left <= 2 ? "high" : "medium",
      });
    }

    // Build document suggestions
    for (const doc of pending_documents) {
      if (existing_refs.has(doc.uuid)) continue;
      suggestions.push({
        type:          "Document",
        source:        "document",
        reference_id:  doc.uuid,
        reference_type: "Document",
        title:         `Review pending: ${doc.document_name}`,
        description:   `Document is in "${doc.status}" status and needs your attention.`,
        suggested_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        notify_before:  1,
        priority:       "medium",
      });
    }

    return {
      message:     "Module suggestions retrieved.",
      suggestions,
      total:       suggestions.length,
    };
  }

  //////////////////////////////////////////////////////
  // NEW: CREATE REMINDER FROM MODULE (one-click from suggestion)
  // Called when user clicks "Create" on a suggestion card.
  // Pre-fills all fields from the suggestion — user just confirms.
  //////////////////////////////////////////////////////
  async create_from_module_service(data: {
    user_id:        string;
    type:           string;
    source:         string;
    reference_id:   string;
    reference_type: string;
    title:          string;
    description?:   string;
    reminder_date:  string;
    notify_before?: number;
    notify_channels?: { email: boolean; whatsapp: boolean; push: boolean };
    recurrence_rule?: string;
  }) {
    // Safety: do not create duplicate reminders for the same reference
    const existing = await this.aiReminderRepo.findOne({
      where: {
        user_id:      data.user_id,
        reference_id: data.reference_id,
        status:       "pending",
      },
    });

    if (existing) {
      return {
        message:  "A reminder for this item already exists.",
        reminder: existing,
        duplicate: true,
      };
    }

    const reminder = this.aiReminderRepo.create({
      user_id:        data.user_id,
      title:          data.title,
      description:    data.description ?? "",
      type:           data.type as any,
      source:         data.source as any,
      reference_id:   data.reference_id,
      reference_type: data.reference_type,
      reminder_date:  new Date(data.reminder_date),
      notify_before:  data.notify_before ?? 3,
      notify_channels: data.notify_channels ?? {
        email: true, whatsapp: false, push: true,
      },
      recurrence_rule: data.recurrence_rule as any ?? "none",
      status:          "pending",
    });

    const saved = await this.aiReminderRepo.save(reminder);
    return {
      message:   "Reminder created from module suggestion.",
      reminder:  saved,
      duplicate: false,
    };
  }
}
