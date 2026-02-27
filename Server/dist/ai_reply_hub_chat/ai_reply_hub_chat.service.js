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
exports.AiReplyHubChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ai_reply_hub_chat_entity_1 = require("./ai_reply_hub_chat.entity");
const chatgpt_service_1 = require("../chatgpt/chatgpt.service");
const user_business_info_service_1 = require("../user_business_info/user_business_info.service");
let AiReplyHubChatService = class AiReplyHubChatService {
    aireplyhubRepo;
    BusinessInfo;
    openAIService;
    constructor(aireplyhubRepo, BusinessInfo, openAIService) {
        this.aireplyhubRepo = aireplyhubRepo;
        this.BusinessInfo = BusinessInfo;
        this.openAIService = openAIService;
    }
    async getBusinessContext(userId) {
        return "This business sells organic products and offers 24/7 customer service.";
    }
    async create_message_service(data) {
        const message = this.aireplyhubRepo.create(data);
        const result = await this.aireplyhubRepo.save(message);
        return result;
    }
    async single_message_service(idOrUuid) {
        const message = await this.aireplyhubRepo.findOne({
            where: [
                { id: typeof idOrUuid === "number" ? idOrUuid : undefined },
                { uuid: typeof idOrUuid === "string" ? idOrUuid : undefined },
            ],
        });
        if (!message)
            throw new common_1.NotFoundException("Message not found");
        return message;
    }
    async all_messages_service(user_id, options) {
        const query = this.aireplyhubRepo
            .createQueryBuilder("msg")
            .where("msg.user_id = :user_id", { user_id });
        if (options?.client_id)
            query.andWhere("msg.client_id = :client_id", {
                client_id: options.client_id,
            });
        if (options?.platform)
            query.andWhere("msg.platform = :platform", {
                platform: options.platform,
            });
        if (options?.direction)
            query.andWhere("msg.direction = :direction", {
                direction: options.direction,
            });
        const result = await query.orderBy("msg.sent_at", "DESC").getMany();
        return result;
    }
    async update_message_service(idOrUuid, data) {
        const message = await this.single_message_service(idOrUuid);
        Object.assign(message, data);
        const result = await this.aireplyhubRepo.save(message);
        return result;
    }
    async delete_message_service(idOrUuid) {
        const result = await this.aireplyhubRepo.delete({ uuid: idOrUuid });
        return result;
    }
    async toggle_ai_reply(idOrUuid, enable) {
        const result = await this.update_message_service(idOrUuid, {
            ai_reply_enable: enable,
        });
        return result;
    }
    async search_messages_service(user_id, query) {
        const result = await this.aireplyhubRepo.find({
            where: [
                { user_id, message: (0, typeorm_2.Like)(`%${query}%`) },
                { user_id, ai_reply: (0, typeorm_2.Like)(`%${query}%`) },
            ],
            order: { sent_at: "DESC" },
        });
        return result;
    }
    async unanswered_ai_messages_service(user_id) {
        const response = await this.aireplyhubRepo.find({
            where: {
                user_id,
                direction: "inbound",
                ai_reply_enable: true,
                ai_reply: "",
                status: "sent",
            },
            order: { sent_at: "ASC" },
        });
        return response;
    }
    async bulk_insert_service(messages) {
        const entities = this.aireplyhubRepo.create(messages);
        const result = await this.aireplyhubRepo.save(entities);
        return result;
    }
    async update_status_service(idOrUuid, status, error_message) {
        const result = await this.update_message_service(idOrUuid, {
            status,
            error_message,
        });
        return result;
    }
    async update_ai_reply_service(uuid, ai_reply, model) {
        const msg = await this.aireplyhubRepo.findOneBy({ uuid });
        if (!msg)
            throw new Error("Message not found");
        msg.ai_reply = ai_reply;
        if (model)
            msg.ai_model = model;
        const result = this.aireplyhubRepo.save(msg);
        return result;
    }
    async generate_ai_reply_service(message) {
        try {
            const businessInfo = await this.BusinessInfo.user_business_info_service(message.user_id);
            const prompt = `You are replying to a client. Use this business info as context: ${JSON.stringify(businessInfo)}\nClient message: ${message.message}`;
            const response = await this.openAIService.generate_ai_reply_service(prompt, {
                model: "",
                businessSnapshot: "",
                purpose: "reply",
            });
            message.ai_reply = response;
            message.ai_model = "GPT-4";
            const result = await this.aireplyhubRepo.save(message);
            return result;
        }
        catch (err) {
            console.error("AI reply failed:", err);
            message.error_message = err.message;
            await this.aireplyhubRepo.save(message);
        }
    }
    async message_by_client_service(user_id, client_id) {
        const response = this.aireplyhubRepo.find({
            where: { user_id, client_id },
            order: { sent_at: "ASC" },
        });
        return response;
    }
    async chat_mark_as_read_service(message_id) {
        await this.aireplyhubRepo.update({ uuid: message_id }, { status: "read" });
        return this.aireplyhubRepo.findOne({ where: { uuid: message_id } });
    }
    async user_chat_partner_service(userId) {
        const partners = await this.aireplyhubRepo.query(`
      SELECT 
        c.uuid AS client_uuid,
        c.name AS client_name,
        c.whatsapp_number,
        c.email,
        last_chat.message,
        last_chat.direction,
        last_chat.status,
        last_chat.platform,
        last_chat.sent_at
      FROM client_lists c
      LEFT JOIN (
        SELECT DISTINCT ON (client_id)
          client_id,
          message,
          direction,
          status,
          platform,
          sent_at
        FROM ai_reply_hub_chats
        WHERE user_id = $1
        ORDER BY client_id, sent_at DESC
      ) last_chat 
      ON last_chat.client_id = c.uuid OR last_chat.client_id = c.uuid
      ORDER BY last_chat.sent_at DESC
    `, [userId]);
        return partners;
    }
};
exports.AiReplyHubChatService = AiReplyHubChatService;
exports.AiReplyHubChatService = AiReplyHubChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ai_reply_hub_chat_entity_1.AiReplyHubChat)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_business_info_service_1.UserBusinessInfoService,
        chatgpt_service_1.ChatgptService])
], AiReplyHubChatService);
//# sourceMappingURL=ai_reply_hub_chat.service.js.map