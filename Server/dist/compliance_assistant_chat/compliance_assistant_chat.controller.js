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
exports.ComplianceAssistantController = void 0;
const common_1 = require("@nestjs/common");
const compliance_assistant_chat_service_1 = require("./compliance_assistant_chat.service");
const GPTService_1 = require("../services/GPTService");
const ai_reminder_service_1 = require("../ai_reminder/ai_reminder.service");
let ComplianceAssistantController = class ComplianceAssistantController {
    AssistantChatService;
    gpt_service;
    reminderService;
    constructor(AssistantChatService, gpt_service, reminderService) {
        this.AssistantChatService = AssistantChatService;
        this.gpt_service = gpt_service;
        this.reminderService = reminderService;
    }
    async chat_gpt(body) {
        try {
            const response = await this.gpt_service.GPTChat(body.prompt, "you are a compliance assistant you must answer to the related compliance.");
            return { message: "success", response: response.data.content };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async askAI(body) {
        try {
            const response = await this.AssistantChatService.askAI(body);
            const parsed = JSON.parse(response.answer);
            if (parsed.type === "reminder") {
                const reminder_result = this.reminderService.create_reminder_service({
                    user_id: body.user_id,
                    title: parsed.title,
                    description: parsed.description,
                    type: parsed.reminder_type || "Custom",
                    reminder_date: new Date(parsed.reminder_date),
                    notify_before: parsed.notify_before || 3,
                    notify_channels: parsed.notify_channels,
                    recurrence_rule: parsed.recurrence_rule || "none",
                    status: "pending",
                });
                return {
                    message: "Reminder created successfully",
                    reminder: reminder_result,
                    response: response.answer,
                };
            }
            return {
                message: "AI response",
                answer: response.answer,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error?.message || "AI request failed", common_1.HttpStatus.BAD_REQUEST);
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
    (0, common_1.Post)("compliance_ai"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceAssistantController.prototype, "chat_gpt", null);
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
    __metadata("design:paramtypes", [compliance_assistant_chat_service_1.ComplianceAssistantChatService,
        GPTService_1.GPTService,
        ai_reminder_service_1.AiReminderService])
], ComplianceAssistantController);
//# sourceMappingURL=compliance_assistant_chat.controller.js.map