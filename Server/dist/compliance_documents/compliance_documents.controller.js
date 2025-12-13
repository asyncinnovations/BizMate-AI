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
exports.ComplianceDocumentsController = void 0;
const common_1 = require("@nestjs/common");
const upload_decorator_1 = require("../common/decorators/upload.decorator");
const compliance_documents_service_1 = require("./compliance_documents.service");
const path_1 = require("path");
let ComplianceDocumentsController = class ComplianceDocumentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async upload_document(body, file) {
        try {
            const data = {
                user_id: body.user_id,
                reminder_id: body.reminder_id,
                document_type: body.document_type,
                filename: file?.originalname || body.filename,
                file_url: body.file_url,
            };
            const response = await this.service.upload_document_service(data);
            return { message: "document uploaded", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_user_document(user_id, reminderId) {
        try {
            const response = await this.service.get_user_document_service(user_id, reminderId);
            return { message: "all user docs retrived", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_single_document(doc_id) {
        try {
            const response = await this.service.get_single_document_service(doc_id);
            return { message: "single document retrived", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update_document(doc_id, updates) {
        try {
            const response = await this.service.update_document_service(doc_id, updates);
            return { message: "document updated", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verify_document(doc_id) {
        try {
            const response = await this.service.verify_document_service(doc_id);
            return { message: "document verified", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async reject_document(doc_id) {
        try {
            const response = await this.service.reject_document_service(doc_id);
            return { message: "document rejected", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async attach_ai_summary(doc_id) {
        try {
            const response = await this.service.attach_ai_summary_service(doc_id);
            return { message: "ai summary attached", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete_document(doc_id) {
        try {
            const response = await this.service.delete_document_service(doc_id);
            return { message: "document delete success", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ComplianceDocumentsController = ComplianceDocumentsController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, upload_decorator_1.UploadFile)({
        fieldName: "filename",
        destination: (0, path_1.join)(__dirname, "../../public/uploads"),
        maxCount: 1,
        multiple: false,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceDocumentsController.prototype, "upload_document", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("reminder_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceDocumentsController.prototype, "get_user_document", null);
__decorate([
    (0, common_1.Get)("single/:doc_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("doc_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceDocumentsController.prototype, "get_single_document", null);
__decorate([
    (0, common_1.Patch)("update/:doc_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("doc_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceDocumentsController.prototype, "update_document", null);
__decorate([
    (0, common_1.Patch)("verify/:doc_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("doc_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceDocumentsController.prototype, "verify_document", null);
__decorate([
    (0, common_1.Patch)("reject/:doc_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("doc_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceDocumentsController.prototype, "reject_document", null);
__decorate([
    (0, common_1.Patch)("ai_summary/:doc_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("doc_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceDocumentsController.prototype, "attach_ai_summary", null);
__decorate([
    (0, common_1.Delete)("delete/:doc_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("doc_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceDocumentsController.prototype, "delete_document", null);
exports.ComplianceDocumentsController = ComplianceDocumentsController = __decorate([
    (0, common_1.Controller)("compliance-documents"),
    __metadata("design:paramtypes", [compliance_documents_service_1.ComplianceDocumentsService])
], ComplianceDocumentsController);
//# sourceMappingURL=compliance_documents.controller.js.map