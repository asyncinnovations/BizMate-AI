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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceAssistantChatService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const compliance_assistant_chat_entity_1 = require("./compliance_assistant_chat.entity");
let ComplianceAssistantChatService = class ComplianceAssistantChatService {
    compliance_assistant;
    openai;
    constructor(compliance_assistant) {
        this.compliance_assistant = compliance_assistant;
        this.openai = new openai_1.default({
            apiKey: `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`,
        });
    }
    async askAI(data) {
        try {
            const systemPrompt = `
        You are a UAE Compliance Assistant.
        Provide step-by-step guidance for VAT, ESR, Trade License Renewal, and UAE government procedures.
      `;
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: data.question },
                ],
            });
            const answer = response.choices[0].message.content;
            const chat = this.compliance_assistant.create({
                answer: answer,
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
        const result = await this.compliance_assistant.find({
            where: { user_id: userId },
        });
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
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ComplianceAssistantChatService);
//# sourceMappingURL=compliance_assistant_chat.service.js.map