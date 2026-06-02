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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoices_entity_1 = require("./invoices.entity");
const PromptService_1 = require("../services/PromptService");
const GPTService_1 = require("../services/GPTService");
let InvoicesService = class InvoicesService {
    invoicesRepo;
    openAIService;
    promptservice;
    constructor(invoicesRepo, openAIService, promptservice) {
        this.invoicesRepo = invoicesRepo;
        this.openAIService = openAIService;
        this.promptservice = promptservice;
    }
    append_activity_log(existing_log, new_status) {
        const log = Array.isArray(existing_log) ? existing_log : [];
        return [...log, { status: new_status, timestamp: new Date().toISOString() }];
    }
    async generate_invoice_number() {
        const year = new Date().getFullYear();
        const prefix = `INV-${year}-`;
        const latest = await this.invoicesRepo
            .createQueryBuilder("invoice")
            .where("invoice.invoice_number LIKE :prefix", { prefix: `${prefix}%` })
            .orderBy("invoice.invoice_number", "DESC")
            .getOne();
        if (!latest)
            return `${prefix}0001`;
        const lastSeq = parseInt(latest.invoice_number.split("-")[2] ?? "0", 10);
        const nextSeq = String(lastSeq + 1).padStart(4, "0");
        return `${prefix}${nextSeq}`;
    }
    async create_invoice_service(data) {
        const invoice = this.invoicesRepo.create({
            ...data,
            activity_log: this.append_activity_log([], data.status ?? invoices_entity_1.InvoiceStatus.DRAFT),
        });
        return await this.invoicesRepo.save(invoice);
    }
    async set_invoice_pdf_path_service(path, uuid) {
        return await this.invoicesRepo.update({ uuid }, { invoice_pdf: path });
    }
    async generate_ai_invoice_service(prompt) {
        const system_prompt = this.promptservice.InvoiceGenerator();
        const response = await this.openAIService.GPTChat(prompt, system_prompt);
        return { message: "invoice generated", response };
    }
    async get_prebuild_invoice_template_service() {
        return await this.invoicesRepo.find({ where: { user_id: (0, typeorm_2.IsNull)() } });
    }
    async all_invoices_service(query) {
        const where = {};
        if (query?.status)
            where.status = query.status;
        if (query?.user_id)
            where.user_id = query.user_id;
        if (query?.search)
            where.customer_name = (0, typeorm_2.ILike)(`%${query.search}%`);
        return await this.invoicesRepo.find({
            where,
            order: { created_at: "DESC" },
        });
    }
    async user_invoices_service(user_id) {
        return await this.invoicesRepo.query(`SELECT i.*, u.full_name AS primary_owner
       FROM invoices i
       JOIN users u ON i.user_id::UUID = u.uuid
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`, [user_id]);
    }
    async single_invoice_service(idOrUuid) {
        const invoices = await this.invoicesRepo.query(`SELECT * FROM invoices WHERE uuid = $1`, [idOrUuid]);
        if (!invoices || invoices.length === 0) {
            throw new common_1.NotFoundException("Invoice not found");
        }
        return invoices[0];
    }
    async update_invoice_service(idOrUuid, data) {
        const invoice = await this.single_invoice_service(idOrUuid);
        Object.assign(invoice, data);
        return await this.invoicesRepo.save(invoice);
    }
    async update_custom_field_service(idOrUuid, customFields) {
        const invoice = await this.single_invoice_service(idOrUuid);
        invoice.custom_fields = { ...invoice.custom_fields, ...customFields };
        return await this.invoicesRepo.save(invoice);
    }
    async delete_invoices_service(idOrUuid) {
        const invoice = await this.single_invoice_service(idOrUuid);
        await this.invoicesRepo.remove(invoice);
        return { message: "Invoice deleted successfully" };
    }
    async update_invoice_status_service(idOrUuid, new_status) {
        const valid_statuses = Object.values(invoices_entity_1.InvoiceStatus);
        if (!valid_statuses.includes(new_status)) {
            throw new common_1.BadRequestException(`Invalid status "${new_status}". Allowed: ${valid_statuses.join(", ")}`);
        }
        const invoice = await this.single_invoice_service(idOrUuid);
        const updated_log = this.append_activity_log(invoice.activity_log ?? [], new_status);
        await this.invoicesRepo.query(`UPDATE invoices
       SET status = $1, activity_log = $2::jsonb, updated_at = NOW()
       WHERE uuid = $3`, [new_status, JSON.stringify(updated_log), invoice.uuid]);
        return {
            message: `Invoice status updated to "${new_status}"`,
            uuid: invoice.uuid,
            status: new_status,
            activity_log: updated_log,
        };
    }
    async total_inovices_service(subtotal, vatRate) {
        const vat = parseFloat(((subtotal * vatRate) / 100).toFixed(2));
        const total = parseFloat((subtotal + vat).toFixed(2));
        return { vat, total };
    }
    async duplicate_invoice_service(invoice_uuid, requesting_user_id) {
        const original = await this.single_invoice_service(invoice_uuid);
        if (original.user_id && original.user_id !== requesting_user_id) {
            throw new common_1.BadRequestException("You do not have permission to duplicate this invoice.");
        }
        const new_invoice_number = await this.generate_invoice_number();
        const duplicate = this.invoicesRepo.create({
            user_id: original.user_id,
            invoice_name: original.invoice_name,
            invoice_type: original.invoice_type,
            invoice_number: new_invoice_number,
            customer_name: original.customer_name,
            customer_email: original.customer_email,
            customer_address: original.customer_address,
            invoice_date: new Date(),
            due_date: original.due_date,
            payment_terms: original.payment_terms,
            subtotal: original.subtotal,
            vat: original.vat,
            total: original.total,
            notes: original.notes,
            custom_fields: original.custom_fields,
            invoice_items: original.invoice_items,
            status: invoices_entity_1.InvoiceStatus.DRAFT,
            source: invoices_entity_1.InvoiceSource.DUPLICATE,
            activity_log: this.append_activity_log([], invoices_entity_1.InvoiceStatus.DRAFT),
            invoice_pdf: null,
        });
        const saved = await this.invoicesRepo.save(duplicate);
        return {
            message: "Invoice duplicated successfully",
            invoice: saved,
        };
    }
    async get_ai_insights_service(invoice_uuid) {
        const invoice = await this.single_invoice_service(invoice_uuid);
        const customer_history = await this.invoicesRepo.query(`SELECT invoice_date, due_date, status, total
       FROM invoices
       WHERE customer_email = $1
         AND status IN ('paid', 'overdue', 'unpaid')
         AND uuid != $2
       ORDER BY created_at DESC
       LIMIT 10`, [invoice.customer_email, invoice_uuid]);
        const context = {
            invoice: {
                invoice_number: invoice.invoice_number,
                customer_name: invoice.customer_name,
                total: invoice.total,
                invoice_date: invoice.invoice_date,
                due_date: invoice.due_date,
                status: invoice.status,
            },
            customer_history: customer_history.map((h) => ({
                total: h.total,
                status: h.status,
                invoice_date: h.invoice_date,
                due_date: h.due_date,
            })),
        };
        const system_prompt = this.promptservice.InvoiceInsightsAnalyser();
        const gpt_response = await this.openAIService.GPTChat(JSON.stringify(context), system_prompt);
        let insights = {};
        try {
            const raw = gpt_response?.data?.content ?? "";
            const cleaned = raw.replace(/```json|```/g, "").trim();
            insights = JSON.parse(cleaned);
        }
        catch {
            insights = {
                payment_prediction_days: 7,
                late_payment_risk_percent: 25,
                suggested_action: "Send a payment reminder if this invoice is unpaid after the due date.",
                client_payment_pattern: "Insufficient history to make a reliable prediction.",
            };
        }
        return {
            message: "AI insights generated",
            insights: {
                ...insights,
                invoice_uuid,
                customer_name: invoice.customer_name,
            },
        };
    }
    async get_ai_suggestions_service(user_id, customer_name) {
        if (!customer_name || customer_name.trim().length < 2) {
            throw new common_1.BadRequestException("Customer name must be at least 2 characters.");
        }
        const past_invoices = await this.invoicesRepo.query(`SELECT invoice_items, payment_terms, total, status, invoice_date, due_date
       FROM invoices
       WHERE user_id = $1
         AND LOWER(customer_name) LIKE LOWER($2)
       ORDER BY created_at DESC
       LIMIT 20`, [user_id, `%${customer_name.trim()}%`]);
        if (past_invoices.length === 0) {
            return {
                message: "No history found for this customer",
                suggestions: [],
                payment_pattern: "No payment history available for this customer yet.",
                pricing_tip: "Consider researching market rates for your services.",
                professional_notes: `Thank you for your business. Payment is due within the specified terms. For any questions, please contact us directly.`,
            };
        }
        const all_items = [];
        for (const inv of past_invoices) {
            if (Array.isArray(inv.invoice_items)) {
                all_items.push(...inv.invoice_items);
            }
        }
        const service_map = {};
        for (const item of all_items) {
            const name = item.name?.trim();
            if (!name)
                continue;
            if (!service_map[name])
                service_map[name] = { total_price: 0, count: 0 };
            service_map[name].total_price += Number(item.price ?? 0);
            service_map[name].count += 1;
        }
        const suggestions = Object.entries(service_map)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([name, data]) => ({
            name,
            suggested_price: Math.round(data.total_price / data.count),
            times_used: data.count,
        }));
        const paid_invoices = past_invoices.filter((i) => i.status === "paid");
        let avg_days = 0;
        if (paid_invoices.length > 0) {
            const total_days = paid_invoices.reduce((sum, inv) => {
                const diff = new Date(inv.due_date).getTime() - new Date(inv.invoice_date).getTime();
                return sum + Math.ceil(diff / (1000 * 60 * 60 * 24));
            }, 0);
            avg_days = Math.round(total_days / paid_invoices.length);
        }
        const overdue_count = past_invoices.filter((i) => i.status === "overdue").length;
        const payment_rate = Math.round((paid_invoices.length / past_invoices.length) * 100);
        const payment_pattern = paid_invoices.length > 0
            ? `${customer_name} typically pays within ${avg_days} days. ${payment_rate}% on-time payment rate.`
            : `No paid invoices on record for ${customer_name} yet.`;
        const prices = suggestions.map((s) => s.suggested_price).filter(Boolean);
        const pricing_tip = prices.length > 0
            ? `Based on your history with ${customer_name}, services typically range from AED ${Math.min(...prices).toLocaleString()} to AED ${Math.max(...prices).toLocaleString()}.`
            : "Set pricing based on your standard rates.";
        return {
            message: "Suggestions generated",
            suggestions,
            payment_pattern,
            overdue_count,
            payment_rate,
            pricing_tip,
            professional_notes: `Thank you for your continued business, ${customer_name}. Payment is due within the agreed terms. Please contact us for any queries regarding this invoice.`,
        };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoices_entity_1.InvoiceEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, GPTService_1.GPTService,
        PromptService_1.PromptService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map