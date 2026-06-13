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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const quotations_entity_1 = require("./quotations.entity");
const GPTService_1 = require("../services/GPTService");
const PromptService_1 = require("../services/PromptService");
let QuotationsService = class QuotationsService {
    quotationsRepo;
    gptService;
    promptService;
    constructor(quotationsRepo, gptService, promptService) {
        this.quotationsRepo = quotationsRepo;
        this.gptService = gptService;
        this.promptService = promptService;
    }
    append_log(existing, new_status, actor) {
        const log = Array.isArray(existing) ? existing : [];
        return [...log, { status: new_status, timestamp: new Date().toISOString(), ...(actor ? { actor } : {}) }];
    }
    async generate_quotation_number() {
        const year = new Date().getFullYear();
        const prefix = `QT-${year}-`;
        const latest = await this.quotationsRepo
            .createQueryBuilder("q")
            .where("q.quotation_number LIKE :prefix", { prefix: `${prefix}%` })
            .orderBy("q.quotation_number", "DESC")
            .getOne();
        if (!latest)
            return `${prefix}0001`;
        const lastSeq = parseInt(latest.quotation_number.split("-")[2] ?? "0", 10);
        const nextSeq = String(lastSeq + 1).padStart(4, "0");
        return `${prefix}${nextSeq}`;
    }
    calculate_totals(line_items) {
        let subtotal = 0;
        let total_discount = 0;
        let total_tax = 0;
        const calculated_items = (line_items || []).map((item) => {
            const qty = Number(item.quantity) || 0;
            const unit_price = Number(item.unit_price) || 0;
            const disc_pct = Number(item.discount_pct) || 0;
            const tax_pct = Number(item.tax_pct) || 0;
            const base_amount = qty * unit_price;
            const discount_amt = parseFloat(((base_amount * disc_pct) / 100).toFixed(2));
            const after_discount = base_amount - discount_amt;
            const tax_amt = parseFloat(((after_discount * tax_pct) / 100).toFixed(2));
            const line_total = parseFloat((after_discount + tax_amt).toFixed(2));
            subtotal += base_amount;
            total_discount += discount_amt;
            total_tax += tax_amt;
            return {
                ...item,
                id: item.id ?? (0, uuid_1.v4)(),
                line_total,
            };
        });
        subtotal = parseFloat(subtotal.toFixed(2));
        total_discount = parseFloat(total_discount.toFixed(2));
        total_tax = parseFloat(total_tax.toFixed(2));
        const grand_total = parseFloat((subtotal - total_discount + total_tax).toFixed(2));
        return { line_items: calculated_items, subtotal, total_discount, total_tax, grand_total };
    }
    async create_quotation_service(data) {
        const quotation_number = await this.generate_quotation_number();
        const financials = this.calculate_totals(data.line_items);
        const status = quotations_entity_1.QuotationStatus.DRAFT;
        const quotation = this.quotationsRepo.create({
            user_id: data.user_id,
            quotation_number,
            project_title: data.project_title ?? null,
            description: data.description ?? null,
            client_id: data.client_id ?? null,
            client_name: data.client_name,
            client_email: data.client_email ?? null,
            client_address: data.client_address ?? null,
            client_phone: data.client_phone ?? null,
            currency: data.currency ?? "AED",
            line_items: financials.line_items,
            subtotal: financials.subtotal,
            total_discount: financials.total_discount,
            total_tax: financials.total_tax,
            grand_total: financials.grand_total,
            issue_date: new Date(data.issue_date),
            expiry_date: new Date(data.expiry_date),
            terms_and_conditions: data.terms_and_conditions ?? null,
            notes: data.notes ?? null,
            status,
            source: data.source ?? quotations_entity_1.QuotationSource.MANUAL,
            activity_log: this.append_log([], status),
            linked_documents: [],
        });
        return await this.quotationsRepo.save(quotation);
    }
    async ai_generate_quotation_service(user_id, prompt) {
        if (!prompt?.trim()) {
            throw new common_1.BadRequestException("Prompt is required.");
        }
        const system_prompt = this.promptService.QuotationGenerator();
        const gpt_response = await this.gptService.GPTChat(prompt, system_prompt);
        let ai_result = {};
        try {
            const raw = gpt_response?.data?.content ?? "";
            const cleaned = raw.replace(/```json|```/g, "").trim();
            ai_result = JSON.parse(cleaned);
        }
        catch {
            throw new common_1.BadRequestException("AI could not parse a valid quotation from your prompt. Please be more specific.");
        }
        return {
            message: "Quotation draft generated. Review before saving.",
            ai_result,
            user_id,
            source: quotations_entity_1.QuotationSource.AI,
            ai_prompt: prompt,
        };
    }
    async ai_save_quotation_service(data) {
        return await this.create_quotation_service({
            ...data,
            source: quotations_entity_1.QuotationSource.AI,
        });
    }
    async user_quotations_service(user_id, filters) {
        const where = { user_id };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.currency)
            where.currency = filters.currency;
        if (filters?.search)
            where.client_name = (0, typeorm_2.ILike)(`%${filters.search}%`);
        return await this.quotationsRepo.find({
            where,
            order: { created_at: "DESC" },
        });
    }
    async single_quotation_service(uuid) {
        const q = await this.quotationsRepo.findOne({ where: { uuid } });
        if (!q)
            throw new common_1.NotFoundException("Quotation not found.");
        return q;
    }
    async update_quotation_service(uuid, data) {
        const q = await this.single_quotation_service(uuid);
        if (data.line_items) {
            const financials = this.calculate_totals(data.line_items);
            data.line_items = financials.line_items;
            data.subtotal = financials.subtotal;
            data.total_discount = financials.total_discount;
            data.total_tax = financials.total_tax;
            data.grand_total = financials.grand_total;
        }
        Object.assign(q, data);
        return await this.quotationsRepo.save(q);
    }
    async update_quotation_status_service(uuid, new_status, actor) {
        const valid = Object.values(quotations_entity_1.QuotationStatus);
        if (!valid.includes(new_status)) {
            throw new common_1.BadRequestException(`Invalid status "${new_status}". Allowed: ${valid.join(", ")}`);
        }
        const q = await this.single_quotation_service(uuid);
        const updated_log = this.append_log(q.activity_log ?? [], new_status, actor);
        await this.quotationsRepo.query(`UPDATE quotations
       SET status = $1, activity_log = $2::jsonb, updated_at = NOW()
       WHERE uuid = $3`, [new_status, JSON.stringify(updated_log), uuid]);
        return {
            message: `Quotation status updated to "${new_status}"`,
            uuid,
            status: new_status,
            activity_log: updated_log,
        };
    }
    async send_quotation_service(uuid) {
        const q = await this.single_quotation_service(uuid);
        const public_token = (0, uuid_1.v4)().replace(/-/g, "");
        const updated_log = this.append_log(q.activity_log ?? [], quotations_entity_1.QuotationStatus.SENT);
        await this.quotationsRepo.query(`UPDATE quotations
       SET status = $1, public_token = $2, activity_log = $3::jsonb, updated_at = NOW()
       WHERE uuid = $4`, [quotations_entity_1.QuotationStatus.SENT, public_token, JSON.stringify(updated_log), uuid]);
        return {
            message: "Quotation sent successfully. Share the public link with your client.",
            uuid,
            status: quotations_entity_1.QuotationStatus.SENT,
            public_token,
            public_url: `${process.env.APP_URL ?? "https://app.bizmate.ai"}/q/${public_token}`,
        };
    }
    async get_quotation_by_token_service(token) {
        const q = await this.quotationsRepo.findOne({ where: { public_token: token } });
        if (!q)
            throw new common_1.NotFoundException("Quotation not found or link has expired.");
        if (q.status === quotations_entity_1.QuotationStatus.SENT) {
            const updated_log = this.append_log(q.activity_log ?? [], quotations_entity_1.QuotationStatus.VIEWED);
            await this.quotationsRepo.query(`UPDATE quotations
         SET status = $1, viewed_at = NOW(), activity_log = $2::jsonb, updated_at = NOW()
         WHERE uuid = $3`, [quotations_entity_1.QuotationStatus.VIEWED, JSON.stringify(updated_log), q.uuid]);
            q.status = quotations_entity_1.QuotationStatus.VIEWED;
            q.viewed_at = new Date();
        }
        return {
            uuid: q.uuid,
            quotation_number: q.quotation_number,
            project_title: q.project_title,
            description: q.description,
            client_name: q.client_name,
            currency: q.currency,
            line_items: q.line_items,
            subtotal: q.subtotal,
            total_discount: q.total_discount,
            total_tax: q.total_tax,
            grand_total: q.grand_total,
            issue_date: q.issue_date,
            expiry_date: q.expiry_date,
            terms_and_conditions: q.terms_and_conditions,
            notes: q.notes,
            status: q.status,
        };
    }
    async client_action_service(token, action, comment) {
        const q = await this.quotationsRepo.findOne({ where: { public_token: token } });
        if (!q)
            throw new common_1.NotFoundException("Quotation not found or link has expired.");
        if ([quotations_entity_1.QuotationStatus.CONVERTED, quotations_entity_1.QuotationStatus.ARCHIVED].includes(q.status)) {
            throw new common_1.BadRequestException("This quotation has already been finalised.");
        }
        if (action === "comment") {
            await this.quotationsRepo.update({ uuid: q.uuid }, { client_comment: comment ?? "" });
            return { message: "Comment saved.", uuid: q.uuid };
        }
        const new_status = action === "accept" ? quotations_entity_1.QuotationStatus.ACCEPTED : quotations_entity_1.QuotationStatus.REJECTED;
        const updated_log = this.append_log(q.activity_log ?? [], new_status, "client");
        await this.quotationsRepo.query(`UPDATE quotations
       SET status = $1,
           client_comment = $2,
           client_action_at = NOW(),
           activity_log = $3::jsonb,
           updated_at = NOW()
       WHERE uuid = $4`, [new_status, comment ?? null, JSON.stringify(updated_log), q.uuid]);
        return {
            message: action === "accept"
                ? "Quotation accepted. The supplier has been notified."
                : "Quotation rejected. The supplier has been notified.",
            uuid: q.uuid,
            status: new_status,
        };
    }
    async convert_to_invoice_service(uuid, user_id) {
        const q = await this.single_quotation_service(uuid);
        if (q.user_id !== user_id) {
            throw new common_1.BadRequestException("You do not have permission to convert this quotation.");
        }
        if (q.status !== quotations_entity_1.QuotationStatus.ACCEPTED) {
            throw new common_1.BadRequestException(`Only accepted quotations can be converted. Current status: "${q.status}"`);
        }
        if (q.converted_invoice_id) {
            throw new common_1.ConflictException("This quotation has already been converted to an invoice.");
        }
        const invoice_data = {
            user_id: q.user_id,
            customer_name: q.client_name,
            customer_email: q.client_email,
            customer_address: q.client_address,
            invoice_date: new Date().toISOString().split("T")[0],
            due_date: q.expiry_date,
            payment_terms: "Net 30",
            subtotal: q.subtotal,
            vat: q.total_tax,
            total: q.grand_total,
            notes: q.notes,
            status: "draft",
            source: "quotation",
            invoice_items: q.line_items.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description ?? "",
                quantity: item.quantity,
                price: item.unit_price,
                amount: item.line_total,
            })),
            quotation_uuid: q.uuid,
        };
        return {
            message: "Invoice data prepared from quotation. Save it via POST /invoices/create.",
            invoice_data,
            quotation_uuid: q.uuid,
        };
    }
    async mark_as_converted_service(quotation_uuid, invoice_uuid) {
        const updated_log = this.append_log((await this.single_quotation_service(quotation_uuid)).activity_log ?? [], quotations_entity_1.QuotationStatus.CONVERTED);
        await this.quotationsRepo.query(`UPDATE quotations
       SET status = $1, converted_invoice_id = $2, activity_log = $3::jsonb, updated_at = NOW()
       WHERE uuid = $4`, [quotations_entity_1.QuotationStatus.CONVERTED, invoice_uuid, JSON.stringify(updated_log), quotation_uuid]);
        return {
            message: "Quotation marked as converted.",
            quotation_uuid,
            converted_invoice_id: invoice_uuid,
        };
    }
    async duplicate_quotation_service(uuid, user_id) {
        const original = await this.single_quotation_service(uuid);
        if (original.user_id !== user_id) {
            throw new common_1.BadRequestException("You do not have permission to duplicate this quotation.");
        }
        const new_number = await this.generate_quotation_number();
        const status = quotations_entity_1.QuotationStatus.DRAFT;
        const copy = this.quotationsRepo.create({
            user_id: original.user_id,
            quotation_number: new_number,
            project_title: original.project_title ? `${original.project_title} (Copy)` : null,
            description: original.description,
            client_id: original.client_id,
            client_name: original.client_name,
            client_email: original.client_email,
            client_address: original.client_address,
            client_phone: original.client_phone,
            currency: original.currency,
            line_items: original.line_items,
            subtotal: original.subtotal,
            total_discount: original.total_discount,
            total_tax: original.total_tax,
            grand_total: original.grand_total,
            issue_date: new Date(),
            expiry_date: original.expiry_date,
            terms_and_conditions: original.terms_and_conditions,
            notes: original.notes,
            source: quotations_entity_1.QuotationSource.DUPLICATE,
            status,
            activity_log: this.append_log([], status),
            linked_documents: [],
            public_token: null,
            pdf_path: null,
        });
        const saved = await this.quotationsRepo.save(copy);
        return { message: "Quotation duplicated successfully.", quotation: saved };
    }
    async delete_quotation_service(uuid) {
        const q = await this.single_quotation_service(uuid);
        await this.quotationsRepo.remove(q);
        return { message: "Quotation deleted successfully." };
    }
    async link_document_service(quotation_uuid, document) {
        const q = await this.single_quotation_service(quotation_uuid);
        const already_linked = q.linked_documents.some((d) => d.document_uuid === document.document_uuid);
        if (already_linked) {
            throw new common_1.ConflictException("This document is already linked to the quotation.");
        }
        const updated_docs = [...q.linked_documents, document];
        await this.quotationsRepo.update({ uuid: quotation_uuid }, { linked_documents: updated_docs });
        return {
            message: "Document linked successfully.",
            linked_documents: updated_docs,
        };
    }
    async unlink_document_service(quotation_uuid, document_uuid) {
        const q = await this.single_quotation_service(quotation_uuid);
        const updated_docs = q.linked_documents.filter((d) => d.document_uuid !== document_uuid);
        await this.quotationsRepo.update({ uuid: quotation_uuid }, { linked_documents: updated_docs });
        return {
            message: "Document unlinked successfully.",
            linked_documents: updated_docs,
        };
    }
    async set_pdf_path_service(uuid, pdf_path) {
        await this.quotationsRepo.update({ uuid }, { pdf_path });
        return { message: "PDF path saved.", uuid, pdf_path };
    }
    async recent_quotations_service(user_id, limit = 5) {
        return await this.quotationsRepo.find({
            where: { user_id },
            order: { created_at: "DESC" },
            take: Math.min(limit, 20),
            select: [
                "uuid", "quotation_number", "project_title", "client_name",
                "grand_total", "currency", "status", "source", "created_at",
            ],
        });
    }
    async get_ai_suggestions_service(user_id) {
        const recent = await this.quotationsRepo.find({
            where: { user_id },
            order: { created_at: "DESC" },
            take: 10,
            select: ["quotation_number", "project_title", "status", "client_name",
                "grand_total", "expiry_date", "viewed_at", "created_at"],
        });
        if (recent.length === 0) {
            return {
                message: "No quotation history yet.",
                suggestions: [
                    { type: "action", message: "Create your first quotation to start tracking client responses." },
                    { type: "tip", message: "AI pricing suggestions activate once you have sent quotations." },
                ],
            };
        }
        const system_prompt = this.promptService.QuotationSuggestionEngine();
        const gpt_response = await this.gptService.GPTChat(JSON.stringify({
            recent_quotations: recent.map((q) => ({
                quotation_number: q.quotation_number,
                project_title: q.project_title,
                status: q.status,
                client_name: q.client_name,
                grand_total: q.grand_total,
                expiry_date: q.expiry_date,
                viewed_at: q.viewed_at,
            })),
            today: new Date().toISOString().split("T")[0],
        }), system_prompt);
        let suggestions = [];
        try {
            const raw = gpt_response?.data?.content ?? "";
            const cleaned = raw.replace(/```json|```/g, "").trim();
            suggestions = JSON.parse(cleaned);
        }
        catch {
            suggestions = [
                { type: "follow_up", message: "Send a follow-up to clients who viewed but haven't responded." },
                { type: "expiry", message: "Check for quotations expiring in the next 7 days." },
            ];
        }
        return {
            message: "AI suggestions generated.",
            suggestions,
            based_on: recent.length,
        };
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quotations_entity_1.QuotationEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, GPTService_1.GPTService,
        PromptService_1.PromptService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map