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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const documents_service_1 = require("./documents.service");
const PdfService_1 = require("../services/PdfService");
const node_path_1 = require("node:path");
const documents_entity_1 = require("./documents.entity");
let DocumentsController = class DocumentsController {
    documentsService;
    pdfService;
    constructor(documentsService, pdfService) {
        this.documentsService = documentsService;
        this.pdfService = pdfService;
    }
    async create_document(body) {
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        if (!body.document_name)
            throw new common_1.BadRequestException("document_name is required.");
        if (!body.field_values || typeof body.field_values !== "object") {
            throw new common_1.BadRequestException("field_values must be a valid JSON object.");
        }
        const doc = await this.documentsService.create_document_service({
            user_id: body.user_id,
            template_id: body.template_id ?? null,
            document_name: body.document_name,
            category: body.category ?? null,
            document_type: body.document_type ?? null,
            field_values: body.field_values,
            content: body.content ?? null,
            source: body.source ?? documents_entity_1.DocumentSource.TEMPLATE,
        });
        return { message: "Document created successfully.", document: doc };
    }
    async ai_generate_document(body) {
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        if (!body.prompt)
            throw new common_1.BadRequestException("prompt is required.");
        return await this.documentsService.ai_generate_document_service(body.user_id, body.prompt, body.document_type);
    }
    async save_ai_document(body) {
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        if (!body.document_name)
            throw new common_1.BadRequestException("document_name is required.");
        if (!body.content)
            throw new common_1.BadRequestException("content is required.");
        if (!body.ai_prompt)
            throw new common_1.BadRequestException("ai_prompt is required.");
        const doc = await this.documentsService.save_ai_document_service(body);
        return { message: "AI document saved successfully.", document: doc };
    }
    async user_documents(user_id, status, category, documentType, search) {
        if (!user_id)
            throw new common_1.BadRequestException("user_id is required.");
        const docs = await this.documentsService.user_documents_service(user_id, {
            status,
            category,
            document_type: documentType,
            search,
        });
        return {
            message: "Documents retrieved successfully.",
            count: docs.length,
            data: docs,
        };
    }
    async recent_documents(user_id, limit) {
        if (!user_id)
            throw new common_1.BadRequestException("user_id is required.");
        const docs = await this.documentsService.recent_documents_service(user_id, Number(limit ?? 5));
        return { message: "Recent documents retrieved.", data: docs };
    }
    async single_document(uuid) {
        if (!uuid)
            throw new common_1.BadRequestException("Document UUID is required.");
        const doc = await this.documentsService.single_document_service(uuid);
        return { message: "Document retrieved.", data: doc };
    }
    async update_document(uuid, body) {
        if (!uuid)
            throw new common_1.BadRequestException("Document UUID is required.");
        if (!body || Object.keys(body).length === 0) {
            throw new common_1.BadRequestException("No update data provided.");
        }
        const updated = await this.documentsService.update_document_service(uuid, body);
        return { message: "Document updated successfully.", data: updated };
    }
    async update_document_status(uuid, status) {
        if (!uuid)
            throw new common_1.BadRequestException("Document UUID is required.");
        if (!status)
            throw new common_1.BadRequestException("status is required.");
        return await this.documentsService.update_document_status_service(uuid, status);
    }
    async delete_document(uuid) {
        if (!uuid)
            throw new common_1.BadRequestException("Document UUID is required.");
        return await this.documentsService.delete_document_service(uuid);
    }
    async duplicate_document(body) {
        if (!body.document_uuid)
            throw new common_1.BadRequestException("document_uuid is required.");
        if (!body.user_id)
            throw new common_1.BadRequestException("user_id is required.");
        return await this.documentsService.duplicate_document_service(body.document_uuid, body.user_id);
    }
    async run_compliance_check(uuid) {
        if (!uuid)
            throw new common_1.BadRequestException("Document UUID is required.");
        return await this.documentsService.run_compliance_check_service(uuid);
    }
    async get_ai_suggestions(user_id) {
        if (!user_id)
            throw new common_1.BadRequestException("user_id is required.");
        return await this.documentsService.get_ai_suggestions_service(user_id);
    }
    async generate_pdf(uuid) {
        if (!uuid)
            throw new common_1.BadRequestException("Document UUID is required.");
        const doc = await this.documentsService.single_document_service(uuid);
        const filename = `${Date.now()}-${uuid}-document.pdf`;
        const filePath = (0, node_path_1.join)(__dirname, `../../public/uploads/${filename}`);
        await this.pdfService.TemplatePDFGenerator({
            template_name: doc.document_name,
            description: doc.document_type ?? "",
            fields_schema: doc.field_values,
            content: doc.content,
        }, filePath);
        const url = `/public/uploads/${filename}`;
        await this.documentsService.set_document_file_paths_service(uuid, { pdf_path: url });
        return { message: "PDF generated successfully.", url, uuid };
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "create_document", null);
__decorate([
    (0, common_1.Post)("ai-generate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "ai_generate_document", null);
__decorate([
    (0, common_1.Post)("ai-save"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "save_ai_document", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("category")),
    __param(3, (0, common_1.Query)("document_type")),
    __param(4, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "user_documents", null);
__decorate([
    (0, common_1.Get)("recent/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "recent_documents", null);
__decorate([
    (0, common_1.Get)("single/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "single_document", null);
__decorate([
    (0, common_1.Put)("update/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "update_document", null);
__decorate([
    (0, common_1.Patch)("status/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "update_document_status", null);
__decorate([
    (0, common_1.Delete)("delete/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "delete_document", null);
__decorate([
    (0, common_1.Post)("duplicate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "duplicate_document", null);
__decorate([
    (0, common_1.Post)("compliance-check/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "run_compliance_check", null);
__decorate([
    (0, common_1.Get)("ai-suggestions/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "get_ai_suggestions", null);
__decorate([
    (0, common_1.Post)("generate-pdf/:uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "generate_pdf", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.Controller)("documents"),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService,
        PdfService_1.PdfService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map