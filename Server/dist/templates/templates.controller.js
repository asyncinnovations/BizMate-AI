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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const templates_service_1 = require("./templates.service");
const PdfService_1 = require("../services/PdfService");
const path_1 = require("path");
const EmailService_1 = require("../services/EmailService");
let TemplatesController = class TemplatesController {
    templatesService;
    pdfService;
    emailService;
    constructor(templatesService, pdfService, emailService) {
        this.templatesService = templatesService;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }
    async createTemplate(data, req) {
        if (!data.template_name || typeof data.template_name !== "string") {
            throw new common_1.BadRequestException("Template name is required and must be a string.");
        }
        if (!data.fields_schema || typeof data.fields_schema !== "object") {
            throw new common_1.BadRequestException("Fields schema is required and must be a valid JSON object.");
        }
        if (data.description && typeof data.description !== "string") {
            throw new common_1.BadRequestException("Description must be a string if provided.");
        }
        if (data.is_prebuilt !== undefined &&
            typeof data.is_prebuilt !== "boolean") {
            throw new common_1.BadRequestException("is_prebuilt must be a boolean value.");
        }
        if (data.is_active !== undefined && typeof data.is_active !== "boolean") {
            throw new common_1.BadRequestException("is_active must be a boolean value.");
        }
        if (data.version && isNaN(Number(data.version))) {
            throw new common_1.BadRequestException("Version must be a number if provided.");
        }
        const post_data = {
            template_name: data.template_name.trim(),
            description: data.description?.trim() || null,
            fields_schema: data.fields_schema,
            user_id: data.user_id || req.user?.uuid,
            is_prebuilt: data.is_prebuilt ?? false,
            version: data.version ?? 1,
            is_active: data.is_active ?? true,
        };
        const result = await this.templatesService.create_template_service(post_data);
        return { message: "Template created successfully", data: result };
    }
    async get_all_template() {
        const templates = await this.templatesService.get_all_template_service();
        if (!templates || templates.length === 0) {
            return { message: "No templates found", status: 404, data: [] };
        }
        return { message: "All templates", data: templates };
    }
    async single_template(id) {
        if (!id) {
            throw new common_1.BadRequestException("Template ID or UUID is required.");
        }
        const template = await this.templatesService.single_template_service(id);
        if (!template) {
            return { message: "No templates found", status: 404, data: [] };
        }
        return { message: "Template found", data: template };
    }
    async update_template(id, data) {
        if (!id) {
            throw new common_1.BadRequestException("Template ID or UUID is required.");
        }
        if (!data || Object.keys(data).length === 0) {
            throw new common_1.BadRequestException("No data provided for update.");
        }
        if (data.template_name && typeof data.template_name !== "string") {
            throw new common_1.BadRequestException("Template name must be a string.");
        }
        if (data.fields_schema && typeof data.fields_schema !== "object") {
            throw new common_1.BadRequestException("Fields schema must be a valid JSON object.");
        }
        if (data.version && isNaN(Number(data.version))) {
            throw new common_1.BadRequestException("Version must be numeric if provided.");
        }
        const updated = await this.templatesService.update_template_service(id, data);
        return { message: "Template updated successfully", data: updated };
    }
    async user_template(user_id) {
        if (!user_id) {
            throw new common_1.BadRequestException("User ID is required.");
        }
        const templates = await this.templatesService.user_template_service(user_id);
        if (!templates || templates.length === 0) {
            return {
                message: "No templates found for this user",
                status: 404,
                data: [],
            };
        }
        return { message: "User templates found", data: templates };
    }
    async preview_document(body) {
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
        const filename = `${Math.floor(Number(new Date()) * Math.random())}-template_preview.pdf`;
        const filePath = (0, path_1.join)(__dirname, `../../public/uploads/${filename}`);
        const result = await this.pdfService.TemplatePDFGenerator(data, filePath);
        const url = `/public/uploads/${filename}`;
        return { response: result.message, success: result.success, url };
    }
    async delete_template(id) {
        if (!id) {
            throw new common_1.BadRequestException("Template ID or UUID is required for deletion.");
        }
        await this.templatesService.delete_template_service(id);
        return { message: "Template deleted successfully" };
    }
    async send_template_to_email(body) {
        const response = await this.emailService.send_email(body);
        return { message: "email send success", response };
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "get_all_template", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "single_template", null);
__decorate([
    (0, common_1.Put)("update/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "update_template", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "user_template", null);
__decorate([
    (0, common_1.Get)("preview"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "preview_document", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "delete_template", null);
__decorate([
    (0, common_1.Post)("send_to_email"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "send_template_to_email", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.Controller)("templates"),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService,
        PdfService_1.PdfService,
        EmailService_1.EmailService])
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map