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
exports.ComplianceAssistantChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const compliance_assistant_chat_entity_1 = require("./compliance_assistant_chat.entity");
const GPTService_1 = require("../services/GPTService");
const PromptService_1 = require("../services/PromptService");
let ComplianceAssistantChatService = class ComplianceAssistantChatService {
    compliance_assistant;
    gpt_service;
    prompt_service;
    constructor(compliance_assistant, gpt_service, prompt_service) {
        this.compliance_assistant = compliance_assistant;
        this.gpt_service = gpt_service;
        this.prompt_service = prompt_service;
    }
    async askAI(data) {
        try {
            const systemPrompt = this.prompt_service.ComplianceAIPrompt();
            const aiResponse = await this.gpt_service.GPTChat(data.question, systemPrompt.trim());
            const chat = this.compliance_assistant.create({
                answer: aiResponse?.data?.content,
                question: data.question,
                user_id: data.user_id,
            });
            const result = await this.compliance_assistant.save(chat);
            return result;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException("AI processing failed", 500);
        }
    }
    async user_chat_history_service(userId) {
        const result = await this.compliance_assistant.query(`
      SELECT cac.*, ar.title as reminder_title, ar.description as reminder_description, 
      ar.type as reminder_type, ar.reminder_date, ar.notify_before as reminder_notify_before, 
      ar.notify_channels as reminder_notify_channels, ar.notified as reminder_notified, ar.recurrence_rule as reminder_recurrence_rule,
      ar.status as reminder_status, ar.created_at
      FROM compliance_assistant_chat as cac 
      LEFT JOIN ai_reminders as ar ON cac.user_id=ar.user_id
      WHERE cac.user_id=$1 
      `, [userId]);
        return result;
    }
    async delete_chat_service(chatId, userId) {
        const chat = await this.compliance_assistant.findOne({
            where: { uuid: chatId, user_id: userId },
        });
        if (!chat) {
            throw new common_1.HttpException("Chat not found", 404);
        }
        const result = await this.compliance_assistant.remove(chat);
        return result;
    }
    async clear_chat_history_service(userId) {
        await this.compliance_assistant.delete({ user_id: userId });
        return { message: "All chat history cleared." };
    }
    async searchChat(userId, keyword) {
        return await this.compliance_assistant
            .createQueryBuilder("chat")
            .where("chat.userId = :userId", { userId })
            .andWhere("chat.question ILIKE :keyword OR chat.answer ILIKE :keyword", {
            keyword: `%${keyword}%`,
        })
            .orderBy("chat.timestamp", "ASC")
            .getMany();
    }
};
exports.ComplianceAssistantChatService = ComplianceAssistantChatService;
exports.ComplianceAssistantChatService = ComplianceAssistantChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(compliance_assistant_chat_entity_1.ComplianceAssistantChat)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        GPTService_1.GPTService,
        PromptService_1.PromptService])
], ComplianceAssistantChatService);
//# sourceMappingURL=compliance_assistant_chat.service.js.map