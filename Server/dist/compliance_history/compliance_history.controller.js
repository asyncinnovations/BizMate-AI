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
exports.ComplianceHistoryController = void 0;
const common_1 = require("@nestjs/common");
const compliance_history_service_1 = require("./compliance_history.service");
let ComplianceHistoryController = class ComplianceHistoryController {
    historyService;
    constructor(historyService) {
        this.historyService = historyService;
    }
    async log_event(body, req) {
        return this.historyService.log_event_service(req.user.id, body.event_type, body.details, body.document_id, body.reminder_id, body.company_id);
    }
    async log_document_uploaded(body, req) {
        return this.historyService.log_document_uploaded_service(req.user.id, body.document_id, body.filename);
    }
    async logAiSummary(body, req) {
        return this.historyService.log_ai_summary_generated_service(req.user.id, body.document_id);
    }
    async logReminder(body, req) {
        return this.historyService.log_reminder_triggered_service(req.user.id, body.reminder_id, body.reminder_title);
    }
    async logDocumentVerified(body, req) {
        return this.historyService.log_document_verified_service(req.user.id, body.document_id);
    }
    async logDocumentRejected(body, req) {
        return this.historyService.log_document_rejected_service(req.user.id, body.document_id, body.reason);
    }
    async logAiChat(body, req) {
        return this.historyService.log_ai_chat_service(req.user.id, body.question);
    }
    async logLicenseRenewed(body, req) {
        return this.historyService.log_license_renewed_service(req.user.id, body.license_id, body.license_type);
    }
    async getUserHistory(req) {
        return this.historyService.get_user_history_service(req.user.id);
    }
    async getDocumentHistory(documentId) {
        return this.historyService.get_document_history_service(documentId);
    }
    async getReminderHistory(reminderId) {
        return this.historyService.get_reminder_history_service(reminderId);
    }
    async getByEventType(eventType) {
        return this.historyService.get_by_event_type_service(eventType);
    }
    async deleteHistoryEntry(uuid) {
        return this.historyService.delete_history_entry_service(uuid);
    }
    async clearUserHistory(req) {
        return this.historyService.clear_user_history_service(req.user.id);
    }
};
exports.ComplianceHistoryController = ComplianceHistoryController;
__decorate([
    (0, common_1.Post)("log"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "log_event", null);
__decorate([
    (0, common_1.Post)("document-uploaded"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "log_document_uploaded", null);
__decorate([
    (0, common_1.Post)("ai-summary"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "logAiSummary", null);
__decorate([
    (0, common_1.Post)("reminder-triggered"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "logReminder", null);
__decorate([
    (0, common_1.Post)("document-verified"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "logDocumentVerified", null);
__decorate([
    (0, common_1.Post)("document-rejected"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "logDocumentRejected", null);
__decorate([
    (0, common_1.Post)("ai-chat"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "logAiChat", null);
__decorate([
    (0, common_1.Post)("license-renewed"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "logLicenseRenewed", null);
__decorate([
    (0, common_1.Get)("user"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "getUserHistory", null);
__decorate([
    (0, common_1.Get)("document/:documentId"),
    __param(0, (0, common_1.Param)("documentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "getDocumentHistory", null);
__decorate([
    (0, common_1.Get)("reminder/:reminderId"),
    __param(0, (0, common_1.Param)("reminderId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "getReminderHistory", null);
__decorate([
    (0, common_1.Get)("event/:eventType"),
    __param(0, (0, common_1.Param)("eventType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "getByEventType", null);
__decorate([
    (0, common_1.Delete)(":uuid"),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "deleteHistoryEntry", null);
__decorate([
    (0, common_1.Delete)("clear/all"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceHistoryController.prototype, "clearUserHistory", null);
exports.ComplianceHistoryController = ComplianceHistoryController = __decorate([
    (0, common_1.Controller)("compliance-history"),
    __metadata("design:paramtypes", [compliance_history_service_1.ComplianceHistoryService])
], ComplianceHistoryController);
//# sourceMappingURL=compliance_history.controller.js.map