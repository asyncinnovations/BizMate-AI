"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiReminderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ai_reminder_entity_1 = require("./ai_reminder.entity");
const GPTService_1 = require("../services/GPTService");
const PromptService_1 = require("../services/PromptService");
let AiReminderService = class AiReminderService {
    aiReminderRepo;
    gptService;
    promptService;
    constructor(aiReminderRepo, gptService, promptService) {
        this.aiReminderRepo = aiReminderRepo;
        this.gptService = gptService;
        this.promptService = promptService;
    }
    async create_reminder_service(data) {
        const reminder = this.aiReminderRepo.create(data);
        return await this.aiReminderRepo.save(reminder);
    }
    async all_reminders_service(user_id, filters) {
        const where = {};
        if (user_id)
            where.user_id = user_id;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.type)
            where.type = filters.type;
        if (filters?.from && filters?.to)
            where.reminder_date = (0, typeorm_2.Between)(filters.from, filters.to);
        return await this.aiReminderRepo.find({
            where,
            order: { reminder_date: "ASC" },
        });
    }
    async single_reminder_service(uuid) {
        const reminder = await this.aiReminderRepo.findOne({ where: { uuid } });
        if (!reminder)
            throw new common_1.NotFoundException("Reminder not found");
        return reminder;
    }
    async user_reminder_service(user_id) {
        const reminder = await this.aiReminderRepo.query(`SELECT ar.*, u.full_name, u.email
       FROM ai_reminders AS ar
       JOIN users AS u ON ar.user_id = u.uuid
       WHERE ar.user_id = $1`, [user_id]);
        if (!reminder || reminder.length === 0)
            throw new common_1.NotFoundException("No reminders found for this user");
        return reminder;
    }
    async update_reminder_service(uuid, data) {
        const reminder = await this.single_reminder_service(uuid);
        Object.assign(reminder, data);
        return await this.aiReminderRepo.save(reminder);
    }
    async delete_reminder_service(uuid) {
        const reminder = await this.single_reminder_service(uuid);
        return await this.aiReminderRepo.remove(reminder);
    }
    async update_reminder_status_service(uuid, status) {
        const reminder = await this.single_reminder_service(uuid);
        reminder.status = status;
        return await this.aiReminderRepo.save(reminder);
    }
    async recurring_reminder_servcie(user_id) {
        return await this.aiReminderRepo.find({
            where: {
                user_id,
                recurrence_rule: (0, typeorm_2.In)(["monthly", "quarterly", "yearly"]),
            },
        });
    }
    async upcoming_reminder_service(daysAhead = 3) {
        const now = new Date();
        const future = new Date();
        future.setDate(now.getDate() + daysAhead);
        return await this.aiReminderRepo.find({
            where: { reminder_date: (0, typeorm_2.Between)(now, future), status: "pending" },
        });
    }
    async create_bulk_reminders_service(reminders) {
        const created = this.aiReminderRepo.create(reminders);
        return await this.aiReminderRepo.save(created);
    }
    async generate_ai_reminder_service(data) {
        data.status = "pending";
        const reminder = this.aiReminderRepo.create({
            ...data,
            notify_channels: data.notify_channels || {
                email: true,
                whatsapp: false,
                push: true,
            },
        });
        return await this.aiReminderRepo.save(reminder);
    }
    async ai_generate_from_prompt_service(user_id, prompt) {
        if (!prompt?.trim()) {
            throw new common_1.BadRequestException("Prompt is required.");
        }
        const system_prompt = this.promptService.ComplianceAIPrompt();
        const gpt_response = await this.gptService.GPTChat(prompt, system_prompt);
        let ai_result = {};
        try {
            const raw = gpt_response?.data?.content ?? "";
            const cleaned = raw.replace(/```json|```/g, "").trim();
            ai_result = JSON.parse(cleaned);
        }
        catch {
            ai_result = {
                type: "Custom",
                title: prompt.slice(0, 80),
                description: gpt_response?.data?.content ?? "",
                reminder_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
                notify_before: 3,
                recurrence_rule: "none",
                notify_channels: { email: true, whatsapp: false, push: true },
            };
        }
        const normalised = {
            type: ai_result.reminder_type ?? ai_result.type ?? "Custom",
            title: ai_result.title ?? prompt.slice(0, 80),
            description: ai_result.description ?? "",
            reminder_date: ai_result.reminder_date
                ? ai_result.reminder_date.split(" ")[0]
                : new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
            notify_before: Number(ai_result.notify_before ?? 3),
            recurrence_rule: ai_result.recurrence_rule ?? "none",
            notify_channels: ai_result.notify_channels ?? {
                email: true, whatsapp: false, push: true,
            },
            ai_prompt: prompt,
            source: "ai",
        };
        return {
            message: "Reminder draft generated. Review before saving.",
            ai_result: normalised,
            user_id,
        };
    }
    async get_module_suggestions_service(user_id) {
        const existing = await this.aiReminderRepo.find({
            where: { user_id, status: "pending" },
            select: ["reference_id"],
        });
        const existing_refs = new Set(existing.map((r) => r.reference_id).filter(Boolean));
        const overdue_invoices = await this.aiReminderRepo.query(`SELECT uuid, invoice_number, customer_name, due_date, status
       FROM invoices
       WHERE user_id = $1
         AND status IN ('unpaid', 'overdue')
         AND due_date < NOW()
       ORDER BY due_date ASC
       LIMIT 5`, [user_id]).catch(() => []);
        const expiring_quotations = await this.aiReminderRepo.query(`SELECT uuid, quotation_number, project_title, client_name, expiry_date, status
       FROM quotations
       WHERE user_id = $1
         AND status IN ('sent', 'viewed')
         AND expiry_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
       ORDER BY expiry_date ASC
       LIMIT 5`, [user_id]).catch(() => []);
        const pending_documents = await this.aiReminderRepo.query(`SELECT uuid, document_name, document_type, status, created_at
       FROM generated_documents
       WHERE user_id = $1
         AND status IN ('draft', 'ai_generated', 'under_review')
         AND created_at > NOW() - INTERVAL '7 days'
       ORDER BY created_at DESC
       LIMIT 3`, [user_id]).catch(() => []);
        const suggestions = [];
        for (const inv of overdue_invoices) {
            if (existing_refs.has(inv.uuid))
                continue;
            const days_overdue = Math.floor((Date.now() - new Date(inv.due_date).getTime()) / 86400000);
            suggestions.push({
                type: "Invoice",
                source: "invoice",
                reference_id: inv.uuid,
                reference_type: "Invoice",
                title: `Follow up: ${inv.invoice_number} — ${inv.customer_name}`,
                description: `Invoice is ${days_overdue} day${days_overdue !== 1 ? "s" : ""} overdue. Send a payment reminder.`,
                suggested_date: new Date().toISOString().split("T")[0],
                notify_before: 1,
                priority: "high",
            });
        }
        for (const qt of expiring_quotations) {
            if (existing_refs.has(qt.uuid))
                continue;
            const days_left = Math.ceil((new Date(qt.expiry_date).getTime() - Date.now()) / 86400000);
            suggestions.push({
                type: "Quotation",
                source: "quotation",
                reference_id: qt.uuid,
                reference_type: "Quotation",
                title: `${qt.quotation_number} expires in ${days_left} day${days_left !== 1 ? "s" : ""}`,
                description: `Quotation for ${qt.client_name} (${qt.project_title ?? ""}) is expiring soon.`,
                suggested_date: new Date(qt.expiry_date).toISOString().split("T")[0],
                notify_before: days_left > 3 ? 3 : 1,
                priority: days_left <= 2 ? "high" : "medium",
            });
        }
        for (const doc of pending_documents) {
            if (existing_refs.has(doc.uuid))
                continue;
            suggestions.push({
                type: "Document",
                source: "document",
                reference_id: doc.uuid,
                reference_type: "Document",
                title: `Review pending: ${doc.document_name}`,
                description: `Document is in "${doc.status}" status and needs your attention.`,
                suggested_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
                notify_before: 1,
                priority: "medium",
            });
        }
        return {
            message: "Module suggestions retrieved.",
            suggestions,
            total: suggestions.length,
        };
    }
    async create_from_module_service(data) {
        const existing = await this.aiReminderRepo.findOne({
            where: {
                user_id: data.user_id,
                reference_id: data.reference_id,
                status: "pending",
            },
        });
        if (existing) {
            return {
                message: "A reminder for this item already exists.",
                reminder: existing,
                duplicate: true,
            };
        }
        const reminder = this.aiReminderRepo.create({
            user_id: data.user_id,
            title: data.title,
            description: data.description ?? "",
            type: data.type,
            source: data.source,
            reference_id: data.reference_id,
            reference_type: data.reference_type,
            reminder_date: new Date(data.reminder_date),
            notify_before: data.notify_before ?? 3,
            notify_channels: data.notify_channels ?? {
                email: true, whatsapp: false, push: true,
            },
            recurrence_rule: data.recurrence_rule ?? "none",
            status: "pending",
        });
        const saved = await this.aiReminderRepo.save(reminder);
        return {
            message: "Reminder created from module suggestion.",
            reminder: saved,
            duplicate: false,
        };
    }
};
exports.AiReminderService = AiReminderService;
exports.AiReminderService = AiReminderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ai_reminder_entity_1.AiReminder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        GPTService_1.GPTService,
        PromptService_1.PromptService])
], AiReminderService);
//# sourceMappingURL=ai_reminder.service.js.map