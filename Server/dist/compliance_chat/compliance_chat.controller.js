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
exports.ComplianceAssistantController = void 0;
const common_1 = require("@nestjs/common");
const compliance_assistant_chat_service_1 = require("./compliance_assistant_chat.service");
let ComplianceAssistantController = class ComplianceAssistantController {
    AssistantChatService;
    constructor(AssistantChatService) {
        this.AssistantChatService = AssistantChatService;
    }
    async askAI(body) {
        try {
            const data = {
                user_id: body.user_id,
                question: body.question,
                answer: "To submit VAT for Q3 2024, follow these steps: 1) Login to FTA portal, 2) Upload VAT return spreadsheet, 3) Submit before 28/10/2024, 4) Keep the receipt for records.",
            };
            const response = await this.AssistantChatService.askAI(data);
            return { message: "ai response", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async user_chat_history(user_id) {
        try {
            const response = await this.AssistantChatService.user_chat_history_service(user_id);
            return { message: "user history retrived", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteChat(chat_id, user_id) {
        try {
            const response = await this.AssistantChatService.delete_chat_service(chat_id, user_id);
            return { message: "chat deleted", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async clear_chat_history(user_id) {
        try {
            const result = await this.AssistantChatService.clear_chat_history_service(user_id);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async searchChat(userId, keyword) {
        try {
            const response = await this.AssistantChatService.searchChat(userId, keyword);
            return { message: "search result", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ComplianceAssistantController = ComplianceAssistantController;
__decorate([
    (0, common_1.Post)("ask-ai"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceAssistantController.prototype, "askAI", null);
__decorate([
    (0, common_1.Get)("user/history/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceAssistantController.prototype, "user_chat_history", null);
__decorate([
    (0, common_1.Delete)("delete/:chat_id/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("chat_id")),
    __param(1, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceAssistantController.prototype, "deleteChat", null);
__decorate([
    (0, common_1.Delete)("clear/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceAssistantController.prototype, "clear_chat_history", null);
__decorate([
    (0, common_1.Get)("search/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("keyword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceAssistantController.prototype, "searchChat", null);
exports.ComplianceAssistantController = ComplianceAssistantController = __decorate([
    (0, common_1.Controller)("compliance_assistant_chat"),
    __metadata("design:paramtypes", [typeof (_a = typeof compliance_assistant_chat_service_1.ComplianceAssistantChatService !== "undefined" && compliance_assistant_chat_service_1.ComplianceAssistantChatService) === "function" ? _a : Object])
], ComplianceAssistantController);
//# sourceMappingURL=compliance_chat.controller.js.map