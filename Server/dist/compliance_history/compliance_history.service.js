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
exports.ComplianceHistoryService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const compliance_history_entity_1 = require("./compliance_history.entity");
let ComplianceHistoryService = class ComplianceHistoryService {
    historyRepository;
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
    }
    async log_event_service(user_id, event_type, details, document_id, reminder_id, company_id) {
        const history = this.historyRepository.create({});
        return await this.historyRepository.save(history);
    }
    async log_document_uploaded_service(user_id, document_id, filename) {
        return this.log_event_service(user_id, "document_uploaded", `Document uploaded: ${filename}`, document_id);
    }
    async log_ai_summary_generated_service(user_id, document_id) {
        return this.log_event_service(user_id, "ai_summary_generated", "AI summary generated for document", document_id);
    }
    async log_reminder_triggered_service(user_id, reminder_id, reminder_title) {
        return this.log_event_service(user_id, "reminder_triggered", `Reminder triggered: ${reminder_title}`, reminder_id);
    }
    async log_document_verified_service(user_id, document_id) {
        return this.log_event_service(user_id, "document_verified", `Document marked as verified`, document_id);
    }
    async log_document_rejected_service(user_id, document_id, reason) {
        return this.log_event_service(user_id, "document_rejected", `Document rejected: ${reason}`, document_id);
    }
    async log_ai_chat_service(user_id, question) {
        return this.log_event_service(user_id, "ai_chat", `User asked AI: ${question}`);
    }
    async log_license_renewed_service(user_id, license_id, license_type) {
        return this.log_event_service(user_id, "license_renewed", `License renewed: ${license_type}`, license_id);
    }
    async get_user_history_service(user_id) {
        return await this.historyRepository.find({
            where: { user_id },
            order: { created_at: "DESC" },
        });
    }
    async get_document_history_service(document_id) {
        return await this.historyRepository.find({
            where: { uuid: document_id },
            order: { created_at: "DESC" },
        });
    }
    async get_reminder_history_service(reminder_id) {
        return await this.historyRepository.find({
            where: {},
            order: { created_at: "DESC" },
        });
    }
    async get_by_event_type_service(event_type) {
        return await this.historyRepository.find({
            where: { event_type },
            order: { created_at: "DESC" },
        });
    }
    async delete_history_entry_service(id) {
        return await this.historyRepository.delete({ uuid: id });
    }
    async clear_user_history_service(user_id) {
        return await this.historyRepository.delete({ user_id });
    }
};
exports.ComplianceHistoryService = ComplianceHistoryService;
exports.ComplianceHistoryService = ComplianceHistoryService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(compliance_history_entity_1.ComplianceHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ComplianceHistoryService);
//# sourceMappingURL=compliance_history.service.js.map