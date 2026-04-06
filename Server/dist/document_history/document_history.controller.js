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
exports.DocumentHistoryController = void 0;
const common_1 = require("@nestjs/common");
const document_history_service_1 = require("./document_history.service");
let DocumentHistoryController = class DocumentHistoryController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create_document(body) {
        try {
            const response = await this.service.create_document_service(body);
            return { message: "document created", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_document_by_uuid(uuid) {
        try {
            const response = await this.service.get_document_by_uuid_service(uuid);
            return { message: "document retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_documents_by_user(user_id) {
        try {
            const response = await this.service.get_documents_by_user_service(user_id);
            return { message: "all user docs retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async search_documents(user_id, keyword) {
        try {
            const response = await this.service.search_documents_service(user_id, keyword);
            return { message: "search results", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update_status(uuid, status) {
        try {
            await this.service.update_status_service(uuid, status);
            return { message: "document status updated" };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update_parsed_data(uuid, parsedData) {
        try {
            await this.service.update_parsed_data_service(uuid, parsedData);
            return { message: "document parsed data updated" };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete_document(uuid) {
        try {
            await this.service.delete_document_service(uuid);
            return { message: "document deleted" };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_pending_documents() {
        try {
            const response = await this.service.get_pending_documents_service();
            return { message: "pending documents retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_documents_expiring_within(days) {
        try {
            const response = await this.service.get_documents_expiring_within_service(days);
            return { message: `documents expiring within ${days} days`, response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.DocumentHistoryController = DocumentHistoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "create_document", null);
__decorate([
    (0, common_1.Get)(":uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "get_document_by_uuid", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "get_documents_by_user", null);
__decorate([
    (0, common_1.Get)("user/:user_id/search"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("keyword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "search_documents", null);
__decorate([
    (0, common_1.Put)(":uuid/status"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "update_status", null);
__decorate([
    (0, common_1.Put)(":uuid/parsed-data"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __param(1, (0, common_1.Body)("parsed_data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "update_parsed_data", null);
__decorate([
    (0, common_1.Delete)(":uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "delete_document", null);
__decorate([
    (0, common_1.Get)("pending/all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "get_pending_documents", null);
__decorate([
    (0, common_1.Get)("expiring-within/:days"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentHistoryController.prototype, "get_documents_expiring_within", null);
exports.DocumentHistoryController = DocumentHistoryController = __decorate([
    (0, common_1.Controller)("document-history"),
    __metadata("design:paramtypes", [document_history_service_1.DocumentHistoryService])
], DocumentHistoryController);
//# sourceMappingURL=document_history.controller.js.map