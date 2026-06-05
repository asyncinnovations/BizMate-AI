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
exports.QuotationsController = void 0;
const common_1 = require("@nestjs/common");
const quotations_service_1 = require("./quotations.service");
const invoices_service_1 = require("../invoices/invoices.service");
const EmailService_1 = require("../services/EmailService");
const PdfService_1 = require("../services/PdfService");
const node_path_1 = require("node:path");
let QuotationsController = class QuotationsController {
    quotationsService;
    invoicesService;
    emailService;
    pdfService;
    constructor(quotationsService, invoicesService, emailService, pdfService) {
        this.quotationsService = quotationsService;
        this.invoicesService = invoicesService;
        this.emailService = emailService;
        this.pdfService = pdfService;
    }
    async create_quotation(body) {
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        if (!body.client_name)
            throw new common_1.BadRequestException("client_name is required.");
        if (!body.issue_date)
            throw new common_1.BadRequestException("issue_date is required.");
        if (!body.expiry_date)
            throw new common_1.BadRequestException("expiry_date is required.");
        if (!body.line_items || !Array.isArray(body.line_items) || body.line_items.length === 0) {
            throw new common_1.BadRequestException("line_items array is required and must not be empty.");
        }
        const quotation = await this.quotationsService.create_quotation_service({
            user_id: body.user_id,
            project_title: body.project_title,
            description: body.description,
            client_id: body.client_id,
            client_name: body.client_name,
            client_email: body.client_email,
            client_address: body.client_address,
            client_phone: body.client_phone,
            currency: body.currency,
            line_items: body.line_items,
            issue_date: body.issue_date,
            expiry_date: body.expiry_date,
            terms_and_conditions: body.terms_and_conditions,
            notes: body.notes,
            source: body.source,
        });
        return { message: "Quotation created successfully.", quotation };
    }
    async ai_generate_quotation(body) {
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        if (!body.prompt)
            throw new common_1.BadRequestException("prompt is required.");
        return await this.quotationsService.ai_generate_quotation_service(body.user_id, body.prompt);
    }
    async ai_save_quotation(body) {
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        if (!body.client_name)
            throw new common_1.BadRequestException("client_name is required.");
        if (!body.ai_prompt)
            throw new common_1.BadRequestException("ai_prompt is required.");
        if (!body.line_items || !Array.isArray(body.line_items) || body.line_items.length === 0) {
            throw new common_1.BadRequestException("line_items array is required.");
        }
        const quotation = await this.quotationsService.ai_save_quotation_service(body);
        return { message: "AI quotation saved successfully.", quotation };
    }
    async user_quotations(user_id, status, search, currency) {
        if (!user_id)
            throw new common_1.BadRequestException("user_id is required.");
        const data = await this.quotationsService.user_quotations_service(user_id, {
            status, search, currency,
        });
        return { message: "Quotations retrieved successfully.", count: data.length, data };
    }
    async recent_quotations(user_id, limit) {
        if (!user_id)
            throw new common_1.BadRequestException("user_id is required.");
        const data = await this.quotationsService.recent_quotations_service(user_id, Number(limit ?? 5));
        return { message: "Recent quotations retrieved.", data };
    }
    async single_quotation(uuid) {
        if (!uuid)
            throw new common_1.BadRequestException("Quotation UUID is required.");
        const data = await this.quotationsService.single_quotation_service(uuid);
        return { message: "Quotation retrieved.", data };
    }
    async get_public_quotation(token) {
        if (!token)
            throw new common_1.BadRequestException("Token is required.");
        const data = await this.quotationsService.get_quotation_by_token_service(token);
        return { message: "Quotation retrieved.", data };
    }
    async update_quotation(uuid, body) {
        if (!uuid)
            throw new common_1.BadRequestException("Quotation UUID is required.");
        if (!body || Object.keys(body).length === 0) {
            throw new common_1.BadRequestException("No update data provided.");
        }
        const updated = await this.quotationsService.update_quotation_service(uuid, body);
        return { message: "Quotation updated successfully.", data: updated };
    }
    async update_status(uuid, status, actor) {
        if (!uuid)
            throw new common_1.BadRequestException("Quotation UUID is required.");
        if (!status)
            throw new common_1.BadRequestException("status is required.");
        return await this.quotationsService.update_quotation_status_service(uuid, status, actor);
    }
    async send_quotation(uuid, body) {
        if (!uuid)
            throw new common_1.BadRequestException("Quotation UUID is required.");
        const result = await this.quotationsService.send_quotation_service(uuid);
        if (body?.email_to) {
            const q = await this.quotationsService.single_quotation_service(uuid);
            await this.emailService.send_email({
                to: body.email_to,
                subject: body.email_subject ?? `Quotation ${q.quotation_number} from BizMate`,
                message: body.email_message
                    ?? `Please review the attached quotation.\n\nView online: ${result.public_url}`,
                html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
            <div style="background:#4f46e5;color:white;padding:16px;text-align:center">
              <h2 style="margin:0">Quotation ${q.quotation_number}</h2>
              <p style="margin:4px 0 0;font-size:14px;opacity:0.85">${q.project_title ?? ""}</p>
            </div>
            <div style="padding:20px">
              <p>Dear ${q.client_name},</p>
              <p>Please find your quotation for <strong>${q.project_title ?? "the project"}</strong>.</p>
              <p style="font-size:22px;font-weight:bold;color:#4f46e5">${q.currency} ${Number(q.grand_total).toLocaleString()}</p>
              <p>Valid until: ${new Date(q.expiry_date).toLocaleDateString("en-AE")}</p>
              <div style="text-align:center;margin:24px 0">
                <a href="${result.public_url}" style="background:#4f46e5;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold">View Quotation</a>
              </div>
              <p style="font-size:12px;color:#888">BizMate AI — Smart Business Operating System</p>
            </div>
          </div>
        `,
            });
        }
        return {
            ...result,
            email_sent: !!body?.email_to,
        };
    }
    async client_action(token, action, comment) {
        if (!token)
            throw new common_1.BadRequestException("Token is required.");
        if (!action)
            throw new common_1.BadRequestException('action is required: "accept", "reject", or "comment".');
        if (!["accept", "reject", "comment"].includes(action)) {
            throw new common_1.BadRequestException('action must be "accept", "reject", or "comment".');
        }
        return await this.quotationsService.client_action_service(token, action, comment);
    }
    async convert_to_invoice(body) {
        if (!body.quotation_uuid)
            throw new common_1.BadRequestException("quotation_uuid is required.");
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        const conversion = await this.quotationsService.convert_to_invoice_service(body.quotation_uuid, body.user_id);
        const invoice = await this.invoicesService.create_invoice_service(conversion.invoice_data);
        await this.quotationsService.mark_as_converted_service(body.quotation_uuid, invoice.uuid);
        return {
            message: "Quotation converted to invoice successfully.",
            quotation_uuid: body.quotation_uuid,
            invoice_uuid: invoice.uuid,
            invoice_number: invoice.invoice_number,
            invoice,
        };
    }
    async generate_pdf(uuid) {
        if (!uuid)
            throw new common_1.BadRequestException("Quotation UUID is required.");
        const q = await this.quotationsService.single_quotation_service(uuid);
        const filename = `${Date.now()}-${uuid}-quotation.pdf`;
        const filePath = (0, node_path_1.join)(__dirname, `../../public/uploads/${filename}`);
        await this.pdfService.TemplatePDFGenerator({
            template_name: q.quotation_number,
            description: q.project_title ?? "",
            fields_schema: {
                client_name: q.client_name,
                grand_total: `${q.currency} ${Number(q.grand_total).toLocaleString()}`,
                issue_date: q.issue_date,
                expiry_date: q.expiry_date,
            },
            items: q.line_items,
        }, filePath);
        const url = `/public/uploads/${filename}`;
        await this.quotationsService.set_pdf_path_service(uuid, url);
        return { message: "PDF generated successfully.", url, uuid };
    }
    async duplicate_quotation(body) {
        if (!body.quotation_uuid)
            throw new common_1.BadRequestException("quotation_uuid is required.");
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        return await this.quotationsService.duplicate_quotation_service(body.quotation_uuid, body.user_id);
    }
    async link_document(body) {
        if (!body.quotation_uuid)
            throw new common_1.BadRequestException("quotation_uuid is required.");
        if (!body.document_uuid)
            throw new common_1.BadRequestException("document_uuid is required.");
        if (!body.document_type)
            throw new common_1.BadRequestException("document_type is required.");
        if (!body.document_name)
            throw new common_1.BadRequestException("document_name is required.");
        return await this.quotationsService.link_document_service(body.quotation_uuid, {
            document_uuid: body.document_uuid,
            document_type: body.document_type,
            document_name: body.document_name,
        });
    }
    async unlink_document(body) {
        if (!body.quotation_uuid)
            throw new common_1.BadRequestException("quotation_uuid is required.");
        if (!body.document_uuid)
            throw new common_1.BadRequestException("document_uuid is required.");
        return await this.quotationsService.unlink_document_service(body.quotation_uuid, body.document_uuid);
    }
    async get_ai_suggestions(user_id) {
        if (!user_id)
            throw new common_1.BadRequestException("user_id is required.");
        return await this.quotationsService.get_ai_suggestions_service(user_id);
    }
    async delete_quotation(uuid) {
        if (!uuid)
            throw new common_1.BadRequestException("Quotation UUID is required.");
        return await this.quotationsService.delete_quotation_service(uuid);
    }
};
exports.QuotationsController = QuotationsController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "create_quotation", null);
__decorate([
    (0, common_1.Post)("ai-generate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "ai_generate_quotation", null);
__decorate([
    (0, common_1.Post)("ai-save"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "ai_save_quotation", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("search")),
    __param(3, (0, common_1.Query)("currency")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "user_quotations", null);
__decorate([
    (0, common_1.Get)("recent/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "recent_quotations", null);
__decorate([
    (0, common_1.Get)("single/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "single_quotation", null);
__decorate([
    (0, common_1.Get)("public/:token"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "get_public_quotation", null);
__decorate([
    (0, common_1.Put)("update/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "update_quotation", null);
__decorate([
    (0, common_1.Patch)("status/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __param(1, (0, common_1.Body)("status")),
    __param(2, (0, common_1.Body)("actor")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "update_status", null);
__decorate([
    (0, common_1.Post)("send/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "send_quotation", null);
__decorate([
    (0, common_1.Post)("client-action/:token"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("token")),
    __param(1, (0, common_1.Body)("action")),
    __param(2, (0, common_1.Body)("comment")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "client_action", null);
__decorate([
    (0, common_1.Post)("convert-to-invoice"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "convert_to_invoice", null);
__decorate([
    (0, common_1.Post)("generate-pdf/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "generate_pdf", null);
__decorate([
    (0, common_1.Post)("duplicate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "duplicate_quotation", null);
__decorate([
    (0, common_1.Post)("link-document"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "link_document", null);
__decorate([
    (0, common_1.Delete)("unlink-document"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "unlink_document", null);
__decorate([
    (0, common_1.Get)("ai-suggestions/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "get_ai_suggestions", null);
__decorate([
    (0, common_1.Delete)("delete/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "delete_quotation", null);
exports.QuotationsController = QuotationsController = __decorate([
    (0, common_1.Controller)("quotations"),
    __metadata("design:paramtypes", [quotations_service_1.QuotationsService,
        invoices_service_1.InvoicesService,
        EmailService_1.EmailService,
        PdfService_1.PdfService])
], QuotationsController);
//# sourceMappingURL=quotations.controller.js.map