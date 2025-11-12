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
exports.AiReplyHubChatController = void 0;
const common_1 = require("@nestjs/common");
const ai_reply_hub_chat_service_1 = require("./ai_reply_hub_chat.service");
const auth_guard_1 = require("../guards/auth/auth.guard");
let AiReplyHubChatController = class AiReplyHubChatController {
    aireplyHub;
    constructor(aireplyHub) {
        this.aireplyHub = aireplyHub;
    }
    async create_message(body) {
        if (!body.user_id || !body.client_id || !body.message) {
            throw new common_1.BadRequestException("user_id, client_id and message are required");
        }
        const result = await this.aireplyHub.create_message_service(body);
        return { message: "Message created successfully", result };
    }
    async get_single_message(id) {
        const result = await this.aireplyHub.single_message_service(id);
        return { message: "Message fetched successfully", result };
    }
    async get_all_messages(user_id, client_id, platform, direction) {
        const result = await this.aireplyHub.all_messages_service(user_id, {
            client_id,
            platform,
            direction,
        });
        return { message: "Messages fetched successfully", result };
    }
    async update_message(id, body) {
        const result = await this.aireplyHub.update_message_service(id, body);
        return { message: "Message updated successfully", result };
    }
    async delete_message(id) {
        const result = await this.aireplyHub.delete_message_service(id);
        return { message: "Message deleted successfully", result };
    }
    async toggle_ai_reply(id, enable) {
        const result = await this.aireplyHub.toggle_ai_reply(id, enable);
        return { message: "AI auto-reply toggled", result };
    }
    async search_messages(user_id, query) {
        if (!query || query.trim().length < 1) {
            throw new common_1.BadRequestException("Search query must not be empty");
        }
        const result = await this.aireplyHub.search_messages_service(user_id, query);
        return { message: "Search results", result };
    }
    async get_unanswered_ai_messages(user_id) {
        const result = await this.aireplyHub.unanswered_ai_messages_service(user_id);
        return { message: "Unanswered AI messages fetched", result };
    }
    async bulk_insert_messages(body) {
        if (!Array.isArray(body) || body.length === 0) {
            throw new common_1.BadRequestException("Body must be a non-empty array");
        }
        const result = await this.aireplyHub.bulk_insert_service(body);
        return { message: "Bulk insert successful", result };
    }
    async update_status(id, body) {
        const { status, error_message } = body;
        const result = await this.aireplyHub.update_status_service(id, status, error_message);
        return { message: "Status updated successfully", result };
    }
    async update_ai_reply(id, body) {
        const { ai_reply, model } = body;
        const result = await this.aireplyHub.update_ai_reply_service(id, ai_reply, model);
        return { message: "AI reply updated successfully", result };
    }
    async generate_ai_reply(id) {
        const message = await this.aireplyHub.single_message_service(id);
        const result = await this.aireplyHub.generate_ai_reply_service(message);
        return { message: "AI reply generated successfully", result };
    }
    async chat_history(user_id, client_id) {
        const result = await this.aireplyHub.message_by_client_service(user_id, client_id);
        return { message: "Chat history fetched", result };
    }
};
exports.AiReplyHubChatController = AiReplyHubChatController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "create_message", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "get_single_message", null);
__decorate([
    (0, common_1.Get)("all/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("client_id")),
    __param(2, (0, common_1.Query)("platform")),
    __param(3, (0, common_1.Query)("direction")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "get_all_messages", null);
__decorate([
    (0, common_1.Patch)("update/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "update_message", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "delete_message", null);
__decorate([
    (0, common_1.Patch)("toggle-ai-reply/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("enable")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "toggle_ai_reply", null);
__decorate([
    (0, common_1.Get)("search/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "search_messages", null);
__decorate([
    (0, common_1.Get)("unanswered/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "get_unanswered_ai_messages", null);
__decorate([
    (0, common_1.Post)("bulk-insert"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "bulk_insert_messages", null);
__decorate([
    (0, common_1.Patch)("update-status/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "update_status", null);
__decorate([
    (0, common_1.Patch)("update-ai-reply/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "update_ai_reply", null);
__decorate([
    (0, common_1.Post)("generate-ai-reply/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "generate_ai_reply", null);
__decorate([
    (0, common_1.Get)("history/:user_id/:client_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Param)("client_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiReplyHubChatController.prototype, "chat_history", null);
exports.AiReplyHubChatController = AiReplyHubChatController = __decorate([
    (0, common_1.Controller)("reply_hub_chat"),
    (0, common_1.UseGuards)(auth_guard_1.JwtGuard),
    __metadata("design:paramtypes", [ai_reply_hub_chat_service_1.AiReplyHubChatService])
], AiReplyHubChatController);
//# sourceMappingURL=ai_reply_hub_chat.controller.js.map