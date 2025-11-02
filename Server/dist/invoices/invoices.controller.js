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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const invoices_service_1 = require("./invoices.service");
const auth_guard_1 = require("../guards/auth/auth.guard");
const node_path_1 = require("node:path");
const PdfService_1 = require("../common/PdfService");
const EmailService_1 = require("../common/EmailService");
const user_payment_gateway_service_1 = require("../user_payment_gateway/user_payment_gateway.service");
let InvoicesController = class InvoicesController {
    invoicesService;
    pdfService;
    emailService;
    upgService;
    constructor(invoicesService, pdfService, emailService, upgService) {
        this.invoicesService = invoicesService;
        this.pdfService = pdfService;
        this.emailService = emailService;
        this.upgService = upgService;
    }
    async create_invoice(data) {
        if (!data.customer_name || typeof data.customer_name !== "string") {
            throw new common_1.BadRequestException("Customer name is required and must be a string.");
        }
        if (!data.user_id)
            throw new common_1.BadRequestException("User ID is required.");
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
            throw new common_1.BadRequestException("Invoice items are required.");
        }
        await this.upgService.user_active_gateway_service(data.user_id, data.gateway_name);
        const invoiceData = {
            user_id: data.user_id,
            invoice_number: data.invoice_number,
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_address: data.customer_address,
            invoice_date: data.invoice_date,
            due_date: data.due_date,
            payment_terms: data.payment_terms,
            subtotal: data.subtotal,
            vat: data.vat,
            total: data.total,
            notes: data.notes,
            status: data.status,
            custom_fields: data.custom_fields,
            invoice_items: data.invoice_items || data?.items,
        };
        const response = await this.invoicesService.create_invoice_service(invoiceData);
        return { message: "Invoice created successfully", invoice: response };
    }
    async user_invoices(user_id) {
        if (!user_id) {
            throw new common_1.BadRequestException("Invoice user id is required.");
        }
        return await this.invoicesService.user_invoices_service(user_id);
    }
    async all_invoices(search, status, user_id) {
        if (status && typeof status !== "string") {
            throw new common_1.BadRequestException("Invalid status value.");
        }
        return await this.invoicesService.all_invoices_service({
            search,
            status,
            user_id,
        });
    }
    async single_invoice(id) {
        if (!id)
            throw new common_1.BadRequestException("Invoice identifier is required.");
        const parsedId = isNaN(Number(id)) ? id : Number(id);
        return await this.invoicesService.single_invoice_service(parsedId);
    }
    async update_invoice(id, data) {
        if (!data || Object.keys(data).length === 0) {
            throw new common_1.BadRequestException("No data provided to update invoice.");
        }
        const parsedId = isNaN(Number(id)) ? id : Number(id);
        return await this.invoicesService.update_invoice_service(parsedId, data);
    }
    async update_custom_fields(id, customFields) {
        if (!customFields || typeof customFields !== "object") {
            throw new common_1.BadRequestException("Custom fields must be a valid object.");
        }
        const parsedId = isNaN(Number(id)) ? id : Number(id);
        return await this.invoicesService.update_custom_field_service(parsedId, customFields);
    }
    async delete_invoice(id) {
        if (!id)
            throw new common_1.BadRequestException("Invoice ID or UUID is required.");
        const parsedId = isNaN(Number(id)) ? id : Number(id);
        return await this.invoicesService.delete_invoices_service(parsedId);
    }
    async update_status(id, status) {
        if (!status || typeof status !== "string") {
            throw new common_1.BadRequestException("Status is required and must be a string.");
        }
        const parsedId = isNaN(Number(id)) ? id : Number(id);
        return await this.invoicesService.update_invoice_status_service(parsedId, status);
    }
    async compute_totals(subtotal, vatRate) {
        if (subtotal === undefined || isNaN(Number(subtotal))) {
            throw new common_1.BadRequestException("Subtotal is required and must be numeric.");
        }
        if (vatRate === undefined || isNaN(Number(vatRate))) {
            throw new common_1.BadRequestException("VAT rate is required and must be numeric.");
        }
        return await this.invoicesService.total_inovices_service(subtotal, vatRate);
    }
    async preview_invoice(body) {
        const data = {
            template_name: "employment Template",
            description: "Standard invoice for clients",
            fields_schema: {
                company_name: "ABC Ltd.",
                company_address: "123 Business St., City, Country",
                company_email: "info@abcltd.com",
                company_phone: "+1 234 567 890",
                client_name: "John Doe",
                client_email: "john.doe@example.com",
                client_phone: "+1 987 654 321",
                invoice_number: "INV-001",
                invoice_date: "2025-10-31",
                due_date: "2025-11-15",
                payment_terms: "Net 15",
                agreement_duration: [{ name: "1 year" }],
                position: "Software Engineer",
                salary: "USD 60,000",
                benefits: ["Health insurance", "Paid leave", "Retirement plan"],
                notes: "Thank you for your business.",
            },
            user_id: "e3a77190-e83a-4a7a-a3b9-965fda4ec888",
            is_prebuilt: false,
            version: 1,
            is_active: true,
        };
        const filename = `${Math.floor(Number(new Date()) * Math.random())}-invoice_preview.pdf`;
        const filePath = (0, node_path_1.join)(__dirname, `../../public/uploads/${filename}`);
        const result = await this.pdfService.InvoicePDFGenerator(data, filePath);
        const url = `/public/uploads/${filename}`;
        return { response: result.message, success: result.success, url };
    }
    async send_invoice_to_email(body) {
        const response = await this.emailService.send_email(body);
        return { message: "email send success", response };
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "create_invoice", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "user_invoices", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)("search")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "all_invoices", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "single_invoice", null);
__decorate([
    (0, common_1.Put)("update/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "update_invoice", null);
__decorate([
    (0, common_1.Patch)("update/:id/custom-fields"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "update_custom_fields", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "delete_invoice", null);
__decorate([
    (0, common_1.Patch)("update/status/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "update_status", null);
__decorate([
    (0, common_1.Post)("compute-totals"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)("subtotal")),
    __param(1, (0, common_1.Body)("vatRate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "compute_totals", null);
__decorate([
    (0, common_1.Get)("preview"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "preview_invoice", null);
__decorate([
    (0, common_1.Post)("send_to_email"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "send_invoice_to_email", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, common_1.Controller)("invoices"),
    (0, common_1.UseGuards)(auth_guard_1.JwtGuard),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService,
        PdfService_1.PdfService,
        EmailService_1.EmailService,
        user_payment_gateway_service_1.UserPaymentGatewayService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map